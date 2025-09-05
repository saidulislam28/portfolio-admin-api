/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#036280",
        // primary: "#95d7de",
        "input-border": "#e5e7eb",
        "hero-banner": "#E1F2F4",
        "black-text": "#222222",
        "text-secondary": "#797979",
        "body-background": "#f8f8f8",
        "color-yellow": "#ffbb38",
        "text-secondary": "#797979",
        "border-light": "#e5e7eb",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["Fira Code", "monospace"],
        inter: ["var(--font-inter)"],
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
};