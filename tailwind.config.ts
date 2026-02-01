import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'univr-red': '#B91C1C',
        'univr-red-light': '#DC2626',
        'univr-red-dark': '#991B1B',
        'univr-gold': '#D4A34A',
        /* ULSS 9 Scaligera – aulss9.veneto.it style (blue primary, green accent) */
        'ulss9': {
          primary: '#0066A1',
          'primary-dark': '#004D7A',
          'primary-light': '#0080CC',
          green: '#00875A',
          'green-light': '#00A86B',
          dark: '#1a365d',
          gray: '#4a5568',
        },
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.4s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
