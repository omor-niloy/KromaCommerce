/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pure: {
          black: '#000000',
          white: '#ffffff',
          blue: '#0000ff',
          red: '#ff0000',
          green: '#00aa00',
          yellow: '#ffff00',
        }
      },
      borderRadius: {
        none: '0px',
      }
    },
  },
  plugins: [],
};
