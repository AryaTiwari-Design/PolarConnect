/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 950: '#07131f', 900: '#0a1b2e', 800: '#10294a', 700: '#1a3b66', 600: '#2c5588' },
        glacier: { 50: '#f4f9fc', 100: '#e3eff8', 200: '#c6dff0', 300: '#9bc6e3', 400: '#66a8d4', 500: '#3b8fc4', 600: '#2275a9', 700: '#1b5d87' },
        aurora: { 300: '#8aeed7', 400: '#3ddbb9', 500: '#1fbf9f', 600: '#10a585', 700: '#0c7f68' },
        ember: { 300: '#fad58a', 400: '#f6b544', 500: '#e99a1b', 600: '#c47a0c' },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Figtree', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
