export enum Page {
  Thumbnail,
  SocialPost,
  BackgroundRemoval,
}

export const THUMBNAIL_THEMES = [
  'Vibrant & Bold',
  'Minimalist & Clean',
  'Tech & Futuristic',
  'Educational & Informative',
  'Dramatic & Cinematic',
] as const;

export type ThumbnailTheme = typeof THUMBNAIL_THEMES[number];

export const ASPECT_RATIOS = ['16:9', '1:1', '9:16'] as const;
export type AspectRatio = typeof ASPECT_RATIOS[number];

export const TEXT_PLACEMENTS = [
  'AI Recommended',
  'Top Left',
  'Top Center',
  'Top Right',
  'Middle Left',
  'Middle Center',
  'Middle Right',
  'Bottom Left',
  'Bottom Center',
  'Bottom Right',
] as const;

export type TextPlacement = typeof TEXT_PLACEMENTS[number];

export const FONT_STYLES = [
  'AI Recommended',
  'Bold Sans-Serif',
  'Elegant Serif',
  'Futuristic Digital',
  'Playful Script',
  'Handwritten',
] as const;

export type FontStyle = typeof FONT_STYLES[number];

export const ART_STYLES = [
  'AI Recommended',
  'Photorealistic',
  'Cartoon / Comic',
  '3D Render',
  'Pixel Art',
  'Oil Painting',
  'Watercolor',
  'Minimalist Vector',
] as const;
export type ArtStyle = typeof ART_STYLES[number];

export const LIGHTING_STYLES = [
  'AI Recommended',
  'Soft Natural Light',
  'Dramatic Studio Light',
  'Backlit / Rim Light',
  'Golden Hour',
  'Neon Glow / Cyberpunk',
  'Cinematic',
] as const;
export type LightingStyle = typeof LIGHTING_STYLES[number];

export const FRAMING_OPTIONS = [
  'AI Recommended',
  'Close-Up',
  'Medium Shot',
  'Full Shot',
  'Wide Shot / Landscape',
  'Action Shot',
] as const;
export type Framing = typeof FRAMING_OPTIONS[number];

export const IMAGE_EFFECTS = [
  'None',
  'Grayscale',
  'Sepia',
  'Invert Colors',
  'Duotone',
] as const;
export type ImageEffect = typeof IMAGE_EFFECTS[number];


export const SOCIAL_PLATFORMS = ['LinkedIn', 'Instagram'] as const;
export type SocialPlatform = typeof SOCIAL_PLATFORMS[number];

export const POST_TYPES = [
  'Marketing / Promotion',
  'Educational / Insight',
  'Behind-the-Scenes',
  'Community Question',
  'Resource / Link Sharing',
] as const;

export type PostType = typeof POST_TYPES[number];

export interface BaseImage {
  file: File;
  preview: string;
  base64: string;
  mimeType: string;
}