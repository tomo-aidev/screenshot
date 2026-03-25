import { describe, it, expect, beforeEach } from 'vitest';
import {
  getTextExpansionRate,
  getFontStack,
  isRTL,
  wrapText,
  calculateFitFontSize,
  clearMeasureCache,
  getTextDirection,
  getFontFamilyCSS,
  FONT_STACKS,
} from '../textFit';

describe('getTextExpansionRate', () => {
  it('en returns 1.0', () => {
    expect(getTextExpansionRate('en')).toBe(1.0);
  });

  it('ja returns 0.85', () => {
    expect(getTextExpansionRate('ja')).toBe(0.85);
  });

  it('zh returns 0.75', () => {
    expect(getTextExpansionRate('zh')).toBe(0.75);
  });

  it('de returns 1.35', () => {
    expect(getTextExpansionRate('de')).toBe(1.35);
  });

  it('fr returns 1.2', () => {
    expect(getTextExpansionRate('fr')).toBe(1.2);
  });

  it('ar returns 1.25', () => {
    expect(getTextExpansionRate('ar')).toBe(1.25);
  });

  it('unknown locale returns 1.0', () => {
    expect(getTextExpansionRate('xx')).toBe(1.0);
  });

  it('locale with region (zh-Hans) returns correct rate', () => {
    expect(getTextExpansionRate('zh-Hans')).toBe(0.75);
  });

  it('en-US falls back to en rate', () => {
    expect(getTextExpansionRate('en-US')).toBe(1.0);
  });
});

describe('getFontStack', () => {
  it('default returns Inter-based stack', () => {
    const stack = getFontStack('default');
    expect(stack).toEqual(FONT_STACKS.default);
    expect(stack[0]).toBe('Inter');
  });

  it('ja returns Noto Sans JP stack', () => {
    const stack = getFontStack('ja');
    expect(stack[0]).toBe('Noto Sans JP');
  });

  it('zh-Hans returns SC fonts', () => {
    const stack = getFontStack('zh-Hans');
    expect(stack[0]).toBe('Noto Sans SC');
  });

  it('zh-Hant returns TC fonts', () => {
    const stack = getFontStack('zh-Hant');
    expect(stack[0]).toBe('Noto Sans TC');
  });

  it('ko returns Korean fonts', () => {
    const stack = getFontStack('ko');
    expect(stack[0]).toBe('Noto Sans KR');
  });

  it('ar returns Arabic fonts', () => {
    const stack = getFontStack('ar');
    expect(stack[0]).toBe('Noto Sans Arabic');
  });

  it('unknown locale returns default stack', () => {
    const stack = getFontStack('xx');
    expect(stack).toEqual(FONT_STACKS.default);
  });
});

describe('isRTL', () => {
  it('ar is RTL', () => {
    expect(isRTL('ar')).toBe(true);
  });

  it('he is RTL', () => {
    expect(isRTL('he')).toBe(true);
  });

  it('en is not RTL', () => {
    expect(isRTL('en')).toBe(false);
  });

  it('ja is not RTL', () => {
    expect(isRTL('ja')).toBe(false);
  });

  it('ar-SA (with region) is RTL', () => {
    expect(isRTL('ar-SA')).toBe(true);
  });
});

describe('wrapText', () => {
  const fontFamily = 'Inter';

  beforeEach(() => {
    clearMeasureCache();
  });

  it('empty text returns empty array', () => {
    expect(wrapText('', 200, 16, fontFamily)).toEqual([]);
  });

  it('short text fits in one line', () => {
    const lines = wrapText('Hi', 200, 16, fontFamily);
    expect(lines).toHaveLength(1);
    expect(lines[0]).toBe('Hi');
  });

  it('long English text wraps at word boundaries', () => {
    const text = 'The quick brown fox jumps over the lazy dog and keeps on running through the forest';
    const lines = wrapText(text, 100, 16, fontFamily);
    expect(lines.length).toBeGreaterThan(1);
    // Each line should be a valid substring of words (no broken words)
    for (const line of lines) {
      const words = line.split(' ');
      for (const word of words) {
        expect(text).toContain(word);
      }
    }
  });

  it('CJK text wraps at character boundaries', () => {
    const text = '\u3053\u3093\u306B\u3061\u306F\u4E16\u754C\u3053\u308C\u306F\u65E5\u672C\u8A9E\u306E\u30C6\u30B9\u30C8\u3067\u3059';
    const lines = wrapText(text, 80, 16, fontFamily);
    expect(lines.length).toBeGreaterThan(1);
  });

  it('text with newlines preserves paragraph breaks', () => {
    const text = 'Line one\n\nLine three';
    const lines = wrapText(text, 500, 16, fontFamily);
    expect(lines).toContain('');
    expect(lines[0]).toBe('Line one');
  });

  it('zero maxWidth returns empty', () => {
    expect(wrapText('Hello', 0, 16, fontFamily)).toEqual([]);
  });

  it('negative maxWidth returns empty', () => {
    expect(wrapText('Hello', -10, 16, fontFamily)).toEqual([]);
  });

  it('single very long word still returns lines', () => {
    const text = 'Supercalifragilisticexpialidocious';
    const lines = wrapText(text, 50, 16, fontFamily);
    expect(lines.length).toBeGreaterThanOrEqual(1);
  });
});

