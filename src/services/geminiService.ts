import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface GeminiResponse {
  detectedDevice: string;
  confidence: string;
  description: string;
}

export async function analyzeDeviceImage(base64Image: string): Promise<GeminiResponse | null> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image,
              },
            },
            {
              text: `Identify home appliance. IDs: aire_acondicionado, heladera, freezer, lavarropas, termotanque, tv, iluminacion, cocina, pava_electrica, plancha, ventilador, cargador, computadora.
              Return JSON: {"detectedDevice": "id", "confidence": "alta"|"media"|"baja", "description": "text"}. Use 'desconocido' if not in list.`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedDevice: { type: Type.STRING },
            confidence: { type: Type.STRING },
            description: { type: Type.STRING },
          },
          required: ["detectedDevice", "confidence", "description"],
        },
      },
    });

    if (!response.text) return null;
    
    return JSON.parse(response.text.trim()) as GeminiResponse;
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
}
