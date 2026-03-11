import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey! });

export async function identifyDisease(base64Image: string, mimeType: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { text: "You are an expert plant pathologist. Analyze this image of a plant and identify any potential diseases, pests, or nutrient deficiencies. Provide a detailed report including: 1. Identification, 2. Severity, 3. Recommended Treatment (Organic and Chemical), 4. Prevention Tips. Format the output in Markdown." },
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
        ],
      },
    ],
  });
  return response.text;
}

export async function getFarmingAdvice(prompt: string, context?: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { text: `You are a helpful AI farming assistant. Your goal is to provide practical, sustainable, and scientifically-backed advice to farmers. Context: ${context || "General farming query"}` },
          { text: prompt },
        ],
      },
    ],
  });
  return response.text;
}
