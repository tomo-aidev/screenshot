import { describe, it, expect } from 'vitest';
import { MANGA_LAYOUTS, getLayoutPreset, getAllLayoutPresets } from '../layouts';

describe('MANGA_LAYOUTS constant', () => {
  it('has all 6 preset keys', () => {
    const keys = Object.keys(MANGA_LAYOUTS);
    expect(keys).toContain('four-koma');
    expect(keys).toContain('grid-2x2');
    expect(keys).toContain('l-shape');
    expect(keys).toContain('staircase');
    expect(keys).toContain('full-page');
    expect(keys).toContain('free');
    expect(keys).toHaveLength(6);
  });

  it('each layout has name, description, panels', () => {
    for (const layout of Object.values(MANGA_LAYOUTS)) {
      expect(layout).toHaveProperty('name');
      expect(layout).toHaveProperty('description');
      expect(layout).toHaveProperty('panels');
      expect(typeof layout.name).toBe('string');
      expect(typeof layout.description).toBe('string');
      expect(Array.isArray(layout.panels)).toBe(true);
    }
  });

  it('four-koma has 4 panels', () => {
    expect(MANGA_LAYOUTS['four-koma'].panels).toHaveLength(4);
  });

  it('grid-2x2 has 4 panels', () => {
    expect(MANGA_LAYOUTS['grid-2x2'].panels).toHaveLength(4);
  });

  it('l-shape has 3 panels', () => {
    expect(MANGA_LAYOUTS['l-shape'].panels).toHaveLength(3);
  });

  it('staircase has 3 panels', () => {
    expect(MANGA_LAYOUTS['staircase'].panels).toHaveLength(3);
  });

  it('full-page has 1 panel', () => {
    expect(MANGA_LAYOUTS['full-page'].panels).toHaveLength(1);
  });

  it('free has 0 panels', () => {
    expect(MANGA_LAYOUTS['free'].panels).toHaveLength(0);
  });
});

describe('Panel properties', () => {
  const allPanels = Object.values(MANGA_LAYOUTS).flatMap((layout) => layout.panels);

  it('all panels have id, x, y, width, height', () => {
    for (const panel of allPanels) {
      expect(panel).toHaveProperty('id');
      expect(panel).toHaveProperty('x');
      expect(panel).toHaveProperty('y');
      expect(panel).toHaveProperty('width');
      expect(panel).toHaveProperty('height');
    }
  });

  it('x and y are >= 0 and <= 100', () => {
    for (const panel of allPanels) {
      expect(panel.x).toBeGreaterThanOrEqual(0);
      expect(panel.x).toBeLessThanOrEqual(100);
      expect(panel.y).toBeGreaterThanOrEqual(0);
      expect(panel.y).toBeLessThanOrEqual(100);
    }
  });

  it('width and height are > 0 and <= 100', () => {
    for (const panel of allPanels) {
      expect(panel.width).toBeGreaterThan(0);
      expect(panel.width).toBeLessThanOrEqual(100);
      expect(panel.height).toBeGreaterThan(0);
      expect(panel.height).toBeLessThanOrEqual(100);
    }
  });

  it('all panels have borderWidth and borderColor', () => {
    for (const panel of allPanels) {
      expect(panel).toHaveProperty('borderWidth');
      expect(panel).toHaveProperty('borderColor');
      expect(typeof panel.borderWidth).toBe('number');
      expect(typeof panel.borderColor).toBe('string');
    }
  });

  it('all panels have content with type screenshot', () => {
    for (const panel of allPanels) {
      expect(panel.content).toHaveProperty('type');
      expect(panel.content.type).toBe('screenshot');
    }
  });

  it('four-koma panels are roughly equal height', () => {
    const panels = MANGA_LAYOUTS['four-koma'].panels;
    const heights = panels.map((p) => p.height);
    const avg = heights.reduce((a, b) => a + b, 0) / heights.length;
    for (const h of heights) {
      expect(Math.abs(h - avg)).toBeLessThan(2);
    }
  });

  it('grid-2x2 panels form 2x2 grid (check x/y positions)', () => {
    const panels = MANGA_LAYOUTS['grid-2x2'].panels;
    // Top-left
    expect(panels[0].x).toBe(0);
    expect(panels[0].y).toBe(0);
    // Top-right
    expect(panels[1].x).toBeGreaterThan(0);
    expect(panels[1].y).toBe(0);
    // Bottom-left
    expect(panels[2].x).toBe(0);
    expect(panels[2].y).toBeGreaterThan(0);
    // Bottom-right
    expect(panels[3].x).toBeGreaterThan(0);
    expect(panels[3].y).toBeGreaterThan(0);
  });
});

describe('getLayoutPreset()', () => {
  it('returns panels for each preset', () => {
    expect(getLayoutPreset('four-koma')).toHaveLength(4);
    expect(getLayoutPreset('grid-2x2')).toHaveLength(4);
    expect(getLayoutPreset('l-shape')).toHaveLength(3);
    expect(getLayoutPreset('staircase')).toHaveLength(3);
    expect(getLayoutPreset('full-page')).toHaveLength(1);
    expect(getLayoutPreset('free')).toHaveLength(0);
  });

  it('returns copy (not reference)', () => {
    const panels = getLayoutPreset('four-koma');
    expect(panels).not.toBe(MANGA_LAYOUTS['four-koma'].panels);
  });

  it('modifying returned panels does not affect original', () => {
    const panels = getLayoutPreset('four-koma');
    panels[0].x = 999;
    expect(MANGA_LAYOUTS['four-koma'].panels[0].x).toBe(0);
  });

  it('returns empty array for free', () => {
    const panels = getLayoutPreset('free');
    expect(panels).toEqual([]);
  });
});

describe('getAllLayoutPresets()', () => {
  it('returns 6 entries', () => {
    expect(getAllLayoutPresets()).toHaveLength(6);
  });

  it('each entry has id, name, description, panelCount', () => {
    for (const entry of getAllLayoutPresets()) {
      expect(entry).toHaveProperty('id');
      expect(entry).toHaveProperty('name');
      expect(entry).toHaveProperty('description');
      expect(entry).toHaveProperty('panelCount');
    }
  });

  it('four-koma panelCount is 4', () => {
    const preset = getAllLayoutPresets().find((p) => p.id === 'four-koma');
    expect(preset?.panelCount).toBe(4);
  });

  it('free panelCount is 0', () => {
    const preset = getAllLayoutPresets().find((p) => p.id === 'free');
    expect(preset?.panelCount).toBe(0);
  });
});
