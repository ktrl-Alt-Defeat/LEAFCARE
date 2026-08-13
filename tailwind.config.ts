import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        agro: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
          950: '#052E16',
        },
        earth: {
          50: '#FAF8F5',
          100: '#F4EFE6',
          200: '#E6DBCB',
          500: '#8B5CF6',
          700: '#78350F',
          900: '#451A03',
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(22, 163, 74, 0.08), 0 1px 4px -1px rgba(0, 0, 0, 0.04)',
        'soft-md': '0 6px 20px -4px rgba(22, 163, 74, 0.12), 0 2px 8px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 12px 32px -6px rgba(22, 163, 74, 0.16), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
        'glow': '0 0 25px rgba(34, 197, 94, 0.4)',
      },
      animation: {
        'scan-line': 'scanLine 2.5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        scanLine: {
          '0%, 100%': { top: '5%' },
          '50%': { top: '90%' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.03)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
