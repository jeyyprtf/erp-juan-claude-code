/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Soft Operations Design System tokens
        background: '#F0F2F5',
        surface: '#FFFFFF',
        'surface-dim': '#cbdbf5',
        'surface-bright': '#f8f9ff',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#eff4ff',
        'surface-container': '#e5eeff',
        'surface-container-high': '#dce9ff',
        'surface-container-highest': '#d3e4fe',
        'on-surface': '#0b1c30',
        'on-surface-variant': '#414751',
        outline: '#717783',
        'outline-variant': '#c1c7d3',
        primary: {
          DEFAULT: '#4A90E2',
          container: '#2976c7',
          fixed: '#d4e3ff',
          'fixed-dim': '#a4c9ff',
        },
        secondary: {
          DEFAULT: '#3b608f',
          container: '#a5c9fe',
        },
        tertiary: '#595c5f',
        error: '#ba1a1a',
        'pastel-blue': '#A5C9FF',
        'slate-blue': '#4A90E2',
        'neutral-grey': '#64748b',
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
        'neu-extruded': '4px 4px 8px rgba(163, 177, 198, 0.4), -4px -4px 8px rgba(255, 255, 255, 0.9)',
        'neu-extruded-sm': '2px 2px 4px rgba(163, 177, 198, 0.3), -2px -2px 4px rgba(255, 255, 255, 0.8)',
        'neu-extruded-lg': '8px 8px 16px rgba(163, 177, 198, 0.45), -8px -8px 16px rgba(255, 255, 255, 0.95)',
        'neu-inset': 'inset 4px 4px 8px rgba(163, 177, 198, 0.4), inset -4px -4px 8px rgba(255, 255, 255, 0.9)',
        'neu-inset-sm': 'inset 2px 2px 4px rgba(163, 177, 198, 0.3), inset -2px -2px 4px rgba(255, 255, 255, 0.8)',
        'neu-button': '4px 4px 8px rgba(74, 144, 226, 0.25), -4px -4px 8px rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(74, 144, 226, 0.15)',
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
