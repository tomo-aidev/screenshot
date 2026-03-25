import type { MangaEffect, SoundEffect } from './types';

export function generateSpeedLinesSVG(
  width: number,
  height: number,
  effect: MangaEffect
): string {
  const originX = effect.origin?.x ?? 50;
  const originY = effect.origin?.y ?? 50;
  const cx = (originX / 100) * width;
  const cy = (originY / 100) * height;
  const lineCount = Math.floor(effect.intensity * 0.5);
  const maxLen = Math.max(width, height);

  let lines = '';
  for (let i = 0; i < lineCount; i++) {
    const angle = (Math.PI * 2 * i) / lineCount;
    const startDist = maxLen * 0.1;
    const endDist = maxLen * 0.9;
    const x1 = cx + Math.cos(angle) * startDist;
    const y1 = cy + Math.sin(angle) * startDist;
    const x2 = cx + Math.cos(angle) * endDist;
    const y2 = cy + Math.sin(angle) * endDist;
    const strokeWidth = 1 + Math.random() * 2;
    const opacity = 0.3 + (effect.intensity / 100) * 0.5;
    lines += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="black" stroke-width="${strokeWidth}" opacity="${opacity}" />`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${lines}</svg>`;
}

export function generateFocusLinesSVG(
  width: number,
  height: number,
  effect: MangaEffect
): string {
  const originX = effect.origin?.x ?? 50;
  const originY = effect.origin?.y ?? 50;
  const cx = (originX / 100) * width;
  const cy = (originY / 100) * height;
  const lineCount = Math.floor(effect.intensity * 0.8);
  const maxLen = Math.max(width, height) * 1.5;
  const gapRadius = Math.min(width, height) * 0.15;

  let lines = '';
  for (let i = 0; i < lineCount; i++) {
    const angle = (Math.PI * 2 * i) / lineCount + (Math.random() - 0.5) * 0.1;
    const x1 = cx + Math.cos(angle) * gapRadius;
    const y1 = cy + Math.sin(angle) * gapRadius;
    const x2 = cx + Math.cos(angle) * maxLen;
    const y2 = cy + Math.sin(angle) * maxLen;
    const strokeWidth = 0.5 + Math.random() * 2;
    lines += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="black" stroke-width="${strokeWidth}" opacity="0.6" />`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${lines}</svg>`;
}

export function generateSparkleSVG(
  width: number,
  height: number,
  effect: MangaEffect
): string {
  const count = Math.floor(effect.intensity * 0.3);
  let sparkles = '';

  for (let i = 0; i < count; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = 3 + Math.random() * 8;
    sparkles += `
      <g transform="translate(${x}, ${y}) rotate(${Math.random() * 45})">
        <line x1="0" y1="${-size}" x2="0" y2="${size}" stroke="black" stroke-width="1.5" />
        <line x1="${-size}" y1="0" x2="${size}" y2="0" stroke="black" stroke-width="1.5" />
        <line x1="${-size * 0.6}" y1="${-size * 0.6}" x2="${size * 0.6}" y2="${size * 0.6}" stroke="black" stroke-width="1" />
        <line x1="${-size * 0.6}" y1="${size * 0.6}" x2="${size * 0.6}" y2="${-size * 0.6}" stroke="black" stroke-width="1" />
      </g>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${sparkles}</svg>`;
}

export function generateImpactSVG(
  width: number,
  height: number,
  effect: MangaEffect
): string {
  const cx = width / 2;
  const cy = height / 2;
  const rays = Math.floor(12 + effect.intensity * 0.2);
  const maxR = Math.max(width, height);

  let paths = '';
  for (let i = 0; i < rays; i++) {
    const angle1 = (Math.PI * 2 * i) / rays;
    const angle2 = (Math.PI * 2 * (i + 0.3)) / rays;
    const x1 = cx + Math.cos(angle1) * maxR;
    const y1 = cy + Math.sin(angle1) * maxR;
    const x2 = cx + Math.cos(angle2) * maxR;
    const y2 = cy + Math.sin(angle2) * maxR;
    paths += `<path d="M ${cx},${cy} L ${x1},${y1} L ${x2},${y2} Z" fill="black" opacity="${0.1 + (effect.intensity / 100) * 0.3}" />`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${paths}</svg>`;
}

export function generateEffectSVG(
  width: number,
  height: number,
  effect: MangaEffect
): string {
  switch (effect.type) {
    case 'speed-lines':
      return generateSpeedLinesSVG(width, height, effect);
    case 'focus-lines':
      return generateFocusLinesSVG(width, height, effect);
    case 'sparkle':
      return generateSparkleSVG(width, height, effect);
    case 'impact':
      return generateImpactSVG(width, height, effect);
    case 'emotion-lines':
      return generateFocusLinesSVG(width, height, { ...effect, intensity: effect.intensity * 0.5 });
    default:
      return '';
  }
}

export function createSoundEffect(
  panelId: string,
  text: string,
  options: Partial<Omit<SoundEffect, 'text' | 'panelId'>> = {}
): SoundEffect {
  return {
    text,
    panelId,
    position: options.position ?? { x: 50, y: 50 },
    fontSize: options.fontSize ?? 48,
    rotation: options.rotation ?? -12,
    color: options.color ?? '#000000',
    style: options.style ?? 'bold',
  };
}

export const SOUND_EFFECT_PRESETS: { text: string; textJa: string; style: SoundEffect['style'] }[] = [
  { text: 'WHOOSH!', textJa: 'シュッ！', style: 'bold' },
  { text: 'BAM!', textJa: 'ドーン！', style: 'shadow' },
  { text: 'CRACK!', textJa: 'バキッ！', style: 'outline' },
  { text: 'ZOOM!', textJa: 'ズーム！', style: 'gradient' },
  { text: 'FLASH!', textJa: 'ピカッ！', style: 'bold' },
  { text: 'SMOOTH!', textJa: 'サクサク！', style: 'shadow' },
  { text: 'PING!', textJa: 'ピコン！', style: 'outline' },
  { text: 'SWIPE!', textJa: 'スワイプ！', style: 'bold' },
  { text: 'TAP!', textJa: 'タップ！', style: 'bold' },
  { text: 'CLICK!', textJa: 'カチッ！', style: 'outline' },
];
