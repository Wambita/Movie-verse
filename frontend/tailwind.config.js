/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/features/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#9C27B0', // purple-500
          DEFAULT: '#6A1B9A', // purple-800
          dark: '#4A148C', // purple-900
        },
        accent: {
          light: '#E1BEE7', // purple-100
          DEFAULT: '#8E24AA', // purple-600
          dark: '#4A148C', // purple-900
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.25)',
          DEFAULT: 'rgba(255, 255, 255, 0.15)',
          dark: 'rgba(0, 0, 0, 0.3)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(8px)',
      },
    },
  },
  plugins: [],
  darkMode: 'class', // Enable dark mode with class strategy
};