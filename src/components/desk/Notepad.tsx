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
      label="Mis Apuntes ✍️"
      badgePosition="top-center"
      className="top-[57%] left-[47%] w-[12%] h-[17%] -rotate-6"
      style={{ zIndex: 13 }}
      onClick={handleClick}
    />
  );
}
