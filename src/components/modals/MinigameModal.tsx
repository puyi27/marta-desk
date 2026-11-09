"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHotkeys } from "react-hotkeys-hook";
import confetti from "canvas-confetti";
import { X, Gamepad2, Heart, Award, CheckCircle2 } from "lucide-react";
import { useDeskStore } from "@/store/useDeskStore";
import { useAudioStore } from "@/store/useAudioStore";

type ButtonKey = "X" | "O" | "△" | "□";

const SECRET_SEQUENCE: ButtonKey[] = ["X", "O", "△", "□"];

const buttonStyles: Record<
  ButtonKey,
  { bg: string; text: string; border: string; glow: string }
> = {
  X: {
    bg: "rgba(30, 58, 95, 0.7)",
    text: "#38bdf8",
    border: "#38bdf8",
    glow: "rgba(56, 189, 248, 0.4)",
  },
  O: {
    bg: "rgba(95, 30, 30, 0.7)",
    text: "#f87171",
    border: "#f87171",
    glow: "rgba(248, 113, 113, 0.4)",
  },
  "△": {
    bg: "rgba(30, 74, 42, 0.7)",
    text: "#4ade80",
    border: "#4ade80",
    glow: "rgba(74, 222, 128, 0.4)",
  },
  "□": {
    bg: "rgba(74, 30, 74, 0.7)",
    text: "#c084fc",
    border: "#c084fc",
    glow: "rgba(192, 132, 252, 0.4)",
  },
};

const triviaQuestions = [
  {
    q: "¿Cuál es nuestro rincón favorito de Sevilla donde se para el tiempo?",
    options: ["El Cristo de las Tres Caídas", "La Plaza de España", "El Parque María Luisa"],
    answer: 0,
  },
  {
    q: "¿Quién es la perrita teckel más buena y leal del universo?",
    options: ["Dora", "Otra perrita", "Nadie"],
    answer: 0,
  },
  {
    q: "¿Quién está más orgulloso de tu esfuerzo y pasión con el TFM?",
    options: ["Ángel 💙", "Todo el mundo", "Ambas son correctas"],
    answer: 2,
  },
];

