"use client";

import { useState, useEffect } from "react";
import NumberFlow from "@number-flow/react";
import { Cloud, Sun, Sunset, Moon } from "lucide-react";
import { useDeskStore } from "@/store/useDeskStore";
import { useAudioStore } from "@/store/useAudioStore";

type ThemeMode = "auto" | "day" | "sunset" | "night";

const themeIcons: Record<ThemeMode, React.ReactNode> = {
  auto: <Cloud size={14} className="text-sky-300" />,
  day: <Sun size={14} className="text-amber-300" />,
  sunset: <Sunset size={14} className="text-orange-400" />,
  night: <Moon size={14} className="text-indigo-300" />,
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

  const tempValue = weatherData ? weatherData.temp : 6;
  const conditionText = weatherData ? weatherData.condition : "despejado";

  return (
    <div
      onClick={handleNextTheme}
      onMouseEnter={playHoverTick}
      className="absolute top-[44%] left-[44%] w-[16%] h-[14%] cursor-pointer group rounded-2xl bg-neutral-950/80 backdrop-blur-md border border-white/15 shadow-2xl transition-all duration-300 hover:border-white/30 hover:scale-[1.02] flex flex-col justify-center items-center p-3 select-none"
      style={{ zIndex: 14 }}
      title="Reloj inteligente - Clic para alternar ambiente"
    >
      <div className="absolute -top-7 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105">
        <div className="backdrop-blur-md bg-white/90 text-zinc-900 px-3 py-1 rounded-full text-xs font-semibold shadow-xl border border-white/50 flex items-center gap-1.5 whitespace-nowrap">
          <span>{tempValue}°C</span>
          <span className="text-[10px] text-zinc-600 capitalize">
            {conditionText}
          </span>
        </div>
      </div>

      <div
        className="text-white text-3xl md:text-4xl font-bold tracking-tight drop-shadow-md flex items-center"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <NumberFlow value={hours} format={{ minimumIntegerDigits: 2 }} />
        <span className="mx-0.5 animate-pulse text-neutral-400">:</span>
        <NumberFlow value={minutes} format={{ minimumIntegerDigits: 2 }} />
        <span className="mx-0.5 text-xs text-neutral-500 font-normal">:</span>
        <span className="text-sm text-neutral-400 font-normal">
          <NumberFlow value={seconds} format={{ minimumIntegerDigits: 2 }} />
        </span>
      </div>

      <div className="flex items-center gap-2 text-xs text-neutral-300 font-mono mt-1">
        {themeIcons[themeMode]}
        <div className="flex items-center font-medium">
          <NumberFlow value={tempValue} />
          <span>°C</span>
        </div>
        <span className="text-[10px] text-neutral-400 capitalize hidden sm:inline">
          {conditionText}
        </span>
      </div>
    </div>
  );
}
