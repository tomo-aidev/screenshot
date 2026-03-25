import { describe, it, expect } from 'vitest';
import {
  VIDEO_PRESETS,
  BGM_TRACKS,
  calculateDuration,
  getVideoConfig,
  validateVideoConfig,
} from '../video';
import type { VideoExportConfig } from '../video';

describe('VIDEO_PRESETS', () => {
  it('all presets have valid dimensions', () => {
    for (const key of Object.keys(VIDEO_PRESETS) as (keyof typeof VIDEO_PRESETS)[]) {
      const preset = VIDEO_PRESETS[key];
      expect(preset.width).toBeGreaterThan(0);
      expect(preset.height).toBeGreaterThan(0);
      expect(preset.fps).toBeGreaterThan(0);
    }
  });

  it('instagram-reels: 1080x1920, 30fps, H.264', () => {
    const preset = VIDEO_PRESETS['instagram-reels'];
    expect(preset.width).toBe(1080);
    expect(preset.height).toBe(1920);
    expect(preset.fps).toBe(30);
    expect(preset.codec).toBe('H.264');
  });

  it('tiktok: 1080x1920, 30fps, H.264', () => {
    const preset = VIDEO_PRESETS['tiktok'];
    expect(preset.width).toBe(1080);
    expect(preset.height).toBe(1920);
    expect(preset.fps).toBe(30);
    expect(preset.codec).toBe('H.264');
  });

  it('youtube-shorts: 1080x1920, 30fps, H.264', () => {
    const preset = VIDEO_PRESETS['youtube-shorts'];
    expect(preset.width).toBe(1080);
    expect(preset.height).toBe(1920);
    expect(preset.fps).toBe(30);
    expect(preset.codec).toBe('H.264');
  });

  it('twitter-video: 1920x1080, 30fps, H.264', () => {
    const preset = VIDEO_PRESETS['twitter-video'];
    expect(preset.width).toBe(1920);
    expect(preset.height).toBe(1080);
    expect(preset.fps).toBe(30);
    expect(preset.codec).toBe('H.264');
  });
});

describe('BGM_TRACKS', () => {
  it('has 3 tracks', () => {
    expect(BGM_TRACKS).toHaveLength(3);
  });

  it('each has id, name, description, duration, bpm', () => {
    for (const track of BGM_TRACKS) {
      expect(track.id).toBeTruthy();
      expect(track.name).toBeTruthy();
      expect(track.description).toBeTruthy();
      expect(track.duration).toBeGreaterThan(0);
      expect(track.bpm).toBeGreaterThan(0);
    }
  });

  it('contains upbeat, corporate, minimal', () => {
    const ids = BGM_TRACKS.map((t) => t.id);
    expect(ids).toContain('upbeat');
    expect(ids).toContain('corporate');
    expect(ids).toContain('minimal');
  });
});

describe('calculateDuration()', () => {
  it('1 screenshot = 4 seconds (default)', () => {
    // 1 * 4 + 0 * 0.5 = 4
    expect(calculateDuration(1)).toBe(4);
  });

  it('5 screenshots = 5*4 + 4*0.5 = 22 seconds (default)', () => {
    expect(calculateDuration(5)).toBe(22);
  });

  it('custom secondsPerSlide: 3 screenshots, 3s/slide = 3*3 + 2*0.5 = 10', () => {
    expect(calculateDuration(3, 3)).toBe(10);
  });

  it('custom transition: 2 screenshots, 4s/slide, 1s transition = 8+1 = 9', () => {
    expect(calculateDuration(2, 4, 1)).toBe(9);
  });

  it('single screenshot has no transitions', () => {
    // 1 * 4 + (1-1) * 0.5 = 4
    const result = calculateDuration(1, 4, 0.5);
    expect(result).toBe(4);
  });
});

describe('getVideoConfig()', () => {
  it('returns correct config for each preset', () => {
    const presetKeys = Object.keys(VIDEO_PRESETS) as (keyof typeof VIDEO_PRESETS)[];
    for (const key of presetKeys) {
      const config = getVideoConfig(key);
      expect(config.width).toBe(VIDEO_PRESETS[key].width);
      expect(config.height).toBe(VIDEO_PRESETS[key].height);
      expect(config.fps).toBe(VIDEO_PRESETS[key].fps);
      expect(config.codec).toBe(VIDEO_PRESETS[key].codec);
      expect(config.bitrate).toBe(VIDEO_PRESETS[key].bitrate);
      expect(config.durationInSeconds).toBe(VIDEO_PRESETS[key].durationInSeconds);
    }
  });

  it('duration override works', () => {
    const config = getVideoConfig('instagram-reels', 60);
    expect(config.durationInSeconds).toBe(60);
    // Other fields should remain from the preset
    expect(config.width).toBe(1080);
    expect(config.height).toBe(1920);
  });

  it('without override uses default', () => {
    const config = getVideoConfig('tiktok');
    expect(config.durationInSeconds).toBe(30);
  });
});

describe('validateVideoConfig()', () => {
  function makeValid(): VideoExportConfig {
    return {
      width: 1080,
      height: 1920,
      fps: 30,
      codec: 'H.264',
      bitrate: 10,
      durationInSeconds: 30,
    };
  }

  it('valid config returns empty errors', () => {
    expect(validateVideoConfig(makeValid())).toEqual([]);
  });

  it('width < 480 returns error', () => {
    const config = { ...makeValid(), width: 320 };
    const errors = validateVideoConfig(config);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.toLowerCase().includes('width'))).toBe(true);
  });

  it('width > 3840 returns error', () => {
    const config = { ...makeValid(), width: 4000 };
    const errors = validateVideoConfig(config);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.toLowerCase().includes('width'))).toBe(true);
  });

  it('height < 480 returns error', () => {
    const config = { ...makeValid(), height: 100 };
    const errors = validateVideoConfig(config);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.toLowerCase().includes('height'))).toBe(true);
  });

  it('fps < 15 returns error', () => {
    const config = { ...makeValid(), fps: 10 };
    const errors = validateVideoConfig(config);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.toLowerCase().includes('fps'))).toBe(true);
  });

  it('fps > 60 returns error', () => {
    const config = { ...makeValid(), fps: 120 };
    const errors = validateVideoConfig(config);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.toLowerCase().includes('fps'))).toBe(true);
  });

  it('duration < 1 returns error', () => {
    const config = { ...makeValid(), durationInSeconds: 0 };
    const errors = validateVideoConfig(config);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.toLowerCase().includes('duration'))).toBe(true);
  });

  it('duration > 600 returns error', () => {
    const config = { ...makeValid(), durationInSeconds: 700 };
    const errors = validateVideoConfig(config);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.toLowerCase().includes('duration'))).toBe(true);
  });

  it('bitrate < 1 returns error', () => {
    const config = { ...makeValid(), bitrate: 0 };
    const errors = validateVideoConfig(config);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.toLowerCase().includes('bitrate'))).toBe(true);
  });

  it('bitrate > 50 returns error', () => {
    const config = { ...makeValid(), bitrate: 100 };
    const errors = validateVideoConfig(config);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.toLowerCase().includes('bitrate'))).toBe(true);
  });

  it('multiple errors at once', () => {
    const config: VideoExportConfig = {
      width: 100,
      height: 100,
      fps: 5,
      codec: 'H.264',
      bitrate: 0,
      durationInSeconds: 0,
    };
    const errors = validateVideoConfig(config);
    expect(errors.length).toBeGreaterThanOrEqual(5);
  });
});
