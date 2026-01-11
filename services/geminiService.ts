
import { GoogleGenAI } from "@google/genai";
import { AspectRatio } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  /**
   * Edits an image based on a prompt using Gemini 2.5 Flash Image.
   */
  async editImage(
    base64Image: string,
    mimeType: string,
    prompt: string,
    aspectRatio: AspectRatio
  ): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        },
      },
    });

    if (!response.candidates?.[0]?.content?.parts) {
      throw new Error("No image generated in the response.");
    }

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data found in the response parts.");
  }
}

export const geminiService = new GeminiService();
