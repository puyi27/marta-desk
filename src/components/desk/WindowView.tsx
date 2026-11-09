"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useDeskStore } from "@/store/useDeskStore";

const skyBackgrounds: Record<string, string> = {
  day: "linear-gradient(180deg, #6ba5d8 0%, #a2cff0 45%, #dceefc 80%, #9cb89c 100%)",
  sunset:
    "linear-gradient(180deg, #c74d32 0%, #e87b4b 35%, #f6b579 65%, #46283b 100%)",
  night:
    "linear-gradient(180deg, #090e1d 0%, #111a33 50%, #182240 85%, #0f1526 100%)",
  auto: "linear-gradient(180deg, #6ba5d8 0%, #a2cff0 45%, #dceefc 80%, #9cb89c 100%)",
};

const rainAmounts: Record<string, number> = {
  day: 0,
  sunset: 0,
  night: 40,
  auto: 0,
};

export default function WindowView() {
  const trainRef = useRef<HTMLDivElement>(null);
  const { themeMode } = useDeskStore();

  useEffect(() => {
    if (!trainRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        trainRef.current,
        { x: 420 },
        {
          x: -420,
          duration: 9,
          ease: "none",
          repeat: -1,
          repeatDelay: 8,
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const sky = skyBackgrounds[themeMode] ?? skyBackgrounds.auto;
  const rainCount = rainAmounts[themeMode] ?? 0;

  return (
    <div
      className="absolute overflow-hidden rounded-xl select-none"
      style={{
        right: "8%",
        top: "6%",
        width: "380px",
        height: "270px",
        border: "12px solid #36281e",
        boxShadow:
          "0 25px 50px -12px rgba(0,0,0,0.7), inset 0 0 30px rgba(0,0,0,0.6), 0 0 0 3px #1f1610",
        zIndex: 12,
      }}
    >
      <div
        className="absolute inset-0 transition-all duration-1000 overflow-hidden"
        style={{ background: sky }}
      >
        {themeMode === "night" && (
          <div className="absolute inset-0">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  left: `${(i * 17) % 96}%`,
                  top: `${(i * 23) % 65}%`,
                  opacity: 0.2 + ((i % 5) * 0.16),
                }}
              />
            ))}
          </div>
        )}

        {themeMode === "day" && (
          <div
            className="absolute -top-6 -right-6 w-32 h-32 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,230,0.9) 0%, rgba(255,240,180,0.4) 40%, transparent 75%)",
            }}
          />
        )}

        {themeMode === "sunset" && (
          <div
            className="absolute bottom-16 right-16 w-28 h-28 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(255,200,100,0.95) 0%, rgba(255,120,40,0.5) 45%, transparent 75%)",
            }}
          />
        )}

        <div
          className="absolute bottom-0 left-0 right-0 h-20 rounded-t-[40px]"
          style={{
            background:
              themeMode === "night"
                ? "linear-gradient(180deg, #15221b 0%, #0c1410 100%)"
                : "linear-gradient(180deg, #32582d 0%, #1e3b1a 100%)",
          }}
        />

        <div
          className="absolute bottom-9 left-0 right-0 h-1"
          style={{
            background:
              themeMode === "night"
                ? "rgba(100, 110, 130, 0.4)"
                : "rgba(80, 90, 100, 0.7)",
          }}
        />

        <div
          ref={trainRef}
          className="absolute bottom-9 flex items-center gap-1 drop-shadow-lg z-10"
        >
          <div className="h-4 w-16 rounded-xs bg-red-600 flex items-center justify-between px-1.5 border border-red-700 shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-200 animate-ping" />
            <div className="w-10 h-1 rounded-2xs bg-white/90" />
          </div>
          <div className="h-3.5 w-12 rounded-2xs bg-neutral-200 border border-neutral-300 flex items-center justify-around px-1">
            <div className="w-2 h-1 bg-sky-900 rounded-2xs" />
            <div className="w-2 h-1 bg-sky-900 rounded-2xs" />
            <div className="w-2 h-1 bg-sky-900 rounded-2xs" />
          </div>
          <div className="h-3.5 w-12 rounded-2xs bg-neutral-200 border border-neutral-300 flex items-center justify-around px-1">
            <div className="w-2 h-1 bg-sky-900 rounded-2xs" />
            <div className="w-2 h-1 bg-sky-900 rounded-2xs" />
            <div className="w-2 h-1 bg-sky-900 rounded-2xs" />
          </div>
          <div className="h-4 w-12 rounded-xs bg-red-600 border border-red-700" />
        </div>

        {rainCount > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: rainCount }).map((_, i) => (
              <div
                key={i}
                className="absolute bg-sky-200/50"
                style={{
                  left: `${(i * 9) % 100}%`,
                  top: `${(i * 13) % 100}%`,
                  width: "1.5px",
                  height: `${14 + (i % 10)}px`,
                  transform: "rotate(20deg)",
                }}
              />
            ))}
          </div>
        )}

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 40%, rgba(255,255,255,0.05) 60%, transparent 100%)",
          }}
        />
      </div>

      <div className="absolute left-1/2 top-0 bottom-0 w-3 -translate-x-1/2 bg-[#36281e] shadow-md z-20" />
      <div className="absolute top-1/2 left-0 right-0 h-3 -translate-y-1/2 bg-[#36281e] shadow-md z-20" />

      <div
        className="absolute -bottom-2 left-0 right-0 h-4 bg-[#261b14] border-t border-[#4a3629] shadow-lg z-30"
      />
    </div>
  );
}
