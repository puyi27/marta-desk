"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Pin, PinOff, Sparkles, BookOpen } from "lucide-react";
import { useDeskStore } from "@/store/useDeskStore";

interface ChatMessage {
  id: string;
  role: string;
  content: string;
  pinned: boolean;
  createdAt: string;
}

export default function OrtegaAgentModal() {
  const { setActiveModal } = useDeskStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPinned, setShowPinned] = useState(false);
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

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const content = input.trim();
    setInput("");
    setLoading(true);

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

  const displayMessages = showPinned
    ? messages.filter((m) => m.pinned)
    : messages;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center p-4 backdrop-blur-md"
      style={{ background: "rgba(15, 12, 10, 0.75)", zIndex: 60 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setActiveModal(null);
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, rotateX: -8 }}
        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border-2 border-[#d6c4ae]"
        style={{
          width: "min(920px, 95vw)",
          height: "min(620px, 88vh)",
          background: "#FAF6F0",
          boxShadow: "0 35px 70px -15px rgba(0,0,0,0.7), inset 0 0 40px rgba(180, 140, 90, 0.15)",
        }}
      >
        <div
          className="w-full md:w-[38%] p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#d6c4ae]"
          style={{
            background: "linear-gradient(180deg, #F5EDE0 0%, #EFE4D2 100%)",
          }}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-900/70 font-bold">
                TFM · Marco Teórico
              </span>
              <button
                onClick={() => setActiveModal(null)}
                className="md:hidden text-amber-950/60 hover:text-amber-950"
              >
                <X size={18} />
              </button>
            </div>

            <h2
              className="text-2xl font-bold text-amber-950 mt-1 leading-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Estudios sobre el amor
            </h2>
            <p
              className="text-xs italic text-amber-900/70 mt-1"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              José Ortega y Gasset
            </p>

            <div className="flex gap-1.5 flex-wrap mt-4">
              {[
                "Cristalización",
                "Atención sostenida",
                "Amor vs Deseo",
                "Ensimismamiento",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-900/10 text-amber-950 border border-amber-900/15"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex-1 my-5 overflow-y-auto pr-1 space-y-2.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-amber-950/80">
                {showPinned ? "Citas fijadas" : "Apuntes fijados"}
              </span>
              <button
                onClick={() => setShowPinned(!showPinned)}
                className="text-[11px] font-medium text-amber-900 hover:underline flex items-center gap-1"
              >
                <Pin size={11} />
                <span>{showPinned ? "Ver todo" : "Filtrar fijados"}</span>
              </button>
            </div>

            {messages
              .filter((m) => m.pinned)
              .map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-xl bg-white/80 border border-amber-900/20 shadow-xs relative group"
                >
                  <p
                    className="text-xs text-amber-950 leading-relaxed italic"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    "{m.content.slice(0, 110)}..."
                  </p>
                  <button
                    onClick={() => togglePin(m.id, true)}
                    className="absolute top-2 right-2 text-amber-700 hover:text-amber-950"
                  >
                    <PinOff size={11} />
                  </button>
                </div>
              ))}

            {messages.filter((m) => m.pinned).length === 0 && (
              <div className="p-4 rounded-xl border border-dashed border-amber-900/30 text-center text-xs text-amber-900/60">
                <BookOpen size={18} className="mx-auto mb-1 opacity-50" />
                Pincha el icono de chincheta en cualquier respuesta para guardarla en esta columna.
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-amber-900/20 flex items-center justify-between text-[11px] text-amber-900/70 font-mono">
            <span>Ángel & Marta</span>
            <span>Edición TFM 💙</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between bg-[#FAF6F0]">
          <div className="p-4 px-6 border-b border-[#d6c4ae] flex items-center justify-between bg-white/40">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span
                className="text-sm font-semibold text-amber-950"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Tutor Filosófico IA
              </span>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="hidden md:flex text-amber-900/60 hover:text-amber-950 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-4"
          >
            {displayMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 group ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 shadow-sm relative ${
                    msg.role === "user"
                      ? "bg-amber-900 text-amber-50"
                      : "bg-white text-neutral-900 border border-amber-900/15"
                  }`}
                  style={{
                    fontFamily:
                      msg.role === "model" ? "var(--font-playfair)" : "inherit",
                    lineHeight: "1.7",
                    fontSize: "0.92rem",
                  }}
                >
                  <p>{msg.content}</p>

                  <button
                    onClick={() => togglePin(msg.id, msg.pinned)}
                    className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-white shadow-md border border-amber-900/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-amber-900"
                    title={msg.pinned ? "Desfijar cita" : "Fijar cita para el TFM"}
                  >
                    {msg.pinned ? <PinOff size={11} /> : <Pin size={11} />}
                  </button>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl p-4 bg-white border border-amber-900/15 flex items-center gap-2 text-xs text-amber-900 font-mono">
                  <Sparkles size={14} className="text-amber-600 animate-spin" />
                  <span>Consultando los textos de Ortega y Gasset...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-[#d6c4ae] bg-white/60">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Pregúntale sobre la atención, el deseo, Stendhal o estructura del TFM..."
                className="flex-1 px-4 py-3 rounded-2xl bg-white border border-amber-900/20 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-amber-900 transition-colors"
                style={{ fontFamily: "var(--font-playfair)" }}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="w-12 h-12 rounded-2xl bg-amber-900 hover:bg-amber-950 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
