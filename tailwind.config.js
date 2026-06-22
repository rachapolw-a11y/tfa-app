/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display:   ['Spurs', 'sans-serif'],
        condensed: ['"Barlow Condensed"', 'sans-serif'],
        body:      ['"Barlow"', 'sans-serif'],
      },
      colors: {
        navy: {
          DEFAULT: '#070f1e',
          mid:     '#101c33',
          soft:    '#1a2942',
          light:   '#122540',
          line:    '#25375a',
        },
        gold: {
          DEFAULT: '#f1b813',
          light:   '#f7cd54',
          dim:     '#c8960a',
        },
        cream: {
          DEFAULT: '#f5f0e8',
          dark:    '#e7ddcc',
          line:    '#d8ccb6',
        },
        // Skill rating ramp
        rating: {
          low:   '#e2493f',
          mid:   '#f97316',
          high:  '#06b6d4',
          elite: '#f1b813',
        },
        // Pitch positions
        pos: {
          gk:  '#e0a92e',
          def: '#3b9ae1',
          mid: '#2ec18d',
          fwd: '#e25563',
        },
        // Lead funnel status
        status: {
          new:      '#7286a0',
          trial:    '#3b9ae1',
          attended: '#8b6fc9',
          offer:    '#f1b813',
          paid:     '#2ec18d',
          enrolled: '#1aa769',
        },
      },
    },
  },
  plugins: [],
}
