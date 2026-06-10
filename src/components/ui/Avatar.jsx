import React from 'react';

// Circular avatar with optional status dot. Used in team/task lists.
export default function Avatar({
  name = '',
  src,
  size = 'md', // 'xs' | 'sm' | 'md' | 'lg'
  status, // 'online' | 'offline' | 'busy' | null
  className = '',
}) {
  const sizeClass = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-label-md',
    md: 'w-10 h-10 text-label-md',
    lg: 'w-12 h-12 text-label-lg',
  }[size];

  const dotSize = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  }[size];

  const statusColor = {
    online: 'bg-emerald-500',
    offline: 'bg-neutral-grey',
    busy: 'bg-amber-500',
  }[status];

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const colors = [
    'bg-primary-fixed text-primary',
    'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
    'bg-amber-500/10 text-amber-500 border border-amber-500/20',
    'bg-rose-500/10 text-rose-500 border border-rose-500/20',
    'bg-violet-500/10 text-violet-500 border border-violet-500/20'
  ];
  const colorIndex = name.length ? name.charCodeAt(0) % colors.length : 0;
  const tone = colors[colorIndex];

  return (
    <div className={`relative shrink-0 ${className}`}>
      <div className={`${sizeClass} ${src ? '' : tone} rounded-full flex items-center justify-center font-semibold overflow-hidden`}>
        {src ? <img src={src} alt={name} className="w-full h-full object-cover" /> : initials}
      </div>
      {status && (
        <span className={`absolute -bottom-0.5 -right-0.5 ${dotSize} ${statusColor} rounded-full ring-2 ring-surface`} />
      )}
    </div>
  );
}
