"use client";

import { useEditorStore } from "@/stores/editorStore";
import type { TemplateType } from "@/types/template";

const TEMPLATE_ITEMS: { type: TemplateType; icon: string; label: string }[] = [
  { type: "classic", icon: "dashboard", label: "Classic" },
  { type: "story", icon: "auto_stories", label: "Story" },
  { type: "manga", icon: "auto_awesome", label: "Manga" },
  { type: "lifestyle", icon: "style", label: "Lifestyle" },
  { type: "infographic", icon: "insights", label: "Infographic" },
  { type: "character", icon: "person", label: "Character" },
];

const LAYER_ICONS: Record<string, string> = {
  text: "text_fields",
  screenshot: "screenshot_region",
  "device-frame": "phone_iphone",
  background: "image",
  shape: "shapes",
  image: "photo",
  effect: "auto_awesome",
};

export function SideNavBar() {
  const activeTemplate = useEditorStore((s) => s.activeTemplate);
  const setActiveTemplate = useEditorStore((s) => s.setActiveTemplate);
  const layers = useEditorStore((s) => s.layers);
  const selectedLayerId = useEditorStore((s) => s.selectedLayerId);
  const selectLayer = useEditorStore((s) => s.selectLayer);
  const updateLayer = useEditorStore((s) => s.updateLayer);

  return (
    <aside className="w-[240px] flex flex-col bg-surface-low shrink-0">
      <div className="p-4">
        <div className="flex flex-col gap-0.5 mb-6">
          <span className="text-lg font-black text-white">Templates</span>
          <span className="text-[10px] font-medium uppercase tracking-widest text-slate-500">
            Marketing Visuals
          </span>
        </div>

        {/* Template selector */}
        <nav className="flex flex-col gap-1">
          {TEMPLATE_ITEMS.map((item) => (
            <button
              key={item.type}
              onClick={() => setActiveTemplate(item.type)}
              className={`rounded-lg px-3 py-2 flex items-center gap-3 cursor-pointer transition-all text-left ${
                activeTemplate === item.type
                  ? "bg-surface-highest text-av-accent"
                  : "text-slate-400 hover:text-white hover:bg-surface-highest/50"
              }`}
            >
              <span className="material-symbols-outlined text-sm">
                {item.icon}
              </span>
              <span className="text-sm font-medium uppercase tracking-widest">
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Layers */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Layers
            </span>
            <button className="text-av-accent hover:brightness-125 transition-all">
              <span className="material-symbols-outlined text-sm">
                add_circle
              </span>
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {layers.map((layer) => (
              <button
                key={layer.id}
                onClick={() => selectLayer(layer.id)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left ${
                  selectedLayerId === layer.id
                    ? "bg-surface-high text-white"
                    : "text-slate-300 hover:bg-surface-high/40"
                }`}
              >
                <span className="material-symbols-outlined text-sm opacity-60">
                  {LAYER_ICONS[layer.type] ?? "layers"}
                </span>
                <span className="text-xs font-medium">{layer.name}</span>
                <button
                  className="ml-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateLayer(layer.id, { visible: !layer.visible });
                  }}
                >
                  <span className="material-symbols-outlined text-xs opacity-40 hover:opacity-80">
                    {layer.visible ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="mt-auto border-t border-outline-variant/10 p-4">
        <button className="w-full bg-surface-highest text-white py-2 rounded-lg text-xs font-bold tracking-widest uppercase hover:bg-surface-bright transition-colors flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span>
          New Layer
        </button>
      </div>
    </aside>
  );
}
