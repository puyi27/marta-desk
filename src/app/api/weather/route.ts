import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey || apiKey === "your_openweather_api_key") {
    return NextResponse.json({
      temp: 18,
      condition: "despejado",
      icon: "01d",
      humidity: 50,
    });
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=Sevilla,es&units=metric&appid=${apiKey}`,
      { next: { revalidate: 300 } }
    );

    if (!response.ok) {
      return NextResponse.json({
        temp: 18,
        condition: "despejado",
        icon: "01d",
        humidity: 50,
      });
    }

    const data = await response.json();

    return NextResponse.json({
      temp: Math.round(data.main.temp),
      condition: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
    });
  } catch {
    return NextResponse.json({
      temp: 18,
      condition: "despejado",
      icon: "01d",
      humidity: 50,
    });
  }
}
