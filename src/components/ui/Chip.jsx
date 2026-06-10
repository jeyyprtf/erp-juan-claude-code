import React from 'react';

// Pill-shaped status chip. Used for kanban markers, task statuses, tags.
export default function Chip({
  variant = 'default', // 'default' | 'in-progress' | 'final-check' | 'success' | 'warning' | 'error' | 'neutral'
  size = 'md', // 'sm' | 'md'
  children,
  className = '',
  ...rest
}) {
  const sizeClass = size === 'sm' ? 'px-2.5 py-0.5 text-label-md' : 'px-3 py-1 text-label-md';

  const variantClass = {
    default: 'bg-surface-container-low text-on-surface-variant border border-outline-variant/30',
    'in-progress': 'bg-pastel-blue text-secondary border border-primary/10',
    'final-check': 'bg-primary text-white',
    success: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
    error: 'bg-red-500/10 text-red-500 border border-red-500/20',
    neutral: 'bg-surface-container text-on-surface-variant border border-outline-variant/20',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClass} ${variantClass} ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
}
