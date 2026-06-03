/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#070f1e',
          mid: '#0d1f38',
          light: '#122540',
        },
        gold: {
          DEFAULT: '#f1b813',
          dim: '#c99800',
          light: '#ffd84d',
        },
        cream: '#f5f0e8',
      },
    },
  },
  plugins: [],
}
