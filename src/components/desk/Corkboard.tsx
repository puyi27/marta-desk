"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { corkboardPhotos } from "@/data/deskData";
import { useDeskStore } from "@/store/useDeskStore";

const pinColors: Record<string, string> = {
  "photo-primos": "linear-gradient(135deg, #ef4444 0%, #991b1b 100%)",
  "photo-dora": "linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)",
  "photo-cristo": "linear-gradient(135deg, #eab308 0%, #a16207 100%)",
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
        left: "1.5%",
        top: "2.5%",
        width: "195px",
        height: "300px",
        zIndex: 22,
      }}
    >
      <div
        className="relative w-full h-full rounded-lg shadow-2xl p-2.5 flex flex-col justify-between"
        style={{
          background: "radial-gradient(circle at center, #c99352 0%, #aa7738 70%, #875c26 100%)",
          border: "8px solid #5a3818",
          boxShadow: "0 20px 35px -5px rgba(0,0,0,0.5), inset 0 2px 8px rgba(0,0,0,0.4)",
        }}
      >
        <div className="flex justify-between items-start">
          {corkboardPhotos.slice(0, 2).map((photo) => (
            <motion.div
              key={photo.id}
              layoutId={`photo-${photo.id}`}
              whileHover={{ scale: 1.12, rotate: 0, zIndex: 30 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOpenPhoto(photo.id)}
              className="relative cursor-pointer bg-white p-1 pb-3 rounded-xs shadow-md transition-shadow group"
              style={{
                width: "82px",
                transform: `rotate(${photo.rotation}deg)`,
                boxShadow: "0 6px 12px rgba(0,0,0,0.25)",
              }}
            >
              <div
                className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full shadow-md z-10"
                style={{ background: pinColors[photo.id] ?? "#ef4444" }}
              />
              <div className="relative w-full h-16 rounded-2xs overflow-hidden bg-neutral-100">
                <Image
                  src={photo.imageSrc}
                  alt={photo.title}
                  fill
                  sizes="82px"
                  className="object-cover"
                />
              </div>
              <p
                className="text-center text-[8px] text-neutral-600 font-medium mt-1 truncate"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {photo.title}
              </p>
            </motion.div>
          ))}
        </div>

        {corkboardPhotos[2] && (
          <div className="flex justify-center -mt-2">
            <motion.div
              layoutId={`photo-${corkboardPhotos[2].id}`}
              whileHover={{ scale: 1.12, rotate: 0, zIndex: 30 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOpenPhoto(corkboardPhotos[2].id)}
              className="relative cursor-pointer bg-white p-1 pb-3 rounded-xs shadow-md transition-shadow group"
              style={{
                width: "82px",
                transform: `rotate(${corkboardPhotos[2].rotation}deg)`,
                boxShadow: "0 6px 12px rgba(0,0,0,0.25)",
              }}
            >
              <div
                className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full shadow-md z-10"
                style={{ background: pinColors[corkboardPhotos[2].id] ?? "#eab308" }}
              />
              <div className="relative w-full h-16 rounded-2xs overflow-hidden bg-neutral-100">
                <Image
                  src={corkboardPhotos[2].imageSrc}
                  alt={corkboardPhotos[2].title}
                  fill
                  sizes="82px"
                  className="object-cover"
                />
              </div>
              <p
                className="text-center text-[8px] text-neutral-600 font-medium mt-1 truncate"
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
