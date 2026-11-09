"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart } from "lucide-react";
import { useDeskStore } from "@/store/useDeskStore";

export default function DachshundPlush() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { } = useDeskStore();

  const handleSquish = async () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    confetti({
      particleCount: 45,
      spread: 70,
      origin: { x: 0.13, y: 0.65 },
      colors: ["#ff4081", "#e91e63", "#f48fb1", "#ff80ab", "#ff1744"],
      shapes: ["circle"],
      scalar: 1,
    });

    try {
      await fetch("/api/miss-you", { method: "POST" });
    } catch {
      console.error("Miss-you error");
    }
  };

  return (
    <div
      className="absolute cursor-pointer select-none"
      style={{
        left: "7.5%",
        top: "52%",
        width: "155px",
        height: "125px",
        zIndex: 26,
      }}
      title="¡Apretar peluche de Dora!"
    >
      <motion.div
        animate={{ y: [-4, 4, -4] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-7 left-10 z-30 pointer-events-none"
      >
        <div className="bg-white px-2.5 py-1 rounded-full shadow-lg border border-rose-100 flex items-center justify-center">
          <Heart size={14} className="fill-rose-500 text-rose-500 animate-pulse" />
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{
          scaleX: 1.3,
          scaleY: 0.68,
          y: 12,
          transition: { type: "spring", stiffness: 600, damping: 14 },
        }}
        onClick={handleSquish}
        className="relative w-full h-full"
      >
        <div className="absolute -bottom-2 left-3 right-3 h-5 bg-black/35 rounded-full blur-md" />

        <div
          className="absolute left-6 top-10 rounded-full shadow-lg"
          style={{
            width: "105px",
            height: "56px",
            background: "linear-gradient(135deg, #a66a38 0%, #7d441f 70%, #5c2d0f 100%)",
            boxShadow: "inset 0 4px 6px rgba(255,255,255,0.25), 0 8px 16px rgba(0,0,0,0.3)",
          }}
        >
          <div
            className="absolute -left-3 top-2 rounded-full origin-right"
            style={{
              width: "18px",
              height: "10px",
              background: "linear-gradient(135deg, #8a4e24 0%, #613110 100%)",
              transform: "rotate(-25deg)",
            }}
          />

          <div className="absolute -bottom-2 left-4 w-5 h-5 rounded-full bg-[#6b3815] shadow-md border-b border-black/20" />
          <div className="absolute -bottom-2 left-10 w-5 h-5 rounded-full bg-[#5c2d0f] shadow-md border-b border-black/20" />
          <div className="absolute -bottom-2 right-4 w-5 h-5 rounded-full bg-[#6b3815] shadow-md border-b border-black/20" />
        </div>

        <div
          className="absolute right-3 top-4 rounded-full shadow-xl"
          style={{
            width: "60px",
            height: "56px",
            background: "linear-gradient(145deg, #b87a45 0%, #8b4d24 60%, #693311 100%)",
            boxShadow: "inset 0 3px 5px rgba(255,255,255,0.3), 0 6px 14px rgba(0,0,0,0.35)",
          }}
        >
          <div
            className="absolute -right-3 top-6 rounded-full"
            style={{
              width: "30px",
              height: "26px",
              background: "linear-gradient(135deg, #a66a38 0%, #7d441f 100%)",
            }}
          >
            <div className="absolute right-0.5 top-1.5 w-3.5 h-3 rounded-full bg-neutral-900 shadow-xs" />
          </div>

          <div
            className="absolute -left-1 top-2 rounded-2xl shadow-md origin-top"
            style={{
              width: "18px",
              height: "44px",
              background: "linear-gradient(180deg, #6b3815 0%, #4a220a 100%)",
              transform: "rotate(12deg)",
            }}
          />

          <div
            className="absolute right-10 top-2 rounded-2xl shadow-md origin-top"
            style={{
              width: "16px",
              height: "38px",
              background: "linear-gradient(180deg, #592c0e 0%, #3d1b06 100%)",
              transform: "rotate(-8deg)",
              zIndex: -1,
            }}
          />

          <div className="absolute right-5 top-5 w-3 h-3 rounded-full bg-neutral-950 flex items-center justify-center shadow-xs">
            <div className="w-1 h-1 rounded-full bg-white -mt-0.5 -mr-0.5" />
          </div>
        </div>
      </motion.div>

      <audio ref={audioRef} src="/sounds/squeak.mp3" preload="auto" />
    </div>
  );
}
