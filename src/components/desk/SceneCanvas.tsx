"use client";

import Image from "next/image";
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

  const filterClass = isDay
    ? "brightness-105 contrast-100 saturate-105"
    : isSunset
    ? "brightness-95 contrast-105 saturate-125 sepia-[.15]"
    : isNight
    ? "brightness-[0.45] contrast-125 saturate-90 hue-rotate-[-10deg]"
    : "brightness-100";

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-zinc-950">
      <AmbientMixer />

      <div
        className="pointer-events-none fixed inset-0 z-30 opacity-[0.035] shadow-[inset_0_0_120px_rgba(0,0,0,0.55)]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      />

      <Tilt
        tiltMaxAngleX={1.2}
        tiltMaxAngleY={1.2}
        scale={1.03}
        transitionSpeed={2500}
        tiltReverse={true}
        className="relative w-full h-full"
      >
        <div className="relative w-full h-full">
          <Image
            src="/images/desk-bg.jpg"
            alt="Marta's Lofi Desk"
            fill
            priority
            sizes="100vw"
            className={`object-cover object-center transition-all duration-1000 ${filterClass}`}
          />

          <div
            className={`pointer-events-none absolute inset-0 bg-gradient-to-tr from-amber-900/30 via-orange-500/15 to-purple-900/30 mix-blend-multiply transition-opacity duration-1000 ${
              isSunset ? "opacity-100" : "opacity-0"
            }`}
          />

          <div
            className={`pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_38%_28%,rgba(255,200,120,0.45)_0%,rgba(255,160,60,0.15)_35%,rgba(5,8,20,0.88)_75%)] mix-blend-hard-light transition-opacity duration-1000 ${
              isNight ? "opacity-100" : "opacity-0"
            }`}
          />

          <WindowView />
          <Corkboard />
          <RecordPlayer />
          <SmartClock />
          <Notepad />
          <PhilosophyBook />
          <DachshundPlush />
          <GamerDrawer />
        </div>
      </Tilt>
    </div>
  );
}
