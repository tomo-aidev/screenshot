export type TemplateType = 'classic' | 'story' | 'manga' | 'lifestyle' | 'infographic' | 'character';

export interface TemplateLayer {
  id: string;
  type: 'text' | 'image' | 'screenshot' | 'device-frame' | 'background' | 'shape' | 'effect';
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  order: number;
  data: Record<string, unknown>;
}

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  textAlign: 'left' | 'center' | 'right';
  lineHeight: number;
  letterSpacing: number;
  textShadow?: {
    color: string;
    offsetX: number;
    offsetY: number;
    blur: number;
  };
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

export interface Template {
  id: string;
  type: TemplateType;
  name: string;
  description: string;
  thumbnail: string;
  layers: TemplateLayer[];
  defaultTexts: Record<string, string>;
  tags: string[];
}
