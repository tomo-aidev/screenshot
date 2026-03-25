import type { SpeechBubble } from './types';

export interface BubbleShape {
  type: SpeechBubble['type'];
  svgPath: (width: number, height: number) => string;
  defaultStyle: SpeechBubble['style'];
}

export const BUBBLE_SHAPES: Record<SpeechBubble['type'], BubbleShape> = {
  normal: {
    type: 'normal',
    svgPath: (w, h) => {
      const rx = w / 2;
      const ry = h / 2;
      return `M ${rx},0 A ${rx},${ry} 0 1,1 ${rx},${h} A ${rx},${ry} 0 1,1 ${rx},0 Z`;
    },
    defaultStyle: {
      backgroundColor: '#ffffff',
      borderColor: '#000000',
      fontFamily: 'Inter',
      fontSize: 14,
    },
  },

  shout: {
    type: 'shout',
    svgPath: (w, h) => {
      const cx = w / 2;
      const cy = h / 2;
      const points = 12;
      const outerR = Math.max(w, h) / 2;
      const innerR = outerR * 0.75;
      let path = '';
      for (let i = 0; i < points * 2; i++) {
        const angle = (Math.PI * i) / points;
        const r = i % 2 === 0 ? outerR : innerR;
        const x = cx + r * Math.cos(angle - Math.PI / 2);
        const y = cy + r * Math.sin(angle - Math.PI / 2);
        path += i === 0 ? `M ${x},${y}` : ` L ${x},${y}`;
      }
      return path + ' Z';
    },
    defaultStyle: {
      backgroundColor: '#ffffff',
      borderColor: '#000000',
      fontFamily: 'Inter',
      fontSize: 16,
    },
  },

  whisper: {
    type: 'whisper',
    svgPath: (w, h) => {
      const rx = w / 2;
      const ry = h / 2;
      return `M ${rx},0 A ${rx},${ry} 0 1,1 ${rx},${h} A ${rx},${ry} 0 1,1 ${rx},0 Z`;
    },
    defaultStyle: {
      backgroundColor: '#f0f0f0',
      borderColor: '#999999',
      fontFamily: 'Inter',
      fontSize: 12,
    },
  },

  thought: {
    type: 'thought',
    svgPath: (w, h) => {
      const cx = w / 2;
      const cy = h / 2;
      const bumps = 8;
      const r = Math.min(w, h) / 2;
      const bumpR = r * 0.15;
      let path = '';
      for (let i = 0; i < bumps; i++) {
        const angle = (2 * Math.PI * i) / bumps;
        const x = cx + (r - bumpR) * Math.cos(angle);
        const y = cy + (r - bumpR) * Math.sin(angle);
        if (i === 0) {
          path = `M ${x + bumpR},${y}`;
        }
        const nextAngle = (2 * Math.PI * (i + 1)) / bumps;
        const nx = cx + (r - bumpR) * Math.cos(nextAngle);
        const ny = cy + (r - bumpR) * Math.sin(nextAngle);
        const midAngle = (angle + nextAngle) / 2;
        const cpx = cx + r * 1.1 * Math.cos(midAngle);
        const cpy = cy + r * 1.1 * Math.sin(midAngle);
        path += ` Q ${cpx},${cpy} ${nx + bumpR * Math.cos(nextAngle)},${ny + bumpR * Math.sin(nextAngle)}`;
      }
      return path + ' Z';
    },
    defaultStyle: {
      backgroundColor: '#ffffff',
      borderColor: '#000000',
      fontFamily: 'Inter',
      fontSize: 13,
    },
  },

  narration: {
    type: 'narration',
    svgPath: (w, h) => `M 0,0 L ${w},0 L ${w},${h} L 0,${h} Z`,
    defaultStyle: {
      backgroundColor: '#1a1a2e',
      borderColor: '#ffffff',
      fontFamily: 'Inter',
      fontSize: 13,
    },
  },
};

export function createBubble(
  panelId: string,
  type: SpeechBubble['type'],
  text: string,
  position: { x: number; y: number } = { x: 50, y: 50 }
): SpeechBubble {
  const shape = BUBBLE_SHAPES[type];
  return {
    id: `bubble-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    panelId,
    type,
    text,
    position,
    tailDirection: type === 'narration' ? 'none' : 'bottom-left',
    style: { ...shape.defaultStyle },
  };
}

export function getTailPath(
  direction: SpeechBubble['tailDirection'],
  bubbleWidth: number,
  bubbleHeight: number,
  tailLength: number = 20
): string {
  const tailWidth = 15;
  switch (direction) {
    case 'bottom-left':
      return `M ${bubbleWidth * 0.3},${bubbleHeight} L ${bubbleWidth * 0.25 - tailWidth / 2},${bubbleHeight + tailLength} L ${bubbleWidth * 0.4},${bubbleHeight}`;
    case 'bottom-right':
      return `M ${bubbleWidth * 0.6},${bubbleHeight} L ${bubbleWidth * 0.75 + tailWidth / 2},${bubbleHeight + tailLength} L ${bubbleWidth * 0.7},${bubbleHeight}`;
    case 'top-left':
      return `M ${bubbleWidth * 0.3},0 L ${bubbleWidth * 0.25 - tailWidth / 2},${-tailLength} L ${bubbleWidth * 0.4},0`;
    case 'top-right':
      return `M ${bubbleWidth * 0.6},0 L ${bubbleWidth * 0.75 + tailWidth / 2},${-tailLength} L ${bubbleWidth * 0.7},0`;
    case 'none':
    default:
      return '';
  }
}
