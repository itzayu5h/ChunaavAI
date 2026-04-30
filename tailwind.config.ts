import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary palette — used as saffron.* or india-saffron.*
        'india-saffron': {
          light: '#FFF3E0',
          DEFAULT: '#FF6F00',
          dark: '#E65100',
        },
        saffron: {
          light: '#FFF3E0',
          DEFAULT: '#FF6F00',
          dark: '#E65100',
        },
        // Navy — used as navy.* or india-navy.*
        'india-navy': {
          light: '#E8EAF6',
          DEFAULT: '#1A237E',
          dark: '#0D1453',
        },
        navy: {
          light: '#E8EAF6',
          DEFAULT: '#1A237E',
          dark: '#0D1453',
        },
        // Blue — used as india-blue.*
        'india-blue': {
          light: '#E3F2FD',
          DEFAULT: '#1565C0',
          dark: '#0D47A1',
        },
        // Green — used as india-green.*
        'india-green': {
          light: '#E8F5E9',
          DEFAULT: '#2E7D32',
          dark: '#1B5E20',
        },
        charcoal: '#212121',
        'text-secondary': '#757575',
      },
      fontFamily: {
        // Used as font-hindi and font-devanagari
        hindi: ['Noto Sans Devanagari', 'sans-serif'],
        devanagari: ['Noto Sans Devanagari', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
      },
    },
  },
  plugins: [],
}
export default config
