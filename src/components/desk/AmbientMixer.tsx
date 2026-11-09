"use client";

import { useEffect } from "react";
import {
  Sun,
  Sunset,
  Moon,
  Cloud,
  CloudRain,
  Disc3,
  Heart,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useDeskStore } from "@/store/useDeskStore";
import { useAudioStore } from "@/store/useAudioStore";

export default function AmbientMixer() {
  const { themeMode, setThemeMode, weatherData, setWeatherData } =
    useDeskStore();
  const {
    initAudio,
    rainVolume,
    vinylVolume,
    setRainVolume,
    setVinylVolume,
    isMuted,
    toggleMute,
    startRain,
    stopRain,
    playHoverTick,
  } = useAudioStore();

  useEffect(() => {
    initAudio();
  }, [initAudio]);

  useEffect(() => {
    if (themeMode === "night") {
      startRain();
    } else {
      stopRain();
    }
  }, [themeMode, startRain, stopRain]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch("/api/weather");
        if (!res.ok) return;
        const data = await res.json();
        if (data && !data.error) {
          setWeatherData({ temp: data.temp, condition: data.condition });
          if (themeMode === "auto") {
            const hour = new Date().getHours();
            if (hour >= 7 && hour < 18) setThemeMode("day");
            else if (hour >= 18 && hour < 21) setThemeMode("sunset");
            else setThemeMode("night");
          }
        }
      } catch {}
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 300000);
    return () => clearInterval(interval);
  }, [setWeatherData, setThemeMode, themeMode]);

  return (
    <header className="absolute top-4 left-1/2 -translate-x-1/2 z-40 flex items-center pointer-events-auto">
      <div className="backdrop-blur-xl bg-black/45 border border-white/15 rounded-full px-6 py-2.5 text-white flex items-center gap-6 shadow-2xl transition-all">
        <div className="flex items-center gap-2 text-xs text-amber-200 font-medium">
          <Heart size={14} className="fill-rose-500 text-rose-500 animate-pulse" />
          <span
            className="tracking-wide hidden sm:inline"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            El Rincón de Marta
          </span>
        </div>

        <div className="w-px h-4 bg-white/20" />

        <div className="flex items-center gap-1">
          {(
            [
              { mode: "day", label: "Día", icon: Sun, color: "text-amber-400" },
              {
                mode: "sunset",
                label: "Tarde",
                icon: Sunset,
                color: "text-orange-400",
              },
              {
                mode: "night",
                label: "Noche",
                icon: Moon,
                color: "text-indigo-300",
              },
              {
                mode: "auto",
                label: "Auto",
                icon: Cloud,
                color: "text-sky-300",
              },
            ] as const
          ).map((item) => {
            const Icon = item.icon;
            const isActive = themeMode === item.mode;
            return (
              <button
                key={item.mode}
                onClick={() => {
                  playHoverTick();
                  setThemeMode(item.mode);
                }}
                onMouseEnter={playHoverTick}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? "bg-white/20 text-white shadow-inner font-semibold"
                    : "text-neutral-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={12} className={item.color} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="w-px h-4 bg-white/20 hidden md:block" />

        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 group">
            <CloudRain
              size={14}
              className={`${
                rainVolume > 0 && !isMuted ? "text-sky-400" : "text-neutral-400"
              } transition-colors`}
            />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : rainVolume}
              onChange={(e) => setRainVolume(parseFloat(e.target.value))}
              aria-label="Volumen lluvia"
              className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-sky-400 hover:bg-white/30"
            />
          </div>

          <div className="flex items-center gap-2 group">
            <Disc3
              size={14}
              className={`${
                vinylVolume > 0 && !isMuted
                  ? "text-emerald-400 animate-spin"
                  : "text-neutral-400"
              } transition-colors`}
              style={{ animationDuration: "4s" }}
            />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : vinylVolume}
              onChange={(e) => setVinylVolume(parseFloat(e.target.value))}
              aria-label="Volumen vinilo"
              className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-400 hover:bg-white/30"
            />
          </div>

          <button
            onClick={() => {
              playHoverTick();
              toggleMute();
            }}
            onMouseEnter={playHoverTick}
            className="p-1 rounded-full hover:bg-white/10 text-neutral-300 hover:text-white transition-colors"
            aria-label="Silenciar sonido"
          >
            {isMuted ? (
              <VolumeX size={15} className="text-rose-400" />
            ) : (
              <Volume2 size={15} />
            )}
          </button>
        </div>

        {weatherData && (
          <>
            <div className="w-px h-4 bg-white/20 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-200 font-mono">
              <span className="text-[#1DB954] font-semibold">
                {weatherData.temp}°C
              </span>
              <span className="text-[11px] text-neutral-300 capitalize">
                {weatherData.condition}
              </span>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

