
export interface PlagiarismMatch {
  index: number;
  source: string;
  url: string;
  similarity: number; 
  matchedText: string;
  category: 'Internet Source' | 'Publication' | 'Student Paper';
}

export interface AIDetectionResult {
  aiScore: number; 
  confidence: number;
  perplexity: 'Low' | 'Medium' | 'High';
  burstiness: 'Low' | 'Medium' | 'High';
  analysis: string;
}

export interface DigitalReceipt {
  submissionId: string;
  submissionDate: string;
  fileHash: string;
  author: string;
  characterCount: number;
}

export interface AnalysisReport {
  id: string;
  timestamp: string;
  fileName: string;
  overallSimilarity: number;
  internetSimilarity: number;
  publicationSimilarity: number;
  studentSimilarity: number;
  aiProbability: number;
  wordCount: number;
  matches: PlagiarismMatch[];
  aiResult: AIDetectionResult;
  content: string;
  receipt: DigitalReceipt;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  FINGERPRINTING = 'FINGERPRINTING',
  SEARCHING = 'SEARCHING',
  AI_SCANNING = 'AI_SCANNING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
