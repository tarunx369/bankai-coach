import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        ink: {
          950: '#080D18',
          900: '#0B1220',
          800: '#131D33',
          700: '#1B2841',
          600: '#293A5C',
          500: '#3E5480',
        },
        paper: {
          50: '#F8F6F0',
          100: '#F1EEE4',
          200: '#E5E0D2',
        },
        gold: {
          400: '#EDB666',
          500: '#E3A542',
          600: '#C6832B',
          700: '#9C6720',
        },
        mint: {
          400: '#4ADE9C',
          500: '#34D399',
          600: '#22B27E',
        },
        coral: {
          400: '#F88C8C',
          500: '#F76C6C',
          600: '#E4504F',
        },
      },
      boxShadow: {
        glass: '0 8px 32px rgba(8, 13, 24, 0.28)',
        'glass-sm': '0 4px 16px rgba(8, 13, 24, 0.18)',
      },
      backdropBlur: {
        glass: '18px',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        rise: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
      },
      animation: {
        rise: 'rise 0.35s ease-out both',
        pulseSoft: 'pulseSoft 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [typography],
}
