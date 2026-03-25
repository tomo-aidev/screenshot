import { create } from 'zustand';
import type { Project, ProjectLocale } from '@/types/project';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  locales: ProjectLocale[];
  baseLocale: string;
  isLoading: boolean;

  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  setLocales: (locales: ProjectLocale[]) => void;
  setBaseLocale: (locale: string) => void;
  addLocale: (locale: string) => void;
  removeLocale: (locale: string) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  locales: [],
  baseLocale: 'en',
  isLoading: false,

  setProjects: (projects) => set({ projects }),
  setCurrentProject: (project) => set({ currentProject: project }),
  setLocales: (locales) => set({ locales }),
  setBaseLocale: (locale) => set({ baseLocale: locale }),
  addLocale: (locale) =>
    set((state) => ({
      locales: [
        ...state.locales,
        {
          id: `locale-${Date.now()}`,
          projectId: state.currentProject?.id ?? '',
          locale,
          isBase: false,
        },
      ],
    })),
  removeLocale: (locale) =>
    set((state) => ({
      locales: state.locales.filter((l) => l.locale !== locale),
    })),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));
