/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Instrument Sans"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'Menlo', 'monospace'],
      },
      colors: {
        pw: {
          bg: '#FAFAF9',
          surface: '#FFFFFF',
          subtle: '#F5F5F4',
          muted: '#E7E5E4',
          border: '#E7E5E4',
          'border-active': '#D6D3D1',
          text: '#1C1917',
          secondary: '#78716C',
          tertiary: '#A8A29E',
          accent: '#2563EB',
          'accent-hover': '#1D4ED8',
          'accent-subtle': '#EFF6FF',
          'accent-border': '#BFDBFE',
          success: '#16A34A',
          'success-subtle': '#F0FDF4',
          warning: '#D97706',
          'warning-subtle': '#FFFBEB',
          error: '#DC2626',
        }
      },
      borderRadius: {
        'pw-sm': '8px',
        'pw-md': '12px',
        'pw-lg': '16px',
        'pw-xl': '24px',
      },
      boxShadow: {
        'pw-sm': '0 1px 2px 0 rgba(28, 25, 23, 0.04)',
        'pw-card': '0 1px 3px 0 rgba(28, 25, 23, 0.05), 0 1px 2px -1px rgba(28, 25, 23, 0.05)',
        'pw-hover': '0 10px 25px -5px rgba(28, 25, 23, 0.08), 0 8px 10px -6px rgba(28, 25, 23, 0.04)',
        'pw-dropdown': '0 20px 25px -5px rgba(28, 25, 23, 0.1), 0 8px 10px -6px rgba(28, 25, 23, 0.04)',
      }
    },
  },
  plugins: [],
}

