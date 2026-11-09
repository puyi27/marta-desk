"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, RotateCcw } from "lucide-react";
import Image from "next/image";
import { corkboardPhotos } from "@/data/deskData";
import { useDeskStore } from "@/store/useDeskStore";

export default function PhotoZoomModal() {
  const { setActiveModal, selectedPhotoId, setSelectedPhotoId } = useDeskStore();
  const [flipped, setFlipped] = useState(false);

  const photo = corkboardPhotos.find((p) => p.id === selectedPhotoId);

  const handleClose = () => {
    setFlipped(false);
    setSelectedPhotoId(null);
    setActiveModal(null);
  };

  if (!photo) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center modal-backdrop select-none"
      style={{ background: "rgba(0,0,0,0.75)", zIndex: 50 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="relative flex flex-col items-center">
        <button
          onClick={handleClose}
          className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors z-10"
        >
          <X size={26} />
        </button>

        <motion.div
          layoutId={`photo-${photo.id}`}
          className="relative cursor-pointer"
          onClick={() => setFlipped(!flipped)}
          style={{
            width: "320px",
            height: "410px",
            perspective: "1200px",
          }}
        >
          <motion.div
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.65, ease: [0.4, 0.0, 0.2, 1] }}
            style={{
              width: "100%",
              height: "100%",
              transformStyle: "preserve-3d",
              position: "relative",
            }}
          >
            <div
              className="absolute inset-0 bg-white rounded-xs p-3 pb-8 shadow-2xl flex flex-col"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <div className="relative w-full flex-1 overflow-hidden bg-neutral-100 rounded-2xs">
                <Image
                  src={photo.imageSrc}
                  alt={photo.title}
                  fill
                  className="object-cover"
                  sizes="320px"
                  priority
                />
              </div>
              <div
                className="text-center pt-3 text-neutral-600 font-medium tracking-wide"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "13px",
                }}
              >
                {photo.title}
              </div>
            </div>

            <div
              className="absolute inset-0 bg-[#fdfbf7] rounded-xs p-8 shadow-2xl flex flex-col justify-between"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                border: "1px solid #ebd8c3",
              }}
            >
              <div className="w-8 h-1 bg-amber-800/30 mx-auto rounded-full" />
              <p
                className="text-center italic leading-relaxed"
                style={{
                  fontFamily: "var(--font-playfair)",
                  color: "#3a2518",
                  fontSize: "1.15rem",
                  lineHeight: "1.8",
                }}
              >
                "{photo.backNote}"
              </p>
              <p
                className="text-center text-xs text-amber-900/50"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Toca para volver a ver la foto
              </p>
            </div>
          </motion.div>
        </motion.div>

        <div className="flex justify-center mt-5">
          <button
            onClick={() => setFlipped(!flipped)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm transition-colors border border-white/20 backdrop-blur-xs"
          >
            <RotateCcw size={15} />
            <span>{flipped ? "Ver foto" : "Girar para leer dedicatoria"}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