describe('calculateFitFontSize', () => {
  const baseParams = {
    text: 'Hello',
    locale: 'en',
    maxWidth: 500,
    maxHeight: 200,
    fontFamily: 'Inter',
    baseFontSize: 48,
    minFontSize: 10,
    lineHeight: 1.2,
  };

  beforeEach(() => {
    clearMeasureCache();
  });

  it('basic case: short text fits at baseFontSize', () => {
    const result = calculateFitFontSize(baseParams);
    expect(result.fontSize).toBeGreaterThanOrEqual(baseParams.minFontSize);
    expect(result.overflow).toBe(false);
  });

  it('long text: fontSize is reduced from baseFontSize', () => {
    const result = calculateFitFontSize({
      ...baseParams,
      text: 'This is a much longer text that should require the font size to be reduced significantly to fit within the given area boundaries',
      maxWidth: 150,
      maxHeight: 80,
    });
    expect(result.fontSize).toBeLessThan(baseParams.baseFontSize);
  });

  it('overflow: returns overflow=true when minFontSize still does not fit', () => {
    const result = calculateFitFontSize({
      ...baseParams,
      text: 'This is an extremely long text that simply cannot fit in such a tiny box no matter what font size is used because the area is way too small for this much content',
      maxWidth: 30,
      maxHeight: 10,
      minFontSize: 10,
    });
    expect(result.overflow).toBe(true);
  });

  it('adjustmentRatio is < 1 when text is shrunk', () => {
    const result = calculateFitFontSize({
      ...baseParams,
      text: 'A longer text string that needs shrinking to fit in the available space here',
      maxWidth: 100,
      maxHeight: 50,
    });
    if (result.fontSize < baseParams.baseFontSize) {
      expect(result.adjustmentRatio).toBeLessThan(1);
    }
  });

  it('adjustmentRatio equals fontSize / baseFontSize', () => {
    const result = calculateFitFontSize(baseParams);
    expect(result.adjustmentRatio).toBeCloseTo(result.fontSize / baseParams.baseFontSize, 5);
  });

  it('different locales produce different fontSizes (German vs English)', () => {
    const text = 'Hello World Test';
    const enResult = calculateFitFontSize({ ...baseParams, text, locale: 'en' });
    const deResult = calculateFitFontSize({ ...baseParams, text, locale: 'de' });
    // German has a higher expansion rate (1.35), so adjustedBaseFontSize is smaller
    // meaning de should have the same or smaller fontSize
    expect(deResult.fontSize).toBeLessThanOrEqual(enResult.fontSize);
  });

  it('Japanese text with expansion rate', () => {
    const result = calculateFitFontSize({
      ...baseParams,
      text: '\u3053\u3093\u306B\u3061\u306F\u4E16\u754C',
      locale: 'ja',
    });
    expect(result.fontSize).toBeGreaterThanOrEqual(baseParams.minFontSize);
    expect(result.lines.length).toBeGreaterThanOrEqual(1);
  });

  it('padding reduces effective area', () => {
    const noPadding = calculateFitFontSize({
      ...baseParams,
      text: 'Some text to fit here',
      padding: 0,
    });
    const withPadding = calculateFitFontSize({
      ...baseParams,
      text: 'Some text to fit here',
      padding: 50,
    });
    expect(withPadding.fontSize).toBeLessThanOrEqual(noPadding.fontSize);
  });

  it('zero-area returns overflow=true', () => {
    const result = calculateFitFontSize({
      ...baseParams,
      maxWidth: 0,
      maxHeight: 0,
    });
    expect(result.overflow).toBe(true);
  });

  it('returns lines array', () => {
    const result = calculateFitFontSize(baseParams);
    expect(Array.isArray(result.lines)).toBe(true);
    expect(result.lines.length).toBeGreaterThanOrEqual(1);
  });
});

describe('clearMeasureCache', () => {
  it('can be called without error', () => {
    expect(() => clearMeasureCache()).not.toThrow();
  });
});

describe('getTextDirection', () => {
  it('en returns ltr', () => {
    expect(getTextDirection('en')).toBe('ltr');
  });

  it('ar returns rtl', () => {
    expect(getTextDirection('ar')).toBe('rtl');
  });
});

describe('getFontFamilyCSS', () => {
  it('returns comma-separated string', () => {
    const css = getFontFamilyCSS('en');
    expect(css).toContain(',');
  });

  it('multi-word fonts are quoted', () => {
    const css = getFontFamilyCSS('en');
    // "Inter" is single word, but "Helvetica Neue" has a space
    expect(css).toContain('"Helvetica Neue"');
  });

  it('single-word fonts are not quoted', () => {
    const css = getFontFamilyCSS('en');
    // Inter and Arial should not be quoted
    expect(css).toMatch(/(?<!")Inter(?!")/);
    expect(css).toMatch(/(?<!")Arial(?!")/);
  });
});
