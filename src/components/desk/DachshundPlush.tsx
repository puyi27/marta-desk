"use client";

import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { useAudioStore } from "@/store/useAudioStore";

export default function DachshundPlush() {
  const { playSquish, playHoverTick } = useAudioStore();

  const handleSquish = async () => {
    playSquish();

    confetti({
      particleCount: 50,
      spread: 75,
      origin: { x: 0.15, y: 0.65 },
      colors: ["#ff4081", "#e91e63", "#f48fb1", "#ff80ab", "#ff1744"],
      shapes: ["circle"],
      scalar: 1.1,
    });

    try {
      await fetch("/api/miss-you", { method: "POST" });
    } catch {}

    toast.success("Achuchón enviado al móvil de Ángel ❤️", {
      duration: 3500,
    });
  };

  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      whileTap={{ scaleX: 1.22, scaleY: 0.78, rotate: -6 }}
      transition={{ type: "spring", stiffness: 500, damping: 12 }}
      onClick={handleSquish}
      onMouseEnter={playHoverTick}
      className="absolute top-[56%] left-[8%] w-[13%] h-[18%] cursor-pointer group select-none rounded-2xl"
      style={{ zIndex: 18 }}
    >
      <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle,rgba(255,255,255,0.22)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="absolute -top-7 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105">
        <div className="backdrop-blur-md bg-white/90 text-zinc-900 px-3 py-1.5 rounded-full text-xs font-semibold shadow-xl border border-white/50 flex items-center gap-1.5 whitespace-nowrap">
          <span>❤️</span>
          <span>Achuchar a Dora</span>
        </div>
      </div>
    </motion.div>
  );
}
