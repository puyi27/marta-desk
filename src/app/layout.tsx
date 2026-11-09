import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "El Rincón de Marta | Lofi Desk",
  description:
    "Un espacio de estudio interactivo, cálido y personal para Marta, con música de los 80, Ortega y Gasset y recuerdos especiales.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
        <Toaster position="bottom-right" richColors theme="dark" />
      </body>
    </html>
  );
}
