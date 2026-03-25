import { describe, it, expect, beforeEach } from 'vitest';
import { useEditorStore } from '@/stores/editorStore';

const initialState = useEditorStore.getState();

beforeEach(() => {
  useEditorStore.setState(initialState, true);
});

describe('editorStore', () => {
  describe('initial state', () => {
    it('projectId is null', () => {
      expect(useEditorStore.getState().projectId).toBeNull();
    });

    it('projectName is "Untitled"', () => {
      expect(useEditorStore.getState().projectName).toBe('Untitled');
    });

    it('activeTemplate is "classic"', () => {
      expect(useEditorStore.getState().activeTemplate).toBe('classic');
    });

    it('layers has 4 items (text, screenshot, device-frame, background)', () => {
      const layers = useEditorStore.getState().layers;
      expect(layers).toHaveLength(4);
      expect(layers.map((l) => l.type)).toEqual([
        'text',
        'screenshot',
        'device-frame',
        'background',
      ]);
    });

    it('selectedLayerId is "text-1"', () => {
      expect(useEditorStore.getState().selectedLayerId).toBe('text-1');
    });

    it('zoom is 100', () => {
      expect(useEditorStore.getState().zoom).toBe(100);
    });

    it('currentScreenshot is 1', () => {
      expect(useEditorStore.getState().currentScreenshot).toBe(1);
    });

    it('totalScreenshots is 10', () => {
      expect(useEditorStore.getState().totalScreenshots).toBe(10);
    });

    it('deviceModel is "iPhone 15 Pro"', () => {
      expect(useEditorStore.getState().deviceModel).toBe('iPhone 15 Pro');
    });

    it('mode is "creative"', () => {
      expect(useEditorStore.getState().mode).toBe('creative');
    });
  });

  describe('setProjectId / setProjectName', () => {
    it('setProjectId updates correctly', () => {
      useEditorStore.getState().setProjectId('proj-123');
      expect(useEditorStore.getState().projectId).toBe('proj-123');
    });

    it('setProjectName updates correctly', () => {
      useEditorStore.getState().setProjectName('My App');
      expect(useEditorStore.getState().projectName).toBe('My App');
    });
  });

  describe('setActiveTemplate', () => {
    it('changes template type', () => {
      useEditorStore.getState().setActiveTemplate('story');
      expect(useEditorStore.getState().activeTemplate).toBe('story');
    });
  });

  describe('layer operations', () => {
    it('addLayer adds to beginning', () => {
      const newLayer = {
        id: 'shape-1',
        type: 'shape' as const,
        name: 'Shape',
        visible: true,
        locked: false,
        opacity: 1,
        order: 0,
        data: {},
      };
      useEditorStore.getState().addLayer(newLayer);
      const layers = useEditorStore.getState().layers;
      expect(layers[0].id).toBe('shape-1');
      expect(layers).toHaveLength(5);
    });

    it('removeLayer removes correct layer', () => {
      useEditorStore.getState().removeLayer('screenshot-1');
      const layers = useEditorStore.getState().layers;
      expect(layers).toHaveLength(3);
      expect(layers.find((l) => l.id === 'screenshot-1')).toBeUndefined();
    });

    it('removeLayer deselects if removed layer was selected', () => {
      expect(useEditorStore.getState().selectedLayerId).toBe('text-1');
      useEditorStore.getState().removeLayer('text-1');
      expect(useEditorStore.getState().selectedLayerId).toBeNull();
    });

    it('updateLayer updates specific layer data', () => {
      useEditorStore.getState().updateLayer('text-1', { name: 'Title', opacity: 0.5 });
      const layer = useEditorStore.getState().layers.find((l) => l.id === 'text-1');
      expect(layer?.name).toBe('Title');
      expect(layer?.opacity).toBe(0.5);
    });

    it('reorderLayers moves layer from one position to another', () => {
      // Move background (index 3) to index 0
      useEditorStore.getState().reorderLayers(3, 0);
      const layers = useEditorStore.getState().layers;
      expect(layers[0].id).toBe('background-1');
      expect(layers[1].id).toBe('text-1');
    });

    it('reorderLayers updates order property', () => {
      useEditorStore.getState().reorderLayers(3, 0);
      const layers = useEditorStore.getState().layers;
      layers.forEach((layer, index) => {
        expect(layer.order).toBe(index);
      });
    });

    it('selectLayer changes selectedLayerId', () => {
      useEditorStore.getState().selectLayer('background-1');
      expect(useEditorStore.getState().selectedLayerId).toBe('background-1');
    });

    it('selectLayer(null) deselects', () => {
      useEditorStore.getState().selectLayer(null);
      expect(useEditorStore.getState().selectedLayerId).toBeNull();
    });
  });

  describe('setZoom', () => {
    it('sets zoom value', () => {
      useEditorStore.getState().setZoom(150);
      expect(useEditorStore.getState().zoom).toBe(150);
    });

    it('clamps minimum to 10', () => {
      useEditorStore.getState().setZoom(1);
      expect(useEditorStore.getState().zoom).toBe(10);
    });

    it('clamps maximum to 400', () => {
      useEditorStore.getState().setZoom(999);
      expect(useEditorStore.getState().zoom).toBe(400);
    });
  });

  describe('setCurrentScreenshot / setTotalScreenshots', () => {
    it('setCurrentScreenshot updates correctly', () => {
      useEditorStore.getState().setCurrentScreenshot(5);
      expect(useEditorStore.getState().currentScreenshot).toBe(5);
    });

    it('setTotalScreenshots updates correctly', () => {
      useEditorStore.getState().setTotalScreenshots(20);
      expect(useEditorStore.getState().totalScreenshots).toBe(20);
    });
  });

  describe('setSelectedTextProps', () => {
    it('partial update merges with existing', () => {
      useEditorStore.getState().setSelectedTextProps({ fontSize: 48, color: '#FF0000' });
      const props = useEditorStore.getState().selectedTextProps;
      expect(props.fontSize).toBe(48);
      expect(props.color).toBe('#FF0000');
      // Other props remain unchanged
      expect(props.fontFamily).toBe('Inter');
      expect(props.fontWeight).toBe(900);
      expect(props.textShadow).toBe(true);
    });

    it('can update fontSize only', () => {
      useEditorStore.getState().setSelectedTextProps({ fontSize: 16 });
      expect(useEditorStore.getState().selectedTextProps.fontSize).toBe(16);
      expect(useEditorStore.getState().selectedTextProps.color).toBe('#EAEAEA');
    });

    it('can update color only', () => {
      useEditorStore.getState().setSelectedTextProps({ color: '#00FF00' });
      expect(useEditorStore.getState().selectedTextProps.color).toBe('#00FF00');
      expect(useEditorStore.getState().selectedTextProps.fontSize).toBe(32);
    });
  });

  describe('setMode', () => {
    it('changes mode value', () => {
      useEditorStore.getState().setMode('platform');
      expect(useEditorStore.getState().mode).toBe('platform');

      useEditorStore.getState().setMode('sns');
      expect(useEditorStore.getState().mode).toBe('sns');
    });
  });
});
