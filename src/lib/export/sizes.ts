import type { OutputSize, Platform } from '@/types/export';

export const OUTPUT_SIZES: OutputSize[] = [
  // ===== Apple App Store =====
  {
    platform: 'apple',
    type: 'screenshot',
    name: 'iPhone 6.9"',
    width: 1320,
    height: 2868,
    aspectRatio: '110:239',
    required: true,
    format: ['png', 'jpeg'],
  },
  {
    platform: 'apple',
    type: 'screenshot',
    name: 'iPhone 6.7"',
    width: 1290,
    height: 2796,
    aspectRatio: '215:466',
    required: true,
    format: ['png', 'jpeg'],
  },
  {
    platform: 'apple',
    type: 'screenshot',
    name: 'iPhone 6.5"',
    width: 1284,
    height: 2778,
    aspectRatio: '214:463',
    required: true,
    format: ['png', 'jpeg'],
  },
  {
    platform: 'apple',
    type: 'screenshot',
    name: 'iPhone 5.5"',
    width: 1242,
    height: 2208,
    aspectRatio: '9:16',
    required: true,
    format: ['png', 'jpeg'],
  },
  {
    platform: 'apple',
    type: 'screenshot',
    name: 'iPad Pro 13"',
    width: 2064,
    height: 2752,
    aspectRatio: '3:4',
    required: false,
    format: ['png', 'jpeg'],
  },
  {
    platform: 'apple',
    type: 'screenshot',
    name: 'iPad Pro 12.9"',
    width: 2048,
    height: 2732,
    aspectRatio: '3:4',
    required: false,
    format: ['png', 'jpeg'],
  },
  {
    platform: 'apple',
    type: 'screenshot',
    name: 'Apple Watch',
    width: 396,
    height: 484,
    aspectRatio: '99:121',
    required: false,
    format: ['png'],
  },

  // ===== Google Play Store =====
  {
    platform: 'google',
    type: 'screenshot',
    name: 'Phone',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    required: true,
    format: ['png', 'jpeg'],
  },
  {
    platform: 'google',
    type: 'screenshot',
    name: 'Tablet 7"',
    width: 1200,
    height: 1920,
    aspectRatio: '5:8',
    required: false,
    format: ['png', 'jpeg'],
  },
  {
    platform: 'google',
    type: 'screenshot',
    name: 'Tablet 10"',
    width: 1600,
    height: 2560,
    aspectRatio: '5:8',
    required: false,
    format: ['png', 'jpeg'],
  },
  {
    platform: 'google',
    type: 'screenshot',
    name: 'Wear OS',
    width: 384,
    height: 384,
    aspectRatio: '1:1',
    required: false,
    format: ['png'],
  },
  {
    platform: 'google',
    type: 'screenshot',
    name: 'TV',
    width: 1920,
    height: 1080,
    aspectRatio: '16:9',
    required: false,
    format: ['png', 'jpeg'],
  },
  {
    platform: 'google',
    type: 'graphic',
    name: 'Feature Graphic',
    width: 1024,
    height: 500,
    aspectRatio: '1024:500',
    required: true,
    format: ['png', 'jpeg'],
  },

  // ===== Instagram =====
  {
    platform: 'instagram',
    type: 'graphic',
    name: 'Feed',
    width: 1080,
    height: 1350,
    aspectRatio: '4:5',
    required: false,
    format: ['png', 'jpeg'],
  },
  {
    platform: 'instagram',
    type: 'graphic',
    name: 'Story',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    required: false,
    format: ['png', 'jpeg'],
  },
  {
    platform: 'instagram',
    type: 'video',
    name: 'Reels',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    required: false,
    format: ['jpeg'],
    video: {
      codec: 'H.264',
      bitrate: { min: 5, max: 15 },
      duration: { min: 15, max: 90 },
    },
  },

  // ===== Twitter/X =====
  {
    platform: 'twitter',
    type: 'graphic',
    name: 'Post',
    width: 1200,
    height: 675,
    aspectRatio: '16:9',
    required: false,
    format: ['png', 'jpeg'],
  },
  {
    platform: 'twitter',
    type: 'graphic',
    name: 'Header',
    width: 1500,
    height: 500,
    aspectRatio: '3:1',
    required: false,
    format: ['png', 'jpeg'],
  },
  {
    platform: 'twitter',
    type: 'video',
    name: 'Video',
    width: 1920,
    height: 1080,
    aspectRatio: '16:9',
    required: false,
    format: ['jpeg'],
    video: {
      codec: 'H.264',
      bitrate: { min: 5, max: 15 },
      duration: { min: 1, max: 140 },
    },
  },

  // ===== Facebook =====
  {
    platform: 'facebook',
    type: 'graphic',
    name: 'Feed',
    width: 1200,
    height: 630,
    aspectRatio: '1.91:1',
    required: false,
    format: ['png', 'jpeg'],
  },
  {
    platform: 'facebook',
    type: 'graphic',
    name: 'Story',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    required: false,
    format: ['png', 'jpeg'],
  },

  // ===== TikTok =====
  {
    platform: 'tiktok',
    type: 'video',
    name: 'Video',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    required: false,
    format: ['jpeg'],
    video: {
      codec: 'H.264',
      bitrate: { min: 8, max: 15 },
      duration: { min: 15, max: 600 },
    },
  },
  {
    platform: 'tiktok',
    type: 'graphic',
    name: 'Cover',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    required: false,
    format: ['png', 'jpeg'],
  },

  // ===== YouTube =====
  {
    platform: 'youtube',
    type: 'graphic',
    name: 'Thumbnail',
    width: 1280,
    height: 720,
    aspectRatio: '16:9',
    required: false,
    format: ['png', 'jpeg'],
  },
  {
    platform: 'youtube',
    type: 'video',
    name: 'Shorts',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    required: false,
    format: ['jpeg'],
    video: {
      codec: 'H.264',
      bitrate: { min: 8, max: 12 },
      duration: { min: 1, max: 60 },
    },
  },

  // ===== LINE =====
  {
    platform: 'line',
    type: 'graphic',
    name: 'Rich',
    width: 1040,
    height: 1040,
    aspectRatio: '1:1',
    required: false,
    format: ['png', 'jpeg'],
  },

  // ===== Pinterest =====
  {
    platform: 'pinterest',
    type: 'graphic',
    name: 'Pin',
    width: 1000,
    height: 1500,
    aspectRatio: '2:3',
    required: false,
    format: ['png', 'jpeg'],
  },
];

