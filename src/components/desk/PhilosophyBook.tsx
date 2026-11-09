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
      label="TFM: Ortega y Gasset 📖"
      sublabel="Estudios sobre el amor"
      badgePosition="top-right"
      className="top-[55%] left-[58%] w-[24%] h-[20%]"
      style={{ zIndex: 13 }}
      onClick={handleClick}
    />
  );
}
