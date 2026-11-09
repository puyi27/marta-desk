"use client";

import { motion } from "framer-motion";
import { Music } from "lucide-react";
import { useDeskStore } from "@/store/useDeskStore";
import { useAudioStore } from "@/store/useAudioStore";
import DeskHotspot from "@/components/desk/DeskHotspot";

export default function RecordPlayer() {
  const { setActiveModal, isPlayingAudio } = useDeskStore();
  const { playBookOpen, startVinyl } = useAudioStore();

  const handleClick = () => {
    playBookOpen();
    startVinyl();
    setActiveModal("music");
  };

  return (
    <DeskHotspot
      label="80s Playlist · Abrir Diario Musical 🎵"
      badgePosition="top-right"
      className="top-[26%] left-[20%] w-[24%] h-[42%]"
      style={{ zIndex: 12 }}
      onClick={handleClick}
    >
      {isPlayingAudio && (
        <div className="absolute top-[25%] left-[45%] pointer-events-none">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ y: 0, opacity: 0, scale: 0.5 }}
              animate={{
                y: -50,
                opacity: [0, 0.8, 0],
                scale: [0.5, 1.2, 0.8],
                x: (i - 1) * 20,
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                delay: i * 0.7,
                ease: "easeOut",
              }}
              className="absolute text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
            >
              <Music size={16} />
            </motion.div>
          ))}
        </div>
      )}
    </DeskHotspot>
  );
}
