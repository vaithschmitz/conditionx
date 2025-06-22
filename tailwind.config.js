/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        surface: '#FFFFFF',
        bg: '#F9FAFB',
        border: '#E5E7EB',
        text: '#111827',
        'text-muted': '#6B7280',
        accent: '#22C55E',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};
