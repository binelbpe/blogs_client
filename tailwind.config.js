/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0FA3B1", // Teal
        secondary: "#B5E2FA", // Light Blue
        background: "#F9F7F3", // Off White
        accent: "#EDDEA4", // Light Yellow
        highlight: "#F7A072", // Coral
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
