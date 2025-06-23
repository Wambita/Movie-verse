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
          light: '#4B5563', // gray-600
          DEFAULT: '#1F2937', // gray-800
          dark: '#111827', // gray-900
        },
        accent: {
          light: '#DBEAFE', // blue-100
          DEFAULT: '#3B82F6', // blue-500
          dark: '#1E40AF', // blue-800
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
  darkMode: 'class', // Enable dark mode with class strategy
};