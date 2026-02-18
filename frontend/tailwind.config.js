/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        mine: {
          red: '#ef4444',
          orange: '#f97316',
          yellow: '#eab308',
        },
        stacks: {
          purple: '#5546FF', // Stacks purple
          black: '#12151A',  // Stacks black
          white: '#FFFFFF',  // Stacks white
          gradient1: '#5546FF',
          gradient2: '#7B6FFF',
          gradient3: '#B7B0FF',
        }
      },
      animation: {
        'cell-reveal': 'cellReveal 0.2s ease-out',
        'mine-explode': 'mineExplode 0.5s ease-out',
      },
      keyframes: {
        cellReveal: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        mineExplode: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.5)', backgroundColor: '#ef4444' },
          '100%': { transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
}
