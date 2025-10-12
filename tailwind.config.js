/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        onPrimary: "var(--onPrimary)",
        secondary: "var(--secondary)",
        background: "var(--background)",
        surface: "var(--surface)",
        accent: "var(--accent)",
        accentDark: "var(--accent-dark)",
        accentLight: "var(--accent-light)",
        borderColor: "var(--border)",
      },
    },
  },
  plugins: [],
};
