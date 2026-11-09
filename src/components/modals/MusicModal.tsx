"use client";

import { useState, useRef, forwardRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Radio,
  Disc3,
} from "lucide-react";
import {
  playlistTracks,
  SPOTIFY_PLAYLIST_URL,
  SPOTIFY_EMBED_URL,
} from "@/data/deskData";
import { useDeskStore } from "@/store/useDeskStore";
import { useAudioStore } from "@/store/useAudioStore";
import WaveformPlayer from "@/components/modals/WaveformPlayer";

const FlipBook = dynamic(() => import("react-pageflip"), {
  ssr: false,
}) as any;

interface BookPageProps {
  children: React.ReactNode;
  className?: string;
}

const BookPage = forwardRef<HTMLDivElement, BookPageProps>(
  ({ children, className = "" }, ref) => {
    return (
      <div
        ref={ref}
        className={`page relative w-full h-full overflow-hidden select-none shadow-md ${className}`}
      >
        {children}
      </div>
    );
  }
);
BookPage.displayName = "BookPage";

export default function MusicModal() {
  const { setActiveModal } = useDeskStore();
  const { playBookOpen, stopVinyl } = useAudioStore();

  const [activeTab, setActiveTab] = useState<"diary" | "spotify">("diary");
  const [currentPage, setCurrentPage] = useState(0);
  const [mounted, setMounted] = useState(false);
  const bookRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      stopVinyl();
    };
  }, [stopVinyl]);

  const handleNext = () => {
    playBookOpen();
    if (bookRef.current) {
      bookRef.current.pageFlip()?.flipNext();
    }
  };

  const handlePrev = () => {
    playBookOpen();
    if (bookRef.current) {
      bookRef.current.pageFlip()?.flipPrev();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center p-3 sm:p-6 backdrop-blur-md"
      style={{ background: "rgba(10, 12, 18, 0.8)", zIndex: 60 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setActiveModal(null);
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        className="relative w-full max-w-4xl bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        style={{ height: "min(680px, 92vh)" }}
      >
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/10 bg-neutral-950/60">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("diary")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "diary"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <BookOpen size={14} />
              <span>Diario Musical de Canciones</span>
            </button>

            <button
              onClick={() => setActiveTab("spotify")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "spotify"
                  ? "bg-[#1DB954]/20 text-[#1DB954] border border-[#1DB954]/30"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Radio size={14} />
              <span>Spotify Playlist Oficial</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={SPOTIFY_PLAYLIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-xs text-neutral-400 hover:text-[#1DB954] transition-colors"
            >
              <span>Abrir en Spotify</span>
              <ExternalLink size={12} />
            </a>

            <button
              onClick={() => setActiveModal(null)}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative p-4 flex items-center justify-center bg-radial from-neutral-900 to-neutral-950">
          {activeTab === "spotify" ? (
            <div className="w-full h-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
              <iframe
                src={SPOTIFY_EMBED_URL}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              {mounted && (
                <div className="w-full max-w-3xl h-[520px] flex items-center justify-center">
                  <FlipBook
                    ref={bookRef}
                    width={380}
                    height={500}
                    size="stretch"
                    minWidth={280}
                    maxWidth={440}
                    minHeight={380}
                    maxHeight={540}
                    drawShadow={true}
                    flippingTime={900}
                    usePortrait={false}
                    startZIndex={1}
                    autoSize={true}
                    maxShadowOpacity={0.6}
                    showCover={false}
                    mobileScrollSupport={true}
                    clickEventForward={true}
                    useMouseEvents={true}
                    showPageCorners={true}
                    disableFlipByClick={false}
                    className="shadow-2xl rounded-xl"
                    style={{ margin: "0 auto" }}
                    onFlip={(e: any) => setCurrentPage(e.data)}
                  >
                    {playlistTracks.flatMap((t, idx) => [
                      <BookPage
                        key={`left-${t.id}`}
                        className="bg-[#181513] text-stone-100 p-6 flex flex-col justify-between border-r border-amber-950/40"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Disc3
                              size={20}
                              className="text-amber-400 animate-spin"
                              style={{ animationDuration: "6s" }}
                            />
                            <span className="text-[10px] font-mono tracking-widest text-amber-400/80 uppercase">
                              Pista {idx + 1} de {playlistTracks.length}
                            </span>
                          </div>
                          <span className="text-[10px] text-stone-500 font-mono">
                            Lofi Desk Record
                          </span>
                        </div>

                        <div className="my-auto flex flex-col items-center text-center">
                          <div className="relative w-36 h-36 rounded-full bg-gradient-to-tr from-neutral-900 via-neutral-800 to-neutral-900 p-2 shadow-2xl border-4 border-neutral-700/60 mb-5 flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-amber-500 flex items-center justify-center shadow-inner text-neutral-950 font-bold text-xs">
                              {idx + 1}
                            </div>
                            <div className="absolute inset-4 rounded-full border border-white/5" />
                            <div className="absolute inset-8 rounded-full border border-white/5" />
                          </div>

                          <h3
                            className="text-2xl font-bold text-stone-100"
                            style={{ fontFamily: "var(--font-playfair)" }}
                          >
                            {t.title}
                          </h3>
                          <p className="text-xs text-amber-300 font-medium tracking-wide mt-1">
                            {t.artist}
                          </p>
                        </div>

                        <div className="w-full flex flex-col gap-3">
                          <WaveformPlayer url={t.audioSrc} />

                          <a
                            href={t.spotifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-white/5"
                          >
                            <span>Escuchar en Spotify</span>
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      </BookPage>,

                      <BookPage
                        key={`right-${t.id}`}
                        className="bg-[#FAF6F0] text-stone-900 p-8 flex flex-col justify-between border-l border-amber-900/15"
                      >
                        <div className="flex items-center justify-between text-[11px] text-amber-950/50 font-mono">
                          <span>Para Marta</span>
                          <span>{t.title}</span>
                        </div>

                        <div className="my-auto flex flex-col justify-center">
                          <div className="w-10 h-0.5 bg-amber-700/30 mb-6" />

                          <blockquote
                            className="text-xl md:text-2xl text-amber-950 font-medium leading-relaxed italic"
                            style={{ fontFamily: "var(--font-playfair)" }}
                          >
                            "{t.lyric}"
                          </blockquote>

                          <p
                            className="text-sm text-stone-700 leading-relaxed mt-6 pl-3 border-l-2 border-amber-600/40"
                            style={{ fontFamily: "var(--font-inter)" }}
                          >
                            {t.explanation}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-amber-900/10 flex items-center justify-between text-xs text-amber-900/60 font-mono">
                          <span>Ángel & Marta 💙</span>
                          <span className="text-[10px]">Arrastra la esquina ↗</span>
                        </div>
                      </BookPage>,
                    ])}
                  </FlipBook>
                </div>
              )}

              <div className="flex items-center gap-4 mt-3 z-10">
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors border border-white/10"
                >
                  <ChevronLeft size={14} />
                  <span>Anterior</span>
                </button>

                <span className="text-xs text-neutral-400 font-mono">
                  Gira las páginas con el ratón o usa los botones
                </span>

                <button
                  onClick={handleNext}
                  className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors border border-white/10"
                >
                  <span>Siguiente</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
