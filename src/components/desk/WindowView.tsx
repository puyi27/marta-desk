"use client";

import { useMemo } from "react";
import { Particles, ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine, ISourceOptions } from "@tsparticles/engine";
import { useDeskStore } from "@/store/useDeskStore";

export default function WindowView() {
  const { themeMode } = useDeskStore();

  const isNight = themeMode === "night";
  const isSunset = themeMode === "sunset";

  const initEngine = async (engine: Engine) => {
    await loadSlim(engine);
  };

  const particleOptions = useMemo<ISourceOptions>(() => {
    if (isNight) {
      return {
        fpsLimit: 60,
        particles: {
          color: { value: "#93c5fd" },
          move: {
            direction: "bottom-left",
            enable: true,
            outModes: { default: "out" },
            speed: 14,
            straight: true,
          },
          number: { value: 45, density: { enable: true } },
          opacity: { value: 0.6 },
          shape: { type: "line" },
          size: { value: { min: 4, max: 12 } },
        },
      };
    }

    if (isSunset) {
      return {
        fpsLimit: 60,
        particles: {
          color: { value: "#fbbf24" },
          move: {
            direction: "top-right",
            enable: true,
            outModes: { default: "out" },
            speed: 0.8,
            random: true,
          },
          number: { value: 25, density: { enable: true } },
          opacity: { value: { min: 0.2, max: 0.7 } },
          shape: { type: "circle" },
          size: { value: { min: 1, max: 3 } },
        },
      };
    }

    return {
      fpsLimit: 60,
      particles: {
        color: { value: "#ffffff" },
        move: {
          direction: "none",
          enable: true,
          outModes: { default: "out" },
          speed: 0.5,
          random: true,
        },
        number: { value: 18, density: { enable: true } },
        opacity: { value: { min: 0.1, max: 0.5 } },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 2.5 } },
      },
    };
  }, [isNight, isSunset]);

  return (
    <div
      className="absolute top-[0%] left-[60%] w-[38%] h-[52%] pointer-events-none overflow-hidden"
      style={{ zIndex: 6 }}
    >
      <ParticlesProvider init={initEngine}>
        <Particles
          id="window-ambient-particles"
          options={particleOptions}
          className="absolute inset-0"
        />
      </ParticlesProvider>
    </div>
  );
}
