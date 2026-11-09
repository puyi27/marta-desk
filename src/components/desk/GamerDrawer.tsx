"use client";

import { motion } from "framer-motion";
import { Gamepad2, ChevronDown } from "lucide-react";
import { useDeskStore } from "@/store/useDeskStore";

export default function GamerDrawer() {
  const { setActiveModal } = useDeskStore();

  return (
    <motion.div
      whileHover={{ y: 8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      onClick={() => setActiveModal("gamer")}
      className="absolute cursor-pointer select-none group"
      style={{
        left: "35.5%",
        top: "74%",
        width: "300px",
        height: "125px",
        zIndex: 25,
      }}
      title="Cajón Gamer - Clic para jugar"
    >
      <div className="relative w-full h-full">
        <div
          className="absolute inset-0 rounded-b-xl shadow-2xl transition-all duration-300"
          style={{
            background: "linear-gradient(180deg, #5c3d18 0%, #3e260c 60%, #2a1805 100%)",
            border: "3px solid #754e22",
            borderTop: "4px solid #2a1805",
            boxShadow: "0 25px 35px -5px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.15)",
          }}
        >
          <div
            className="absolute top-2 left-6 right-6 h-14 rounded-lg bg-black/60 shadow-inner flex items-center justify-center overflow-hidden border border-amber-950/40"
          >
            <div
              className="relative w-28 h-10 rounded-2xl flex items-center justify-between px-3 shadow-md"
              style={{
                background: "linear-gradient(180deg, #1f232b 0%, #0f1115 100%)",
                border: "1px solid #333a46",
              }}
            >
              <div className="w-5 h-5 grid grid-cols-3 grid-rows-3 gap-0.5">
                <div />
                <div className="bg-neutral-500 rounded-2xs" />
                <div />
                <div className="bg-neutral-500 rounded-2xs" />
                <div className="bg-neutral-600 rounded-full" />
                <div className="bg-neutral-500 rounded-2xs" />
                <div />
                <div className="bg-neutral-500 rounded-2xs" />
                <div />
              </div>

              <div className="w-8 h-3 rounded-full bg-blue-500/70 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse" />

              <div className="w-5 h-5 grid grid-cols-2 grid-rows-2 gap-1 items-center justify-items-center">
                <span className="text-[7px] text-green-400 font-bold leading-none">△</span>
                <span className="text-[7px] text-red-400 font-bold leading-none">○</span>
                <span className="text-[7px] text-sky-400 font-bold leading-none">✕</span>
                <span className="text-[7px] text-pink-400 font-bold leading-none">□</span>
              </div>
            </div>
          </div>

          <div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 w-28 h-4 rounded-full shadow-md flex items-center justify-center"
            style={{
              background: "linear-gradient(180deg, #e5b369 0%, #b88636 50%, #8c611f 100%)",
              border: "1px solid #d49c47",
              boxShadow: "0 3px 6px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.4)",
            }}
          >
            <div className="w-16 h-1 rounded-full bg-amber-950/30" />
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/90 text-amber-200 text-xs font-mono shadow-xl border border-amber-500/40 whitespace-nowrap"
        >
          <Gamepad2 size={13} className="text-amber-400" />
          <span>Cajón Gamer</span>
          <ChevronDown size={14} className="text-amber-300" />
        </motion.div>
      </div>
    </motion.div>
  );
}
