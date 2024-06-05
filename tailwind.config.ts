import type { Config } from 'tailwindcss'
const { nextui } = require('@nextui-org/react')
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#0d308c',
        'primary-purple': '#6965e0',
      },
    },
    screens: {
      xs: '475px',
      '13inch': '1350px',
      '2xxl': '1700px',
      '3xl': '1940px',
      ...defaultTheme.screens,
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {},
        },
        dark: {
          colors: {},
        },
      },
    }),
  ],
}
export default config
