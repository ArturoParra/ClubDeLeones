/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#000000',    // Negro
        'secondary': '#E3672D',  // Naranja
        'accent': '#FEC80B',     // Amarillo
        'neutral': '#9ca3af'      //Gris
      }
    },
  },
  plugins: [],
}

