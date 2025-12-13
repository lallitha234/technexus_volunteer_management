export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        slate: {
          750: '#1e2e48',
          850: '#0f1419',
          950: '#0a0e13',
        },
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
