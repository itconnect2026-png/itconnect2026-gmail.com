import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DesignConfig, GeneratedContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema for text generation
const textResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    headline: { type: Type.STRING, description: "A catchy headline for the design." },
    tagline: { type: Type.STRING, description: "A short, punchy slogan." },
    bodyText: { type: Type.STRING, description: "Brief informational content suitable for the format." },
    primaryColor: { type: Type.STRING, description: "Hex code for the main background or dominant color." },
    secondaryColor: { type: Type.STRING, description: "Hex code for contrasting text or shapes." },
    accentColor: { type: Type.STRING, description: "Hex code for highlights." },
    fontPairing: { type: Type.STRING, enum: ['modern', 'classic', 'playful'], description: "Suggested font style." }
  },
  required: ["headline", "tagline", "bodyText", "primaryColor", "secondaryColor", "accentColor", "fontPairing"]
};

export const generateDesignText = async (config: DesignConfig): Promise<GeneratedContent> => {
  const prompt = `You are a professional graphic designer. Create content and a color palette for a ${config.category} about "${config.topic}". The mood should be "${config.mood}". Return JSON only.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: textResponseSchema,
        systemInstruction: "Always respond with valid JSON adhering to the schema. Ensure color contrast is accessible."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No text generated");
    
    return JSON.parse(text) as GeneratedContent;
  } catch (error) {
    console.error("Text generation failed:", error);
    throw error;
  }
};

export const generateDesignImage = async (config: DesignConfig): Promise<string> => {
  const prompt = `A high quality, professional background texture or illustration for a ${config.category} about ${config.topic}. Style: ${config.mood}, minimalist, abstract, no text, high resolution, digital art.`;

  try {
    // Using gemini-2.5-flash-image for image generation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      }
    });

    // Extract image from response
    let base64Image = "";
    if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                base64Image = part.inlineData.data;
                break;
            }
        }
    }

    if (!base64Image) {
        throw new Error("No image data found in response");
    }

    return `data:image/png;base64,${base64Image}`;
  } catch (error) {
    console.error("Image generation failed:", error);
    throw error;
  }
};