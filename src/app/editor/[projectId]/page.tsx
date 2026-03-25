"use client";

import { TopNavBar } from "../components/TopNavBar";
import { SideNavBar } from "../components/SideNavBar";
import { Canvas } from "../components/Canvas/Canvas";
import { PropertyPanel } from "../components/PropertyPanel/PropertyPanel";
import { BottomBar } from "../components/BottomBar";

export default function EditorPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopNavBar />
      <main className="flex flex-1 pt-14 pb-14 overflow-hidden">
        <SideNavBar />
        <Canvas />
        <PropertyPanel />
      </main>
      <BottomBar />
    </div>
  );
}
