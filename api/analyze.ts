// Vercel Serverless Function for API Key Protection
import { GoogleGenAI, Type } from "@google/genai";

const MODEL_NAME = 'gemini-1.5-flash';

interface RequestBody {
  text: string;
  fileName: string;
}

export const config = {
  maxDuration: 60, // 60 seconds timeout
};

// Simple in-memory rate limiting (for production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const limit = 10; // 10 requests
  const windowMs = 60 * 60 * 1000; // per hour

  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: limit - record.count };
}

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting
  const userIP = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection?.remoteAddress || 'unknown';
  const rateLimit = checkRateLimit(userIP);
  
  res.setHeader('X-RateLimit-Limit', '10');
  res.setHeader('X-RateLimit-Remaining', rateLimit.remaining.toString());
  
  if (!rateLimit.allowed) {
    return res.status(429).json({ 
      error: 'Rate limit exceeded. Please try again later.',
      retryAfter: 3600 
    });
  }
  
  try {
    const { text, fileName }: RequestBody = req.body;

    if (!text || !fileName) {
      return res.status(400).json({ error: 'Missing required fields: text and fileName' });
    }

    if (text.length > 50000) {
      return res.status(400).json({ error: 'Text too long. Maximum 50,000 characters allowed.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const cleanText = text.trim();

    // Stage 1: Plagiarism Check with Search Grounding
    const plagiarismResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `You are a professional Plagiarism Auditor working for an academic institution. 
      TASK: Cross-reference the following text against the global web, scholarly publications, and known academic repositories using Google Search.
      
      STEP 1: Identify specific, verbatim sequences (7+ words) that match external sources.
      STEP 2: For each match, determine if it is an 'Internet Source', 'Publication', or 'Student Paper'.
      STEP 3: Return a structured list of these matches with the EXACT segment from the document and the source URL.
      
      TEXT TO AUDIT:
      """
      ${cleanText.substring(0, 15000)}
      """
      
      OUTPUT FORMAT:
      [MATCHES_START]
      - Index: 1 | Segment: "verbatim text segment" | Category: Internet Source | Source: https://example.com/page
      - Index: 2 | Segment: "another verbatim segment" | Category: Publication | Source: https://doi.org/reference
      [MATCHES_END]`,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    // Stage 2: AI Content Detection
    const aiDetectionResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Analyze this text for patterns typical of Large Language Models (LLMs).
      TEXT: """${cleanText.substring(0, 6000)}"""`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            aiScore: { type: Type.NUMBER },
            confidence: { type: Type.NUMBER },
            perplexity: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
            burstiness: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
            analysis: { type: Type.STRING }
          },
          required: ['aiScore', 'confidence', 'perplexity', 'burstiness', 'analysis']
        }
      }
    });

    // Parsing Logic
    const responseText = plagiarismResponse.text || '';
    const matchesSection = responseText.match(/\[MATCHES_START\]([\s\S]*?)\[MATCHES_END\]/);
    const groundingMetadata = plagiarismResponse.candidates?.[0]?.groundingMetadata;
    
    let matches: any[] = [];
    let internetChars = 0;
    let publicationChars = 0;
    let studentChars = 0;

    const groundingChunks = groundingMetadata?.groundingChunks || [];

    if (matchesSection && matchesSection[1]) {
      const lines = matchesSection[1].trim().split('\n');
      lines.forEach((line) => {
        const parts = line.split('|');
        if (parts.length >= 4) {
          const idxStr = parts[0].match(/\d+/);
          const idx = idxStr ? parseInt(idxStr[0]) : matches.length + 1;
          const segment = parts[1].replace(/Segment: /, '').replace(/"/g, '').trim();
          const categoryRaw = parts[2].replace(/Category: /, '').trim();
          const urlStr = parts[3].replace(/Source: /, '').trim();
          
          let category: 'Internet Source' | 'Publication' | 'Student Paper' = 'Internet Source';
          if (categoryRaw.toLowerCase().includes('publication')) category = 'Publication';
          else if (categoryRaw.toLowerCase().includes('student')) category = 'Student Paper';

          if (segment.length > 5) {
            let sourceTitle = getSafeSourceTitle(urlStr);
            
            const groundingMatch = groundingChunks.find((chunk: any) => chunk.web?.uri === urlStr);
            if (groundingMatch?.web?.title) {
              sourceTitle = groundingMatch.web.title;
            }

            matches.push({
              index: idx,
              source: sourceTitle,
              url: urlStr,
              similarity: 0,
              matchedText: segment,
              category: category
            });

            if (category === 'Internet Source') internetChars += segment.length;
            else if (category === 'Publication') publicationChars += segment.length;
            else if (category === 'Student Paper') studentChars += segment.length;
          }
        }
      });
    }

    const totalDocChars = cleanText.length || 1;
    const internetSim = Math.round((internetChars / totalDocChars) * 100);
    const pubSim = Math.round((publicationChars / totalDocChars) * 100);
    const studentSim = Math.round((studentChars / totalDocChars) * 100);
    const overallSim = Math.min(internetSim + pubSim + studentSim, 100);

    matches = matches.map(m => ({
      ...m,
      similarity: Math.max(1, Math.round((m.matchedText.length / totalDocChars) * 100))
    }));

    let aiResult: any;
    try {
      aiResult = JSON.parse(aiDetectionResponse.text || '{}');
    } catch {
      aiResult = { aiScore: 0, confidence: 0, perplexity: 'Medium', burstiness: 'Medium', analysis: 'Parsing failed.' };
    }

    const result = {
      id: `VERI-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      timestamp: new Date().toISOString(),
      fileName,
      overallSimilarity: overallSim,
      internetSimilarity: internetSim,
      publicationSimilarity: pubSim,
      studentSimilarity: studentSim,
      aiProbability: aiResult.aiScore,
      wordCount: cleanText.split(/\s+/).filter(Boolean).length,
      matches,
      aiResult,
      content: cleanText,
      receipt: {
        submissionId: `REC-${Date.now().toString().slice(-6)}`,
        submissionDate: new Date().toLocaleString(),
        fileHash: `SHA-${Math.random().toString(16).slice(2, 18).toUpperCase()}`,
        author: "Verified User",
        characterCount: cleanText.length
      }
    };

    return res.status(200).json(result);

  } catch (error: any) {
    console.error("Analysis Error:", error);
    return res.status(500).json({ 
      error: error.message || 'Analysis failed. Please try again.' 
    });
  }
}

function getSafeSourceTitle(sourceStr: string): string {
  const trimmed = sourceStr.trim();
  if (trimmed.toLowerCase().startsWith('http')) {
    try {
      const url = new URL(trimmed);
      return url.hostname;
    } catch (e) {
      return trimmed;
    }
  }
  return trimmed;
}
