"use client";

import { useDeskStore } from "@/store/useDeskStore";
import { useAudioStore } from "@/store/useAudioStore";
import DeskHotspot from "@/components/desk/DeskHotspot";

export default function GamerDrawer() {
  const { setActiveModal } = useDeskStore();
  const { playHoverTick } = useAudioStore();

  const handleClick = () => {
    playHoverTick();
    setActiveModal("gamer");
  };

  return (
    <DeskHotspot
      label="Cajón Gamer Secreto 🎮"
      badgePosition="top-center"
      className="top-[76%] left-[33%] w-[32%] h-[20%]"
      style={{ zIndex: 11 }}
      onClick={handleClick}
    >
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <svg
          viewBox="0 0 100 40"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(255,215,150,0.8)] text-amber-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M 15 20 Q 50 35 85 20" strokeDasharray="4 4" className="animate-pulse" />
        </svg>
      </div>
    </DeskHotspot>
  );
}
