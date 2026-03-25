export * from './types';
export * from './layouts';
export * from './bubbles';
export * from './effects';

import type { MangaTemplate, MangaLayoutPreset } from './types';
import { getLayoutPreset } from './layouts';

export function createMangaTemplate(
  name: string,
  layoutPreset: MangaLayoutPreset
): MangaTemplate {
  return {
    id: `manga-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    name,
    description: '',
    thumbnail: '',
    panels: getLayoutPreset(layoutPreset),
    bubbles: [],
    effects: [],
    soundEffects: [],
    backgroundColor: '#ffffff',
    panelSpacing: 8,
  };
}
