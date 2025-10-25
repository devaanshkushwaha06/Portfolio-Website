/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-gold': '#ffd700',
        'secondary-gold': '#b8860b',
        'accent-gold': '#daa520',
        'dark-bg': '#1a1a2e',
        'darker-bg': '#16213e',
        'purple-accent': '#6b4f96',
        'cyan-accent': '#00d2d3',
        'text-light': '#f0f0f0',
        'text-gold': '#f0c674'
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif']
      },
      animation: {
        'liquid-float': 'liquid-float 20s ease-in-out infinite',
        'particle-float': 'particle-float 12s linear infinite',
        'morph-shape': 'morph-shape 20s ease-in-out infinite',
      },
      keyframes: {
        'liquid-float': {
          '0%, 100%': {
            transform: 'translate(0, 0) rotate(0deg) scale(1)'
          },
          '25%': {
            transform: 'translate(30px, -50px) rotate(90deg) scale(1.1)'
          },
          '50%': {
            transform: 'translate(-20px, 30px) rotate(180deg) scale(0.9)'
          },
          '75%': {
            transform: 'translate(50px, 20px) rotate(270deg) scale(1.05)'
          }
        },
        'particle-float': {
          '0%': {
            transform: 'translateY(100vh) scale(0)',
            opacity: '0'
          },
          '10%': {
            opacity: '0.7',
            transform: 'scale(1)'
          },
          '90%': {
            opacity: '0.7'
          },
          '100%': {
            transform: 'translateY(-100px) scale(0)',
            opacity: '0'
          }
        },
        'morph-shape': {
          '0%, 100%': {
            'border-radius': '30% 70% 70% 30% / 30% 30% 70% 70%',
            transform: 'rotate(0deg) scale(1)'
          },
          '25%': {
            'border-radius': '70% 30% 30% 70% / 70% 70% 30% 30%',
            transform: 'rotate(90deg) scale(1.1)'
          },
          '50%': {
            'border-radius': '50% 50% 50% 50% / 50% 50% 50% 50%',
            transform: 'rotate(180deg) scale(0.9)'
          },
          '75%': {
            'border-radius': '40% 60% 60% 40% / 60% 40% 40% 60%',
            transform: 'rotate(270deg) scale(1.05)'
          }
        }
      }
    },
  },
  plugins: [],
}