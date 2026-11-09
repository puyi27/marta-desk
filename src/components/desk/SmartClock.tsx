"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cloud, Sun, Sunset, Moon } from "lucide-react";
import { useDeskStore } from "@/store/useDeskStore";

type ThemeMode = "auto" | "day" | "sunset" | "night";

const themeIcons: Record<ThemeMode, React.ReactNode> = {
  auto: <Cloud size={14} className="text-sky-300" />,
  day: <Sun size={14} className="text-amber-300" />,
  sunset: <Sunset size={14} className="text-orange-400" />,
  night: <Moon size={14} className="text-indigo-300" />,
};

const themeModes: ThemeMode[] = ["auto", "day", "sunset", "night"];

export default function SmartClock() {
  const [time, setTime] = useState("");
  const { weatherData, themeMode, setThemeMode } = useDeskStore();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNextTheme = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextIdx = (themeModes.indexOf(themeMode) + 1) % themeModes.length;
    setThemeMode(themeModes[nextIdx]);
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={handleNextTheme}
      className="absolute cursor-pointer select-none group"
      style={{
        left: "44.5%",
        top: "43%",
        width: "185px",
        height: "82px",
        zIndex: 25,
      }}
      title="Reloj inteligente - Clic para cambiar atmósfera"
    >
      <div className="relative w-full h-full">
        <div className="absolute -bottom-3 left-3 right-3 h-4 bg-black/45 rounded-full blur-md" />

        <div
          className="relative w-full h-full rounded-2xl flex flex-col justify-between p-2.5 shadow-2xl transition-all duration-300 group-hover:ring-2 group-hover:ring-sky-400/40"
          style={{
            background: "linear-gradient(180deg, #1f232d 0%, #12141a 70%, #0a0b0e 100%)",
            border: "2px solid rgba(255, 255, 255, 0.15)",
            boxShadow: "0 15px 25px -5px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.25), inset 0 -2px 4px rgba(0,0,0,0.5)",
          }}
        >
          <div className="flex items-center justify-between w-full px-1">
            <span
              className="text-[10px] uppercase font-bold tracking-wider text-sky-400/80"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Sevilla
            </span>
            <button
              onClick={handleNextTheme}
              className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              {themeIcons[themeMode]}
            </button>
          </div>

          <div className="flex items-center justify-center -my-1">
            <span
              className="text-white font-bold tracking-wider drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "1.9rem",
                letterSpacing: "0.06em",
              }}
            >
              {time || "12:00"}
            </span>
          </div>

          <div className="flex items-center justify-between px-1 text-[10px] text-neutral-300 font-mono">
            <span>{weatherData ? `${weatherData.temp}°C, ${weatherData.condition}` : "18°C, despejado"}</span>
            <span className="text-[9px] text-neutral-400 capitalize">{themeMode}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
