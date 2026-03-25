import { create } from 'zustand';
import type { TemplateType, TemplateLayer } from '@/types/template';

interface EditorState {
  // Project
  projectId: string | null;
  projectName: string;

  // Template
  activeTemplate: TemplateType;
  layers: TemplateLayer[];
  selectedLayerId: string | null;

  // Canvas
  zoom: number;
  panOffset: { x: number; y: number };
  currentScreenshot: number;
  totalScreenshots: number;

  // Device
  deviceModel: string;
  deviceColor: string;

  // Text
  selectedTextProps: {
    fontFamily: string;
    fontSize: number;
    fontWeight: number;
    color: string;
    textShadow: boolean;
  };

  // Mode
  mode: 'creative' | 'platform' | 'sns';

  // Actions
  setProjectId: (id: string) => void;
  setProjectName: (name: string) => void;
  setActiveTemplate: (template: TemplateType) => void;
  setLayers: (layers: TemplateLayer[]) => void;
  addLayer: (layer: TemplateLayer) => void;
  removeLayer: (id: string) => void;
  updateLayer: (id: string, data: Partial<TemplateLayer>) => void;
  reorderLayers: (fromIndex: number, toIndex: number) => void;
  selectLayer: (id: string | null) => void;
  setZoom: (zoom: number) => void;
  setPanOffset: (offset: { x: number; y: number }) => void;
  setCurrentScreenshot: (num: number) => void;
  setTotalScreenshots: (total: number) => void;
  setDeviceModel: (model: string) => void;
  setDeviceColor: (color: string) => void;
  setSelectedTextProps: (props: Partial<EditorState['selectedTextProps']>) => void;
  setMode: (mode: EditorState['mode']) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  projectId: null,
  projectName: 'Untitled',
  activeTemplate: 'classic',
  layers: [
    { id: 'text-1', type: 'text', name: 'Text', visible: true, locked: false, opacity: 1, order: 0, data: {} },
    { id: 'screenshot-1', type: 'screenshot', name: 'Screenshot', visible: true, locked: false, opacity: 1, order: 1, data: {} },
    { id: 'device-frame-1', type: 'device-frame', name: 'Device Frame', visible: true, locked: false, opacity: 1, order: 2, data: {} },
    { id: 'background-1', type: 'background', name: 'Background', visible: true, locked: false, opacity: 1, order: 3, data: {} },
  ],
  selectedLayerId: 'text-1',
  zoom: 100,
  panOffset: { x: 0, y: 0 },
  currentScreenshot: 1,
  totalScreenshots: 10,
  deviceModel: 'iPhone 15 Pro',
  deviceColor: 'Midnight',
  selectedTextProps: {
    fontFamily: 'Inter',
    fontSize: 32,
    fontWeight: 900,
    color: '#EAEAEA',
    textShadow: true,
  },
  mode: 'creative',

  setProjectId: (id) => set({ projectId: id }),
  setProjectName: (name) => set({ projectName: name }),
  setActiveTemplate: (template) => set({ activeTemplate: template }),
  setLayers: (layers) => set({ layers }),
  addLayer: (layer) =>
    set((state) => ({ layers: [layer, ...state.layers] })),
  removeLayer: (id) =>
    set((state) => ({
      layers: state.layers.filter((l) => l.id !== id),
      selectedLayerId: state.selectedLayerId === id ? null : state.selectedLayerId,
    })),
  updateLayer: (id, data) =>
    set((state) => ({
      layers: state.layers.map((l) => (l.id === id ? { ...l, ...data } : l)),
    })),
  reorderLayers: (fromIndex, toIndex) =>
    set((state) => {
      const layers = [...state.layers];
      const [moved] = layers.splice(fromIndex, 1);
      layers.splice(toIndex, 0, moved);
      return { layers: layers.map((l, i) => ({ ...l, order: i })) };
    }),
  selectLayer: (id) => set({ selectedLayerId: id }),
  setZoom: (zoom) => set({ zoom: Math.max(10, Math.min(400, zoom)) }),
  setPanOffset: (offset) => set({ panOffset: offset }),
  setCurrentScreenshot: (num) => set({ currentScreenshot: num }),
  setTotalScreenshots: (total) => set({ totalScreenshots: total }),
  setDeviceModel: (model) => set({ deviceModel: model }),
  setDeviceColor: (color) => set({ deviceColor: color }),
  setSelectedTextProps: (props) =>
    set((state) => ({
      selectedTextProps: { ...state.selectedTextProps, ...props },
    })),
  setMode: (mode) => set({ mode }),
}));
