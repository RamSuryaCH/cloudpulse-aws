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
        aws: {
          orange: '#FF9900',
          squid: '#232F3E',
          smile: '#FF9900',
          anchor: '#0073BB',
          dark: '#0F172A',
          card: '#1E293B',
          border: '#334155',
          neon: '#FF9900'
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(255, 153, 0, 0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(255, 153, 0, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
