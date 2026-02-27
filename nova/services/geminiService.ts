
import { GoogleGenAI, Type } from "@google/genai";
import { Media, Genre } from "../types";
import { MOCK_MEDIA } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getPersonalizedRecommendations = async (watchHistory: string[]): Promise<Media[]> => {
  if (!process.env.API_KEY) {
     // Fallback to simple logic if no API key
     return MOCK_MEDIA.slice(0, 3);
  }

  const userContext = watchHistory.map(id => MOCK_MEDIA.find(m => m.id === id)?.title).join(", ");
  const availableContent = MOCK_MEDIA.map(m => ({ id: m.id, title: m.title, genre: m.genre }));

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on a user who watched [${userContext}], select the top 3 items from this list: ${JSON.stringify(availableContent)}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              reason: { type: Type.STRING }
            },
            required: ["id"]
          }
        }
      }
    });

    const results = JSON.parse(response.text || "[]");
    const recommendedIds = results.map((r: any) => r.id);
    return MOCK_MEDIA.filter(m => recommendedIds.includes(m.id));
  } catch (error) {
    console.error("Gemini rec error:", error);
    return MOCK_MEDIA.slice(1, 4);
  }
};
