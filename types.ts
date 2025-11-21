export enum DesignCategory {
  SOCIAL_MEDIA = 'Social Media',
  POSTER = 'Poster',
  BUSINESS_CARD = 'Business Card',
  BANNER = 'Banner',
  WALLPAPER = 'Wallpaper'
}

export interface DesignConfig {
  category: DesignCategory;
  topic: string;
  mood: string;
}

export interface GeneratedContent {
  headline: string;
  tagline: string;
  bodyText: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontPairing: 'modern' | 'classic' | 'playful';
}

export interface GeneratedImage {
  url: string;
  promptUsed: string;
}

export interface DesignState {
  config: DesignConfig;
  content: GeneratedContent | null;
  backgroundImage: GeneratedImage | null;
  isGeneratingText: boolean;
  isGeneratingImage: boolean;
  error: string | null;
}