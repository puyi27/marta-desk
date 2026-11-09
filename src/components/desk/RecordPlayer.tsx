"use client";

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
      badgePosition="top-right"
      className="top-[28%] left-[21%] w-[23%] h-[40%]"
      style={{ zIndex: 12 }}
      onClick={handleClick}
    />
  );
}
