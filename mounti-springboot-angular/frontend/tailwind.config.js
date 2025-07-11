/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Mediterranean theme colors
        'navy': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#1e293b',
          700: '#0f172a',
          800: '#020617',
          900: '#0c1220',
        },
        'mint': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        'mediterranean': '0 4px 6px -1px rgba(30, 41, 59, 0.1), 0 2px 4px -1px rgba(30, 41, 59, 0.06)',
        'mediterranean-lg': '0 10px 15px -3px rgba(30, 41, 59, 0.1), 0 4px 6px -2px rgba(30, 41, 59, 0.05)',
      }
    },
  },
  plugins: [],
}