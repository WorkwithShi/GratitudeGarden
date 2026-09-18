/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        handwriting: ['Caveat', 'cursive'],
      },
      keyframes: {
        bloom: {
          '0%': { transform: 'scale(0.3) translateY(20px)', opacity: '0' },
          '70%': { transform: 'scale(1.08) translateY(-4px)', opacity: '1' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        sparklePop: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '0' },
          '50%': { transform: 'scale(1.2) rotate(90deg)', opacity: '1' },
          '100%': { transform: 'scale(0) rotate(180deg)', opacity: '0' },
        },
      },
      animation: {
        bloom: 'bloom 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        sparkle: 'sparklePop 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
}
