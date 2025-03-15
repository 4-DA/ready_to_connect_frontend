
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8A2BE2', // Vibrant purple
          dark: '#6A1B9A',
          light: '#9D4EDD',
        },
        dark: {
          DEFAULT: '#121212', // Near black
          light: '#1E1E1E',
          lighter: '#2D2D2D',
        }
      },
    },
  },
  plugins: [],
}
