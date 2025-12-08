/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: { 'space_cadet': { DEFAULT: '#2b2d42', 100: '#08090d', 200: '#11121a', 300: '#191b27', 400: '#222334', 500: '#2b2d42', 600: '#4a4d72', 700: '#6d71a0', 800: '#9da0bf', 900: '#ced0df' }, 'cool_gray': { DEFAULT: '#8d99ae', 100: '#1a1e25', 200: '#343c4a', 300: '#4f5b6f', 400: '#697994', 500: '#8d99ae', 600: '#a4aebf', 700: '#bbc2cf', 800: '#d2d6df', 900: '#e8ebef' }, 'anti-flash_white': { DEFAULT: '#edf2f4', 100: '#24353b', 200: '#496a77', 300: '#759bab', 400: '#b1c6cf', 500: '#edf2f4', 600: '#f0f4f6', 700: '#f4f7f8', 800: '#f7fafa', 900: '#fbfcfd' }, 'red_(pantone)': { DEFAULT: '#ef233c', 100: '#330409', 200: '#660813', 300: '#9a0c1c', 400: '#cd0f26', 500: '#ef233c', 600: '#f25063', 700: '#f57c8a', 800: '#f8a8b1', 900: '#fcd3d8' }, 'fire_engine_red': { DEFAULT: '#d90429', 100: '#2b0108', 200: '#560210', 300: '#810318', 400: '#ac0420', 500: '#d90429', 600: '#fa1b40', 700: '#fc5470', 800: '#fd8da0', 900: '#fec6cf' } }
    },
  },
  plugins: [],
}
