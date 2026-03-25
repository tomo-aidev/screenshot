"use client";

import { useEditorStore } from "@/stores/editorStore";

export function TopNavBar() {
  const projectName = useEditorStore((s) => s.projectName);

  return (
    <header className="fixed top-0 w-full h-14 flex items-center justify-between px-6 bg-surface-low z-50">
      <div className="flex items-center gap-6">
        <span className="text-xl font-bold tracking-tighter text-white uppercase">
          AppVisual Studio
        </span>
        <div className="h-4 w-px bg-outline-variant opacity-20" />
        <span className="text-slate-400 font-medium hover:text-white transition-colors duration-200 cursor-pointer">
          Project: {projectName}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 mr-4">
          <button className="p-2 text-slate-400 hover:text-white transition-colors duration-200">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 text-slate-400 hover:text-white transition-colors duration-200">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
        <button className="bg-gradient-to-r from-av-primary-container to-av-accent text-white px-6 py-1.5 rounded-lg font-semibold active:opacity-80 active:scale-95 transition-all">
          Export
        </button>
        <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-highest border border-outline-variant/20">
          <div className="w-full h-full bg-gradient-to-br from-av-primary-container to-av-accent" />
        </div>
      </div>
    </header>
  );
}
