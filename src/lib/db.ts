import fs from "fs";
import path from "path";
import crypto from "crypto";
import { prisma } from "./prisma";

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessageItem {
  id: string;
  role: string;
  content: string;
  pinned: boolean;
  createdAt: string;
}

export interface SquishLogItem {
  id: string;
  createdAt: string;
}

interface LocalDatabase {
  notes: NoteItem[];
  chatMessages: ChatMessageItem[];
  squishLogs: SquishLogItem[];
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "desk_storage.json");

const defaultData: LocalDatabase = {
  notes: [
    {
      id: "note-ortega-1",
      title: "Ideas para el TFM · Ortega y Gasset",
      content:
        "La noción de atención sostenida como núcleo del amor. Diferencia con Stendhal: cristalización pasiva frente a la elección y atención viva que Ortega defiende.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "note-ortega-2",
      title: "Estructura del marco teórico",
      content:
        "1. Introducción al pensamiento orteguiano del amor.\n2. La distinción fenomenológica entre desear y amar.\n3. La atención centrífuga y el estado de gracia.\n4. Conclusiones y defensa ante el tribunal.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  chatMessages: [
    {
      id: "init-ortega-1",
      role: "model",
      content:
        "¡Hola, Marta! Estoy aquí para acompañarte en tu TFM sobre 'Estudios sobre el amor' de José Ortega y Gasset. ¿En qué aspecto de su pensamiento te gustaría profundizar hoy: la distinción entre amor y deseo, la atención sostenida o la crítica a la teoría de Stendhal?",
      pinned: true,
      createdAt: new Date().toISOString(),
    },
  ],
  squishLogs: [],
};

let prismaAvailable = true;
let lastPrismaCheck = 0;
const PRISMA_RETRY_INTERVAL = 30000;

function ensureDataFile(): LocalDatabase {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2), "utf-8");
      return defaultData;
    }
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as LocalDatabase;
  } catch {
    return defaultData;
  }
}

function writeDataFile(data: LocalDatabase): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch {}
}

async function runWithTimeout<T>(promise: Promise<T>, timeoutMs = 800): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("Database timeout")), timeoutMs);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timer!);
  }
}

async function canUsePrisma(): Promise<boolean> {
  const now = Date.now();
  if (!prismaAvailable && now - lastPrismaCheck < PRISMA_RETRY_INTERVAL) {
    return false;
  }
  return true;
}

function handlePrismaError(): void {
  prismaAvailable = false;
  lastPrismaCheck = Date.now();
}

export async function getNotes(): Promise<NoteItem[]> {
  if (await canUsePrisma()) {
    try {
      const dbNotes = await runWithTimeout(
        prisma.note.findMany({ orderBy: { updatedAt: "desc" } })
      );
      prismaAvailable = true;
      return dbNotes.map((n) => ({
        id: n.id,
        title: n.title,
        content: n.content,
        createdAt: n.createdAt.toISOString(),
        updatedAt: n.updatedAt.toISOString(),
      }));
    } catch {
      handlePrismaError();
    }
  }
  const local = ensureDataFile();
  return local.notes.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export async function createNote(title: string, content: string): Promise<NoteItem> {
  if (await canUsePrisma()) {
    try {
      const created = await runWithTimeout(
        prisma.note.create({ data: { title, content } })
      );
      prismaAvailable = true;
      const note: NoteItem = {
        id: created.id,
        title: created.title,
        content: created.content,
        createdAt: created.createdAt.toISOString(),
        updatedAt: created.updatedAt.toISOString(),
      };
      const local = ensureDataFile();
      local.notes.unshift(note);
      writeDataFile(local);
      return note;
    } catch {
      handlePrismaError();
    }
  }
  const local = ensureDataFile();
  const note: NoteItem = {
    id: `local-${crypto.randomUUID()}`,
    title,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  local.notes.unshift(note);
  writeDataFile(local);
  return note;
}

export async function updateNote(
  id: string,
  title?: string,
  content?: string
): Promise<NoteItem | null> {
  if (await canUsePrisma()) {
    try {
      const updated = await runWithTimeout(
        prisma.note.update({
          where: { id },
          data: {
            ...(title !== undefined ? { title } : {}),
            ...(content !== undefined ? { content } : {}),
          },
        })
      );
      prismaAvailable = true;
      const note: NoteItem = {
        id: updated.id,
        title: updated.title,
        content: updated.content,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      };
      const local = ensureDataFile();
      const index = local.notes.findIndex((n) => n.id === id);
      if (index !== -1) {
        local.notes[index] = note;
        writeDataFile(local);
      }
      return note;
    } catch {
      handlePrismaError();
    }
  }
  const local = ensureDataFile();
  const index = local.notes.findIndex((n) => n.id === id);
  if (index === -1) return null;
  const current = local.notes[index];
  const updated: NoteItem = {
    ...current,
    title: title !== undefined ? title : current.title,
    content: content !== undefined ? content : current.content,
    updatedAt: new Date().toISOString(),
  };
  local.notes[index] = updated;
  writeDataFile(local);
  return updated;
}

export async function deleteNote(id: string): Promise<boolean> {
  if (await canUsePrisma()) {
    try {
      await runWithTimeout(prisma.note.delete({ where: { id } }));
      prismaAvailable = true;
    } catch {
      handlePrismaError();
    }
  }
  const local = ensureDataFile();
  local.notes = local.notes.filter((n) => n.id !== id);
  writeDataFile(local);
  return true;
}

export async function getChatMessages(): Promise<ChatMessageItem[]> {
  if (await canUsePrisma()) {
    try {
      const messages = await runWithTimeout(
        prisma.chatMessage.findMany({ orderBy: { createdAt: "asc" } })
      );
      prismaAvailable = true;
      return messages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        pinned: m.pinned,
        createdAt: m.createdAt.toISOString(),
      }));
    } catch {
      handlePrismaError();
    }
  }
  const local = ensureDataFile();
  return local.chatMessages.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

