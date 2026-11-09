import type { Config } from "tailwindcss";
import daisyui from "daisyui";

interface TailwindConfigWithDaisyUI extends Config {
  daisyui?: {
    themes?: string[];
  };
}

const config: TailwindConfigWithDaisyUI = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        playfair: ["var(--font-playfair)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        desk: {
          wood: "#8B6914",
          warm: "#F5E6D3",
          cork: "#C4954A",
        },
      },
      keyframes: {
        "train-pass": {
          "0%": { transform: "translateX(120%)" },
          "100%": { transform: "translateX(-120%)" },
        },
        "float-heart": {
          "0%": { transform: "translateY(0) scale(1)", opacity: "1" },
          "100%": { transform: "translateY(-80px) scale(1.5)", opacity: "0" },
        },
      },
      animation: {
        "train-pass": "train-pass 8s linear infinite",
        "float-heart": "float-heart 1.5s ease-out forwards",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light"],
  },
};

export default config;
