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
      label="Cajón secreto 🎮"
      sublabel="DualSense"
      badgePosition="top-center"
      className="top-[77%] left-[34%] w-[31%] h-[19%]"
      style={{ zIndex: 11 }}
      onClick={handleClick}
    />
  );
}