export function getOutputSizes(platforms: Platform[]): OutputSize[] {
  return OUTPUT_SIZES.filter((size) => platforms.includes(size.platform));
}

export function getRequiredSizes(platforms: Platform[]): OutputSize[] {
  return OUTPUT_SIZES.filter(
    (size) => platforms.includes(size.platform) && size.required
  );
}

export function getScreenshotSizes(platforms: Platform[]): OutputSize[] {
  return OUTPUT_SIZES.filter(
    (size) => platforms.includes(size.platform) && size.type === 'screenshot'
  );
}

export function getVideoSizes(platforms: Platform[]): OutputSize[] {
  return OUTPUT_SIZES.filter(
    (size) => platforms.includes(size.platform) && size.type === 'video'
  );
}

export function getGraphicSizes(platforms: Platform[]): OutputSize[] {
  return OUTPUT_SIZES.filter(
    (size) => platforms.includes(size.platform) && size.type === 'graphic'
  );
}

export function getSizesByPlatform(): Record<Platform, OutputSize[]> {
  const result = {} as Record<Platform, OutputSize[]>;
  for (const size of OUTPUT_SIZES) {
    if (!result[size.platform]) {
      result[size.platform] = [];
    }
    result[size.platform].push(size);
  }
  return result;
}

export const PLATFORM_LABELS: Record<Platform, string> = {
  apple: 'Apple App Store',
  google: 'Google Play Store',
  instagram: 'Instagram',
  twitter: 'Twitter / X',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  line: 'LINE',
  pinterest: 'Pinterest',
};

export const PLATFORM_ICONS: Record<Platform, string> = {
  apple: 'phone_iphone',
  google: 'android',
  instagram: 'photo_camera',
  twitter: 'tag',
  facebook: 'thumb_up',
  tiktok: 'music_note',
  youtube: 'play_circle',
  line: 'chat',
  pinterest: 'push_pin',
};
