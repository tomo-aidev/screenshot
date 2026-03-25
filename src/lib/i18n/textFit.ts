/**
 * Multilingual Text Auto-Fit System
 * Calculates optimal font sizes for text within bounded areas,
 * with support for CJK, RTL, and text expansion rates per language.
 */

// Text expansion rates relative to English (1.0)
const TEXT_EXPANSION_RATES: Record<string, number> = {
  en: 1.0,
  ja: 0.85,
  zh: 0.75,
  'zh-Hans': 0.75,
  'zh-Hant': 0.75,
  ko: 1.05,
  de: 1.35,
  fr: 1.2,
  es: 1.15,
  pt: 1.15,
  ru: 1.25,
  ar: 1.25,
  he: 1.15,
  th: 1.1,
  vi: 1.1,
  id: 1.1,
  it: 1.15,
  nl: 1.2,
  pl: 1.2,
  tr: 1.15,
  sv: 1.1,
};

// Language-specific recommended font stacks
export const FONT_STACKS: Record<string, string[]> = {
  default: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
  ja: ['Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', 'sans-serif'],
  'zh-Hans': ['Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
  'zh-Hant': ['Noto Sans TC', 'PingFang TC', 'Microsoft JhengHei', 'sans-serif'],
  ko: ['Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', 'sans-serif'],
  ar: ['Noto Sans Arabic', 'Geeza Pro', 'Traditional Arabic', 'sans-serif'],
  he: ['Noto Sans Hebrew', 'Arial Hebrew', 'sans-serif'],
  th: ['Noto Sans Thai', 'Sarabun', 'sans-serif'],
};

// RTL languages
const RTL_LOCALES = new Set(['ar', 'he', 'fa', 'ur']);

export function isRTL(locale: string): boolean {
  const lang = locale.split('-')[0];
  return RTL_LOCALES.has(lang);
}

export function getTextExpansionRate(locale: string): number {
  if (TEXT_EXPANSION_RATES[locale]) return TEXT_EXPANSION_RATES[locale];
  const lang = locale.split('-')[0];
  return TEXT_EXPANSION_RATES[lang] ?? 1.0;
}

export function getFontStack(locale: string): string[] {
  if (FONT_STACKS[locale]) return FONT_STACKS[locale];
  const lang = locale.split('-')[0];
  return FONT_STACKS[lang] ?? FONT_STACKS.default;
}

// Check if a character is CJK
function isCJK(char: string): boolean {
  const code = char.charCodeAt(0);
  return (
    (code >= 0x4e00 && code <= 0x9fff) || // CJK Unified Ideographs
    (code >= 0x3040 && code <= 0x309f) || // Hiragana
    (code >= 0x30a0 && code <= 0x30ff) || // Katakana
    (code >= 0xac00 && code <= 0xd7af) || // Hangul Syllables
    (code >= 0x3400 && code <= 0x4dbf) || // CJK Extension A
    (code >= 0xf900 && code <= 0xfaff)    // CJK Compatibility Ideographs
  );
}

// Japanese kinsoku characters (cannot start a line)
const KINSOKU_START = new Set([
  ')', ']', '}', '）', '】', '」', '』', '〉', '》', '〕', '〗', '〙', '〛',
  '、', '。', '，', '．', '：', '；', '！', '？', '・', 'ー',
  ')', ']', '}', ',', '.', ':', ';', '!', '?',
]);

// Characters that cannot end a line
const KINSOKU_END = new Set([
  '(', '[', '{', '（', '【', '「', '『', '〈', '《', '〔', '〖', '〘', '〚',
  '(', '[', '{',
]);

interface TextMeasureCache {
  [key: string]: number;
}

const measureCache: TextMeasureCache = {};

/**
 * Estimate text width without canvas (server-side compatible).
 * Uses character-based width estimation with language-aware adjustments.
 */
function estimateTextWidth(
  text: string,
  fontSize: number,
  fontFamily: string
): number {
  const cacheKey = `${text}:${fontSize}:${fontFamily}`;
  if (measureCache[cacheKey] !== undefined) {
    return measureCache[cacheKey];
  }

  let totalWidth = 0;
  for (const char of text) {
    if (isCJK(char)) {
      totalWidth += fontSize;
    } else if (char === ' ') {
      totalWidth += fontSize * 0.3;
    } else if (/[A-Z]/.test(char)) {
      totalWidth += fontSize * 0.7;
    } else if (/[a-z]/.test(char)) {
      totalWidth += fontSize * 0.55;
    } else if (/[0-9]/.test(char)) {
      totalWidth += fontSize * 0.6;
    } else {
      totalWidth += fontSize * 0.5;
    }
  }

  measureCache[cacheKey] = totalWidth;
  return totalWidth;
}

/**
 * Wrap text into lines that fit within maxWidth.
 * CJK: character-level wrapping with kinsoku processing.
 * Latin: word-level wrapping.
 */
export function wrapText(
  text: string,
  maxWidth: number,
  fontSize: number,
  fontFamily: string
): string[] {
  if (!text || maxWidth <= 0) return [];

  const paragraphs = text.split('\n');
  const allLines: string[] = [];

  for (const paragraph of paragraphs) {
    if (paragraph.trim() === '') {
      allLines.push('');
      continue;
    }

    const lines = wrapParagraph(paragraph, maxWidth, fontSize, fontFamily);
    allLines.push(...lines);
  }

  return allLines;
}

function wrapParagraph(
  text: string,
  maxWidth: number,
  fontSize: number,
  fontFamily: string
): string[] {
  const lines: string[] = [];
  let currentLine = '';

  // Determine if text is primarily CJK
  const cjkCount = [...text].filter(isCJK).length;
  const isCJKText = cjkCount > text.length * 0.3;

  if (isCJKText) {
    // Character-level wrapping for CJK
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const testLine = currentLine + char;
      const testWidth = estimateTextWidth(testLine, fontSize, fontFamily);

      if (testWidth > maxWidth && currentLine.length > 0) {
        // Kinsoku processing
        const nextChar = text[i + 1];
        if (nextChar && KINSOKU_START.has(char)) {
          // Don't break before kinsoku-start chars, pull them back
          currentLine += char;
          lines.push(currentLine);
          currentLine = '';
          continue;
        }
        if (KINSOKU_END.has(char)) {
          lines.push(currentLine);
          currentLine = char;
          continue;
        }

        lines.push(currentLine);
        currentLine = char;
      } else {
        currentLine = testLine;
      }
    }
  } else {
    // Word-level wrapping for Latin scripts
    const words = text.split(/(\s+)/);
    for (const word of words) {
      const testLine = currentLine + word;
      const testWidth = estimateTextWidth(testLine, fontSize, fontFamily);

      if (testWidth > maxWidth && currentLine.trim().length > 0) {
        lines.push(currentLine.trim());
        currentLine = word.trimStart();
      } else {
        currentLine = testLine;
      }
    }
  }

  if (currentLine.trim().length > 0) {
    lines.push(currentLine.trim());
  }

  return lines;
}

