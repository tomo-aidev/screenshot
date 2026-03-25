"use client";

import { useEditorStore } from "@/stores/editorStore";

export function PropertyPanel() {
  const selectedTextProps = useEditorStore((s) => s.selectedTextProps);
  const setSelectedTextProps = useEditorStore((s) => s.setSelectedTextProps);
  const deviceModel = useEditorStore((s) => s.deviceModel);
  const deviceColor = useEditorStore((s) => s.deviceColor);

  return (
    <aside className="w-[280px] bg-surface-low flex flex-col shrink-0 overflow-y-auto no-scrollbar">
      {/* Text Properties */}
      <div className="p-5 border-b border-outline-variant/10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
            Text Properties
          </span>
          <span className="material-symbols-outlined text-sm text-slate-600">
            more_vert
          </span>
        </div>
        <div className="space-y-4">
          {/* Font Family */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-medium text-slate-400 uppercase">
              Font Family
            </label>
            <div className="bg-surface-highest px-3 py-2 rounded-lg text-xs font-semibold flex justify-between items-center cursor-pointer border border-transparent hover:border-outline-variant/30">
              {selectedTextProps.fontFamily}
              <span className="material-symbols-outlined text-sm">
                unfold_more
              </span>
            </div>
          </div>

          {/* Size & Weight */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-medium text-slate-400 uppercase">
                Size
              </label>
              <input
                type="number"
                value={selectedTextProps.fontSize}
                onChange={(e) =>
                  setSelectedTextProps({
                    fontSize: parseInt(e.target.value) || 0,
                  })
                }
                className="bg-surface-highest px-3 py-2 rounded-lg text-xs font-semibold border-none focus:ring-1 focus:ring-av-accent"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-medium text-slate-400 uppercase">
                Weight
              </label>
              <div className="bg-surface-highest px-3 py-2 rounded-lg text-xs font-semibold">
                {selectedTextProps.fontWeight} (Black)
              </div>
            </div>
          </div>

          {/* Color */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-medium text-slate-400 uppercase">
              Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={selectedTextProps.color}
                onChange={(e) =>
                  setSelectedTextProps({ color: e.target.value })
                }
                className="w-8 h-8 rounded border border-white/20 shadow-sm cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-300">
                {selectedTextProps.color}
              </span>
            </div>
          </div>

          {/* Text Shadow */}
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setSelectedTextProps({
                  textShadow: !selectedTextProps.textShadow,
                })
              }
              className={`w-4 h-4 rounded border flex items-center justify-center ${
                selectedTextProps.textShadow
                  ? "border-av-accent bg-av-accent/20"
                  : "border-slate-600"
              }`}
            >
              {selectedTextProps.textShadow && (
                <span
                  className="material-symbols-outlined text-[10px] text-av-accent"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check
                </span>
              )}
            </button>
            <span className="text-xs text-slate-300">Text Shadow</span>
          </div>
        </div>
      </div>

      {/* Device Settings */}
      <div className="p-5 border-b border-outline-variant/10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
            Device Settings
          </span>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-medium text-slate-400 uppercase">
              Model
            </label>
            <div className="bg-surface-highest px-3 py-2 rounded-lg text-xs font-semibold flex justify-between items-center cursor-pointer border border-transparent hover:border-outline-variant/30">
              {deviceModel}
              <span className="material-symbols-outlined text-sm">
                smartphone
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-medium text-slate-400 uppercase">
                Finish
              </label>
              <div className="bg-surface-highest px-3 py-2 rounded-lg text-xs font-semibold">
                {deviceColor}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-medium text-slate-400 uppercase">
                Angle
              </label>
              <div className="bg-surface-highest px-3 py-2 rounded-lg text-xs font-semibold">
                Straight
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      <div className="p-5">
        <div className="bg-gradient-to-br from-surface-highest to-surface-low rounded-xl p-4 border border-av-accent/20">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="material-symbols-outlined text-av-accent text-lg"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              auto_awesome
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-white">
              AI Assistant
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
            Enhance your visual with generative backgrounds matching your
            screenshot theme.
          </p>
          <button className="w-full bg-av-accent text-white py-2.5 rounded-lg text-[11px] font-bold tracking-widest uppercase hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-av-accent/20">
            Generate Background
          </button>
        </div>
      </div>
    </aside>
  );
}
