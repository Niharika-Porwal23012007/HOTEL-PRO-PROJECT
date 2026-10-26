/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAF8F5',
        surface: '#FFFFFF',
        text: '#1C1917',
        muted: '#6B645C',
        border: '#E7E2DA',
        primary: {
          DEFAULT: '#115E59',
          hover: '#0D4A46',
        },
        accent: '#C2410C',
        success: '#15803D',
        warning: '#B45309',
        error: '#B91C1C',
      },
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      fontSize: {
        '14': '14px',
        '16': '16px',
        '18': '18px',
        '24': '24px',
        '32': '32px',
        '48': '48px',
      },
      borderRadius: {
        'input': '8px',
        'card': '12px',
      },
      spacing: {
        '8': '8px',
      },
      maxWidth: {
        'content': '1200px',
      },
    },
  },
  plugins: [],
}
