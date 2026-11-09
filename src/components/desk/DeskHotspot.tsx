"use client";

import { motion } from "framer-motion";
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
  pulseColor?: string;
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
  pulseColor = "bg-amber-400",
}: DeskHotspotProps) {
  const { playHoverTick } = useAudioStore();

  return (
    <div
      onClick={onClick}
      onMouseEnter={playHoverTick}
      style={style}
      className={`absolute group cursor-pointer rounded-2xl select-none transition-all duration-300 ${className}`}
    >
      <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle,rgba(255,240,200,0.28)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 mix-blend-overlay transition-opacity duration-300 pointer-events-none" />

      {label && (
        <div
          className={`absolute ${positionClasses[badgePosition]} pointer-events-none z-20`}
        >
          <motion.div
            whileHover={{ y: -4, scale: 1.04 }}
            className="backdrop-blur-xl bg-black/55 text-white/95 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide flex items-center gap-2 whitespace-nowrap opacity-90 group-hover:opacity-100 group-hover:border-white/40 transition-all"
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pulseColor}`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${pulseColor}`}
              />
            </span>
            {icon && <span className="text-white/80">{icon}</span>}
            <span>{label}</span>
            {sublabel && (
              <span className="text-[10px] text-white/60 font-normal">
                · {sublabel}
              </span>
            )}
          </motion.div>
        </div>
      )}

      {children}
    </div>
  );
}
