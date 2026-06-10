/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Soft Operations Design System tokens
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'surface-dim': 'var(--color-surface-dim)',
        'surface-bright': 'var(--color-surface-bright)',
        'surface-container-lowest': 'var(--color-surface-container-lowest)',
        'surface-container-low': 'var(--color-surface-container-low)',
        'surface-container': 'var(--color-surface-container)',
        'surface-container-high': 'var(--color-surface-container-high)',
        'surface-container-highest': 'var(--color-surface-container-highest)',
        'on-surface': 'var(--color-on-surface)',
        'on-surface-variant': 'var(--color-on-surface-variant)',
        outline: 'var(--color-outline)',
        'outline-variant': 'var(--color-outline-variant)',
        primary: {
          DEFAULT: 'var(--color-primary)',
          container: 'var(--color-primary-container)',
          fixed: 'var(--color-primary-fixed)',
          'fixed-dim': 'var(--color-primary-fixed-dim)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          container: 'var(--color-secondary-container)',
        },
        tertiary: 'var(--color-neutral-grey)',
        error: 'var(--color-error)',
        'pastel-blue': 'var(--color-pastel-blue)',
        'slate-blue': 'var(--color-slate-blue)',
        'neutral-grey': 'var(--color-neutral-grey)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'headline-lg': ['30px', { lineHeight: '38px', fontWeight: '700', letterSpacing: '-0.02em' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600', letterSpacing: '-0.01em' }],
        'headline-sm': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'label-lg': ['14px', { lineHeight: '20px', fontWeight: '600' }],
        'label-md': ['12px', { lineHeight: '16px', fontWeight: '500' }],
      },
      borderRadius: {
        'sm': '0.25rem',
        DEFAULT: '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.5rem',
        '2xl': '2rem',
        'full': '9999px',
      },
      boxShadow: {
        // Neumorphic shadows - Accessible Neumorphism
        'neu-flat': '0 0 0 0 rgba(0,0,0,0)',
        'neu-extruded': 'var(--shadow-extruded)',
        'neu-extruded-sm': 'var(--shadow-extruded-sm)',
        'neu-extruded-lg': 'var(--shadow-extruded-lg)',
        'neu-inset': 'var(--shadow-inset)',
        'neu-inset-sm': 'var(--shadow-inset-sm)',
        'neu-button': 'var(--shadow-button)',
      },
      spacing: {
        'gutter': '24px',
        'margin': '32px',
        'bento-gap': '16px',
      },
    },
  },
  plugins: [],
};
