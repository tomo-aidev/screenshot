import type { MangaPanel, MangaLayoutPreset } from './types';

function createPanel(id: string, x: number, y: number, width: number, height: number): MangaPanel {
  return {
    id,
    x,
    y,
    width,
    height,
    borderWidth: 4,
    borderColor: '#000000',
    content: { type: 'screenshot', imageUrl: '', scale: 1, offset: { x: 0, y: 0 } },
  };
}

export const MANGA_LAYOUTS: Record<MangaLayoutPreset, { name: string; description: string; panels: MangaPanel[] }> = {
  'four-koma': {
    name: '4コマ縦',
    description: '縦に4等分（起承転結）',
    panels: [
      createPanel('panel-1', 0, 0, 100, 24),
      createPanel('panel-2', 0, 25.5, 100, 24),
      createPanel('panel-3', 0, 51, 100, 24),
      createPanel('panel-4', 0, 76.5, 100, 23.5),
    ],
  },

  'grid-2x2': {
    name: '2x2グリッド',
    description: '2行2列の均等分割',
    panels: [
      createPanel('panel-1', 0, 0, 49, 49),
      createPanel('panel-2', 51, 0, 49, 49),
      createPanel('panel-3', 0, 51, 49, 49),
      createPanel('panel-4', 51, 51, 49, 49),
    ],
  },

  'l-shape': {
    name: 'L字型',
    description: '上半分大コマ + 下半分2分割',
    panels: [
      createPanel('panel-1', 0, 0, 100, 55),
      createPanel('panel-2', 0, 57, 49, 43),
      createPanel('panel-3', 51, 57, 49, 43),
    ],
  },

  'staircase': {
    name: '階段型',
    description: '対角線的に3コマ配置',
    panels: [
      createPanel('panel-1', 0, 0, 65, 35),
      createPanel('panel-2', 17, 36.5, 66, 28),
      createPanel('panel-3', 35, 66, 65, 34),
    ],
  },

  'full-page': {
    name: '全面',
    description: '1コマ（インパクト重視）',
    panels: [
      createPanel('panel-1', 0, 0, 100, 100),
    ],
  },

  'free': {
    name: '自由配置',
    description: 'ユーザーが自由に配置',
    panels: [],
  },
};

export function getLayoutPreset(preset: MangaLayoutPreset): MangaPanel[] {
  return MANGA_LAYOUTS[preset].panels.map((panel) => ({ ...panel }));
}

export function getAllLayoutPresets(): { id: MangaLayoutPreset; name: string; description: string; panelCount: number }[] {
  return (Object.entries(MANGA_LAYOUTS) as [MangaLayoutPreset, typeof MANGA_LAYOUTS[MangaLayoutPreset]][]).map(
    ([id, layout]) => ({
      id,
      name: layout.name,
      description: layout.description,
      panelCount: layout.panels.length,
    })
  );
}
