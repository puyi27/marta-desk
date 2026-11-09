"use client";

import Tilt from "react-parallax-tilt";
import { useDeskStore } from "@/store/useDeskStore";

import WindowView from "@/components/desk/WindowView";
import Corkboard from "@/components/desk/Corkboard";
import RecordPlayer from "@/components/desk/RecordPlayer";
import SmartClock from "@/components/desk/SmartClock";
import Notepad from "@/components/desk/Notepad";
import PhilosophyBook from "@/components/desk/PhilosophyBook";
import DachshundPlush from "@/components/desk/DachshundPlush";
import GamerDrawer from "@/components/desk/GamerDrawer";
import AmbientMixer from "@/components/desk/AmbientMixer";

export default function SceneCanvas() {
  const { themeMode } = useDeskStore();

  const isDay = themeMode === "day";
  const isSunset = themeMode === "sunset";
  const isNight = themeMode === "night";

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-black">
      <AmbientMixer />

      <Tilt
        tiltMaxAngleX={1.5}
        tiltMaxAngleY={1.5}
        perspective={1200}
        scale={1.02}
        transitionSpeed={2000}
        tiltReverse={true}
        className="relative w-full h-full"
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: "url('/images/desk-bg.jpg')" }}
        />

        <div
          className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ${
            isDay ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "radial-gradient(ellipse at 80% 20%, rgba(255,245,215,0.08) 0%, transparent 60%)",
          }}
        />

        <div
          className={`pointer-events-none absolute inset-0 bg-amber-500/15 mix-blend-multiply transition-opacity duration-1000 ${
            isSunset ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          className={`pointer-events-none absolute inset-0 bg-slate-950/65 mix-blend-multiply transition-opacity duration-1000 ${
            isNight ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ${
            isNight ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "radial-gradient(circle at 38% 18%, rgba(255,190,110,0.35) 0%, rgba(10,15,30,0.85) 70%)",
            mixBlendMode: "screen",
          }}
        />

        <WindowView />
        <Corkboard />
        <RecordPlayer />
        <SmartClock />
        <Notepad />
        <PhilosophyBook />
        <DachshundPlush />
        <GamerDrawer />
      </Tilt>
    </div>
  );
}
