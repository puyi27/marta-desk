"use client";

import { useAudioStore } from "@/store/useAudioStore";

interface DeskHotspotProps {
  className?: string;
  style?: React.CSSProperties;
  label?: string;
  sublabel?: string;
  icon?: React.ReactNode;
  badgePosition?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "center"
    | "top-center"
    | "bottom-center";
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
}

const positionClasses = {
  "top-left": "top-2 left-2",
  "top-right": "top-2 right-2",
  "bottom-left": "bottom-2 left-2",
  "bottom-right": "bottom-2 right-2",
  center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  "top-center": "top-2 left-1/2 -translate-x-1/2",
  "bottom-center": "bottom-2 left-1/2 -translate-x-1/2",
};

export default function DeskHotspot({
  className = "",
  style,
  label,
  sublabel,
  icon,
  badgePosition = "top-right",
  onClick,
  children,
}: DeskHotspotProps) {
  const { playHoverTick } = useAudioStore();

  return (
    <div
      onClick={onClick}
      onMouseEnter={playHoverTick}
      style={style}
      className={`absolute group cursor-pointer rounded-2xl transition-all duration-300 select-none ${className}`}
    >
      <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle,rgba(255,255,255,0.22)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {label && (
        <div
          className={`absolute ${positionClasses[badgePosition]} pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105`}
        >
          <div className="backdrop-blur-md bg-white/90 text-zinc-900 px-3 py-1.5 rounded-full text-xs font-semibold shadow-xl border border-white/50 flex items-center gap-1.5 whitespace-nowrap">
            {icon && <span className="text-zinc-700">{icon}</span>}
            <span>{label}</span>
            {sublabel && (
              <span className="text-[10px] text-zinc-500 font-normal">
                {sublabel}
              </span>
            )}
          </div>
        </div>
      )}

      {children}
    </div>
  );
}