export interface TextFitParams {
  text: string;
  locale: string;
  maxWidth: number;
  maxHeight: number;
  fontFamily: string;
  baseFontSize: number;
  minFontSize: number;
  lineHeight: number;
  padding?: number;
}

export interface TextFitResult {
  fontSize: number;
  lines: string[];
  overflow: boolean;
  adjustmentRatio: number;
}

/**
 * Calculate the optimal font size to fit text within a bounded area.
 * Uses binary search for efficient size determination.
 */
export function calculateFitFontSize(params: TextFitParams): TextFitResult {
  const {
    text,
    locale,
    maxWidth,
    maxHeight,
    fontFamily,
    baseFontSize,
    minFontSize,
    lineHeight,
    padding = 0,
  } = params;

  const effectiveWidth = maxWidth - padding * 2;
  const effectiveHeight = maxHeight - padding * 2;

  if (effectiveWidth <= 0 || effectiveHeight <= 0) {
    return {
      fontSize: minFontSize,
      lines: [text],
      overflow: true,
      adjustmentRatio: minFontSize / baseFontSize,
    };
  }

  // Adjust base font size by language expansion rate
  const expansionRate = getTextExpansionRate(locale);
  const adjustedBaseFontSize = Math.round(baseFontSize / expansionRate);

  // Binary search for optimal font size
  let low = minFontSize;
  let high = adjustedBaseFontSize;
  let bestFit: TextFitResult = {
    fontSize: minFontSize,
    lines: wrapText(text, effectiveWidth, minFontSize, fontFamily),
    overflow: true,
    adjustmentRatio: minFontSize / baseFontSize,
  };

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const lines = wrapText(text, effectiveWidth, mid, fontFamily);
    const totalHeight = lines.length * mid * lineHeight;

    if (totalHeight <= effectiveHeight) {
      bestFit = {
        fontSize: mid,
        lines,
        overflow: false,
        adjustmentRatio: mid / baseFontSize,
      };
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  // Final overflow check with minFontSize
  if (bestFit.fontSize <= minFontSize) {
    const lines = wrapText(text, effectiveWidth, minFontSize, fontFamily);
    const totalHeight = lines.length * minFontSize * lineHeight;
    bestFit = {
      fontSize: minFontSize,
      lines,
      overflow: totalHeight > effectiveHeight,
      adjustmentRatio: minFontSize / baseFontSize,
    };
  }

  return bestFit;
}

/**
 * Clear the text measurement cache.
 */
export function clearMeasureCache(): void {
  for (const key in measureCache) {
    delete measureCache[key];
  }
}

/**
 * Get the text direction for a locale.
 */
export function getTextDirection(locale: string): 'ltr' | 'rtl' {
  return isRTL(locale) ? 'rtl' : 'ltr';
}

/**
 * Get the CSS font-family string for a locale.
 */
export function getFontFamilyCSS(locale: string): string {
  return getFontStack(locale).map((f) => (f.includes(' ') ? `"${f}"` : f)).join(', ');
}
