import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inika)', 'Inika', 'serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#ff6b35',
          light: '#ff8a65',
          dark: '#e64a19',
        },
        'brand-violet': {
          DEFAULT: '#8e24aa',
          light: '#ab47bc',
          dark: '#6a1b9a',
        },
        'background-gold': '#886403',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      screens: {
        'max-h-568': { raw: '(max-height: 568px)' }, // iPhone SE 1st gen, very small
        'max-h-667': { raw: '(max-height: 667px)' },
        violet: '768px', // Custom breakpoint for violet theme
      },
    },
  },
  plugins: [
    function ({ addUtilities }: { addUtilities: any }) {
      const newUtilities = {
        '.hocus\\:bg-brand-light:hover': {
          'background-color': '#ff8a65',
        },
        '.hocus\\:bg-brand-light:focus': {
          'background-color': '#ff8a65',
        },
        '.violet\\:enabled\\:hocus\\:bg-brand-violet-light:enabled:hover': {
          'background-color': '#ab47bc',
        },
        '.violet\\:enabled\\:hocus\\:bg-brand-violet-light:enabled:focus': {
          'background-color': '#ab47bc',
        },
        '.focus-visible\\:styled-outline:focus-visible': {
          outline: '2px solid #ff6b35',
          'outline-offset': '2px',
        },
      }
      addUtilities(newUtilities)
    },
  ],
}
export default config
