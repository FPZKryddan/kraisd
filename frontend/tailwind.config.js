/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      primary: {
        indigo: '#202040',
        purple: '#543864'
      },
      secondary: {
        coral: '#FF6363',
        mustard: '#FFBD69'
      },
      accent: {
        green: '#10B981',
        blue: '#4F46E5'
      },
      neutral: {
        light: '#F5f5f5',
        soft: '#E5E7EB',
        muted: '#D1D5DB'
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#E5E5E5',
        muted: '#A0A3B1',
        black: '#000'
      }

    },
  },
  plugins: [],
}