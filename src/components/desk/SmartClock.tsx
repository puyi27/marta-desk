"use client";

import { useState, useEffect } from "react";
import NumberFlow from "@number-flow/react";
import { Cloud, Sun, Sunset, Moon } from "lucide-react";
import { useDeskStore } from "@/store/useDeskStore";
import { useAudioStore } from "@/store/useAudioStore";

type ThemeMode = "auto" | "day" | "sunset" | "night";

const themeIcons: Record<ThemeMode, React.ReactNode> = {
  auto: <Cloud size={13} className="text-sky-300" />,
  day: <Sun size={13} className="text-amber-300" />,
  sunset: <Sunset size={13} className="text-orange-400" />,
  night: <Moon size={13} className="text-indigo-300" />,
};

const themeModes: ThemeMode[] = ["day", "sunset", "night", "auto"];

export default function SmartClock() {
  const [hours, setHours] = useState(12);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const { weatherData, themeMode, setThemeMode } = useDeskStore();
  const { playHoverTick } = useAudioStore();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setHours(now.getHours());
      setMinutes(now.getMinutes());
      setSeconds(now.getSeconds());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNextTheme = (e: React.MouseEvent) => {
    e.stopPropagation();
    playHoverTick();
    const nextIdx = (themeModes.indexOf(themeMode) + 1) % themeModes.length;
    setThemeMode(themeModes[nextIdx]);
  };

  const tempValue = weatherData ? weatherData.temp : 18;
  const conditionText = weatherData ? weatherData.condition : "Despejado";

  return (
    <div
      onClick={handleNextTheme}
      onMouseEnter={playHoverTick}
      className="absolute top-[43%] left-[45%] w-[16%] h-[14%] cursor-pointer group rounded-xl backdrop-blur-sm bg-black/75 border border-white/10 flex flex-col items-center justify-center p-2 shadow-inner select-none transition-all duration-300 hover:border-white/30"
      style={{ zIndex: 14 }}
      title="Reloj inteligente - Clic para alternar clima"
    >
      <div className="absolute -top-7 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105 z-20">
        <div className="backdrop-blur-xl bg-black/55 text-white/95 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-full px-3 py-1 text-xs font-medium tracking-wide flex items-center gap-1.5 whitespace-nowrap">
          <span>{tempValue}°C</span>
          <span className="text-[10px] text-white/60 capitalize">
            · {conditionText}
          </span>
        </div>
      </div>

      <div
        className="text-white text-3xl md:text-4xl font-bold tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.4)] flex items-center"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <NumberFlow value={hours} format={{ minimumIntegerDigits: 2 }} />
        <span className="mx-0.5 animate-pulse text-white/70">:</span>
        <NumberFlow value={minutes} format={{ minimumIntegerDigits: 2 }} />
        <span className="text-xs text-white/40 ml-1 font-normal hidden sm:inline">
          <NumberFlow value={seconds} format={{ minimumIntegerDigits: 2 }} />
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-white/80 font-mono mt-1">
        {themeIcons[themeMode]}
        <div className="flex items-center font-medium">
          <NumberFlow value={tempValue} />
          <span>°C</span>
        </div>
        <span className="text-[10px] text-white/60 capitalize hidden sm:inline">
          · {conditionText}
        </span>
      </div>
    </div>
  );
}
