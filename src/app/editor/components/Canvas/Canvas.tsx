"use client";

import { useEditorStore } from "@/stores/editorStore";

export function Canvas() {
  const zoom = useEditorStore((s) => s.zoom);
  const setZoom = useEditorStore((s) => s.setZoom);
  const currentScreenshot = useEditorStore((s) => s.currentScreenshot);
  const totalScreenshots = useEditorStore((s) => s.totalScreenshots);
  const setCurrentScreenshot = useEditorStore((s) => s.setCurrentScreenshot);
  const selectedTextProps = useEditorStore((s) => s.selectedTextProps);

  return (
    <section className="flex-1 bg-surface-lowest relative flex items-center justify-center overflow-hidden p-8">
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#e2e0fc 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Device Mockup */}
      <div
        className="relative bg-slate-900 rounded-[3rem] border-[8px] border-slate-800 shadow-2xl flex flex-col items-center overflow-hidden"
        style={{
          width: 320 * (zoom / 100),
          height: 640 * (zoom / 100),
          transition: "width 0.2s, height 0.2s",
        }}
      >
        {/* Status Bar */}
        <div className="w-full h-8 flex justify-between items-center px-8 pt-2 z-10">
          <span className="text-[10px] font-bold text-white">9:41</span>
          <div className="flex gap-1.5 items-center">
            <span className="material-symbols-outlined text-[10px] text-white">
              signal_cellular_4_bar
            </span>
            <span className="material-symbols-outlined text-[10px] text-white">
              wifi
            </span>
            <span className="material-symbols-outlined text-[10px] text-white">
              battery_full
            </span>
          </div>
        </div>

        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>

        {/* Text Overlay */}
        <div className="mt-auto mb-16 px-8 w-full z-10">
          <h1
            className="text-3xl font-black leading-tight text-center"
            style={{
              color: selectedTextProps.color,
              fontFamily: selectedTextProps.fontFamily,
              fontWeight: selectedTextProps.fontWeight,
              textShadow: selectedTextProps.textShadow
                ? "0 4px 12px rgba(0,0,0,0.5)"
                : "none",
            }}
          >
            Revolutionize Your Experience
          </h1>
        </div>

        {/* Home Indicator */}
        <div className="w-24 h-1 bg-white/30 rounded-full mb-2 mt-auto z-10" />
      </div>

      {/* Floating Canvas Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass-panel flex items-center gap-6 px-4 py-2 rounded-full border border-white/5 shadow-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setZoom(zoom - 10)}
            className="p-1 hover:text-av-accent transition-colors"
          >
            <span className="material-symbols-outlined text-lg">remove</span>
          </button>
          <span className="text-xs font-bold text-white w-12 text-center">
            {zoom}%
          </span>
          <button
            onClick={() => setZoom(zoom + 10)}
            className="p-1 hover:text-av-accent transition-colors"
          >
            <span className="material-symbols-outlined text-lg">add</span>
          </button>
        </div>
        <div className="h-4 w-px bg-white/10" />
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              setCurrentScreenshot(Math.max(1, currentScreenshot - 1))
            }
            className="p-1 hover:text-av-accent transition-colors"
          >
            <span className="material-symbols-outlined text-lg">
              chevron_left
            </span>
          </button>
          <span className="text-xs font-bold text-white">
            {currentScreenshot}/{totalScreenshots}
          </span>
          <button
            onClick={() =>
              setCurrentScreenshot(
                Math.min(totalScreenshots, currentScreenshot + 1)
              )
            }
            className="p-1 hover:text-av-accent transition-colors"
          >
            <span className="material-symbols-outlined text-lg">
              chevron_right
            </span>
          </button>
        </div>
        <div className="h-4 w-px bg-white/10" />
        <button className="p-1 hover:text-av-accent transition-colors">
          <span className="material-symbols-outlined text-lg">fullscreen</span>
        </button>
      </div>
    </section>
  );
}
