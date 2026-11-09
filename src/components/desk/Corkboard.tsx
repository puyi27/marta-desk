"use client";

import { useState } from "react";
import Image from "next/image";
import {
  DndContext,
  useDraggable,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import { corkboardPhotos, CorkboardPhoto } from "@/data/deskData";
import { useDeskStore } from "@/store/useDeskStore";
import { useAudioStore } from "@/store/useAudioStore";
import DeskHotspot from "@/components/desk/DeskHotspot";

interface DraggablePolaroidProps {
  photo: CorkboardPhoto;
  initialX: number;
  initialY: number;
  onOpen: (id: string) => void;
}

function DraggablePolaroid({
  photo,
  initialX,
  initialY,
  onOpen,
}: DraggablePolaroidProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: photo.id,
    });

  const x = initialX + (transform?.x ?? 0);
  const y = initialY + (transform?.y ?? 0);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        e.stopPropagation();
        onOpen(photo.id);
      }}
      style={{
        transform: `translate3d(${x}px, ${y}px, 0) rotate(${
          isDragging ? 0 : photo.rotation
        }deg) scale(${isDragging ? 1.08 : 1})`,
        zIndex: isDragging ? 50 : 10,
        touchAction: "none",
      }}
      className="absolute top-0 left-0 w-[46%] bg-white p-1 pb-3 rounded-xs shadow-md hover:shadow-xl transition-shadow cursor-grab active:cursor-grabbing select-none"
    >
      <div className="relative w-full aspect-square rounded-2xs overflow-hidden bg-neutral-100 pointer-events-none">
        <Image
          src={photo.imageSrc}
          alt={photo.title}
          fill
          sizes="120px"
          className="object-cover"
        />
      </div>
      <p
        className="text-center text-[8.5px] text-neutral-700 font-medium mt-1 truncate pointer-events-none px-0.5"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {photo.title}
      </p>
    </div>
  );
}

export default function Corkboard() {
  const { setActiveModal, setSelectedPhotoId } = useDeskStore();
  const { playBookOpen } = useAudioStore();

  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({
    "photo-dora": { x: 8, y: 15 },
    "photo-primos": { x: 95, y: 12 },
    "photo-cristo": { x: 50, y: 130 },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const id = String(active.id);
    setPositions((prev) => ({
      ...prev,
      [id]: {
        x: (prev[id]?.x ?? 0) + delta.x,
        y: (prev[id]?.y ?? 0) + delta.y,
      },
    }));
  };

  const handleOpenPhoto = (id: string) => {
    playBookOpen();
    setSelectedPhotoId(id);
    setActiveModal("corkboard");
  };

  return (
    <DeskHotspot
      label="Corcho de Recuerdos"
      sublabel="3 fotos"
      badgePosition="top-right"
      className="top-[4%] left-[2%] w-[20%] h-[50%]"
      style={{ zIndex: 15 }}
      onClick={() => handleOpenPhoto(corkboardPhotos[0]?.id ?? "")}
    >
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="relative w-full h-full p-2">
          {corkboardPhotos.map((photo) => (
            <DraggablePolaroid
              key={photo.id}
              photo={photo}
              initialX={positions[photo.id]?.x ?? 0}
              initialY={positions[photo.id]?.y ?? 0}
              onOpen={handleOpenPhoto}
            />
          ))}
        </div>
      </DndContext>
    </DeskHotspot>
  );
}
