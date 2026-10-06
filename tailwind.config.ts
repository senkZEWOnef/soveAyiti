import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef3fb',
          100: '#d9e4f5',
          200: '#b3c9ea',
          300: '#7fa1d6',
          400: '#4a74bb',
          500: '#2a529a',
          600: '#1c3d7a',
          700: '#152f60',
          800: '#0f2248',
          900: '#0a1832',
        },
        cream: {
          50: '#fffdf9',
          100: '#faf7f0',
          200: '#f2ecde',
          300: '#e6dcc6',
        },
        flag: {
          500: '#c8374a',
          600: '#a92b3c',
          700: '#8a2230',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
