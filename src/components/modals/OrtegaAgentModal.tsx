"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { X, Send, Pin, PinOff, Sparkles, BookOpen, Quote } from "lucide-react";
import { useDeskStore } from "@/store/useDeskStore";
import { useAudioStore } from "@/store/useAudioStore";

interface ChatMessage {
  id: string;
  role: string;
  content: string;
  pinned: boolean;
  createdAt: string;
}

const famousQuotes = [
  "El amor es un acto centrífugo del alma hacia el objeto amado: un proyectar constante de gracia y calidez.",
  "Enamorarse es sentirse encantado por otro ser y desear ir a él con la totalidad de nuestro ser.",
  "Dime qué amas y te diré quién eres.",
  "El verdadero amor empieza cuando el egoísmo se calla y el alma se deleita en la existencia ajena.",
];

const quickPrompts = [
  "Analizar concepto de cristalización",
  "Diferencia entre amor y deseo en Ortega",
  "Estructurar capítulo del TFM",
];

export default function OrtegaAgentModal() {
  const { setActiveModal } = useDeskStore();
  const { playBookOpen, playHoverTick } = useAudioStore();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/ortega-chat")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setMessages(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (textToSend?: string) => {
    const content = (textToSend ?? input).trim();
    if (!content || loading) return;

    setInput("");
    setLoading(true);
    playHoverTick();

    try {
      const res = await fetch("/api/ortega-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.userMessage && data.assistantMessage) {
          setMessages((prev) => [...prev, data.userMessage, data.assistantMessage]);
        }
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const togglePin = async (id: string, currentPinned: boolean) => {
    playHoverTick();
    try {
      const res = await fetch("/api/ortega-chat", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, pinned: !currentPinned }),
      });
      if (res.ok) {
        const updated = await res.json();
        setMessages((prev) =>
          prev.map((m) => (m.id === updated.id ? updated : m))
        );
      }
    } catch {}
  };

  const pinnedMessages = messages.filter((m) => m.pinned);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center p-3 sm:p-6 backdrop-blur-2xl bg-black/65 z-50 select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) setActiveModal(null);
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="w-full max-w-5xl aspect-[16/10] bg-[#FAF6EE] text-stone-900 rounded-2xl shadow-[0_25px_80px_rgba(0,0,0,0.75)] border border-stone-300 relative overflow-hidden grid grid-cols-1 md:grid-cols-2 max-h-[92vh]"
      >
        <div className="bg-gradient-to-r from-transparent via-stone-900/15 to-transparent w-12 left-1/2 -translate-x-1/2 inset-y-0 absolute pointer-events-none hidden md:block z-10" />

        <div className="p-6 md:p-8 flex flex-col justify-between overflow-y-auto border-b md:border-b-0 md:border-r border-stone-300/80 bg-[#F4EFE6]/70">
          <div>
            <div className="flex items-center gap-2 text-amber-900 mb-2">
              <BookOpen size={18} />
              <span className="text-xs font-mono font-semibold tracking-widest uppercase">
                TFM Filosofía & Ensayos
              </span>
            </div>

            <h2
              className="text-2xl md:text-3xl font-bold text-stone-900 leading-snug"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Estudios sobre el amor
            </h2>
            <p className="text-xs text-stone-600 font-serif italic mt-0.5">
              José Ortega y Gasset · Asistente Académico
            </p>

            <div className="w-12 h-0.5 bg-amber-800/20 my-4" />

            <div className="mb-6">
              <h3 className="text-xs font-mono font-semibold text-amber-900/80 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Quote size={13} />
                <span>Citas Fundamentales</span>
              </h3>
              <div className="space-y-2.5">
                {famousQuotes.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white/70 border border-amber-900/10 text-xs text-stone-800 leading-relaxed italic font-serif"
                  >
                    "{q}"
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-mono font-semibold text-amber-900/80 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Pin size={13} className="text-amber-700" />
                <span>Apuntes Fijados para el TFM ({pinnedMessages.length})</span>
              </h3>

              {pinnedMessages.length === 0 ? (
                <p className="text-xs text-stone-500 italic p-3 rounded-xl bg-white/40 border border-dashed border-amber-900/20">
                  Usa el icono de chincheta en cualquier respuesta para guardar
                  la cita directamente en tu recopilatorio del TFM.
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {pinnedMessages.map((m) => (
                    <div
                      key={m.id}
                      className="p-2.5 rounded-xl bg-amber-100/60 border border-amber-800/20 text-xs text-stone-900 leading-relaxed font-serif relative group"
                    >
                      <button
                        onClick={() => togglePin(m.id, true)}
                        className="absolute top-2 right-2 text-amber-800 hover:text-rose-600"
                        title="Desfijar apunte"
                      >
                        <PinOff size={13} />
                      </button>
                      <p className="line-clamp-4 pr-5">{m.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-300/60 text-[11px] text-stone-500 font-mono flex items-center justify-between">
            <span>Para la mejor filósofa 💙</span>
            <span>Ángel & Marta</span>
          </div>
        </div>

        <div className="p-6 md:p-8 flex flex-col justify-between overflow-hidden bg-[#FAF6EE]">
          <div className="flex items-center justify-between pb-3 border-b border-stone-300/80">
            <div>
              <span className="text-xs font-mono text-amber-900/70 uppercase">
                Diálogo Epistolar
              </span>
              <p
                className="text-base font-semibold text-stone-900"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Consulta tus hipótesis de investigación
              </p>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-8 h-8 rounded-full bg-stone-200/60 hover:bg-stone-300 text-stone-600 hover:text-stone-900 flex items-center justify-center transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 py-2.5">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(p)}
                className="px-2.5 py-1 rounded-full bg-amber-100/70 hover:bg-amber-200/80 text-amber-950 text-xs font-medium border border-amber-800/20 transition-colors flex items-center gap-1"
              >
                <Sparkles size={11} className="text-amber-700" />
                <span>{p}</span>
              </button>
            ))}
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto space-y-4 pr-2 my-2"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
                <BookOpen size={36} className="text-amber-800/40 mb-3" />
                <p
                  className="text-lg font-medium text-stone-800 mb-1"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  ¿Qué aspecto de la fenomenología del amor deseas explorar hoy?
                </p>
                <p className="text-xs max-w-sm text-stone-500">
                  Pregunta sobre la atención, el entusiasmo, la admiración o la
                  estructura del ensayo para tu trabajo fin de máster.
                </p>
              </div>
            ) : (
              messages.map((m) => {
                const isAssistant = m.role === "assistant";
                return (
                  <div
                    key={m.id}
                    className={`flex ${
                      isAssistant ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl p-4 shadow-sm relative group ${
                        isAssistant
                          ? "bg-white text-stone-900 border border-stone-200"
                          : "bg-amber-800 text-amber-50"
                      }`}
                    >
                      {isAssistant && (
                        <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-stone-100 text-[11px] font-mono text-amber-900/60">
                          <span>Ortega y Gasset</span>
                          <button
                            onClick={() => togglePin(m.id, m.pinned)}
                            className="text-stone-400 hover:text-amber-700 transition-colors"
                            title={m.pinned ? "Desfijar apunte" : "Fijar apunte"}
                          >
                            <Pin
                              size={13}
                              className={m.pinned ? "fill-amber-700 text-amber-700" : ""}
                            />
                          </button>
                        </div>
                      )}

                      <div
                        className={`text-sm leading-relaxed prose prose-stone max-w-none ${
                          isAssistant ? "font-serif" : "font-sans"
                        }`}
                      >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {m.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl p-4 border border-stone-200 flex items-center gap-2 text-xs text-amber-900/70 font-mono shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-amber-600 animate-bounce" />
                  <div
                    className="w-2 h-2 rounded-full bg-amber-600 animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <div
                    className="w-2 h-2 rounded-full bg-amber-600 animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  />
                  <span className="ml-2 font-serif italic text-stone-600">
                    Escribiendo reflexión...
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-stone-300/80 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Escribe tu consulta o tesis filosófica para el TFM..."
              disabled={loading}
              className="flex-1 bg-white border border-stone-300 rounded-xl px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-700/30 transition-all font-serif"
            />

            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="px-4 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 disabled:opacity-50 text-amber-50 font-medium text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Consultar</span>
              <Send size={13} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
