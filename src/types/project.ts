import type { TemplateType } from './template';

export interface Project {
  id: string;
  name: string;
  appName: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  screenshots: Screenshot[];
  locales: ProjectLocale[];
}

export interface Screenshot {
  id: string;
  projectId: string;
  order: number;
  templateType: TemplateType;
  templateData: Record<string, unknown>;
  texts: ScreenshotText[];
}

export interface ScreenshotText {
  id: string;
  screenshotId: string;
  key: string;
  translations: TextTranslation[];
}

export interface TextTranslation {
  id: string;
  screenshotTextId: string;
  locale: string;
  text: string;
  isAutoTranslated: boolean;
}

export interface ProjectLocale {
  id: string;
  projectId: string;
  locale: string;
  isBase: boolean;
}
