"use client";

import { AnimatePresence } from "framer-motion";
import { useDeskStore } from "@/store/useDeskStore";
import SceneCanvas from "@/components/desk/SceneCanvas";

import MusicModal from "@/components/modals/MusicModal";
import OrtegaAgentModal from "@/components/modals/OrtegaAgentModal";
import NotepadModal from "@/components/modals/NotepadModal";
import PhotoZoomModal from "@/components/modals/PhotoZoomModal";
import MinigameModal from "@/components/modals/MinigameModal";

export default function DeskPage() {
  const { activeModal } = useDeskStore();

  return (
    <main className="relative w-screen h-screen overflow-hidden select-none bg-black">
      <SceneCanvas />

      <AnimatePresence mode="wait">
        {activeModal === "music" && <MusicModal key="music" />}
        {activeModal === "philosophy" && <OrtegaAgentModal key="philosophy" />}
        {activeModal === "notepad" && <NotepadModal key="notepad" />}
        {activeModal === "corkboard" && <PhotoZoomModal key="corkboard" />}
        {activeModal === "gamer" && <MinigameModal key="gamer" />}
      </AnimatePresence>
    </main>
  );
}
