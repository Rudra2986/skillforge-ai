/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#0D0F12',
          subtle: '#13161C',
          surface: '#181C24',
          elevated: '#202530',
        },
        border: {
          subtle: '#222733',
          DEFAULT: '#2D3444',
          strong: '#3F485D',
        },
        accent: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          subtle: '#1E293B',
          text: '#60A5FA',
        },
        success: {
          DEFAULT: '#059669',
          subtle: '#064E3B',
          text: '#34D399',
        },
        warning: {
          DEFAULT: '#D97706',
          subtle: '#78350F',
          text: '#FBBF24',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.3)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
