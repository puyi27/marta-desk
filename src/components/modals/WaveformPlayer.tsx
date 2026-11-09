"use client";

import { useState } from "react";
import WavesurferPlayer from "@wavesurfer/react";
import { Play, Pause } from "lucide-react";

interface WaveformPlayerProps {
  url: string;
}

export default function WaveformPlayer({ url }: WaveformPlayerProps) {
  const [wavesurfer, setWavesurfer] = useState<{
    playPause: () => void;
  } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const onReady = (ws: { playPause: () => void }) => {
    setWavesurfer(ws);
    setIsPlaying(false);
  };

  const onPlayPause = () => {
    if (wavesurfer) {
      wavesurfer.playPause();
    }
  };

  return (
    <div className="w-full flex items-center gap-3 bg-black/40 p-2.5 rounded-xl border border-white/10">
      <button
        onClick={onPlayPause}
        className="w-9 h-9 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center shrink-0 transition-transform active:scale-95"
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
      </button>
      <div className="flex-1 overflow-hidden">
        <WavesurferPlayer
          height={32}
          waveColor="#71717a"
          progressColor="#10b981"
          url={url}
          onReady={onReady}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          barWidth={2}
          barGap={2}
          barRadius={2}
        />
      </div>
    </div>
  );
}

