
import { AnalysisReport } from '../types';

// API endpoint - will be /api/analyze in production
const API_ENDPOINT = import.meta.env.PROD 
  ? '/api/analyze' 
  : 'http://localhost:3000/api/analyze';

export const analyzeText = async (text: string, fileName: string): Promise<AnalysisReport> => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, fileName }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const result: AnalysisReport = await response.json();
    return result;

  } catch (error: any) {
    console.error("Analysis request failed:", error);
    
    if (error.message.includes('fetch')) {
      throw new Error("Unable to connect to analysis server. Please check your connection.");
    }
    
    throw new Error(error.message || "Analysis failed. Please try again.");
  }
};
