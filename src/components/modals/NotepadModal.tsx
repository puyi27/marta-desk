"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useDebouncedCallback } from "use-debounce";
import {
  X,
  Plus,
  Trash2,
  FileText,
  Check,
  Bold,
  Italic,
  Heading2,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";
import { useDeskStore } from "@/store/useDeskStore";
import { useAudioStore } from "@/store/useAudioStore";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export default function NotepadModal() {
  const { setActiveModal } = useDeskStore();
  const { playHoverTick } = useAudioStore();

  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const saveNoteDirect = async (titleToSave: string, contentToSave: string) => {
    if (!titleToSave.trim()) return;
    setSaving(true);

    try {
      if (isCreating) {
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: titleToSave, content: contentToSave }),
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
            title: titleToSave,
            content: contentToSave,
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

  const debouncedAutoSave = useDebouncedCallback(
    (newContent: string, newTitle: string) => {
      saveNoteDirect(newTitle, newContent);
    },
    800
  );

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "outline-none text-stone-900 text-sm leading-relaxed min-h-[340px] w-full focus:outline-none font-serif",
      },
    },
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      debouncedAutoSave(html, editTitle);
    },
  });

  useEffect(() => {
    fetch("/api/notes")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          setNotes(data);
          if (data.length > 0) {
            setSelectedNote(data[0]);
            setEditTitle(data[0].title);
            editor?.commands.setContent(data[0].content || "");
          } else {
            setIsCreating(true);
          }
        }
      })
      .catch(() => {});
  }, [editor]);

  const startNew = () => {
    playHoverTick();
    setSelectedNote(null);
    setEditTitle("");
    editor?.commands.setContent("");
    setIsCreating(true);
  };

  const selectNote = (note: Note) => {
    playHoverTick();
    setSelectedNote(note);
    setEditTitle(note.title);
    editor?.commands.setContent(note.content || "");
    setIsCreating(false);
  };

  const deleteNote = async (id: string) => {
    playHoverTick();
    try {
      const res = await fetch(`/api/notes?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setNotes((prev) => prev.filter((n) => n.id !== id));
        if (selectedNote?.id === id) {
          const remaining = notes.filter((n) => n.id !== id);
          if (remaining.length > 0) {
            setSelectedNote(remaining[0]);
            setEditTitle(remaining[0].title);
            editor?.commands.setContent(remaining[0].content || "");
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
      className="fixed inset-0 flex items-center justify-center p-3 sm:p-6 backdrop-blur-md"
      style={{ background: "rgba(10, 10, 12, 0.75)", zIndex: 60 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setActiveModal(null);
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        className="relative w-full max-w-4xl bg-[#FAF6ED] rounded-3xl shadow-2xl border border-amber-900/20 overflow-hidden flex flex-col md:flex-row"
        style={{ height: "min(680px, 92vh)" }}
      >
        <div className="w-full md:w-64 bg-[#F2EDE2] border-b md:border-b-0 md:border-r border-amber-900/15 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-semibold tracking-wider text-amber-950/70 uppercase">
                Bloc de Notas
              </span>
              <button
                onClick={startNew}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-800 hover:bg-amber-900 text-amber-50 text-xs font-medium transition-colors shadow-xs"
              >
                <Plus size={13} />
                <span>Nueva</span>
              </button>
            </div>

            <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
              <AnimatePresence>
                {notes.map((note) => {
                  const isSelected = selectedNote?.id === note.id && !isCreating;
                  return (
                    <motion.div
                      key={note.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      onClick={() => selectNote(note)}
                      className={`group p-2.5 rounded-xl cursor-pointer transition-all flex items-start justify-between ${
                        isSelected
                          ? "bg-white shadow-sm border border-amber-900/15"
                          : "hover:bg-black/5 text-stone-700"
                      }`}
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="text-xs font-semibold text-stone-900 truncate">
                          {note.title || "Sin título"}
                        </p>
                        <p className="text-[11px] text-stone-500 truncate mt-0.5">
                          {note.content?.replace(/<[^>]+>/g, "") || "Vacío..."}
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-rose-600 transition-opacity p-0.5"
                      >
                        <Trash2 size={13} />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {notes.length === 0 && (
                <div className="text-center py-8 text-stone-400 text-xs italic">
                  No hay notas guardadas aún.
                </div>
              )}
            </div>
          </div>

          <div className="text-[11px] text-stone-500 font-mono pt-3 border-t border-amber-900/10 flex items-center justify-between">
            <span>{notes.length} notas</span>
            <span>Marta's Desk</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between p-6 bg-[#FAF6ED] overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-amber-900/15">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => {
                setEditTitle(e.target.value);
                if (editor) debouncedAutoSave(editor.getHTML(), e.target.value);
              }}
              placeholder="Título del apunte o cita..."
              className="flex-1 bg-transparent text-lg font-bold text-stone-900 placeholder:text-stone-400 outline-none"
              style={{ fontFamily: "var(--font-playfair)" }}
            />

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/70 border border-amber-900/15 text-xs text-stone-700">
                {savedSuccess ? (
                  <>
                    <Check size={13} className="text-emerald-600" />
                    <span className="text-emerald-700 font-medium">Guardado</span>
                  </>
                ) : saving ? (
                  <span className="text-amber-800">Guardando...</span>
                ) : (
                  <span className="text-stone-500">Autoguardado 800ms</span>
                )}
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-stone-200/60 hover:bg-stone-300 text-stone-600 hover:text-stone-900 flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {editor && (
            <div className="flex items-center gap-1 py-2 border-b border-amber-900/10 text-stone-700">
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-1.5 rounded-lg transition-colors ${
                  editor.isActive("bold")
                    ? "bg-amber-800 text-amber-50"
                    : "hover:bg-stone-200/60"
                }`}
                title="Negrita"
              >
                <Bold size={14} />
              </button>

              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-1.5 rounded-lg transition-colors ${
                  editor.isActive("italic")
                    ? "bg-amber-800 text-amber-50"
                    : "hover:bg-stone-200/60"
                }`}
                title="Cursiva"
              >
                <Italic size={14} />
              </button>

              <button
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={`p-1.5 rounded-lg transition-colors ${
                  editor.isActive("heading", { level: 2 })
                    ? "bg-amber-800 text-amber-50"
                    : "hover:bg-stone-200/60"
                }`}
                title="Encabezado"
              >
                <Heading2 size={14} />
              </button>

              <div className="w-px h-4 bg-amber-900/20 mx-1" />

              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-1.5 rounded-lg transition-colors ${
                  editor.isActive("bulletList")
                    ? "bg-amber-800 text-amber-50"
                    : "hover:bg-stone-200/60"
                }`}
                title="Lista de puntos"
              >
                <List size={14} />
              </button>

              <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-1.5 rounded-lg transition-colors ${
                  editor.isActive("orderedList")
                    ? "bg-amber-800 text-amber-50"
                    : "hover:bg-stone-200/60"
                }`}
                title="Lista numerada"
              >
                <ListOrdered size={14} />
              </button>

              <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-1.5 rounded-lg transition-colors ${
                  editor.isActive("blockquote")
                    ? "bg-amber-800 text-amber-50"
                    : "hover:bg-stone-200/60"
                }`}
                title="Cita"
              >
                <Quote size={14} />
              </button>
            </div>
          )}

          <div
            className="flex-1 my-3 overflow-y-auto p-4 rounded-2xl bg-white/70 border border-amber-900/10 shadow-inner"
            style={{
              backgroundImage:
                "repeating-linear-gradient(transparent, transparent 27px, rgba(140, 90, 50, 0.06) 28px)",
            }}
          >
            <EditorContent editor={editor} />
          </div>

          <div className="pt-2 border-t border-amber-900/15 flex items-center justify-between text-[11px] text-stone-500 font-mono">
            <span>Editor Tiptap Rich-Text</span>
            <span>Sincronizado con base de datos</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
