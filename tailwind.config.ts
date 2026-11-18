import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#EDF0F3",
        ink: "#0E1116",
        cobalt: "#2340FF",
        mark: "#FFE24A"
      },
      fontFamily: {
        display: ["Archivo", "Helvetica Neue", "Arial", "sans-serif"],
        sans: ["Newsreader", "Georgia", "serif"]
      }
    }
  },
  plugins: []
} satisfies Config;
