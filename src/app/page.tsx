"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Sparkles, Sun, Sunset, Moon, Cloud, Heart } from "lucide-react";
import { useDeskStore } from "@/store/useDeskStore";

import WindowView from "@/components/desk/WindowView";
import SmartClock from "@/components/desk/SmartClock";
import RecordPlayer from "@/components/desk/RecordPlayer";
import PhilosophyBook from "@/components/desk/PhilosophyBook";
import Notepad from "@/components/desk/Notepad";
import DachshundPlush from "@/components/desk/DachshundPlush";
import Corkboard from "@/components/desk/Corkboard";
import GamerDrawer from "@/components/desk/GamerDrawer";

import MusicModal from "@/components/modals/MusicModal";
import OrtegaAgentModal from "@/components/modals/OrtegaAgentModal";
import NotepadModal from "@/components/modals/NotepadModal";
import PhotoZoomModal from "@/components/modals/PhotoZoomModal";
import MinigameModal from "@/components/modals/MinigameModal";

const themeOverlays: Record<string, string> = {
  day: "radial-gradient(ellipse at 70% 30%, rgba(255, 235, 180, 0.15) 0%, rgba(0,0,0,0) 70%)",
  sunset:
    "radial-gradient(ellipse at 70% 30%, rgba(255, 110, 40, 0.25) 0%, rgba(120, 30, 10, 0.18) 60%, rgba(0,0,0,0.4) 100%)",
  night:
    "radial-gradient(ellipse at 70% 30%, rgba(30, 40, 90, 0.45) 0%, rgba(10, 15, 35, 0.65) 100%)",
  auto: "transparent",
};

export default function DeskPage() {
  const { activeModal, themeMode, setWeatherData, setThemeMode, weatherData } =
    useDeskStore();
  const [mounted, setMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  const rotateY = useSpring(rawMouseX, { stiffness: 60, damping: 20 });
  const rotateX = useSpring(rawMouseY, { stiffness: 60, damping: 20 });

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const normalizedX = (e.clientX / innerWidth - 0.5) * 8;
      const normalizedY = -(e.clientY / innerHeight - 0.5) * 6;
      rawMouseX.set(normalizedX);
      rawMouseY.set(normalizedY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [rawMouseX, rawMouseY]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch("/api/weather");
        const data = await res.json();
        if (!data.error) {
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

  const overlayBg = themeOverlays[themeMode] ?? "transparent";

  return (
    <main
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden select-none bg-[#0d0e12]"
      style={{ perspective: "1400px" }}
    >
      <header className="absolute top-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl">
          <div className="flex items-center gap-1.5 text-xs text-amber-200/90 font-medium">
            <Heart size={14} className="fill-rose-500 text-rose-500 animate-pulse" />
            <span style={{ fontFamily: "var(--font-playfair)" }}>
              El Rincón de Marta
            </span>
          </div>

          <div className="w-px h-4 bg-white/15 mx-1" />

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
                  onClick={() => setThemeMode(item.mode)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-medium transition-all ${
                    isActive
                      ? "bg-white/20 text-white shadow-xs font-semibold"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  <Icon size={12} className={item.color} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {weatherData && (
            <>
              <div className="w-px h-4 bg-white/15 mx-1" />
              <div className="flex items-center gap-1.5 text-xs text-neutral-300 font-mono">
                <span className="text-[#1DB954] font-semibold">
                  {weatherData.temp}°C
                </span>
                <span className="text-[10px] text-neutral-400 capitalize hidden sm:inline">
                  {weatherData.condition}
                </span>
              </div>
            </>
          )}
        </div>
      </header>

      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full transition-transform duration-100 ease-out"
      >
        <div className="absolute inset-0">
          <Image
            src="/images/desk-bg.jpg"
            alt="Escritorio 3D de Marta"
            fill
            priority
            sizes="100vw"
            className="object-cover pointer-events-none"
          />
        </div>

        <div
          className="absolute inset-0 pointer-events-none transition-all duration-1000"
          style={{ background: overlayBg, zIndex: 2 }}
        />

        {themeMode === "night" && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 60%, rgba(255, 180, 100, 0.08) 0%, rgba(10, 15, 30, 0.4) 100%)",
              zIndex: 3,
            }}
          />
        )}

        <div
          className="absolute inset-0"
          style={{
            zIndex: 10,
            transformStyle: "preserve-3d",
          }}
        >
          <div style={{ transform: "translateZ(10px)" }}>
            <WindowView />
          </div>

          <div style={{ transform: "translateZ(15px)" }}>
            <Corkboard />
          </div>

          <div style={{ transform: "translateZ(25px)" }}>
            <SmartClock />
          </div>

          <div style={{ transform: "translateZ(30px)" }}>
            <RecordPlayer />
          </div>

          <div style={{ transform: "translateZ(32px)" }}>
            <PhilosophyBook />
          </div>

          <div style={{ transform: "translateZ(28px)" }}>
            <Notepad />
          </div>

          <div style={{ transform: "translateZ(35px)" }}>
            <DachshundPlush />
          </div>

          <div style={{ transform: "translateZ(20px)" }}>
            <GamerDrawer />
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-3 left-4 z-30 pointer-events-none hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[11px] text-neutral-400 font-mono">
        <Sparkles size={12} className="text-amber-400" />
        <span>Mueve el ratón para vista 3D · Toca cualquier objeto para interactuar</span>
      </div>

      <AnimatePresence mode="wait">
        {activeModal === "music" && <MusicModal key="music" />}
        {activeModal === "philosophy" && <OrtegaAgentModal key="philosophy" />}
        {activeModal === "notepad" && <NotepadModal key="notepad" />}
        {activeModal === "corkboard" && <PhotoZoomModal key="corkboard" />}
        {activeModal === "gamer" && <MinigameModal key="gamer" />}
      </AnimatePresence>
    </main>
  );
}
