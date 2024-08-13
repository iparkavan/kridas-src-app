import formsPlugin from '@tailwindcss/forms';
import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        deepForest: '#122A26',
        deepForest80: '#305953',
        deepForestGray: '#51605E',
        gray: '#545454',
        gray50: '#ADADAD',
        gray70: '#7E7E7E',
        coco: '#2E2D29',
        cocoGray: '#2E2D29E5',
        grayGreen30: '#F8F8F8',
        grayGreen50: '#F2F2F2',
        grayGreen70: '#E3E5E4',
        grayGreen100: '#C3CAC9',
        teal: '#3A9289',
        tealLight: '#DFF5F4',
        mint: '#3B968B',
        tomato: '#FF541E',
        pink: '#FFEDED',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
    fontFamily: { sans: ['Suisse'] },
  },
  plugins: [formsPlugin, tailwindcssAnimate],
};
