/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    fontFamily: {
      serif: ['Rhau', 'serif'],
      sans: ['helvetica-neue-lt-pro', 'sans-serif'],
    },

    fontSize: {
      px12: ['0.75rem', {
        lineHeight: '1',
      }],
      
      'px67': ['6.7rem', {
        lineHeight: '0.79',
        letterSpacing: '-0.03em',
      }],
    },

    extend: {
      screens: {
        '2xs': '375px',
        xs: '475px',
      },
    },
  },
  plugins: [],
}

