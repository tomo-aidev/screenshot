export interface FontConfig {
  family: string;
  weights: number[];
  subsets: string[];
  url?: string;
}

export const FONT_CONFIGS: Record<string, FontConfig[]> = {
  default: [
    {
      family: 'Inter',
      weights: [300, 400, 500, 600, 700, 800, 900],
      subsets: ['latin', 'latin-ext'],
    },
  ],
  ja: [
    {
      family: 'Noto Sans JP',
      weights: [300, 400, 500, 700, 900],
      subsets: ['japanese'],
    },
  ],
  'zh-Hans': [
    {
      family: 'Noto Sans SC',
      weights: [300, 400, 500, 700, 900],
      subsets: ['chinese-simplified'],
    },
  ],
  'zh-Hant': [
    {
      family: 'Noto Sans TC',
      weights: [300, 400, 500, 700, 900],
      subsets: ['chinese-traditional'],
    },
  ],
  ko: [
    {
      family: 'Noto Sans KR',
      weights: [300, 400, 500, 700, 900],
      subsets: ['korean'],
    },
  ],
  ar: [
    {
      family: 'Noto Sans Arabic',
      weights: [300, 400, 500, 700],
      subsets: ['arabic'],
    },
  ],
  he: [
    {
      family: 'Noto Sans Hebrew',
      weights: [300, 400, 500, 700],
      subsets: ['hebrew'],
    },
  ],
  th: [
    {
      family: 'Noto Sans Thai',
      weights: [300, 400, 500, 700],
      subsets: ['thai'],
    },
  ],
};

export function getRequiredFonts(locales: string[]): FontConfig[] {
  const fontSet = new Map<string, FontConfig>();

  // Always include default fonts
  for (const font of FONT_CONFIGS.default) {
    fontSet.set(font.family, font);
  }

  for (const locale of locales) {
    const configs = FONT_CONFIGS[locale] ?? FONT_CONFIGS[locale.split('-')[0]];
    if (configs) {
      for (const font of configs) {
        fontSet.set(font.family, font);
      }
    }
  }

  return Array.from(fontSet.values());
}

export function getGoogleFontsUrl(fonts: FontConfig[]): string {
  const families = fonts
    .map((f) => {
      const weights = f.weights.join(';');
      return `family=${encodeURIComponent(f.family)}:wght@${weights}`;
    })
    .join('&');

  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}
