"use client";

import { useDeskStore } from "@/store/useDeskStore";
import { useAudioStore } from "@/store/useAudioStore";
import DeskHotspot from "@/components/desk/DeskHotspot";

export default function Corkboard() {
  const { setActiveModal, setSelectedPhotoId } = useDeskStore();
  const { playBookOpen } = useAudioStore();

  const handleOpenPhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playBookOpen();
    setSelectedPhotoId(id);
    setActiveModal("corkboard");
  };

  return (
    <DeskHotspot
      label="Corcho de Recuerdos"
      sublabel="3 fotos"
      badgePosition="top-right"
      className="top-[2%] left-[1%] w-[21%] h-[52%]"
      style={{ zIndex: 15 }}
      onClick={(e) => handleOpenPhoto("photo-dora", e)}
    >
      <div
        onClick={(e) => handleOpenPhoto("photo-dora", e)}
        className="absolute top-[8%] left-[8%] w-[42%] h-[40%] cursor-pointer group/photo rounded-lg transition-transform hover:scale-105"
        title="Dora (siempre con nosotros)"
      >
        <div className="absolute inset-0 rounded-lg ring-2 ring-white/0 group-hover/photo:ring-white/60 transition-all duration-300" />
      </div>

      <div
        onClick={(e) => handleOpenPhoto("photo-primos", e)}
        className="absolute top-[12%] right-[6%] w-[42%] h-[40%] cursor-pointer group/photo rounded-lg transition-transform hover:scale-105"
        title="Los primos"
      >
        <div className="absolute inset-0 rounded-lg ring-2 ring-white/0 group-hover/photo:ring-white/60 transition-all duration-300" />
      </div>

      <div
        onClick={(e) => handleOpenPhoto("photo-cristo", e)}
        className="absolute bottom-[6%] left-[22%] w-[48%] h-[42%] cursor-pointer group/photo rounded-lg transition-transform hover:scale-105"
        title="Nuestro Cristo"
      >
        <div className="absolute inset-0 rounded-lg ring-2 ring-white/0 group-hover/photo:ring-white/60 transition-all duration-300" />
      </div>
    </DeskHotspot>
  );
}
