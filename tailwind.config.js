export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          300: '#93c5fd',
          500: '#2563eb',
          700: '#1d4ed8',
          900: '#172554'
        },
        surface: {
          950: '#020617',
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155'
        }
      },
      boxShadow: {
        glass: '0 20px 120px rgba(15, 23, 42, 0.35)'
      }
    }
  },
  plugins: []
};
