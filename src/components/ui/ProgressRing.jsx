import React from 'react';

// Circular progress ring. Used for IoT sensors and metrics.
export default function ProgressRing({
  value = 0, // 0..100
  size = 96,
  stroke = 8,
  variant = 'primary', // 'primary' | 'pastel' | 'success'
  label,
  sublabel,
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const strokeColor = {
    primary: '#4A90E2',
    pastel: '#A5C9FF',
    success: '#10b981',
  }[variant];

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5eeff"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 500ms ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label && <span className="type-headline-sm text-on-surface">{label}</span>}
        {sublabel && <span className="type-label-md text-on-surface-variant">{sublabel}</span>}
      </div>
    </div>
  );
}
