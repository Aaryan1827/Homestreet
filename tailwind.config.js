/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'surface-soft': 'var(--color-surface-soft)',
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        ink: 'var(--color-ink)',
        muted: 'var(--color-muted)',
        border: 'var(--color-border)',
        safe: 'var(--color-safe)',
        caution: 'var(--color-caution)',
        danger: 'var(--color-danger)',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '20px',
        'card-lg': '24px',
      },
      boxShadow: {
        card: '0 4px 20px rgba(var(--shadow-color) / 0.12), 0 1px 4px rgba(var(--shadow-color) / 0.08)',
        'card-lg': '0 8px 32px rgba(var(--shadow-color) / 0.16), 0 2px 8px rgba(var(--shadow-color) / 0.10)',
      },
      transitionDuration: {
        theme: '600ms',
      },
    },
  },
  plugins: [],
}
