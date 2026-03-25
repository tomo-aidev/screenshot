import { describe, it, expect, beforeEach } from 'vitest';
import {
  FONT_CONFIGS,
  getRequiredFonts,
  getGoogleFontsUrl,
  FontConfig,
} from '../fonts';

describe('FONT_CONFIGS', () => {
  it('has default entry', () => {
    expect(FONT_CONFIGS).toHaveProperty('default');
    expect(FONT_CONFIGS.default.length).toBeGreaterThan(0);
  });

  it('has ja, zh-Hans, zh-Hant, ko, ar, he, th entries', () => {
    for (const key of ['ja', 'zh-Hans', 'zh-Hant', 'ko', 'ar', 'he', 'th']) {
      expect(FONT_CONFIGS).toHaveProperty(key);
    }
  });

  it('each config has family, weights, subsets', () => {
    for (const [, configs] of Object.entries(FONT_CONFIGS)) {
      for (const config of configs) {
        expect(config).toHaveProperty('family');
        expect(typeof config.family).toBe('string');
        expect(config).toHaveProperty('weights');
        expect(Array.isArray(config.weights)).toBe(true);
        expect(config.weights.length).toBeGreaterThan(0);
        expect(config).toHaveProperty('subsets');
        expect(Array.isArray(config.subsets)).toBe(true);
        expect(config.subsets.length).toBeGreaterThan(0);
      }
    }
  });

  it('default includes Inter', () => {
    const families = FONT_CONFIGS.default.map((c) => c.family);
    expect(families).toContain('Inter');
  });

  it('Japanese includes Noto Sans JP', () => {
    const families = FONT_CONFIGS.ja.map((c) => c.family);
    expect(families).toContain('Noto Sans JP');
  });
});

describe('getRequiredFonts', () => {
  it('always includes default fonts', () => {
    const fonts = getRequiredFonts([]);
    const families = fonts.map((f) => f.family);
    expect(families).toContain('Inter');
  });

  it('adding ja adds Japanese font', () => {
    const fonts = getRequiredFonts(['ja']);
    const families = fonts.map((f) => f.family);
    expect(families).toContain('Noto Sans JP');
    expect(families).toContain('Inter');
  });

  it('adding ko adds Korean font', () => {
    const fonts = getRequiredFonts(['ko']);
    const families = fonts.map((f) => f.family);
    expect(families).toContain('Noto Sans KR');
  });

  it('multiple locales combine fonts', () => {
    const fonts = getRequiredFonts(['ja', 'ko', 'ar']);
    const families = fonts.map((f) => f.family);
    expect(families).toContain('Inter');
    expect(families).toContain('Noto Sans JP');
    expect(families).toContain('Noto Sans KR');
    expect(families).toContain('Noto Sans Arabic');
  });

  it('no duplicate fonts', () => {
    const fonts = getRequiredFonts(['ja', 'ja', 'ko']);
    const families = fonts.map((f) => f.family);
    const uniqueFamilies = [...new Set(families)];
    expect(families.length).toBe(uniqueFamilies.length);
  });

  it('unknown locale returns only default', () => {
    const fonts = getRequiredFonts(['xx']);
    const families = fonts.map((f) => f.family);
    expect(families).toEqual(['Inter']);
  });

  it('empty array returns only default', () => {
    const fonts = getRequiredFonts([]);
    const families = fonts.map((f) => f.family);
    expect(families).toEqual(['Inter']);
  });
});

describe('getGoogleFontsUrl', () => {
  const defaultFonts = getRequiredFonts([]);

  it('returns valid URL string', () => {
    const url = getGoogleFontsUrl(defaultFonts);
    expect(url).toMatch(/^https:\/\//);
  });

  it('contains fonts.googleapis.com', () => {
    const url = getGoogleFontsUrl(defaultFonts);
    expect(url).toContain('fonts.googleapis.com');
  });

  it('contains font family names', () => {
    const fonts = getRequiredFonts(['ja']);
    const url = getGoogleFontsUrl(fonts);
    expect(url).toContain('Inter');
    expect(url).toContain('Noto');
  });

  it('contains weight values', () => {
    const url = getGoogleFontsUrl(defaultFonts);
    expect(url).toContain('wght@');
    expect(url).toContain('400');
  });

  it('URL-encodes font names with spaces', () => {
    const fonts = getRequiredFonts(['ja']);
    const url = getGoogleFontsUrl(fonts);
    // "Noto Sans JP" should be encoded
    expect(url).toContain(encodeURIComponent('Noto Sans JP'));
  });
});
