

export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', 
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF0000',
        secondary: {
          100: '#CCCCCC',
          200: '#AAAAAA',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [
  ],
};