export async function createChatMessage(
  role: string,
  content: string,
  pinned = false
): Promise<ChatMessageItem> {
  if (await canUsePrisma()) {
    try {
      const created = await runWithTimeout(
        prisma.chatMessage.create({
          data: { role, content, pinned },
        })
      );
      prismaAvailable = true;
      const msg: ChatMessageItem = {
        id: created.id,
        role: created.role,
        content: created.content,
        pinned: created.pinned,
        createdAt: created.createdAt.toISOString(),
      };
      const local = ensureDataFile();
      local.chatMessages.push(msg);
      writeDataFile(local);
      return msg;
    } catch {
      handlePrismaError();
    }
  }
  const local = ensureDataFile();
  const msg: ChatMessageItem = {
    id: `local-${crypto.randomUUID()}`,
    role,
    content,
    pinned,
    createdAt: new Date().toISOString(),
  };
  local.chatMessages.push(msg);
  writeDataFile(local);
  return msg;
}

export async function updateChatMessagePinned(
  id: string,
  pinned: boolean
): Promise<ChatMessageItem | null> {
  if (await canUsePrisma()) {
    try {
      const updated = await runWithTimeout(
        prisma.chatMessage.update({
          where: { id },
          data: { pinned },
        })
      );
      prismaAvailable = true;
      const msg: ChatMessageItem = {
        id: updated.id,
        role: updated.role,
        content: updated.content,
        pinned: updated.pinned,
        createdAt: updated.createdAt.toISOString(),
      };
      const local = ensureDataFile();
      const idx = local.chatMessages.findIndex((m) => m.id === id);
      if (idx !== -1) {
        local.chatMessages[idx] = msg;
        writeDataFile(local);
      }
      return msg;
    } catch {
      handlePrismaError();
    }
  }
  const local = ensureDataFile();
  const idx = local.chatMessages.findIndex((m) => m.id === id);
  if (idx === -1) {
    return {
      id,
      role: "model",
      content: "",
      pinned,
      createdAt: new Date().toISOString(),
    };
  }
  local.chatMessages[idx].pinned = pinned;
  writeDataFile(local);
  return local.chatMessages[idx];
}

export async function createSquishLog(): Promise<SquishLogItem> {
  if (await canUsePrisma()) {
    try {
      const created = await runWithTimeout(
        prisma.squishLog.create({ data: {} })
      );
      prismaAvailable = true;
      const logItem: SquishLogItem = {
        id: created.id,
        createdAt: created.createdAt.toISOString(),
      };
      const local = ensureDataFile();
      local.squishLogs.push(logItem);
      writeDataFile(local);
      return logItem;
    } catch {
      handlePrismaError();
    }
  }
  const local = ensureDataFile();
  const logItem: SquishLogItem = {
    id: `local-${crypto.randomUUID()}`,
    createdAt: new Date().toISOString(),
  };
  local.squishLogs.push(logItem);
  writeDataFile(local);
  return logItem;
}
