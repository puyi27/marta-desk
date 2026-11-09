import { NextResponse } from "next/server";
import { createSquishLog } from "@/lib/db";

function getTimeOfDayMessage(): string {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 12) {
    return "¡Buenos días! 🌅 Marta ha apretado al perrito salchicha esta mañana pensando en ti. ¡Empieza el día con amor!";
  }
  if (hour >= 12 && hour < 15) {
    return "¡Hora de comer! 🍽️ Marta está apretando al perrito salchicha al mediodía. Seguro que te echa de menos mientras estudia.";
  }
  if (hour >= 15 && hour < 20) {
    return "¡Buenas tardes! ☀️ Marta ha dado un apretón al peluche salchicha. Está en su escritorio pensando en ti.";
  }
  if (hour >= 20 && hour < 24) {
    return "¡Buenas noches! 🌙 Marta está apretando al perrito salchicha antes de dormir. Te manda todo su amor desde el escritorio.";
  }
  return "🌃 Marta está despierta a estas horas apretando al perrito salchicha. Cuídala mucho (o cuídate tú también, que se hace tarde).";
}

export async function POST() {
  const message = getTimeOfDayMessage();

  try {
    await createSquishLog();
  } catch {}

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId || token === "your_telegram_bot_token") {
    return NextResponse.json({ success: true, mocked: true, message });
  }

  try {
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );

    if (!telegramResponse.ok) {
      return NextResponse.json({ success: false, fallbackMessage: message });
    }

    return NextResponse.json({ success: true, message });
  } catch {
    return NextResponse.json({ success: false, fallbackMessage: message });
  }
}
