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
        left: "35%",
        top: "76%",
        width: "320px",
        height: "135px",
        zIndex: 26,
      }}
      title="Cajón Gamer - Clic para jugar"
    >
      <div className="relative w-full h-full">
        <div
          className="absolute inset-0 rounded-b-2xl shadow-2xl transition-all duration-300"
          style={{
            background: "linear-gradient(180deg, #442a10 0%, #2a1805 100%)",
            border: "3px solid #5a3717",
            borderTop: "5px solid #1a0e03",
            boxShadow:
              "0 25px 40px -5px rgba(0,0,0,0.8), inset 0 2px 4px rgba(255,255,255,0.1)",
          }}
        >
          <div
            className="absolute top-2 left-6 right-6 h-16 rounded-xl bg-black/75 shadow-inner flex items-center justify-center overflow-hidden border border-amber-950/50"
          >
            <div
              className="relative w-32 h-11 rounded-2xl flex items-center justify-between px-3 shadow-lg"
              style={{
                background: "linear-gradient(180deg, #1f232b 0%, #0d0f14 100%)",
                border: "1px solid #3b4352",
                boxShadow: "0 4px 10px rgba(0,0,0,0.6)",
              }}
            >
              <div className="w-5 h-5 grid grid-cols-3 grid-rows-3 gap-0.5">
                <div />
                <div className="bg-neutral-400 rounded-2xs" />
                <div />
                <div className="bg-neutral-400 rounded-2xs" />
                <div className="bg-neutral-600 rounded-full" />
                <div className="bg-neutral-400 rounded-2xs" />
                <div />
                <div className="bg-neutral-400 rounded-2xs" />
                <div />
              </div>

              <div className="w-10 h-3 rounded-full bg-blue-500/80 shadow-[0_0_12px_rgba(59,130,246,0.9)] animate-pulse flex items-center justify-center">
                <div className="w-2 h-0.5 bg-white/70 rounded-full" />
              </div>

              <div className="w-5 h-5 grid grid-cols-2 grid-rows-2 gap-1 items-center justify-items-center">
                <span className="text-[8px] text-green-400 font-bold leading-none">△</span>
                <span className="text-[8px] text-red-400 font-bold leading-none">○</span>
                <span className="text-[8px] text-sky-400 font-bold leading-none">✕</span>
                <span className="text-[8px] text-pink-400 font-bold leading-none">□</span>
              </div>
            </div>
          </div>

          <div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 w-32 h-4 rounded-full shadow-md flex items-center justify-center"
            style={{
              background:
                "linear-gradient(180deg, #e5b369 0%, #b88636 50%, #8c611f 100%)",
              border: "1px solid #d49c47",
              boxShadow:
                "0 3px 6px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.4)",
            }}
          >
            <div className="w-20 h-1 rounded-full bg-amber-950/40" />
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-950/95 text-amber-200 text-xs font-mono shadow-2xl border border-amber-500/40 whitespace-nowrap"
        >
          <Gamepad2 size={13} className="text-amber-400" />
          <span>Cajón Gamer Secreto</span>
          <ChevronDown size={14} className="text-amber-300" />
        </motion.div>
      </div>
    </motion.div>
  );
}
