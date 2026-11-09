"use client";

import dynamic from "next/dynamic";
import AmbientMixer from "@/components/desk/AmbientMixer";

const ThreeDeskScene = dynamic(
  () => import("@/components/desk/ThreeDeskScene"),
  { ssr: false }
);

export default function SceneCanvas() {
  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-black">
      <AmbientMixer />
      <ThreeDeskScene />
    </div>
  );
}
