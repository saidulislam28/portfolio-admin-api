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
        primary: "#FE5D26", // Changed from #036280 to orange
        "input-border": "#e5e7eb",
        "hero-banner": "#FFF5F0", // Updated to complement orange primary
        "black-text": "#222222",
        "text-secondary": "#797979",
        "body-background": "#fdf9f7", // Updated to complement orange primary
        "color-yellow": "#ffbb38",
        "border-light": "#e5e7eb",
        // Added complementary orange shades for design flexibility
        "primary-light": "#FF8A50",
        "primary-dark": "#C74A1E",
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