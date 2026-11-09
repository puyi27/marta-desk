"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useDeskStore } from "@/store/useDeskStore";

const skyBackgrounds: Record<string, string> = {
  day: "linear-gradient(180deg, #7ec0ee 0%, #b8e1fc 60%, #e2f0d9 100%)",
  sunset: "linear-gradient(180deg, #e65c40 0%, #f39c6b 40%, #fad4a5 75%, #3d5a45 100%)",
  night: "linear-gradient(180deg, #0b112c 0%, #172042 60%, #1e284a 100%)",
  auto: "linear-gradient(180deg, #7ec0ee 0%, #b8e1fc 60%, #e2f0d9 100%)",
};

const rainAmounts: Record<string, number> = {
  day: 0,
  sunset: 0,
  night: 35,
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
        { x: 340 },
        {
          x: -340,
          duration: 8,
          ease: "none",
          repeat: -1,
          repeatDelay: 9,
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const sky = skyBackgrounds[themeMode] ?? skyBackgrounds.auto;
  const rainCount = rainAmounts[themeMode] ?? 0;

  return (
    <div
      className="absolute overflow-hidden rounded-md shadow-2xl select-none"
      style={{
        left: "61%",
        top: "1.5%",
        width: "330px",
        height: "235px",
        border: "10px solid #f4ede2",
        boxShadow: "0 25px 40px -10px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.3)",
        zIndex: 15,
      }}
    >
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{ background: sky }}
      >
        {themeMode === "night" && (
          <div className="absolute inset-0">
            {Array.from({ length: 25 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  left: `${(i * 19) % 95}%`,
                  top: `${(i * 23) % 65}%`,
                  opacity: 0.3 + ((i % 5) * 0.15),
                }}
              />
            ))}
          </div>
        )}

        <div
          className="absolute bottom-0 left-0 right-0 h-16 rounded-t-3xl"
          style={{
            background: "linear-gradient(180deg, #2d5a27 0%, #1f401b 100%)",
          }}
        />

        <div className="absolute bottom-6 left-0 right-0 h-1 bg-neutral-600/70" />

        <div
          ref={trainRef}
          className="absolute bottom-6 flex items-center gap-1 drop-shadow-md z-10"
        >
          <div className="h-4 w-14 rounded-xs bg-red-600 flex items-center justify-between px-1 border border-red-700 shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-200 animate-ping" />
            <div className="w-8 h-1 rounded-2xs bg-white/80" />
          </div>
          <div className="h-3.5 w-10 rounded-2xs bg-neutral-100 border border-neutral-300" />
          <div className="h-3.5 w-10 rounded-2xs bg-neutral-100 border border-neutral-300" />
          <div className="h-3.5 w-10 rounded-2xs bg-neutral-100 border border-neutral-300" />
          <div className="h-4 w-10 rounded-xs bg-red-600 border border-red-700" />
        </div>

        {rainCount > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: rainCount }).map((_, i) => (
              <div
                key={i}
                className="absolute bg-sky-200/50"
                style={{
                  left: `${(i * 11) % 100}%`,
                  top: `${(i * 17) % 100}%`,
                  width: "1px",
                  height: `${14 + (i % 8)}px`,
                  transform: "rotate(18deg)",
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="absolute left-1/2 top-0 bottom-0 w-2.5 -translate-x-1/2 bg-[#f4ede2] shadow-sm z-20" />
      <div className="absolute top-1/2 left-0 right-0 h-2.5 -translate-y-1/2 bg-[#f4ede2] shadow-sm z-20" />

      <div
        className="absolute left-0 top-0 bottom-0 w-6 pointer-events-none z-30"
        style={{
          background: "linear-gradient(90deg, rgba(255,255,255,0.7) 0%, transparent 100%)",
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-6 pointer-events-none z-30"
        style={{
          background: "linear-gradient(270deg, rgba(255,255,255,0.7) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}
