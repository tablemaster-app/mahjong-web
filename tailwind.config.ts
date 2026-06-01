import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'mj-bg':     '#0d3b2e',
        'mj-card':   '#1a4a38',
        'mj-border': '#2a6a50',
        'mj-text':   '#f5f0e8',
        'mj-muted':  '#9ab8a8',
      },
    },
  },
  plugins: [],
};
export default config;
