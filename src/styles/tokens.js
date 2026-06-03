// Soft Operations Design System Tokens
// Single source of truth for design variables across the React app.
// Mirrors the tokens defined in tailwind.config.js for use in JS (e.g. inline styles, charts).

export const colors = {
  background: '#F0F2F5',
  surface: '#FFFFFF',
  primary: '#4A90E2',
  primaryContainer: '#2976c7',
  primaryFixed: '#d4e3ff',
  primaryFixedDim: '#a4c9ff',
  secondary: '#3b608f',
  secondaryContainer: '#a5c9fe',
  onSurface: '#0b1c30',
  onSurfaceVariant: '#414751',
  outline: '#717783',
  outlineVariant: '#c1c7d3',
  pastelBlue: '#A5C9FF',
  slateBlue: '#4A90E2',
  neutralGrey: '#64748b',
  error: '#ba1a1a',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#eff4ff',
  surfaceContainer: '#e5eeff',
  surfaceContainerHigh: '#dce9ff',
  surfaceContainerHighest: '#d3e4fe',
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
  extruded: '4px 4px 8px rgba(163, 177, 198, 0.4), -4px -4px 8px rgba(255, 255, 255, 0.9)',
  extrudedSm: '2px 2px 4px rgba(163, 177, 198, 0.3), -2px -2px 4px rgba(255, 255, 255, 0.8)',
  extrudedLg: '8px 8px 16px rgba(163, 177, 198, 0.45), -8px -8px 16px rgba(255, 255, 255, 0.95)',
  inset: 'inset 4px 4px 8px rgba(163, 177, 198, 0.4), inset -4px -4px 8px rgba(255, 255, 255, 0.9)',
  insetSm: 'inset 2px 2px 4px rgba(163, 177, 198, 0.3), inset -2px -2px 4px rgba(255, 255, 255, 0.8)',
  button: '4px 4px 8px rgba(74, 144, 226, 0.25), -4px -4px 8px rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(74, 144, 226, 0.15)',
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
