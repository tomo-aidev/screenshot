export interface VideoExportConfig {
  width: number;
  height: number;
  fps: number;
  codec: string;
  bitrate: number;
  durationInSeconds: number;
}

export interface VideoCompositionData {
  screenshots: {
    imageUrl: string;
    headline: string;
    subtext?: string;
  }[];
  transition: 'slide' | 'fade' | 'zoom' | 'rotate3d' | 'flip';
  textAnimation: 'typewriter' | 'fadeIn' | 'bounce' | 'slideUp';
  bgColor: string;
  accentColor: string;
  fontFamily: string;
  locale: string;
  bgMusic?: string;
  deviceFrame: 'iphone' | 'android' | 'none';
}

export const VIDEO_PRESETS = {
  'instagram-reels': {
    width: 1080,
    height: 1920,
    fps: 30,
    codec: 'H.264',
    bitrate: 10,
    durationInSeconds: 30,
  },
  'tiktok': {
    width: 1080,
    height: 1920,
    fps: 30,
    codec: 'H.264',
    bitrate: 12,
    durationInSeconds: 30,
  },
  'youtube-shorts': {
    width: 1080,
    height: 1920,
    fps: 30,
    codec: 'H.264',
    bitrate: 10,
    durationInSeconds: 30,
  },
  'twitter-video': {
    width: 1920,
    height: 1080,
    fps: 30,
    codec: 'H.264',
    bitrate: 10,
    durationInSeconds: 30,
  },
} as const;

export type VideoPresetKey = keyof typeof VIDEO_PRESETS;

export const BGM_TRACKS = [
  {
    id: 'upbeat',
    name: 'Upbeat Pop',
    description: 'テンポの良いポップ',
    duration: 60,
    bpm: 120,
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: '落ち着いたコーポレート',
    duration: 60,
    bpm: 90,
  },
  {
    id: 'minimal',
    name: 'Minimal Ambient',
    description: 'ミニマルなアンビエント',
    duration: 60,
    bpm: 70,
  },
] as const;

export function calculateDuration(
  screenshotCount: number,
  secondsPerSlide: number = 4,
  transitionDuration: number = 0.5
): number {
  return screenshotCount * secondsPerSlide + (screenshotCount - 1) * transitionDuration;
}

export function getVideoConfig(preset: VideoPresetKey, durationOverride?: number): VideoExportConfig {
  const base = VIDEO_PRESETS[preset];
  return {
    ...base,
    durationInSeconds: durationOverride ?? base.durationInSeconds,
  };
}

export function validateVideoConfig(config: VideoExportConfig): string[] {
  const errors: string[] = [];

  if (config.width < 480 || config.width > 3840) {
    errors.push('Width must be between 480 and 3840 pixels');
  }
  if (config.height < 480 || config.height > 3840) {
    errors.push('Height must be between 480 and 3840 pixels');
  }
  if (config.fps < 15 || config.fps > 60) {
    errors.push('FPS must be between 15 and 60');
  }
  if (config.durationInSeconds < 1 || config.durationInSeconds > 600) {
    errors.push('Duration must be between 1 and 600 seconds');
  }
  if (config.bitrate < 1 || config.bitrate > 50) {
    errors.push('Bitrate must be between 1 and 50 Mbps');
  }

  return errors;
}
