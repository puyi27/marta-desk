"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gamepad2 } from "lucide-react";
import { useDeskStore } from "@/store/useDeskStore";

type ButtonKey = "X" | "O" | "△" | "□";

const SECRET_SEQUENCE: ButtonKey[] = ["X", "O", "△", "□"];
const SECRET_MESSAGE =
  "🎮 ¡Has encontrado el mensaje secreto! Marta, eres la persona más increíble que conozco. Gracias por ser mi jugadora favorita en este juego llamado vida. Te quiero muchísimo. — Ángel 💙";

const buttonStyles: Record<ButtonKey, { bg: string; text: string; border: string }> = {
  X: { bg: "#1e3a5f", text: "#4FC3F7", border: "#4FC3F7" },
  O: { bg: "#5f1e1e", text: "#EF9A9A", border: "#EF9A9A" },
  "△": { bg: "#1e4a2a", text: "#A5D6A7", border: "#A5D6A7" },
  "□": { bg: "#4a1e4a", text: "#CE93D8", border: "#CE93D8" },
};

export default function MinigameModal() {
  const { setActiveModal } = useDeskStore();
  const [sequence, setSequence] = useState<ButtonKey[]>([]);
  const [status, setStatus] = useState<"idle" | "playing" | "success" | "error">("idle");
  const [errorIndex, setErrorIndex] = useState(-1);

  useEffect(() => {
    if (sequence.length === 0) return;

    const expected = SECRET_SEQUENCE[sequence.length - 1];
    const pressed = sequence[sequence.length - 1];

    if (pressed !== expected) {
      setStatus("error");
      setErrorIndex(sequence.length - 1);
      setTimeout(() => {
        setSequence([]);
        setStatus("idle");
        setErrorIndex(-1);
      }, 1200);
      return;
    }

    if (sequence.length === SECRET_SEQUENCE.length) {
      setStatus("success");
    } else {
      setStatus("playing");
    }
  }, [sequence]);

  const pressButton = (btn: ButtonKey) => {
    if (status === "success" || status === "error") return;
    setSequence((prev) => [...prev, btn]);
  };

  const reset = () => {
    setSequence([]);
    setStatus("idle");
    setErrorIndex(-1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center modal-backdrop"
      style={{ background: "rgba(0,0,0,0.7)", zIndex: 50 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setActiveModal(null);
      }}
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.7, opacity: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 22 }}
        className="relative rounded-2xl shadow-2xl overflow-hidden"
        style={{
          width: "min(480px, 90vw)",
          background: "linear-gradient(180deg, #1a1a2e 0%, #0d0d1a 100%)",
          border: "1px solid rgba(255,255,255,0.1)",
          padding: "32px",
        }}
      >
        <button
          onClick={() => setActiveModal(null)}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-8">
          <Gamepad2 size={32} className="mx-auto mb-3 text-blue-400" />
          <h2 className="text-white text-xl font-bold mb-2">Cajón Secreto</h2>
          <p className="text-white/50 text-sm">
            Introduce la secuencia correcta para desbloquear el mensaje
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          {SECRET_SEQUENCE.map((btn, i) => (
            <motion.div
              key={i}
              animate={{
                scale:
                  i < sequence.length
                    ? errorIndex === i
                      ? [1, 1.2, 1]
                      : 1.1
                    : 1,
                borderColor:
                  i < sequence.length
                    ? errorIndex === i
                      ? "#ff4444"
                      : "#44ff44"
                    : "rgba(255,255,255,0.2)",
              }}
              className="rounded-lg flex items-center justify-center font-bold"
              style={{
                width: "44px",
                height: "44px",
                border: "2px solid rgba(255,255,255,0.2)",
                color:
                  i < sequence.length
                    ? errorIndex === i
                      ? "#ff4444"
                      : buttonStyles[sequence[i] ?? btn].text
                    : "rgba(255,255,255,0.3)",
                fontSize: "1.2rem",
                background:
                  i < sequence.length && errorIndex !== i
                    ? "rgba(255,255,255,0.1)"
                    : "transparent",
              }}
            >
              {i < sequence.length ? sequence[i] : "?"}
            </motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-6 rounded-xl mb-6"
              style={{ background: "rgba(68,255,68,0.1)", border: "1px solid rgba(68,255,68,0.3)" }}
            >
              <p className="text-green-400 font-semibold mb-3">🎉 ¡Secuencia correcta!</p>
              <p
                className="text-white/90 text-sm leading-relaxed"
                style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic" }}
              >
                {SECRET_MESSAGE}
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={reset}
                className="mt-4 px-4 py-2 rounded-lg text-sm text-white/70 hover:text-white transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.2)" }}
              >
                Jugar de nuevo
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 gap-3"
            >
              {(["X", "O", "△", "□"] as ButtonKey[]).map((btn) => (
                <motion.button
                  key={btn}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => pressButton(btn)}
                  disabled={status === "error"}
                  className="rounded-xl py-4 font-bold text-xl transition-all disabled:opacity-50"
                  style={{
                    background: buttonStyles[btn].bg,
                    color: buttonStyles[btn].text,
                    border: `2px solid ${buttonStyles[btn].border}`,
                    boxShadow: `0 0 20px ${buttonStyles[btn].border}33`,
                  }}
                >
                  {btn}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {status === "error" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-red-400 text-sm mt-4"
          >
            ✗ Secuencia incorrecta. Inténtalo de nuevo...
          </motion.p>
        )}

        {status !== "success" && sequence.length > 0 && status !== "error" && (
          <div className="flex justify-center mt-4">
            <button
              onClick={reset}
              className="text-white/40 text-xs hover:text-white/70 transition-colors"
            >
              Reiniciar
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
