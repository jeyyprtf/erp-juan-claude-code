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
    default: 'bg-surface-container-low text-on-surface-variant',
    'in-progress': 'bg-pastel-blue text-secondary',
    'final-check': 'bg-primary text-on-primary',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700',
    neutral: 'bg-surface-container text-on-surface-variant',
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
