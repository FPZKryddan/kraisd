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
        light: '#374151',
        black: '#000000',
        muted: '#D1D5DB'
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#E5E5E5',
        muted: '#A0A3B1',
        black: '#000'
      }
    },
    extend: { 
      dropShadow: {
        '3xl': '0 12px 4px rgba(0, 0, 0, 0.25)'
      },
      transitionProperty: {
        'right': 'right'
      }
    },
  },
  plugins: [],
};
