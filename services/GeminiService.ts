import Constants from 'expo-constants';

// You can use environment variables in production
// For now, we'll use the API key directly since it's already provided
const GEMINI_API_KEY = 'AIzaSyDqzpqarAbDUPOH-Qzf2M-EkoFaJjbXtw4';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  isError?: boolean;
}

interface GeminiRequestContent {
  parts: { text: string }[];
}

interface GeminiRequest {
  contents: GeminiRequestContent[];
}

interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
}

/**
 * Sends a message to the Gemini API and returns the response text.
 * @param message The message to send to the Gemini API
 * @returns A promise that resolves to the AI's response text
 */
export async function sendMessageToGemini(message: string): Promise<string> {
  try {
    const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;
    
    const requestBody: GeminiRequest = {
      contents: [
        {
          parts: [{ text: message }]
        }
      ]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json() as GeminiResponse;
    
    if (
      !data.candidates ||
      !data.candidates[0] ||
      !data.candidates[0].content ||
      !data.candidates[0].content.parts ||
      !data.candidates[0].content.parts[0]
    ) {
      throw new Error('Invalid response format from Gemini API');
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}