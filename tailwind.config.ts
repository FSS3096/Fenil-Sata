import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#050608",
        void: "#090a0d",
        glass: "rgba(255,255,255,0.065)",
        copper: "#C4432A",
        cyan: "#72F2FF",
        ivory: "#F7F5F0"
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["DM Sans", "Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 60px rgba(114,242,255,0.16)",
        copper: "0 0 42px rgba(196,67,42,0.24)"
      },
      backgroundImage: {
        "radial-noise":
          "radial-gradient(circle at 20% 15%, rgba(114,242,255,0.14), transparent 26%), radial-gradient(circle at 80% 10%, rgba(196,67,42,0.14), transparent 24%), linear-gradient(180deg, #050608 0%, #0b0c10 52%, #050608 100%)"
      }
    }
  },
  plugins: []
} satisfies Config;
