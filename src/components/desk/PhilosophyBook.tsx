"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useDeskStore } from "@/store/useDeskStore";

export default function PhilosophyBook() {
  const { setActiveModal } = useDeskStore();

  return (
    <motion.div
      whileHover={{ y: -6, rotateX: 12, rotateY: -6, scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      onClick={() => setActiveModal("philosophy")}
      className="absolute cursor-pointer select-none group"
      style={{
        left: "58%",
        top: "54%",
        width: "250px",
        height: "175px",
        perspective: "1000px",
        zIndex: 25,
      }}
      title="Abrir 'Estudios sobre el amor' (Ortega y Gasset)"
    >
      <div className="relative w-full h-full">
        <div className="absolute -bottom-3 left-4 right-4 h-6 bg-black/40 rounded-full blur-md" />

        <div
          className="relative w-full h-full rounded-md shadow-2xl flex overflow-hidden"
          style={{
            background: "#FAF6F0",
            border: "2px solid #d4c4ad",
            boxShadow: "0 20px 30px -10px rgba(0,0,0,0.4), inset 0 0 30px rgba(180, 140, 90, 0.15)",
          }}
        >
          <div className="absolute left-1/2 top-0 bottom-0 w-2.5 -translate-x-1/2 bg-gradient-to-r from-neutral-400/30 via-neutral-900/40 to-neutral-400/30 shadow-inner z-10" />

          <div
            className="w-1/2 h-full p-4 flex flex-col justify-between border-r border-amber-900/10"
            style={{
              background: "linear-gradient(90deg, #f0e6d6 0%, #faf6f0 85%, #e8ddcb 100%)",
            }}
          >
            <div>
              <p
                className="text-[10px] uppercase tracking-widest text-amber-900/60 font-semibold"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Ortega y Gasset
              </p>
              <h3
                className="text-xs font-bold text-amber-950 mt-1 leading-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Estudios sobre el amor
              </h3>
            </div>

            <div className="space-y-1.5 opacity-60">
              <div className="h-1 bg-amber-900/20 rounded-full w-full" />
              <div className="h-1 bg-amber-900/20 rounded-full w-5/6" />
              <div className="h-1 bg-amber-900/20 rounded-full w-4/6" />
              <div className="h-1 bg-amber-900/20 rounded-full w-full" />
            </div>

            <span className="text-[9px] text-amber-800/40 font-mono text-right">pag. 42</span>
          </div>

          <div
            className="w-1/2 h-full p-4 flex flex-col justify-between"
            style={{
              background: "linear-gradient(270deg, #f0e6d6 0%, #faf6f0 85%, #e8ddcb 100%)",
            }}
          >
            <div className="w-12 h-10 border border-amber-900/20 rounded-xs self-center bg-amber-100/40 p-1 flex items-center justify-center">
              <div className="w-full h-full bg-amber-900/10 rounded-2xs" />
            </div>

            <div className="space-y-1.5 opacity-60">
              <div className="h-1 bg-amber-900/20 rounded-full w-full" />
              <div className="h-1 bg-amber-900/20 rounded-full w-full" />
              <div className="h-1 bg-amber-900/20 rounded-full w-3/4" />
            </div>

            <span className="text-[9px] text-amber-800/40 font-mono">pag. 43</span>
          </div>

          <div
            className="absolute left-1/2 top-0 w-3 -translate-x-1/2 rounded-b-md shadow-md z-20"
            style={{
              height: "75%",
              background: "linear-gradient(180deg, #b91c1c 0%, #dc2626 100%)",
            }}
          />
        </div>

        <motion.div
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-7 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-950 text-amber-100 text-xs font-serif italic flex items-center gap-2 shadow-xl border border-amber-700/50 whitespace-nowrap"
        >
          <BookOpen size={13} className="text-amber-300" />
          <span>Ortega y Gasset · TFM</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
