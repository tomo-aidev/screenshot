import { describe, it, expect } from 'vitest';
import {
  createMangaTemplate,
  // Re-exports from layouts
  MANGA_LAYOUTS,
  getLayoutPreset,
  getAllLayoutPresets,
  // Re-exports from bubbles
  BUBBLE_SHAPES,
  createBubble,
  getTailPath,
  // Re-exports from effects
  generateEffectSVG,
  createSoundEffect,
  SOUND_EFFECT_PRESETS,
} from '../index';

describe('createMangaTemplate()', () => {
  it('returns template with unique id', () => {
    const template = createMangaTemplate('Test', 'four-koma');
    expect(template.id).toBeDefined();
    expect(typeof template.id).toBe('string');
    expect(template.id.length).toBeGreaterThan(0);
  });

  it('sets name correctly', () => {
    const template = createMangaTemplate('My Manga', 'four-koma');
    expect(template.name).toBe('My Manga');
  });

  it('panels match the layout preset', () => {
    const template = createMangaTemplate('Test', 'l-shape');
    expect(template.panels).toHaveLength(3);
  });

  it('four-koma preset creates 4 panels', () => {
    const template = createMangaTemplate('Test', 'four-koma');
    expect(template.panels).toHaveLength(4);
  });

  it('grid-2x2 preset creates 4 panels', () => {
    const template = createMangaTemplate('Test', 'grid-2x2');
    expect(template.panels).toHaveLength(4);
  });

  it('free preset creates 0 panels', () => {
    const template = createMangaTemplate('Test', 'free');
    expect(template.panels).toHaveLength(0);
  });

  it('has empty bubbles, effects, soundEffects arrays', () => {
    const template = createMangaTemplate('Test', 'four-koma');
    expect(template.bubbles).toEqual([]);
    expect(template.effects).toEqual([]);
    expect(template.soundEffects).toEqual([]);
  });

  it("default backgroundColor is '#ffffff'", () => {
    const template = createMangaTemplate('Test', 'four-koma');
    expect(template.backgroundColor).toBe('#ffffff');
  });

  it('default panelSpacing is 8', () => {
    const template = createMangaTemplate('Test', 'four-koma');
    expect(template.panelSpacing).toBe(8);
  });

  it("id starts with 'manga-'", () => {
    const template = createMangaTemplate('Test', 'four-koma');
    expect(template.id).toMatch(/^manga-/);
  });
});

describe('Re-exports', () => {
  it('layouts exports are accessible from index', () => {
    expect(MANGA_LAYOUTS).toBeDefined();
    expect(getLayoutPreset).toBeDefined();
    expect(getAllLayoutPresets).toBeDefined();
  });

  it('bubbles exports are accessible from index', () => {
    expect(BUBBLE_SHAPES).toBeDefined();
    expect(createBubble).toBeDefined();
    expect(getTailPath).toBeDefined();
  });

  it('effects exports are accessible from index', () => {
    expect(generateEffectSVG).toBeDefined();
    expect(createSoundEffect).toBeDefined();
    expect(SOUND_EFFECT_PRESETS).toBeDefined();
  });
});
