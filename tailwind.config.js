/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display:   ['Tottenham', '"Barlow Condensed"', 'Impact', 'sans-serif'],
        condensed: ['"Barlow Condensed"', 'sans-serif'],
        body:      ['"Barlow"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': '11px',
        xs:    '12px',
        sm:    '14px',
        md:    '16px',
        lg:    '18px',
        xl:    '22px',
        '2xl': '28px',
        '3xl': '36px',
        '4xl': '48px',
        '5xl': '64px',
      },
      colors: {
        navy: {
          DEFAULT: '#070f1e',
          mid:     '#101c33',
          soft:    '#1a2942',
          light:   '#122540',  // legacy alias used by .input
          line:    '#25375a',
          strong:  '#34507e',
        },
        gold: {
          DEFAULT: '#f1b813',
          light:   '#f7cd54',
          dark:    '#c8960a',
          dim:     '#c8960a',  // legacy alias for older components
        },
        cream: {
          DEFAULT: '#f5f0e8',
          dark:    '#e7ddcc',
          line:    '#d8ccb6',
        },
        ink:   '#0a1322',
        muted: '#8fa1bd',
        faint: '#5d6f8c',
        success: '#2ec18d',
        danger:  '#e2493f',
        info:    '#3b9ae1',
        // Skill rating ramp (0–10 bands)
        rating: {
          low:   '#e2493f',
          mid:   '#f97316',
          high:  '#06b6d4',
          elite: '#f1b813',
        },
        band: {
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
      boxShadow: {
        sm:        'var(--shadow-sm)',
        md:        'var(--shadow-md)',
        lg:        'var(--shadow-lg)',
        card:      'var(--shadow-card)',
        glow:      'var(--glow-gold)',
        'glow-lg': 'var(--glow-gold-lg)',
        light:     'var(--shadow-light)',
      },
      borderRadius: {
        xs:   'var(--radius-xs)',
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        xl:   'var(--radius-xl)',
        pill: 'var(--radius-pill)',
      },
      transitionTimingFunction: {
        'ease-out-soft': 'var(--ease-out)',
        spring:          'var(--ease-spring)',
      },
      transitionDuration: {
        fast: 'var(--dur-fast)',
        DEFAULT: 'var(--dur)',
        slow: 'var(--dur-slow)',
      },
      screens: {
        // Mobile-first redesign breakpoints from README.
        // Override Tailwind defaults so naming matches the design tokens.
        sm: '560px',
        md: '680px',
        lg: '980px',
        xl: '1180px',
      },
      maxWidth: {
        content: 'var(--content-max)',
      },
      spacing: {
        'header-h': 'var(--header-h)',
        'tabbar-h': 'var(--tabbar-h)',
      },
    },
  },
  plugins: [],
}
