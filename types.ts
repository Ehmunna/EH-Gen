
export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';

export interface ImageResult {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  aspectRatio: AspectRatio;
}

export interface GeminiImagePart {
  inlineData: {
    mimeType: string;
    data: string;
  };
}

export interface GeminiTextPart {
  text: string;
}
