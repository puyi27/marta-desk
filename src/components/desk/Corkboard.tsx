"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { corkboardPhotos } from "@/data/deskData";
import { useDeskStore } from "@/store/useDeskStore";

const pinColors: Record<string, string> = {
  "photo-primos": "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
  "photo-dora": "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
  "photo-cristo": "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
};

export default function Corkboard() {
  const { setActiveModal, setSelectedPhotoId } = useDeskStore();

  const handleOpenPhoto = (id: string) => {
    setSelectedPhotoId(id);
    setActiveModal("corkboard");
  };

  return (
    <div
      className="absolute select-none"
      style={{
        left: "3%",
        top: "7%",
        width: "240px",
        height: "340px",
        zIndex: 15,
      }}
    >
      <div
        className="relative w-full h-full rounded-2xl p-3 flex flex-col justify-between shadow-2xl transition-all"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, #c49658 0%, #a8793e 60%, #875c27 100%)",
          border: "10px solid #4a2f18",
          boxShadow:
            "0 30px 60px -10px rgba(0,0,0,0.7), inset 0 3px 12px rgba(0,0,0,0.5), 0 0 0 2px #261609",
        }}
      >
        <div className="flex justify-between items-start pt-1">
          {corkboardPhotos.slice(0, 2).map((photo) => (
            <motion.div
              key={photo.id}
              layoutId={`photo-${photo.id}`}
              whileHover={{ scale: 1.14, rotate: 0, zIndex: 35 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOpenPhoto(photo.id)}
              className="relative cursor-pointer bg-white p-1.5 pb-3.5 rounded-sm shadow-xl transition-shadow group"
              style={{
                width: "96px",
                transform: `rotate(${photo.rotation}deg)`,
                boxShadow: "0 8px 18px rgba(0,0,0,0.35)",
              }}
            >
              <div
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full shadow-md z-10"
                style={{ background: pinColors[photo.id] ?? "#ef4444" }}
              />
              <div className="relative w-full h-20 rounded-2xs overflow-hidden bg-neutral-200">
                <Image
                  src={photo.imageSrc}
                  alt={photo.title}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <p
                className="text-center text-[9px] text-neutral-700 font-medium mt-1 truncate"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {photo.title}
              </p>
            </motion.div>
          ))}
        </div>

        {corkboardPhotos[2] && (
          <div className="flex justify-center -mt-1">
            <motion.div
              layoutId={`photo-${corkboardPhotos[2].id}`}
              whileHover={{ scale: 1.14, rotate: 0, zIndex: 35 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOpenPhoto(corkboardPhotos[2].id)}
              className="relative cursor-pointer bg-white p-1.5 pb-3.5 rounded-sm shadow-xl transition-shadow group"
              style={{
                width: "96px",
                transform: `rotate(${corkboardPhotos[2].rotation}deg)`,
                boxShadow: "0 8px 18px rgba(0,0,0,0.35)",
              }}
            >
              <div
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full shadow-md z-10"
                style={{ background: pinColors[corkboardPhotos[2].id] ?? "#f59e0b" }}
              />
              <div className="relative w-full h-20 rounded-2xs overflow-hidden bg-neutral-200">
                <Image
                  src={corkboardPhotos[2].imageSrc}
                  alt={corkboardPhotos[2].title}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <p
                className="text-center text-[9px] text-neutral-700 font-medium mt-1 truncate"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {corkboardPhotos[2].title}
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
