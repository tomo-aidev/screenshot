import { describe, it, expect, beforeEach } from 'vitest';
import { useExportStore } from '@/stores/exportStore';

const initialState = useExportStore.getState();

beforeEach(() => {
  useExportStore.setState(initialState, true);
});

describe('exportStore', () => {
  describe('initial state', () => {
    it('selectedPlatforms is ["apple", "google"]', () => {
      expect(useExportStore.getState().selectedPlatforms).toEqual(['apple', 'google']);
    });

    it('selectedLocales is ["en"]', () => {
      expect(useExportStore.getState().selectedLocales).toEqual(['en']);
    });

    it('format is "png"', () => {
      expect(useExportStore.getState().format).toBe('png');
    });

    it('quality is 90', () => {
      expect(useExportStore.getState().quality).toBe(90);
    });

    it('namingPattern contains "{platform}"', () => {
      expect(useExportStore.getState().namingPattern).toContain('{platform}');
    });

    it('isExporting is false', () => {
      expect(useExportStore.getState().isExporting).toBe(false);
    });

    it('progress is null', () => {
      expect(useExportStore.getState().progress).toBeNull();
    });
  });

  describe('togglePlatform', () => {
    it('adds new platform', () => {
      useExportStore.getState().togglePlatform('instagram');
      expect(useExportStore.getState().selectedPlatforms).toContain('instagram');
      expect(useExportStore.getState().selectedPlatforms).toHaveLength(3);
    });

    it('removes existing platform (toggle off)', () => {
      useExportStore.getState().togglePlatform('apple');
      expect(useExportStore.getState().selectedPlatforms).not.toContain('apple');
      expect(useExportStore.getState().selectedPlatforms).toEqual(['google']);
    });

    it('toggle on then off returns to original', () => {
      const original = [...useExportStore.getState().selectedPlatforms];
      useExportStore.getState().togglePlatform('twitter');
      useExportStore.getState().togglePlatform('twitter');
      expect(useExportStore.getState().selectedPlatforms).toEqual(original);
    });
  });

  describe('toggleLocale', () => {
    it('adds new locale', () => {
      useExportStore.getState().toggleLocale('ja');
      expect(useExportStore.getState().selectedLocales).toContain('ja');
      expect(useExportStore.getState().selectedLocales).toHaveLength(2);
    });

    it('removes existing locale', () => {
      useExportStore.getState().toggleLocale('en');
      expect(useExportStore.getState().selectedLocales).not.toContain('en');
      expect(useExportStore.getState().selectedLocales).toHaveLength(0);
    });
  });

  describe('toggleScreenshot', () => {
    it('adds screenshot number', () => {
      useExportStore.getState().toggleScreenshot(5);
      expect(useExportStore.getState().selectedScreenshots).toContain(5);
    });

    it('removes screenshot number', () => {
      useExportStore.getState().toggleScreenshot(1);
      expect(useExportStore.getState().selectedScreenshots).not.toContain(1);
      expect(useExportStore.getState().selectedScreenshots).toEqual([2, 3]);
    });
  });

  describe('setFormat', () => {
    it('changes format', () => {
      useExportStore.getState().setFormat('jpeg');
      expect(useExportStore.getState().format).toBe('jpeg');

      useExportStore.getState().setFormat('webp');
      expect(useExportStore.getState().format).toBe('webp');
    });
  });

  describe('setQuality', () => {
    it('sets quality', () => {
      useExportStore.getState().setQuality(75);
      expect(useExportStore.getState().quality).toBe(75);
    });

    it('clamps min to 1', () => {
      useExportStore.getState().setQuality(-10);
      expect(useExportStore.getState().quality).toBe(1);
    });

    it('clamps max to 100', () => {
      useExportStore.getState().setQuality(200);
      expect(useExportStore.getState().quality).toBe(100);
    });
  });

  describe('selectAllPlatforms', () => {
    it('replaces all platforms', () => {
      useExportStore.getState().selectAllPlatforms(['instagram', 'twitter', 'facebook']);
      expect(useExportStore.getState().selectedPlatforms).toEqual([
        'instagram',
        'twitter',
        'facebook',
      ]);
    });
  });

  describe('selectAllLocales', () => {
    it('replaces all locales', () => {
      useExportStore.getState().selectAllLocales(['en', 'ja', 'ko']);
      expect(useExportStore.getState().selectedLocales).toEqual(['en', 'ja', 'ko']);
    });
  });
});
