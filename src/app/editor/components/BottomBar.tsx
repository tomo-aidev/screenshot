"use client";

import { useEditorStore } from "@/stores/editorStore";

const MODES = [
  { id: "creative" as const, icon: "brush", label: "Creative Mode" },
  { id: "platform" as const, icon: "smartphone", label: "iOS / Android" },
  { id: "sns" as const, icon: "share", label: "SNS Targets" },
];

export function BottomBar() {
  const mode = useEditorStore((s) => s.mode);
  const setMode = useEditorStore((s) => s.setMode);

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-4 pointer-events-none">
      <div className="bg-surface-highest/60 backdrop-blur-xl rounded-full mb-6 mx-auto w-fit flex items-center shadow-[0_12px_32px_rgba(12,12,31,0.5)] border border-white/5 pointer-events-auto overflow-hidden">
        {MODES.map((item) => (
          <button
            key={item.id}
            onClick={() => setMode(item.id)}
            className={`px-6 py-2.5 flex items-center gap-2 cursor-pointer transition-all ${
              mode === item.id
                ? "bg-gradient-to-r from-av-primary-container to-av-accent text-white rounded-full"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              {item.icon}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </footer>
  );
}
