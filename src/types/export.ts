export type Platform =
  | 'apple'
  | 'google'
  | 'instagram'
  | 'twitter'
  | 'facebook'
  | 'tiktok'
  | 'youtube'
  | 'line'
  | 'pinterest';

export type OutputType = 'screenshot' | 'video' | 'graphic';

export interface OutputSize {
  platform: Platform;
  type: OutputType;
  name: string;
  width: number;
  height: number;
  aspectRatio: string;
  required: boolean;
  format: ('png' | 'jpeg' | 'webp')[];
  video?: {
    codec: string;
    bitrate: { min: number; max: number };
    duration: { min: number; max: number };
  };
}

export interface ExportJob {
  projectId: string;
  screenshots: number[];
  platforms: Platform[];
  locales: string[];
  format: 'png' | 'jpeg' | 'webp';
  quality: number;
  namingPattern: string;
}

export interface ExportProgress {
  totalFiles: number;
  completedFiles: number;
  currentFile: string;
  percentage: number;
  phase: 'preparing' | 'rendering' | 'processing' | 'compressing' | 'done';
}

export interface ExportResult {
  totalFiles: number;
  completedFiles: number;
  files: ExportFile[];
  errors: ExportError[];
}

export interface ExportFile {
  path: string;
  platform: Platform;
  locale: string;
  screenshotNumber: number;
  deviceSize: string;
  width: number;
  height: number;
  fileSize: number;
}

export interface ExportError {
  file: string;
  error: string;
}
