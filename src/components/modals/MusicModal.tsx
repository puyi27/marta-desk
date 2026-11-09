"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  ExternalLink,
  BookOpen,
  Radio,
} from "lucide-react";
import {
  playlistTracks,
  SPOTIFY_PLAYLIST_URL,
  SPOTIFY_EMBED_URL,
} from "@/data/deskData";
import { useDeskStore } from "@/store/useDeskStore";

export default function MusicModal() {
  const {
    setActiveModal,
    currentTrackIndex,
    setCurrentTrackIndex,
    setIsPlayingAudio,
    isPlayingAudio,
  } = useDeskStore();

  const [activeTab, setActiveTab] = useState<"diary" | "spotify">("diary");
  const [direction, setDirection] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  const track = playlistTracks[currentTrackIndex];

  const goNext = () => {
    setDirection(1);
    setCurrentTrackIndex((currentTrackIndex + 1) % playlistTracks.length);
  };

  const goPrev = () => {
    setDirection(-1);
    setCurrentTrackIndex(
      (currentTrackIndex - 1 + playlistTracks.length) % playlistTracks.length
    );
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlayingAudio(true);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      setIsPlayingAudio(false);
    }
  }, [currentTrackIndex, setIsPlayingAudio]);

  const pageVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
      filter: "blur(4px)",
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -50 : 50,
      opacity: 0,
      filter: "blur(4px)",
    }),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center p-4 backdrop-blur-md"
      style={{ background: "rgba(10, 12, 18, 0.75)", zIndex: 60 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setActiveModal(null);
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 15 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="relative overflow-hidden rounded-3xl shadow-2xl flex flex-col border border-white/10"
        style={{
          width: "min(780px, 94vw)",
          height: "min(560px, 86vh)",
          background: "linear-gradient(145deg, #181c24 0%, #0e1117 100%)",
          boxShadow:
            "0 30px 60px -15px rgba(0,0,0,0.8), 0 0 40px rgba(29, 185, 84, 0.15)",
        }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center shadow-lg shadow-[#1DB954]/30">
              <span className="w-3.5 h-3.5 bg-black rounded-full" />
            </div>
            <div>
              <h2 className="text-white text-base font-semibold tracking-tight">
                Spotify · Para Marta
              </h2>
              <p className="text-xs text-neutral-400">
                Playlist oficial & dedicatorias
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setActiveTab("diary")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === "diary"
                    ? "bg-[#1DB954] text-black shadow-md font-semibold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <BookOpen size={13} />
                <span>Diario</span>
              </button>
              <button
                onClick={() => {
                  if (isPlayingAudio && audioRef.current) {
                    audioRef.current.pause();
                    setIsPlayingAudio(false);
                  }
                  setActiveTab("spotify");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === "spotify"
                    ? "bg-[#1DB954] text-black shadow-md font-semibold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Radio size={13} />
                <span>Spotify Player</span>
              </button>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-neutral-400 hover:text-white flex items-center justify-center transition-colors ml-2"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative">
          {activeTab === "spotify" ? (
            <div className="w-full h-full flex flex-col p-5 gap-3">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs text-neutral-400">
                  Reproduciendo directamente desde Spotify Web
                </span>
                <a
                  href={SPOTIFY_PLAYLIST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-[#1DB954] hover:underline font-medium"
                >
                  <ExternalLink size={13} />
                  <span>Abrir en Spotify App</span>
                </a>
              </div>
              <div className="flex-1 w-full rounded-2xl overflow-hidden border border-white/10 bg-black/50 shadow-inner">
                <iframe
                  src={SPOTIFY_EMBED_URL}
                  width="100%"
                  height="100%"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="w-full h-full border-none"
                />
              </div>
            </div>
          ) : (
            <div className="flex h-full">
              <div className="w-72 border-r border-white/10 p-6 flex flex-col justify-between bg-black/20">
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={{ rotate: isPlayingAudio ? 360 : 0 }}
                    transition={{
                      duration: 3,
                      repeat: isPlayingAudio ? Infinity : 0,
                      ease: "linear",
                    }}
                    className="relative rounded-full shadow-2xl flex items-center justify-center cursor-pointer border-2 border-neutral-700 group"
                    style={{
                      width: "140px",
                      height: "140px",
                      background:
                        "repeating-radial-gradient(circle at center, #111 0px, #111 2px, #1c1c1c 3px, #111 5px, #262626 6px, #111 8px)",
                    }}
                    onClick={togglePlay}
                  >
                    <div className="w-12 h-12 rounded-full bg-[#1DB954] flex items-center justify-center shadow-lg border-2 border-white/20">
                      <div className="w-3 h-3 rounded-full bg-neutral-950" />
                    </div>
                  </motion.div>

                  <div className="text-center mt-5">
                    <p className="text-white text-sm font-semibold truncate max-w-[200px]">
                      {track.title}
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {track.artist}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={goPrev}
                      className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={togglePlay}
                      className="w-12 h-12 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black flex items-center justify-center shadow-lg shadow-[#1DB954]/30 transition-transform"
                    >
                      {isPlayingAudio ? (
                        <Pause size={20} className="fill-black" />
                      ) : (
                        <Play size={20} className="fill-black ml-0.5" />
                      )}
                    </motion.button>
                    <button
                      onClick={goNext}
                      className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  <div className="flex justify-center gap-2">
                    {playlistTracks.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setDirection(i > currentTrackIndex ? 1 : -1);
                          setCurrentTrackIndex(i);
                        }}
                        className={`h-1.5 rounded-full transition-all ${
                          i === currentTrackIndex
                            ? "w-6 bg-[#1DB954]"
                            : "w-2 bg-white/20 hover:bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex-1 p-8 flex flex-col justify-between overflow-y-auto">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={track.id}
                    custom={direction}
                    variants={pageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                    className="flex-1 flex flex-col justify-between space-y-6"
                  >
                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-widest text-[#1DB954] font-semibold">
                        Canción #{currentTrackIndex + 1} de {playlistTracks.length}
                      </span>
                      <h3
                        className="text-2xl font-bold text-white mt-1 leading-tight"
                        style={{ fontFamily: "var(--font-playfair)" }}
                      >
                        {track.title}
                      </h3>
                      <p className="text-sm text-neutral-400 italic">
                        {track.artist}
                      </p>
                    </div>

                    <div
                      className="p-5 rounded-2xl bg-white/5 border border-white/10 shadow-inner"
                      style={{
                        borderLeft: "4px solid #1DB954",
                      }}
                    >
                      <p
                        className="text-amber-100/90 text-sm italic leading-relaxed"
                        style={{ fontFamily: "var(--font-playfair)" }}
                      >
                        "{track.lyric}"
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                        Por qué me recuerda a ti
                      </p>
                      <p className="text-neutral-300 text-sm leading-relaxed">
                        {track.explanation}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-white/10">
                      <a
                        href={SPOTIFY_PLAYLIST_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-[#1DB954] hover:text-[#1ed760] transition-colors font-medium"
                      >
                        <ExternalLink size={13} />
                        <span>Ver playlist en Spotify</span>
                      </a>
                      <span className="text-xs text-neutral-500 font-mono">
                        {currentTrackIndex + 1} / {playlistTracks.length}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        <audio ref={audioRef} src={track.audioSrc} preload="auto" />
      </motion.div>
    </motion.div>
  );
}
