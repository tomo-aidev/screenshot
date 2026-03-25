import { create } from 'zustand';
import type { Platform, ExportProgress } from '@/types/export';

interface ExportState {
  selectedPlatforms: Platform[];
  selectedLocales: string[];
  selectedScreenshots: number[];
  format: 'png' | 'jpeg' | 'webp';
  quality: number;
  namingPattern: string;
  includeMetadata: boolean;
  antiAliasing: boolean;
  isExporting: boolean;
  progress: ExportProgress | null;

  togglePlatform: (platform: Platform) => void;
  toggleLocale: (locale: string) => void;
  toggleScreenshot: (num: number) => void;
  setFormat: (format: 'png' | 'jpeg' | 'webp') => void;
  setQuality: (quality: number) => void;
  setNamingPattern: (pattern: string) => void;
  setIncludeMetadata: (include: boolean) => void;
  setAntiAliasing: (enabled: boolean) => void;
  setIsExporting: (exporting: boolean) => void;
  setProgress: (progress: ExportProgress | null) => void;
  selectAllPlatforms: (platforms: Platform[]) => void;
  selectAllLocales: (locales: string[]) => void;
}

export const useExportStore = create<ExportState>((set) => ({
  selectedPlatforms: ['apple', 'google'],
  selectedLocales: ['en'],
  selectedScreenshots: [1, 2, 3],
  format: 'png',
  quality: 90,
  namingPattern: '{platform}/{locale}/{number}_{device}.{ext}',
  includeMetadata: true,
  antiAliasing: true,
  isExporting: false,
  progress: null,

  togglePlatform: (platform) =>
    set((state) => ({
      selectedPlatforms: state.selectedPlatforms.includes(platform)
        ? state.selectedPlatforms.filter((p) => p !== platform)
        : [...state.selectedPlatforms, platform],
    })),
  toggleLocale: (locale) =>
    set((state) => ({
      selectedLocales: state.selectedLocales.includes(locale)
        ? state.selectedLocales.filter((l) => l !== locale)
        : [...state.selectedLocales, locale],
    })),
  toggleScreenshot: (num) =>
    set((state) => ({
      selectedScreenshots: state.selectedScreenshots.includes(num)
        ? state.selectedScreenshots.filter((n) => n !== num)
        : [...state.selectedScreenshots, num],
    })),
  setFormat: (format) => set({ format }),
  setQuality: (quality) => set({ quality: Math.max(1, Math.min(100, quality)) }),
  setNamingPattern: (pattern) => set({ namingPattern: pattern }),
  setIncludeMetadata: (include) => set({ includeMetadata: include }),
  setAntiAliasing: (enabled) => set({ antiAliasing: enabled }),
  setIsExporting: (exporting) => set({ isExporting: exporting }),
  setProgress: (progress) => set({ progress }),
  selectAllPlatforms: (platforms) => set({ selectedPlatforms: platforms }),
  selectAllLocales: (locales) => set({ selectedLocales: locales }),
}));