export default function MinigameModal() {
  const { setActiveModal } = useDeskStore();
  const { playHoverTick, playSquish } = useAudioStore();

  const [sequence, setSequence] = useState<ButtonKey[]>([]);
  const [status, setStatus] = useState<"idle" | "playing" | "success" | "error">(
    "idle"
  );
  const [triviaStep, setTriviaStep] = useState(0);
  const [triviaScore, setTriviaScore] = useState(0);
  const [gamepadConnected, setGamepadConnected] = useState(false);
  const lastGamepadButtons = useRef<boolean[]>([false, false, false, false]);

  const pressButton = useCallback(
    (btn: ButtonKey) => {
      if (status === "success" || status === "error") return;
      playHoverTick();
      setSequence((prev) => [...prev, btn]);
    },
    [status, playHoverTick]
  );

  useHotkeys("x, enter", () => pressButton("X"), [pressButton]);
  useHotkeys("o, c", () => pressButton("O"), [pressButton]);
  useHotkeys("t, w, up", () => pressButton("△"), [pressButton]);
  useHotkeys("s, a, square", () => pressButton("□"), [pressButton]);

  useEffect(() => {
    let animationFrameId: number;

    const scanGamepad = () => {
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      const gp = gamepads[0];

      if (gp) {
        setGamepadConnected(true);
        const b0 = gp.buttons[0]?.pressed ?? false;
        const b1 = gp.buttons[1]?.pressed ?? false;
        const b2 = gp.buttons[2]?.pressed ?? false;
        const b3 = gp.buttons[3]?.pressed ?? false;

        if (b0 && !lastGamepadButtons.current[0]) pressButton("X");
        if (b1 && !lastGamepadButtons.current[1]) pressButton("O");
        if (b2 && !lastGamepadButtons.current[2]) pressButton("□");
        if (b3 && !lastGamepadButtons.current[3]) pressButton("△");

        lastGamepadButtons.current = [b0, b1, b2, b3];
      } else {
        setGamepadConnected(false);
      }

      animationFrameId = requestAnimationFrame(scanGamepad);
    };

    animationFrameId = requestAnimationFrame(scanGamepad);
    return () => cancelAnimationFrame(animationFrameId);
  }, [pressButton]);

  useEffect(() => {
    if (sequence.length === 0) return;

    const expected = SECRET_SEQUENCE[sequence.length - 1];
    const pressed = sequence[sequence.length - 1];

    if (pressed !== expected) {
      setStatus("error");
      setTimeout(() => {
        setSequence([]);
        setStatus("idle");
      }, 900);
      return;
    }

    if (sequence.length === SECRET_SEQUENCE.length) {
      setStatus("success");
      playSquish();
      confetti({
        particleCount: 70,
        spread: 90,
        origin: { x: 0.5, y: 0.5 },
        colors: ["#38bdf8", "#f87171", "#4ade80", "#c084fc", "#fbbf24"],
      });
    } else {
      setStatus("playing");
    }
  }, [sequence, playSquish]);

  const handleTriviaAnswer = (index: number) => {
    playHoverTick();
    const currentQ = triviaQuestions[triviaStep];
    if (index === currentQ.answer) {
      setTriviaScore((s) => s + 1);
    }
    setTriviaStep((s) => s + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center p-4 backdrop-blur-md"
      style={{ background: "rgba(8, 10, 16, 0.8)", zIndex: 60 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setActiveModal(null);
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-lg bg-gradient-to-b from-neutral-900 via-neutral-900 to-black rounded-3xl p-6 md:p-8 shadow-2xl border border-white/10 overflow-hidden"
      >
        <button
          onClick={() => setActiveModal(null)}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sky-400">
            <Gamepad2 size={24} />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider">
              DualSense Controller
            </span>
          </div>

          <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                gamepadConnected ? "bg-emerald-400 animate-pulse" : "bg-neutral-600"
              }`}
            />
            <span>{gamepadConnected ? "Mando Bluetooth" : "Teclado / Ratón"}</span>
          </div>
        </div>

        {status !== "success" ? (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-white mb-1.5">
                Cajón Gamer Secreto
              </h2>
              <p className="text-neutral-400 text-xs max-w-sm mx-auto">
                Pulsa los 4 botones PlayStation en el orden secreto para
                abrir el compartimento oculto.
              </p>
            </div>

            <div className="flex justify-center gap-3 mb-6">
              {SECRET_SEQUENCE.map((btn, idx) => {
                const isFilled = sequence.length > idx;
                const isCurrentError = status === "error" && idx === sequence.length - 1;
                return (
                  <div
                    key={idx}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border transition-all ${
                      isCurrentError
                        ? "bg-rose-500/20 border-rose-500 text-rose-400 scale-95"
                        : isFilled
                        ? "bg-sky-500/20 border-sky-400 text-sky-300"
                        : "bg-white/5 border-white/10 text-neutral-500"
                    }`}
                  >
                    {isFilled ? sequence[idx] : "·"}
                  </div>
                );
              })}
            </div>

            <div className="relative w-56 h-56 mx-auto mb-6 flex items-center justify-center">
              <div className="absolute inset-4 rounded-full bg-neutral-950 border border-white/10 shadow-2xl flex items-center justify-center">
                <div className="text-xs font-mono text-neutral-500 tracking-widest uppercase">
                  PlayStation
                </div>
              </div>

              <button
                onClick={() => pressButton("△")}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg transition-transform active:scale-90 hover:scale-105 shadow-lg border"
                style={{
                  backgroundColor: buttonStyles["△"].bg,
                  borderColor: buttonStyles["△"].border,
                  color: buttonStyles["△"].text,
                }}
              >
                △
              </button>

              <button
                onClick={() => pressButton("O")}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg transition-transform active:scale-90 hover:scale-105 shadow-lg border"
                style={{
                  backgroundColor: buttonStyles["O"].bg,
                  borderColor: buttonStyles["O"].border,
                  color: buttonStyles["O"].text,
                }}
              >
                O
              </button>

              <button
                onClick={() => pressButton("X")}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg transition-transform active:scale-90 hover:scale-105 shadow-lg border"
                style={{
                  backgroundColor: buttonStyles["X"].bg,
                  borderColor: buttonStyles["X"].border,
                  color: buttonStyles["X"].text,
                }}
              >
                X
              </button>

              <button
                onClick={() => pressButton("□")}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg transition-transform active:scale-90 hover:scale-105 shadow-lg border"
                style={{
                  backgroundColor: buttonStyles["□"].bg,
                  borderColor: buttonStyles["□"].border,
                  color: buttonStyles["□"].text,
                }}
              >
                □
              </button>
            </div>

            <p className="text-center text-[11px] text-neutral-500 font-mono">
              Atajos: [X] Cruz · [O] o [C] Círculo · [T] o [W] Triángulo · [S] o [A] Cuadrado
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-white/5 border border-sky-400/30 text-center">
              <Heart
                size={28}
                className="fill-rose-500 text-rose-500 mx-auto mb-2 animate-bounce"
              />
              <h3
                className="text-xl font-bold text-white mb-2"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Carta Secreta para Marta
              </h3>
              <p
                className="text-xs text-neutral-300 leading-relaxed italic"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                "Marta, eres mi persona favorita de todo el universo. No hay juego ni aventura que se compare a compartir cada día contigo, verte estudiar con tanta dedicación y soñar con todo lo que viene. Te quiero con toda mi alma."
              </p>
              <p className="text-[11px] text-sky-400 font-mono mt-2">
                — Ángel 💙
              </p>
            </div>

            {triviaStep < triviaQuestions.length ? (
              <div className="p-4 rounded-2xl bg-neutral-950 border border-white/10">
                <div className="flex items-center justify-between text-xs text-neutral-400 font-mono mb-2">
                  <span>Mini-Trivia Nosotros</span>
                  <span>
                    {triviaStep + 1} de {triviaQuestions.length}
                  </span>
                </div>

                <p className="text-sm font-semibold text-white mb-3">
                  {triviaQuestions[triviaStep].q}
                </p>

                <div className="space-y-2">
                  {triviaQuestions[triviaStep].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleTriviaAnswer(i)}
                      className="w-full text-left px-3 py-2 rounded-xl bg-white/5 hover:bg-white/15 text-xs text-neutral-200 hover:text-white transition-colors border border-white/5 flex items-center justify-between"
                    >
                      <span>{opt}</span>
                      <CheckCircle2 size={13} className="text-neutral-500" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                <Award size={28} className="text-emerald-400 mx-auto mb-1.5" />
                <h4 className="text-sm font-bold text-emerald-300 mb-1">
                  ¡Trivia Completada con Éxito!
                </h4>
                <p className="text-xs text-neutral-300">
                  Puntuación: {triviaScore} / {triviaQuestions.length} correctas.
                  ¡Te conoces nuestra historia al dedillo!
                </p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
