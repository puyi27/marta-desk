"use client";

import { useDeskStore } from "@/store/useDeskStore";
import { useAudioStore } from "@/store/useAudioStore";
import DeskHotspot from "@/components/desk/DeskHotspot";

export default function PhilosophyBook() {
  const { setActiveModal } = useDeskStore();
  const { playBookOpen } = useAudioStore();

  const handleClick = () => {
    playBookOpen();
    setActiveModal("philosophy");
  };

  return (
    <DeskHotspot
      label="Asistente TFM · Ortega y Gasset 📖"
      badgePosition="top-right"
      className="top-[54%] left-[58%] w-[25%] h-[22%]"
      style={{ zIndex: 13 }}
      onClick={handleClick}
    />
  );
}
