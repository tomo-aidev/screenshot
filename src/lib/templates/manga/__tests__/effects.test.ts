import { describe, it, expect } from 'vitest';
import {
  generateEffectSVG,
  generateSpeedLinesSVG,
  generateFocusLinesSVG,
  generateSparkleSVG,
  generateImpactSVG,
  createSoundEffect,
  SOUND_EFFECT_PRESETS,
} from '../effects';
import type { MangaEffect } from '../types';

function makeEffect(type: MangaEffect['type'], intensity = 50, origin?: { x: number; y: number }): MangaEffect {
  return { type, panelId: 'panel-1', intensity, origin };
}

describe('generateEffectSVG()', () => {
  const effectTypes: MangaEffect['type'][] = ['speed-lines', 'focus-lines', 'sparkle', 'impact', 'emotion-lines'];

  it('returns valid SVG string for each effect type', () => {
    for (const type of effectTypes) {
      const svg = generateEffectSVG(200, 150, makeEffect(type));
      expect(typeof svg).toBe('string');
      expect(svg.length).toBeGreaterThan(0);
    }
  });

  it("contains '<svg' and '</svg>'", () => {
    for (const type of effectTypes) {
      const svg = generateEffectSVG(200, 150, makeEffect(type));
      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
    }
  });

  it('width and height attributes match params', () => {
    const svg = generateEffectSVG(300, 200, makeEffect('speed-lines'));
    expect(svg).toContain('width="300"');
    expect(svg).toContain('height="200"');
  });

  it('works with default origin', () => {
    const svg = generateEffectSVG(200, 150, makeEffect('speed-lines', 50));
    expect(svg).toContain('<svg');
  });
});

describe('generateSpeedLinesSVG()', () => {
  it('returns SVG with <line> elements', () => {
    const svg = generateSpeedLinesSVG(200, 150, makeEffect('speed-lines', 50));
    expect(svg).toContain('<line');
  });

  it('higher intensity creates more lines', () => {
    const svgLow = generateSpeedLinesSVG(200, 150, makeEffect('speed-lines', 10));
    const svgHigh = generateSpeedLinesSVG(200, 150, makeEffect('speed-lines', 80));
    const countLow = (svgLow.match(/<line /g) || []).length;
    const countHigh = (svgHigh.match(/<line /g) || []).length;
    expect(countHigh).toBeGreaterThan(countLow);
  });

  it('custom origin shifts the center', () => {
    const svgDefault = generateSpeedLinesSVG(200, 200, makeEffect('speed-lines', 20));
    const svgCustom = generateSpeedLinesSVG(200, 200, makeEffect('speed-lines', 20, { x: 10, y: 10 }));
    expect(svgDefault).not.toBe(svgCustom);
  });
});

describe('generateFocusLinesSVG()', () => {
  it('returns SVG with <line> elements', () => {
    const svg = generateFocusLinesSVG(200, 150, makeEffect('focus-lines', 50));
    expect(svg).toContain('<line');
  });

  it('has gap in the center', () => {
    // Focus lines start from a gapRadius away from center, so line x1/y1 differ from center
    const svg = generateFocusLinesSVG(200, 200, makeEffect('focus-lines', 50));
    // The center is at 100,100. Lines should not start exactly at center.
    expect(svg).not.toContain('x1="100" y1="100"');
  });
});

describe('generateSparkleSVG()', () => {
  it('returns SVG with <g> elements (sparkle groups)', () => {
    const svg = generateSparkleSVG(200, 150, makeEffect('sparkle', 50));
    expect(svg).toContain('<g');
  });
});

describe('generateImpactSVG()', () => {
  it('returns SVG with <path> elements', () => {
    const svg = generateImpactSVG(200, 150, makeEffect('impact', 50));
    expect(svg).toContain('<path');
  });
});

describe('createSoundEffect()', () => {
  it('returns object with all required fields', () => {
    const se = createSoundEffect('panel-1', 'BAM!');
    expect(se).toHaveProperty('text');
    expect(se).toHaveProperty('panelId');
    expect(se).toHaveProperty('position');
    expect(se).toHaveProperty('fontSize');
    expect(se).toHaveProperty('rotation');
    expect(se).toHaveProperty('color');
    expect(se).toHaveProperty('style');
  });

  it('sets text and panelId correctly', () => {
    const se = createSoundEffect('panel-2', 'WHOOSH!');
    expect(se.text).toBe('WHOOSH!');
    expect(se.panelId).toBe('panel-2');
  });

  it('default fontSize is 48', () => {
    const se = createSoundEffect('panel-1', 'Test');
    expect(se.fontSize).toBe(48);
  });

  it('default rotation is -12', () => {
    const se = createSoundEffect('panel-1', 'Test');
    expect(se.rotation).toBe(-12);
  });

  it('default style is bold', () => {
    const se = createSoundEffect('panel-1', 'Test');
    expect(se.style).toBe('bold');
  });

  it('custom options override defaults', () => {
    const se = createSoundEffect('panel-1', 'Test', {
      fontSize: 72,
      rotation: 15,
      style: 'shadow',
      color: '#ff0000',
      position: { x: 10, y: 20 },
    });
    expect(se.fontSize).toBe(72);
    expect(se.rotation).toBe(15);
    expect(se.style).toBe('shadow');
    expect(se.color).toBe('#ff0000');
    expect(se.position).toEqual({ x: 10, y: 20 });
  });
});

describe('SOUND_EFFECT_PRESETS', () => {
  it('has 10 presets', () => {
    expect(SOUND_EFFECT_PRESETS).toHaveLength(10);
  });

  it('each has text, textJa, style', () => {
    for (const preset of SOUND_EFFECT_PRESETS) {
      expect(preset).toHaveProperty('text');
      expect(preset).toHaveProperty('textJa');
      expect(preset).toHaveProperty('style');
    }
  });

  it('includes WHOOSH!', () => {
    expect(SOUND_EFFECT_PRESETS.some((p) => p.text === 'WHOOSH!')).toBe(true);
  });

  it('includes BAM!', () => {
    expect(SOUND_EFFECT_PRESETS.some((p) => p.text === 'BAM!')).toBe(true);
  });
});
