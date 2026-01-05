
// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     './app/**/*.{js,ts,jsx,tsx,mdx}',
//     './components/**/*.{js,ts,jsx,tsx,mdx}',
//   ],
//   theme: {
//     extend: {
//       animation: {
//         'fade-in': 'fadeIn 0.5s ease-in',
//         'slide-up': 'slideUp 0.5s ease-out',
//         'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
//         'bounce-slow': 'bounce 2s infinite',
//       },
//       keyframes: {
//         fadeIn: {
//           '0%': { opacity: '0' },
//           '100%': { opacity: '1' },
//         },
//         slideUp: {
//           '0%': { transform: 'translateY(20px)', opacity: '0' },
//           '100%': { transform: 'translateY(0)', opacity: '1' },
//         },
//       },
//       colors: {
//         primary: '#3b82f6',
//         secondary: '#8b5cf6',
//         accent: '#ec4899',
//       },
//       backdropBlur: {
//         xs: '2px',
//       }
//     },
//   },
//   plugins: [
//     require('@tailwindcss/forms'),
//     require('@tailwindcss/typography'),
//   ],
// }