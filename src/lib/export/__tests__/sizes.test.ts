import { describe, it, expect } from 'vitest';
import {
  OUTPUT_SIZES,
  getOutputSizes,
  getRequiredSizes,
  getScreenshotSizes,
  getVideoSizes,
  getGraphicSizes,
  getSizesByPlatform,
  PLATFORM_LABELS,
  PLATFORM_ICONS,
} from '../sizes';
import type { Platform } from '@/types/export';

const ALL_PLATFORMS: Platform[] = [
  'apple',
  'google',
  'instagram',
  'twitter',
  'facebook',
  'tiktok',
  'youtube',
  'line',
  'pinterest',
];

const VALID_PLATFORMS: Platform[] = ALL_PLATFORMS;
const VALID_TYPES = ['screenshot', 'video', 'graphic'] as const;

describe('OUTPUT_SIZES data integrity', () => {
  it('all sizes have valid width (> 0)', () => {
    for (const size of OUTPUT_SIZES) {
      expect(size.width).toBeGreaterThan(0);
    }
  });

  it('all sizes have valid height (> 0)', () => {
    for (const size of OUTPUT_SIZES) {
      expect(size.height).toBeGreaterThan(0);
    }
  });

  it('all sizes have valid platform values', () => {
    for (const size of OUTPUT_SIZES) {
      expect(VALID_PLATFORMS).toContain(size.platform);
    }
  });

  it('all sizes have valid type (screenshot | video | graphic)', () => {
    for (const size of OUTPUT_SIZES) {
      expect(VALID_TYPES).toContain(size.type);
    }
  });

  it('all sizes have non-empty name', () => {
    for (const size of OUTPUT_SIZES) {
      expect(size.name.length).toBeGreaterThan(0);
    }
  });

  it('all sizes have at least one format', () => {
    for (const size of OUTPUT_SIZES) {
      expect(size.format.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('video sizes must have video config', () => {
    const videoSizes = OUTPUT_SIZES.filter((s) => s.type === 'video');
    for (const size of videoSizes) {
      expect(size.video).toBeDefined();
      expect(size.video!.codec).toBeTruthy();
      expect(size.video!.bitrate).toBeDefined();
      expect(size.video!.duration).toBeDefined();
    }
  });

  it('non-video sizes should not have video config', () => {
    const nonVideoSizes = OUTPUT_SIZES.filter((s) => s.type !== 'video');
    for (const size of nonVideoSizes) {
      expect(size.video).toBeUndefined();
    }
  });

  it('aspect ratios are non-empty strings', () => {
    for (const size of OUTPUT_SIZES) {
      expect(typeof size.aspectRatio).toBe('string');
      expect(size.aspectRatio.length).toBeGreaterThan(0);
    }
  });
});

describe('Specific platform sizes (exact values)', () => {
  function findSize(platform: Platform, name: string) {
    return OUTPUT_SIZES.find(
      (s) => s.platform === platform && s.name === name
    );
  }

  // Apple
  it('Apple iPhone 6.9": 1320x2868', () => {
    const size = findSize('apple', 'iPhone 6.9"');
    expect(size).toBeDefined();
    expect(size!.width).toBe(1320);
    expect(size!.height).toBe(2868);
  });

  it('Apple iPhone 6.7": 1290x2796', () => {
    const size = findSize('apple', 'iPhone 6.7"');
    expect(size).toBeDefined();
    expect(size!.width).toBe(1290);
    expect(size!.height).toBe(2796);
  });

  it('Apple iPhone 6.5": 1284x2778', () => {
    const size = findSize('apple', 'iPhone 6.5"');
    expect(size).toBeDefined();
    expect(size!.width).toBe(1284);
    expect(size!.height).toBe(2778);
  });

  it('Apple iPhone 5.5": 1242x2208', () => {
    const size = findSize('apple', 'iPhone 5.5"');
    expect(size).toBeDefined();
    expect(size!.width).toBe(1242);
    expect(size!.height).toBe(2208);
  });

  it('Apple iPad Pro 13": 2064x2752', () => {
    const size = findSize('apple', 'iPad Pro 13"');
    expect(size).toBeDefined();
    expect(size!.width).toBe(2064);
    expect(size!.height).toBe(2752);
  });

  it('Apple iPad Pro 12.9": 2048x2732', () => {
    const size = findSize('apple', 'iPad Pro 12.9"');
    expect(size).toBeDefined();
    expect(size!.width).toBe(2048);
    expect(size!.height).toBe(2732);
  });

  it('Apple Watch: 396x484', () => {
    const size = findSize('apple', 'Apple Watch');
    expect(size).toBeDefined();
    expect(size!.width).toBe(396);
    expect(size!.height).toBe(484);
  });

  // Google
  it('Google Phone: 1080x1920', () => {
    const size = findSize('google', 'Phone');
    expect(size).toBeDefined();
    expect(size!.width).toBe(1080);
    expect(size!.height).toBe(1920);
  });

  it('Google Tablet 7": 1200x1920', () => {
    const size = findSize('google', 'Tablet 7"');
    expect(size).toBeDefined();
    expect(size!.width).toBe(1200);
    expect(size!.height).toBe(1920);
  });

  it('Google Tablet 10": 1600x2560', () => {
    const size = findSize('google', 'Tablet 10"');
    expect(size).toBeDefined();
    expect(size!.width).toBe(1600);
    expect(size!.height).toBe(2560);
  });

  it('Google Wear OS: 384x384', () => {
    const size = findSize('google', 'Wear OS');
    expect(size).toBeDefined();
    expect(size!.width).toBe(384);
    expect(size!.height).toBe(384);
  });

  it('Google TV: 1920x1080', () => {
    const size = findSize('google', 'TV');
    expect(size).toBeDefined();
    expect(size!.width).toBe(1920);
    expect(size!.height).toBe(1080);
  });

  it('Google Feature Graphic: 1024x500', () => {
    const size = findSize('google', 'Feature Graphic');
    expect(size).toBeDefined();
    expect(size!.width).toBe(1024);
    expect(size!.height).toBe(500);
  });

  // Instagram
  it('Instagram Feed: 1080x1350', () => {
    const size = findSize('instagram', 'Feed');
    expect(size).toBeDefined();
    expect(size!.width).toBe(1080);
    expect(size!.height).toBe(1350);
  });

  it('Instagram Story: 1080x1920', () => {
    const size = findSize('instagram', 'Story');
    expect(size).toBeDefined();
    expect(size!.width).toBe(1080);
    expect(size!.height).toBe(1920);
  });

  // Twitter
  it('Twitter Post: 1200x675', () => {
    const size = findSize('twitter', 'Post');
    expect(size).toBeDefined();
    expect(size!.width).toBe(1200);
    expect(size!.height).toBe(675);
  });

  it('Twitter Header: 1500x500', () => {
    const size = findSize('twitter', 'Header');
    expect(size).toBeDefined();
    expect(size!.width).toBe(1500);
    expect(size!.height).toBe(500);
  });

  // Facebook
  it('Facebook Feed: 1200x630', () => {
    const size = findSize('facebook', 'Feed');
    expect(size).toBeDefined();
    expect(size!.width).toBe(1200);
    expect(size!.height).toBe(630);
  });

  // TikTok
  it('TikTok Video: 1080x1920', () => {
    const size = findSize('tiktok', 'Video');
    expect(size).toBeDefined();
    expect(size!.width).toBe(1080);
    expect(size!.height).toBe(1920);
  });

  // YouTube
  it('YouTube Thumbnail: 1280x720', () => {
    const size = findSize('youtube', 'Thumbnail');
    expect(size).toBeDefined();
    expect(size!.width).toBe(1280);
    expect(size!.height).toBe(720);
  });

  it('YouTube Shorts: 1080x1920', () => {
    const size = findSize('youtube', 'Shorts');
    expect(size).toBeDefined();
    expect(size!.width).toBe(1080);
    expect(size!.height).toBe(1920);
  });

  // LINE
  it('LINE Rich: 1040x1040', () => {
    const size = findSize('line', 'Rich');
    expect(size).toBeDefined();
    expect(size!.width).toBe(1040);
    expect(size!.height).toBe(1040);
  });

  // Pinterest
  it('Pinterest Pin: 1000x1500', () => {
    const size = findSize('pinterest', 'Pin');
    expect(size).toBeDefined();
    expect(size!.width).toBe(1000);
    expect(size!.height).toBe(1500);
  });
});

describe('getOutputSizes()', () => {
  it('returns all sizes for given platforms', () => {
    const sizes = getOutputSizes(['apple', 'google']);
    expect(sizes.length).toBeGreaterThan(0);
    for (const size of sizes) {
      expect(['apple', 'google']).toContain(size.platform);
    }
  });

  it('returns empty for empty platforms array', () => {
    const sizes = getOutputSizes([]);
    expect(sizes).toEqual([]);
  });

  it('returns only matching platforms', () => {
    const sizes = getOutputSizes(['apple']);
    for (const size of sizes) {
      expect(size.platform).toBe('apple');
    }
    // Should not contain google sizes
    const googleSize = sizes.find((s) => s.platform === 'google');
    expect(googleSize).toBeUndefined();
  });

  it('works with single platform', () => {
    const sizes = getOutputSizes(['line']);
    expect(sizes.length).toBe(1);
    expect(sizes[0].platform).toBe('line');
    expect(sizes[0].name).toBe('Rich');
  });

  it('works with multiple platforms', () => {
    const sizes = getOutputSizes(['instagram', 'twitter', 'facebook']);
    const platforms = new Set(sizes.map((s) => s.platform));
    expect(platforms.has('instagram')).toBe(true);
    expect(platforms.has('twitter')).toBe(true);
    expect(platforms.has('facebook')).toBe(true);
    expect(platforms.size).toBe(3);
  });
});

describe('getRequiredSizes()', () => {
  it('returns only required sizes', () => {
    const sizes = getRequiredSizes(ALL_PLATFORMS);
    for (const size of sizes) {
      expect(size.required).toBe(true);
    }
  });

  it('Apple required sizes include iPhone models', () => {
    const sizes = getRequiredSizes(['apple']);
    const names = sizes.map((s) => s.name);
    expect(names).toContain('iPhone 6.9"');
    expect(names).toContain('iPhone 6.7"');
    expect(names).toContain('iPhone 6.5"');
    expect(names).toContain('iPhone 5.5"');
  });

  it('Google required sizes include Phone and Feature Graphic', () => {
    const sizes = getRequiredSizes(['google']);
    const names = sizes.map((s) => s.name);
    expect(names).toContain('Phone');
    expect(names).toContain('Feature Graphic');
  });
});

describe('getScreenshotSizes()', () => {
  it('returns only screenshot type', () => {
    const sizes = getScreenshotSizes(ALL_PLATFORMS);
    expect(sizes.length).toBeGreaterThan(0);
    for (const size of sizes) {
      expect(size.type).toBe('screenshot');
    }
  });

  it('does not include video or graphic types', () => {
    const sizes = getScreenshotSizes(ALL_PLATFORMS);
    for (const size of sizes) {
      expect(size.type).not.toBe('video');
      expect(size.type).not.toBe('graphic');
    }
  });
});

describe('getVideoSizes()', () => {
  it('returns only video type', () => {
    const sizes = getVideoSizes(ALL_PLATFORMS);
    expect(sizes.length).toBeGreaterThan(0);
    for (const size of sizes) {
      expect(size.type).toBe('video');
    }
  });

  it('all returned items have video config', () => {
    const sizes = getVideoSizes(ALL_PLATFORMS);
    for (const size of sizes) {
      expect(size.video).toBeDefined();
    }
  });
});

describe('getGraphicSizes()', () => {
  it('returns only graphic type', () => {
    const sizes = getGraphicSizes(ALL_PLATFORMS);
    expect(sizes.length).toBeGreaterThan(0);
    for (const size of sizes) {
      expect(size.type).toBe('graphic');
    }
  });
});

describe('getSizesByPlatform()', () => {
  it('returns object with all platform keys', () => {
    const result = getSizesByPlatform();
    for (const platform of ALL_PLATFORMS) {
      expect(result).toHaveProperty(platform);
    }
  });

  it('each key has array of sizes', () => {
    const result = getSizesByPlatform();
    for (const platform of ALL_PLATFORMS) {
      expect(Array.isArray(result[platform])).toBe(true);
      expect(result[platform].length).toBeGreaterThan(0);
    }
  });

  it('sizes under each key match the platform', () => {
    const result = getSizesByPlatform();
    for (const platform of ALL_PLATFORMS) {
      for (const size of result[platform]) {
        expect(size.platform).toBe(platform);
      }
    }
  });
});

describe('PLATFORM_LABELS', () => {
  it('all 9 platforms have labels', () => {
    expect(Object.keys(PLATFORM_LABELS)).toHaveLength(9);
    for (const platform of ALL_PLATFORMS) {
      expect(PLATFORM_LABELS[platform]).toBeDefined();
    }
  });

  it('labels are non-empty strings', () => {
    for (const platform of ALL_PLATFORMS) {
      expect(typeof PLATFORM_LABELS[platform]).toBe('string');
      expect(PLATFORM_LABELS[platform].length).toBeGreaterThan(0);
    }
  });
});

describe('PLATFORM_ICONS', () => {
  it('all 9 platforms have icons', () => {
    expect(Object.keys(PLATFORM_ICONS)).toHaveLength(9);
    for (const platform of ALL_PLATFORMS) {
      expect(PLATFORM_ICONS[platform]).toBeDefined();
    }
  });

  it('icons are non-empty strings', () => {
    for (const platform of ALL_PLATFORMS) {
      expect(typeof PLATFORM_ICONS[platform]).toBe('string');
      expect(PLATFORM_ICONS[platform].length).toBeGreaterThan(0);
    }
  });
});
