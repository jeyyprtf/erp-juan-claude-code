import React from 'react';

// Progress bar (linear). Used for IoT progress tracker and kanban progress.
export default function ProgressBar({
  value = 0, // 0..100
  variant = 'primary', // 'primary' | 'pastel' | 'success' | 'warning'
  size = 'md', // 'sm' | 'md' | 'lg'
  showLabel = false,
  className = '',
}) {
  const height = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3' }[size];
  const fillColor = {
    primary: 'bg-primary',
    pastel: 'bg-pastel-blue',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
  }[variant];

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full ${height} bg-surface-container rounded-full overflow-hidden`}>
        <div
          className={`${height} ${fillColor} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 type-label-md text-on-surface-variant text-right">{value}%</div>
      )}
    </div>
  );
}
