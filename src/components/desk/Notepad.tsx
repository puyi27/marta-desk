"use client";

import { motion } from "framer-motion";
import { Edit3 } from "lucide-react";
import { useDeskStore } from "@/store/useDeskStore";

export default function Notepad() {
  const { setActiveModal } = useDeskStore();

  return (
    <motion.div
      whileHover={{ y: -6, rotateX: 10, rotateY: 5, scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      onClick={() => setActiveModal("notepad")}
      className="absolute cursor-pointer select-none group"
      style={{
        left: "47.5%",
        top: "55%",
        width: "130px",
        height: "170px",
        perspective: "1000px",
        zIndex: 25,
      }}
      title="Abrir bloc de notas"
    >
      <div className="relative w-full h-full">
        <div className="absolute -bottom-3 left-2 right-2 h-5 bg-black/35 rounded-full blur-md" />

        <div
          className="relative w-full h-full rounded-md shadow-2xl overflow-hidden"
          style={{
            background: "#fffef9",
            border: "1px solid #e0d5be",
            boxShadow: "0 15px 25px -5px rgba(0,0,0,0.35), inset 0 0 10px rgba(0,0,0,0.03)",
          }}
        >
          <div className="h-6 w-full bg-neutral-800/10 border-b border-neutral-300 flex items-center justify-around px-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="w-2.5 h-3.5 rounded-full border-2 border-neutral-600 bg-neutral-300 shadow-xs -mt-1"
              />
            ))}
          </div>

          <div className="p-3.5 space-y-3">
            <div className="h-1.5 bg-neutral-400/40 rounded-full w-2/3" />
            <div className="h-1 bg-sky-200/60 rounded-full w-full" />
            <div className="h-1 bg-sky-200/60 rounded-full w-full" />
            <div className="h-1 bg-sky-200/60 rounded-full w-5/6" />
            <div className="h-1 bg-sky-200/60 rounded-full w-4/6" />
            <div className="h-1 bg-sky-200/60 rounded-full w-full" />
            <div className="h-1 bg-sky-200/60 rounded-full w-3/4" />
          </div>

          <div
            className="absolute bottom-0 right-0 w-6 h-6 border-l border-t border-amber-300/60"
            style={{
              background: "linear-gradient(135deg, transparent 50%, #f3ebd8 50%)",
              boxShadow: "-2px -2px 5px rgba(0,0,0,0.08)",
            }}
          />
        </div>

        <div
          className="absolute -right-3 top-8 w-3 h-32 rounded-full shadow-lg"
          style={{
            background: "linear-gradient(90deg, #d97706 0%, #b45309 60%, #78350f 100%)",
            transform: "rotate(15deg)",
          }}
        >
          <div className="w-full h-4 rounded-t-full bg-pink-300 border-b border-neutral-400" />
          <div className="w-full h-2 bg-neutral-300" />
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-amber-100 absolute -bottom-2 left-0" />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute -top-6 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-neutral-900 text-white text-[11px] font-sans flex items-center gap-1.5 shadow-md whitespace-nowrap"
        >
          <Edit3 size={11} className="text-amber-300" />
          <span>Apuntes</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
