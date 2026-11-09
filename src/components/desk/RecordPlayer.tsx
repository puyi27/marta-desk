"use client";

import { motion } from "framer-motion";
import { Disc3, Radio } from "lucide-react";
import { useDeskStore } from "@/store/useDeskStore";

export default function RecordPlayer() {
  const { setActiveModal, isPlayingAudio } = useDeskStore();

  return (
    <motion.div
      whileHover={{ y: -6, rotateX: 6, rotateY: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      onClick={() => setActiveModal("music")}
      className="absolute cursor-pointer select-none group"
      style={{
        left: "19%",
        top: "22%",
        width: "260px",
        height: "210px",
        perspective: "1000px",
        zIndex: 25,
      }}
      title="Tocadiscos Spotify - Clic para abrir el diario musical"
    >
      <div className="relative w-full h-full">
        <div
          className="absolute inset-0 rounded-2xl shadow-2xl transition-all duration-300 group-hover:shadow-[0_25px_40px_-10px_rgba(0,0,0,0.6)]"
          style={{
            background: "linear-gradient(145deg, #1b382b 0%, #11241c 60%, #0a1711 100%)",
            border: "3px solid #1DB954",
            boxShadow:
              "0 20px 35px -5px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -3px 6px rgba(0,0,0,0.5)",
          }}
        >
          <div className="absolute top-2.5 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-ping" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#1DB954] font-bold">
                Spotify Hi-Fi
              </span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80 shadow-xs" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 shadow-xs" />
            </div>
          </div>

          <div
            className="absolute left-4 top-8 rounded-full shadow-inner flex items-center justify-center overflow-hidden"
            style={{
              width: "135px",
              height: "135px",
              background: "#141414",
              border: "3px solid #292929",
            }}
          >
            <motion.div
              animate={{ rotate: isPlayingAudio ? 360 : 0 }}
              transition={{
                duration: 2.2,
                repeat: isPlayingAudio ? Infinity : 0,
                ease: "linear",
              }}
              className="relative rounded-full flex items-center justify-center"
              style={{
                width: "124px",
                height: "124px",
                background:
                  "repeating-radial-gradient(circle at center, #111 0px, #111 2px, #1c1c1c 3px, #111 5px, #262626 6px, #111 8px)",
                boxShadow: "0 0 15px rgba(0,0,0,0.8)",
              }}
            >
              <div
                className="rounded-full shadow-md flex items-center justify-center border-2 border-white/20"
                style={{
                  width: "46px",
                  height: "46px",
                  background: "radial-gradient(circle, #1DB954 0%, #15883e 100%)",
                }}
              >
                <Disc3 size={18} className="text-black animate-spin" />
              </div>
            </motion.div>
          </div>

          <div className="absolute right-5 top-10 w-16 h-28 flex flex-col items-center justify-between">
            <motion.div
              animate={{ rotate: isPlayingAudio ? 24 : 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="origin-top-right relative"
              style={{ width: "8px", height: "80px", right: "2px" }}
            >
              <div className="w-4 h-4 rounded-full bg-amber-200/90 shadow-md ml-auto" />
              <div className="w-1.5 h-16 bg-neutral-300 rounded-full shadow-sm ml-auto mr-1" />
              <div className="w-3 h-5 bg-neutral-900 rounded-xs -mt-1 ml-auto mr-0.5 border border-neutral-600" />
            </motion.div>

            <div className="flex gap-2.5 mt-auto">
              <div className="w-5 h-5 rounded-full bg-neutral-800 border-2 border-neutral-600 shadow-sm flex items-center justify-center">
                <div className="w-1 h-2 bg-[#1DB954] rounded-xs" />
              </div>
              <div className="w-5 h-5 rounded-full bg-neutral-800 border-2 border-neutral-600 shadow-sm" />
            </div>
          </div>

          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-20 h-3 rounded-full bg-neutral-900/60 border border-white/10 flex items-center justify-center">
            <div className="w-8 h-1 bg-[#1DB954]/60 rounded-full" />
          </div>
        </div>

        <motion.div
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-4 right-0 flex items-center gap-2 px-3 py-1.5 rounded-full shadow-xl border border-emerald-400/30 backdrop-blur-md"
          style={{
            background: "linear-gradient(135deg, #1DB954 0%, #169c46 100%)",
            color: "white",
          }}
        >
          <Radio size={13} className="text-black" />
          <span className="text-xs font-bold tracking-wide text-black">
            Spotify
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
