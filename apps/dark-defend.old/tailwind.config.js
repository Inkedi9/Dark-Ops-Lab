/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#05070b",
        panel: "#101418",
        card: "#151a20",
        border: "#2a3038",
        accent: "#2dd4bf",
        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",
        muted: "#94a3b8",
      },
    },
  },
  plugins: [],
};
