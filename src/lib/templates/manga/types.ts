export interface MangaPanel {
  id: string;
  x: number;       // % based (0-100)
  y: number;
  width: number;
  height: number;
  rotation?: number;
  borderWidth: number;
  borderColor: string;
  clipPath?: string;  // SVG path for irregular shapes
  content: PanelContent;
}

export type PanelContent =
  | { type: 'screenshot'; imageUrl: string; scale: number; offset: { x: number; y: number } }
  | { type: 'illustration'; prompt: string; generatedUrl?: string }
  | { type: 'text'; text: string; style: MangaTextStyle }
  | { type: 'character'; characterId: string; pose: string; emotion: string };

export interface MangaTextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  textAlign: 'left' | 'center' | 'right';
  lineHeight: number;
}

export interface SpeechBubble {
  id: string;
  panelId: string;
  type: 'normal' | 'shout' | 'whisper' | 'thought' | 'narration';
  text: string;
  position: { x: number; y: number };
  tailDirection: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'none';
  style: {
    backgroundColor: string;
    borderColor: string;
    fontFamily: string;
    fontSize: number;
  };
}

export interface MangaEffect {
  type: 'speed-lines' | 'focus-lines' | 'sparkle' | 'impact' | 'emotion-lines';
  panelId: string;
  intensity: number; // 0-100
  origin?: { x: number; y: number };
}

export interface SoundEffect {
  text: string;
  panelId: string;
  position: { x: number; y: number };
  fontSize: number;
  rotation: number;
  color: string;
  style: 'bold' | 'outline' | 'shadow' | 'gradient';
}

export interface MangaTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  panels: MangaPanel[];
  bubbles: SpeechBubble[];
  effects: MangaEffect[];
  soundEffects: SoundEffect[];
  backgroundColor: string;
  panelSpacing: number;
}

export type MangaLayoutPreset =
  | 'four-koma'
  | 'grid-2x2'
  | 'l-shape'
  | 'staircase'
  | 'full-page'
  | 'free';
