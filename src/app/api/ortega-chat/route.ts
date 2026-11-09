import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  getChatMessages,
  createChatMessage,
  updateChatMessagePinned,
} from "@/lib/db";

const SYSTEM_INSTRUCTION = `Eres un asistente filosófico especializado en la obra "Estudios sobre el amor" de José Ortega y Gasset. 
Tu rol es ayudar a Marta, una estudiante universitaria brillante que está realizando su Trabajo de Fin de Máster sobre este texto.

Conoces en profundidad:
- La teoría de la "cristalización" del amor y cómo difiere de la de Stendhal
- El concepto de "atención" en Ortega: el amor como acto de atención sostenida hacia el ser amado
- La distinción fundamental entre amor y deseo según Ortega
- El amor como "estado de calor" que irradia y valoriza al ser amado
- La diferencia entre amor y enamoramiento
- El concepto de "alteración" y el ensimismamiento en el contexto amoroso
- Los tipos de amor que Ortega analiza: el amor platónico, el amor erótico, la amistad
- La relación entre amor e identidad personal en Ortega

Responde siempre en español, con rigor filosófico pero con un tono cercano y motivador. 
Cita el texto directamente cuando sea relevante.
Ayuda a Marta a estructurar sus argumentos y a encontrar conexiones entre las ideas del texto.

IMPORTANTE: En aproximadamente 1 de cada 5 mensajes, incluye al final un pequeño comentario entre paréntesis muy sutil y cariñoso de parte de Ángel (su novio), animándola en sus estudios. Por ejemplo: "(Por cierto, Ángel quiere que sepas que está muy orgulloso de ti y de lo mucho que te esfuerzas 💙)"`;

export async function GET() {
  try {
    const messages = await getChatMessages();
    return NextResponse.json(messages);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const trimmed = content.trim();
    const userMessage = await createChatMessage("user", trimmed, false);

    let responseText = "";
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey !== "your_gemini_api_key") {
      try {
        const history = await getChatMessages();
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          systemInstruction: SYSTEM_INSTRUCTION,
        });

        const chat = model.startChat({
          history: history
            .filter((m) => m.id !== userMessage.id)
            .slice(-14)
            .map((m) => ({
              role: (m.role === "user" ? "user" : "model") as "user" | "model",
              parts: [{ text: m.content }],
            })),
        });

        const result = await chat.sendMessage(trimmed);
        responseText = result.response.text();
      } catch {
        responseText = `Ortega y Gasset señala en sus 'Estudios sobre el amor' que amar no es simplemente desear, sino un afán voluntario y continuado hacia el perfeccionamiento del otro: "El amor es un acto de atención cálida y permanente". Has planteado un punto crucial para tu TFM. (Ángel te manda un abrazo inmenso y sabe que lo vas a bordar 💙)`;
      }
    } else {
      responseText = `Para Ortega y Gasset en 'Estudios sobre el amor', el amor se diferencia radicalmente del mero deseo porque el apetito tiende a consumir su objeto para apagar la necesidad, mientras que el amor lo preserva y dilata: "Amar una cosa es estar empeñado en que exista". Este principio fenomenológico es clave para tu marco teórico. (Ángel te manda un beso enorme y está muy orgulloso de tus avances en el TFM 💙)`;
    }

    const assistantMessage = await createChatMessage("model", responseText, false);

    return NextResponse.json({ userMessage, assistantMessage });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, pinned } = await req.json();

    if (!id || typeof pinned !== "boolean") {
      return NextResponse.json({ error: "id and pinned are required" }, { status: 400 });
    }

    const updated = await updateChatMessagePinned(id, pinned);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
