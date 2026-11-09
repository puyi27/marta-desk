"use client";

import { Disc3 } from "lucide-react";
import { useDeskStore } from "@/store/useDeskStore";
import { useAudioStore } from "@/store/useAudioStore";
import DeskHotspot from "@/components/desk/DeskHotspot";

export default function RecordPlayer() {
  const { setActiveModal } = useDeskStore();
  const { playBookOpen, startVinyl } = useAudioStore();

  const handleClick = () => {
    playBookOpen();
    startVinyl();
    setActiveModal("music");
  };

  return (
    <DeskHotspot
      label="80s playlist 🎵 ▶️"
      sublabel="Tocadiscos vintage"
      badgePosition="top-right"
      className="top-[28%] left-[21%] w-[22%] h-[40%]"
      style={{ zIndex: 12 }}
      onClick={handleClick}
    >
      <div className="absolute inset-2 rounded-2xl bg-black/25 backdrop-blur-xs border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
        <Disc3
          size={56}
          className="text-emerald-400/80 animate-spin"
          style={{ animationDuration: "5s" }}
        />
      </div>
    </DeskHotspot>
  );
}
