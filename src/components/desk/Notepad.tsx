"use client";

import { useDeskStore } from "@/store/useDeskStore";
import { useAudioStore } from "@/store/useAudioStore";
import DeskHotspot from "@/components/desk/DeskHotspot";

export default function Notepad() {
  const { setActiveModal } = useDeskStore();
  const { playBookOpen } = useAudioStore();

  const handleClick = () => {
    playBookOpen();
    setActiveModal("notepad");
  };

  return (
    <DeskHotspot
      label="Abrir bloc de notas ✍️"
      badgePosition="top-center"
      className="top-[58%] left-[48%] w-[11%] h-[16%] -rotate-6"
      style={{ zIndex: 13 }}
      onClick={handleClick}
    />
  );
}
