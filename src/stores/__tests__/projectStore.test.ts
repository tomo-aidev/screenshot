import { describe, it, expect, beforeEach } from 'vitest';
import { useProjectStore } from '@/stores/projectStore';

const initialState = useProjectStore.getState();

beforeEach(() => {
  useProjectStore.setState(initialState, true);
});

describe('projectStore', () => {
  describe('initial state', () => {
    it('projects is empty array', () => {
      expect(useProjectStore.getState().projects).toEqual([]);
    });

    it('currentProject is null', () => {
      expect(useProjectStore.getState().currentProject).toBeNull();
    });

    it('baseLocale is "en"', () => {
      expect(useProjectStore.getState().baseLocale).toBe('en');
    });

    it('isLoading is false', () => {
      expect(useProjectStore.getState().isLoading).toBe(false);
    });
  });

  describe('setProjects / setCurrentProject', () => {
    it('setProjects updates correctly', () => {
      const projects = [
        {
          id: 'p1',
          name: 'Project 1',
          appName: 'App 1',
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'u1',
          screenshots: [],
          locales: [],
        },
      ];
      useProjectStore.getState().setProjects(projects);
      expect(useProjectStore.getState().projects).toHaveLength(1);
      expect(useProjectStore.getState().projects[0].id).toBe('p1');
    });

    it('setCurrentProject updates correctly', () => {
      const project = {
        id: 'p1',
        name: 'Project 1',
        appName: 'App 1',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'u1',
        screenshots: [],
        locales: [],
      };
      useProjectStore.getState().setCurrentProject(project);
      expect(useProjectStore.getState().currentProject?.id).toBe('p1');
    });
  });

  describe('addLocale', () => {
    it('adds locale with generated id', () => {
      useProjectStore.getState().addLocale('ja');
      const locales = useProjectStore.getState().locales;
      expect(locales).toHaveLength(1);
      expect(locales[0].locale).toBe('ja');
      expect(locales[0].id).toMatch(/^locale-/);
    });

    it('isBase defaults to false', () => {
      useProjectStore.getState().addLocale('fr');
      const locales = useProjectStore.getState().locales;
      expect(locales[0].isBase).toBe(false);
    });
  });

  describe('removeLocale', () => {
    it('removes locale by locale string', () => {
      useProjectStore.getState().addLocale('ja');
      useProjectStore.getState().addLocale('ko');
      expect(useProjectStore.getState().locales).toHaveLength(2);

      useProjectStore.getState().removeLocale('ja');
      const locales = useProjectStore.getState().locales;
      expect(locales).toHaveLength(1);
      expect(locales[0].locale).toBe('ko');
    });
  });

  describe('setBaseLocale', () => {
    it('changes base locale', () => {
      useProjectStore.getState().setBaseLocale('ja');
      expect(useProjectStore.getState().baseLocale).toBe('ja');
    });
  });
});
