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
              text: `Identify the home appliance in this image. 
              Return ONLY a JSON object with the following structure:
              {
                "detectedDevice": "id_of_device",
                "confidence": "alta" | "media" | "baja",
                "description": "Short description of what you see"
              }
              
              The 'detectedDevice' MUST be one of these IDs if possible:
              aire_acondicionado, heladera, freezer, lavarropas, termotanque, tv, iluminacion, cocina, pava_electrica, plancha, ventilador, cargador, computadora.
              If it is something else, use 'desconocido'.`,
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
