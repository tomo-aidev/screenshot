import { describe, it, expect } from 'vitest';
import { BUBBLE_SHAPES, createBubble, getTailPath } from '../bubbles';

describe('BUBBLE_SHAPES', () => {
  it('has all 5 types', () => {
    const types = Object.keys(BUBBLE_SHAPES);
    expect(types).toContain('normal');
    expect(types).toContain('shout');
    expect(types).toContain('whisper');
    expect(types).toContain('thought');
    expect(types).toContain('narration');
    expect(types).toHaveLength(5);
  });

  it('each has type, svgPath function, defaultStyle', () => {
    for (const shape of Object.values(BUBBLE_SHAPES)) {
      expect(shape).toHaveProperty('type');
      expect(shape).toHaveProperty('svgPath');
      expect(shape).toHaveProperty('defaultStyle');
      expect(typeof shape.svgPath).toBe('function');
    }
  });

  it('svgPath returns non-empty string for reasonable dimensions', () => {
    for (const shape of Object.values(BUBBLE_SHAPES)) {
      const path = shape.svgPath(100, 60);
      expect(typeof path).toBe('string');
      expect(path.length).toBeGreaterThan(0);
    }
  });

  it('defaultStyle has backgroundColor, borderColor, fontFamily, fontSize', () => {
    for (const shape of Object.values(BUBBLE_SHAPES)) {
      expect(shape.defaultStyle).toHaveProperty('backgroundColor');
      expect(shape.defaultStyle).toHaveProperty('borderColor');
      expect(shape.defaultStyle).toHaveProperty('fontFamily');
      expect(shape.defaultStyle).toHaveProperty('fontSize');
    }
  });
});

describe('createBubble()', () => {
  it('returns bubble with unique id', () => {
    const bubble = createBubble('panel-1', 'normal', 'Hello');
    expect(bubble.id).toBeDefined();
    expect(typeof bubble.id).toBe('string');
    expect(bubble.id.length).toBeGreaterThan(0);
  });

  it('sets correct panelId and type', () => {
    const bubble = createBubble('panel-1', 'shout', 'Test');
    expect(bubble.panelId).toBe('panel-1');
    expect(bubble.type).toBe('shout');
  });

  it('sets text correctly', () => {
    const bubble = createBubble('panel-1', 'normal', 'Hello World');
    expect(bubble.text).toBe('Hello World');
  });

  it('default position is { x: 50, y: 50 }', () => {
    const bubble = createBubble('panel-1', 'normal', 'Test');
    expect(bubble.position).toEqual({ x: 50, y: 50 });
  });

  it('custom position works', () => {
    const bubble = createBubble('panel-1', 'normal', 'Test', { x: 10, y: 20 });
    expect(bubble.position).toEqual({ x: 10, y: 20 });
  });

  it('style matches BUBBLE_SHAPES default', () => {
    const bubble = createBubble('panel-1', 'normal', 'Test');
    expect(bubble.style).toEqual(BUBBLE_SHAPES.normal.defaultStyle);
  });

  it('narration type gets tailDirection none', () => {
    const bubble = createBubble('panel-1', 'narration', 'Narration text');
    expect(bubble.tailDirection).toBe('none');
  });

  it('other types get tailDirection bottom-left', () => {
    for (const type of ['normal', 'shout', 'whisper', 'thought'] as const) {
      const bubble = createBubble('panel-1', type, 'Test');
      expect(bubble.tailDirection).toBe('bottom-left');
    }
  });

  it('two calls produce different ids', () => {
    const bubble1 = createBubble('panel-1', 'normal', 'A');
    const bubble2 = createBubble('panel-1', 'normal', 'B');
    expect(bubble1.id).not.toBe(bubble2.id);
  });
});

describe('getTailPath()', () => {
  it('returns non-empty string for bottom-left', () => {
    const path = getTailPath('bottom-left', 100, 60);
    expect(path.length).toBeGreaterThan(0);
  });

  it('returns non-empty string for bottom-right', () => {
    const path = getTailPath('bottom-right', 100, 60);
    expect(path.length).toBeGreaterThan(0);
  });

  it('returns non-empty string for top-left', () => {
    const path = getTailPath('top-left', 100, 60);
    expect(path.length).toBeGreaterThan(0);
  });

  it('returns non-empty string for top-right', () => {
    const path = getTailPath('top-right', 100, 60);
    expect(path.length).toBeGreaterThan(0);
  });

  it('returns empty string for none', () => {
    const path = getTailPath('none', 100, 60);
    expect(path).toBe('');
  });

  it('path contains valid SVG path commands (M, L)', () => {
    for (const direction of ['bottom-left', 'bottom-right', 'top-left', 'top-right'] as const) {
      const path = getTailPath(direction, 100, 60);
      expect(path).toContain('M');
      expect(path).toContain('L');
    }
  });
});
