"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2, Save, FileText, Check } from "lucide-react";
import { useDeskStore } from "@/store/useDeskStore";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function NotepadModal() {
  const { setActiveModal } = useDeskStore();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/notes")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          setNotes(data);
          if (data.length > 0) {
            setSelectedNote(data[0]);
            setEditTitle(data[0].title);
            setEditContent(data[0].content);
          } else {
            setIsCreating(true);
          }
        }
      })
      .catch(() => {});
  }, []);

  const startNew = () => {
    setSelectedNote(null);
    setEditTitle("");
    setEditContent("");
    setIsCreating(true);
  };

  const selectNote = (note: Note) => {
    setSelectedNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsCreating(false);
  };

  const saveNote = async () => {
    if (!editTitle.trim()) return;
    setSaving(true);

    try {
      if (isCreating) {
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: editTitle, content: editContent }),
        });
        if (res.ok) {
          const newNote = await res.json();
          setNotes((prev) => [newNote, ...prev]);
          setSelectedNote(newNote);
          setIsCreating(false);
          setSavedSuccess(true);
          setTimeout(() => setSavedSuccess(false), 2000);
        }
      } else if (selectedNote) {
        const res = await fetch("/api/notes", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: selectedNote.id,
            title: editTitle,
            content: editContent,
          }),
        });
        if (res.ok) {
          const updated = await res.json();
          setNotes((prev) =>
            prev.map((n) => (n.id === updated.id ? updated : n))
          );
          setSelectedNote(updated);
          setSavedSuccess(true);
          setTimeout(() => setSavedSuccess(false), 2000);
        }
      }
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const res = await fetch(`/api/notes?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        const remaining = notes.filter((n) => n.id !== id);
        setNotes(remaining);
        if (selectedNote?.id === id) {
          if (remaining.length > 0) {
            selectNote(remaining[0]);
          } else {
            startNew();
          }
        }
      }
    } catch {}
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
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="relative overflow-hidden rounded-3xl shadow-2xl flex flex-col md:flex-row border border-white/10"
        style={{
          width: "min(860px, 94vw)",
          height: "min(580px, 86vh)",
          background: "linear-gradient(145deg, #181c24 0%, #0e1117 100%)",
          boxShadow: "0 30px 60px -15px rgba(0,0,0,0.8)",
        }}
      >
        <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-white/10 p-5 flex flex-col justify-between bg-white/5">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-amber-400" />
                <h3 className="text-white text-sm font-semibold">
                  Bloc de Apuntes
                </h3>
              </div>
              <button
                onClick={startNew}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-400 text-black text-xs font-semibold hover:bg-amber-300 transition-colors shadow-xs"
              >
                <Plus size={13} />
                <span>Nueva</span>
              </button>
            </div>

            <div className="my-3 space-y-1.5 overflow-y-auto max-h-[40vh] md:max-h-[52vh] pr-1">
              <AnimatePresence>
                {notes.map((note) => {
                  const isSelected = selectedNote?.id === note.id && !isCreating;
                  return (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      onClick={() => selectNote(note)}
                      className={`group p-3 rounded-2xl cursor-pointer transition-all flex items-start justify-between border ${
                        isSelected
                          ? "bg-amber-400/15 border-amber-400/40 text-white shadow-xs"
                          : "bg-white/5 border-transparent text-neutral-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-xs font-semibold truncate">
                          {note.title || "Sin título"}
                        </p>
                        <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                          {note.content || "Vacío..."}
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                        className="text-neutral-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      >
                        <Trash2 size={13} />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {notes.length === 0 && (
                <div className="text-center py-8 text-neutral-400 text-xs">
                  No hay apuntes. Pulsa "Nueva" para crear uno.
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
            <span>{notes.length} notas guardadas</span>
            <button
              onClick={() => setActiveModal(null)}
              className="md:hidden text-neutral-400 hover:text-white"
            >
              Cerrar
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between bg-[#12151d] p-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Título del apunte o cita..."
              className="flex-1 bg-transparent text-lg font-bold text-white placeholder:text-neutral-500 outline-none"
              style={{ fontFamily: "var(--font-playfair)" }}
            />

            <div className="flex items-center gap-2">
              <button
                onClick={saveNote}
                disabled={saving || !editTitle.trim()}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-semibold transition-all shadow-md disabled:opacity-50"
              >
                {savedSuccess ? (
                  <>
                    <Check size={14} />
                    <span>¡Guardado!</span>
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    <span>{saving ? "Guardando..." : "Guardar"}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setActiveModal(null)}
                className="hidden md:flex w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="flex-1 my-4">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Escribe tus reflexiones, bibliografía o citas para el TFM aquí..."
              className="w-full h-full bg-transparent text-sm text-neutral-200 placeholder:text-neutral-600 outline-none resize-none leading-relaxed"
              style={{
                lineHeight: "1.8",
                fontFamily: "var(--font-inter)",
              }}
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
            <span>Sincronizado con PostgreSQL & almacenamiento local</span>
            <span>{editContent.length} caracteres</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
