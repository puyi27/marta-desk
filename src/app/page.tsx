"use client";

import { useEffect, useState, useRef } from "react";
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

const roomWallTones: Record<string, string> = {
  day: "linear-gradient(180deg, #3d4554 0%, #2f3644 60%, #222733 100%)",
  sunset: "linear-gradient(180deg, #4d333b 0%, #3d242a 60%, #29151c 100%)",
  night: "linear-gradient(180deg, #181d2c 0%, #111420 60%, #0c0d15 100%)",
  auto: "linear-gradient(180deg, #3d4554 0%, #2f3644 60%, #222733 100%)",
};

const roomLighting: Record<string, string> = {
  day: "radial-gradient(ellipse at 80% 25%, rgba(255, 240, 200, 0.22) 0%, rgba(255, 230, 180, 0.08) 45%, transparent 75%)",
  sunset:
    "radial-gradient(ellipse at 80% 25%, rgba(255, 120, 50, 0.35) 0%, rgba(200, 70, 30, 0.15) 50%, rgba(30, 10, 20, 0.4) 100%)",
  night:
    "radial-gradient(ellipse at 50% 65%, rgba(255, 180, 90, 0.16) 0%, rgba(15, 20, 45, 0.5) 70%, rgba(8, 10, 25, 0.8) 100%)",
  auto: "transparent",
};

export default function DeskPage() {
  const { activeModal, themeMode, setWeatherData, setThemeMode, weatherData } =
    useDeskStore();
  const [mounted, setMounted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  const rotateY = useSpring(rawMouseX, { stiffness: 50, damping: 20 });
  const rotateX = useSpring(rawMouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const normalizedX = (e.clientX / innerWidth - 0.5) * 6;
      const normalizedY = -(e.clientY / innerHeight - 0.5) * 5;
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

  const currentWallTone = roomWallTones[themeMode] ?? roomWallTones.auto;
  const currentLight = roomLighting[themeMode] ?? roomLighting.auto;

  return (
    <main
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden select-none bg-[#090b10]"
      style={{ perspective: "1500px" }}
    >
      <header className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3">
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl">
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
        <div
          className="absolute inset-0 transition-colors duration-1000"
          style={{
            background: currentWallTone,
          }}
        >
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 40px, transparent 40px, transparent 80px)",
            }}
          />

          <div
            className="absolute top-0 bottom-0 left-0 w-64 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
            }}
          />

          <div
            className="absolute top-0 bottom-0 right-0 w-64 pointer-events-none"
            style={{
              background:
                "linear-gradient(270deg, rgba(0,0,0,0.4) 0%, transparent 100%)",
            }}
          />
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-44 overflow-hidden pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, #1b130b 0%, #120c06 60%, #0a0603 100%)",
            borderTop: "3px solid #2e1d0f",
          }}
        >
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(0,0,0,0.5) 0px, rgba(0,0,0,0.5) 120px, rgba(255,255,255,0.05) 121px, transparent 122px)",
            }}
          />
        </div>

        <div
          className="absolute left-0 right-0"
          style={{
            top: "47%",
            height: "53%",
            background:
              "linear-gradient(180deg, #5c3b1e 0%, #462c15 35%, #35210f 70%, #281809 100%)",
            boxShadow:
              "0 -8px 25px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.2)",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 2px, transparent 2px, transparent 16px)",
            }}
          />

          <div
            className="absolute top-0 left-0 right-0 h-2"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 100%)",
            }}
          />

          <div
            className="absolute left-[30%] right-[30%] top-6 bottom-16 rounded-2xl border border-white/5 shadow-2xl pointer-events-none"
            style={{
              background: "linear-gradient(180deg, #1d212b 0%, #14171f 100%)",
              boxShadow:
                "inset 0 2px 6px rgba(0,0,0,0.7), 0 8px 18px rgba(0,0,0,0.4)",
            }}
          >
            <div className="absolute top-2 left-4 right-4 h-px bg-white/10" />
            <div className="absolute bottom-2 left-4 right-4 h-px bg-white/5" />
          </div>

          <div
            className="absolute top-0 bottom-0 left-12 w-6 rounded-b-md shadow-2xl pointer-events-none"
            style={{
              background: "linear-gradient(90deg, #35210f 0%, #201308 100%)",
            }}
          />
          <div
            className="absolute top-0 bottom-0 right-12 w-6 rounded-b-md shadow-2xl pointer-events-none"
            style={{
              background: "linear-gradient(270deg, #35210f 0%, #201308 100%)",
            }}
          />

          <div
            className="absolute bottom-0 left-0 right-0 h-8"
            style={{
              background:
                "linear-gradient(180deg, #1f1207 0%, #150b04 60%, #0d0702 100%)",
              borderTop: "2px solid #5a3717",
              boxShadow: "0 10px 25px rgba(0,0,0,0.8)",
            }}
          />
        </div>

        <div
          className="absolute inset-0 pointer-events-none transition-all duration-1000"
          style={{
            background: currentLight,
            zIndex: 3,
          }}
        />

        <div
          className="absolute right-[8%] top-[38%] pointer-events-none"
          style={{ zIndex: 14 }}
        >
          <div
            className="w-16 h-3 rounded-full bg-neutral-800 shadow-md"
            style={{
              background: "linear-gradient(90deg, #2a2d36 0%, #16181f 100%)",
              border: "1px solid #3d4250",
            }}
          />
          <div
            className="w-2 h-20 -mt-1 ml-7 bg-neutral-700 shadow-sm"
            style={{
              background: "linear-gradient(90deg, #3e4350 0%, #252831 100%)",
            }}
          />
          <div
            className="w-14 h-8 -mt-2 ml-1 rounded-t-2xl shadow-lg border-t border-amber-300/40"
            style={{
              background: "linear-gradient(180deg, #c58f44 0%, #875c20 100%)",
            }}
          >
            <div
              className="w-full h-full rounded-t-2xl opacity-80"
              style={{
                boxShadow: "0 10px 30px rgba(255, 200, 100, 0.4)",
              }}
            />
          </div>
        </div>

        <div
          className="absolute inset-0"
          style={{
            zIndex: 10,
            transformStyle: "preserve-3d",
          }}
        >
          <div style={{ transform: "translateZ(8px)" }}>
            <WindowView />
          </div>

          <div style={{ transform: "translateZ(12px)" }}>
            <Corkboard />
          </div>

          <div style={{ transform: "translateZ(26px)" }}>
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

          <div style={{ transform: "translateZ(36px)" }}>
            <DachshundPlush />
          </div>

          <div style={{ transform: "translateZ(22px)" }}>
            <GamerDrawer />
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-3 left-4 z-30 pointer-events-none hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 text-[11px] text-neutral-300 font-mono shadow-xl">
        <Sparkles size={12} className="text-amber-400" />
        <span>Mueve el ratón para perspectiva 3D · Toca cualquier objeto para interactuar</span>
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
