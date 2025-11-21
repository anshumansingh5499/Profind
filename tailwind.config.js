/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#b30328",
        secondary: "#FFD966",
        background: "#ffff",
      },
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
        // outfit: ["Lobster", "sans-serif"],
      },
    },
  },
  plugins: [],
};
