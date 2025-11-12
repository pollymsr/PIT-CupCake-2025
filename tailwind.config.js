/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./{src,components,pages,utils,lib,hooks,context}/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pink-cupcake': '#FF69B4', // Cor principal do tema
        'pink-light': '#FFC0CB',
        'pink-dark': '#C71585',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
    },
  },
  plugins: [],
}
