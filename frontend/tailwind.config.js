/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cerulean: {
          DEFAULT: "#008080",
          light: "#20B2AA",
          dark: "#006666",
        },
        burgundy: {
          DEFAULT: "#722F37",
          light: "#8B3A42",
          dark: "#5A252C",
        },
        bg: {
          DEFAULT: "#080c10",
          card: "#0d1117",
          elevated: "#161b22",
        },
        foreground: {
          DEFAULT: "#e6edf3",
          muted: "#8b949e",
        },
        border: {
          DEFAULT: "rgba(255, 255, 255, 0.10)",
          light: "rgba(255, 255, 255, 0.15)",
        },
      },
      fontFamily: {
        sans: ["EB Garamond", "Garamond", "Georgia", "serif"],
      },
      backdropBlur: {
        glass: "24px",
      },
      borderRadius: {
        glass: "20px",
      },
      boxShadow: {
        glass:
          "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
        "glass-hover":
          "0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
        glow: "0 0 20px rgba(0, 128, 128, 0.3)",
        "glow-burgundy": "0 0 20px rgba(114, 47, 55, 0.3)",
      },
    },
  },
  plugins: [],
};
