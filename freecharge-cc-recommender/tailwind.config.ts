import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Card-art gradients come from data (cards.ts), so Tailwind can't see them in
  // the source — safelist them or they'd be purged from the production build.
  safelist: [
    "from-orange-500",
    "to-amber-600",
    "from-orange-600",
    "to-red-600",
    "from-violet-500",
    "to-fuchsia-600",
    "from-blue-600",
    "to-indigo-700",
    "from-amber-500",
    "to-orange-700",
    "from-pink-500",
    "to-rose-600",
    "from-slate-700",
    "to-slate-900",
    "from-purple-700",
    "to-indigo-900",
  ],
  theme: {
    extend: {
      colors: {
        // FreechargeBiz brand — ORANGE on WHITE
        brand: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        accent: {
          500: "#f59e0b",
          600: "#d97706",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.45s ease-out both",
        "scale-in": "scale-in 0.3s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
