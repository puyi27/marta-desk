"use client";

import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { Heart } from "lucide-react";
import { useAudioStore } from "@/store/useAudioStore";

export default function DachshundPlush() {
  const { playSquish, playHoverTick } = useAudioStore();

  const handleSquish = async () => {
    playSquish();

    confetti({
      particleCount: 50,
      spread: 80,
      origin: { x: 0.15, y: 0.65 },
      colors: ["#ff4081", "#e91e63", "#f48fb1", "#ff80ab", "#ff1744"],
      shapes: ["circle"],
      scalar: 1.1,
    });

    try {
      await fetch("/api/miss-you", { method: "POST" });
    } catch {}

    toast.success("Ángel acaba de sentir tu achuchón en su móvil ❤️", {
      duration: 3500,
    });
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scaleX: 1.2, scaleY: 0.8, rotate: -5 }}
      transition={{ type: "spring", stiffness: 500, damping: 14 }}
      onClick={handleSquish}
      onMouseEnter={playHoverTick}
      className="absolute top-[54%] left-[7%] w-[15%] h-[20%] cursor-pointer group select-none rounded-2xl"
      style={{ zIndex: 18 }}
      title="¡Achuchar a Dora!"
    >
      <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle,rgba(255,240,200,0.28)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity duration-300 pointer-events-none" />

      <div className="absolute -top-7 left-1/2 -translate-x-1/2 pointer-events-none z-20">
        <motion.div
          whileHover={{ y: -4, scale: 1.04 }}
          className="backdrop-blur-xl bg-black/55 text-white/95 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-full px-3 py-1.5 text-xs font-medium tracking-wide flex items-center gap-1.5 whitespace-nowrap opacity-90 group-hover:opacity-100 transition-all"
        >
          <Heart size={14} className="fill-rose-500 text-rose-500 animate-pulse" />
          <span>Achuchar a Dora</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
