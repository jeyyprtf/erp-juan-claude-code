// Soft Operations Design System Tokens
// Single source of truth for design variables across the React app.
// Mirrors the tokens defined in tailwind.config.js for use in JS (e.g. inline styles, charts).

export const colors = {
  background: '#FAF8F6',
  surface: '#FFFFFF',
  primary: '#E25C37',
  primaryContainer: '#C54523',
  primaryFixed: '#FCEEEA',
  primaryFixedDim: '#F7D6CC',
  secondary: '#5C4E4A',
  secondaryContainer: '#F2EBE7',
  onSurface: '#2E2522',
  onSurfaceVariant: '#6E5D57',
  outline: '#9E8C86',
  outlineVariant: '#E6DFDB',
  pastelBlue: '#F7D6CC',
  slateBlue: '#E25C37',
  neutralGrey: '#8A7872',
  error: '#ba1a1a',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#FAF3EE',
  surfaceContainer: '#F6ECE4',
  surfaceContainerHigh: '#EFE1D7',
  surfaceContainerHighest: '#E8D5CA',
};

export const typography = {
  'headline-lg': { fontFamily: 'Inter', fontSize: '30px', fontWeight: 700, lineHeight: '38px', letterSpacing: '-0.02em' },
  'headline-md': { fontFamily: 'Inter', fontSize: '24px', fontWeight: 600, lineHeight: '32px', letterSpacing: '-0.01em' },
  'headline-sm': { fontFamily: 'Inter', fontSize: '20px', fontWeight: 600, lineHeight: '28px' },
  'body-lg': { fontFamily: 'Inter', fontSize: '16px', fontWeight: 400, lineHeight: '24px' },
  'body-md': { fontFamily: 'Inter', fontSize: '14px', fontWeight: 400, lineHeight: '20px' },
  'label-lg': { fontFamily: 'Inter', fontSize: '14px', fontWeight: 600, lineHeight: '20px' },
  'label-md': { fontFamily: 'Inter', fontSize: '12px', fontWeight: 500, lineHeight: '16px' },
};

export const radius = {
  sm: '0.25rem',
  DEFAULT: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  full: '9999px',
};

export const shadows = {
  extruded: '4px 4px 8px rgba(158,140,134,0.15), -4px -4px 8px rgba(255,255,255,0.9)',
  extrudedSm: '2px 2px 4px rgba(158,140,134,0.12), -2px -2px 4px rgba(255,255,255,0.8)',
  extrudedLg: '8px 8px 16px rgba(158,140,134,0.18), -8px -8px 16px rgba(255,255,255,0.95)',
  inset: 'inset 4px 4px 8px rgba(158,140,134,0.15), inset -4px -4px 8px rgba(255,255,255,0.9)',
  insetSm: 'inset 2px 2px 4px rgba(158,140,134,0.12), inset -2px -2px 4px rgba(255,255,255,0.8)',
  button: '4px 4px 8px rgba(226, 92, 55, 0.15), -4px -4px 8px rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(226, 92, 55, 0.15)',
};

export const spacing = {
  unit: 8,
  gutter: 24,
  margin: 32,
  bentoGap: 16,
  containerMax: 1440,
};

export const designSystem = {
  name: 'Soft Operations',
  font: 'Inter',
  roundness: 8,
  spacingScale: 2,
};

export default { colors, typography, radius, shadows, spacing, designSystem };
