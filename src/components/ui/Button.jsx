import React from 'react';

// Neumorphic Button — uses .neu-* CSS classes for reliable shadow rendering.
// Primary:  Slate Blue text + blue-tinted extruded shadow + 1px blue border.
// Secondary: neutral text + standard extruded shadow.
export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-sans transition-all duration-150 cursor-pointer select-none';

  const sizeMap = {
    sm: 'px-3 py-1.5 text-[12px] leading-4 rounded-lg',
    md: 'px-5 py-2.5 text-[14px] leading-5 rounded-xl',
    lg: 'px-6 py-3 text-[14px] leading-5 rounded-xl',
  };

  const variantMap = {
    primary: 'neu-button-primary',
    secondary: 'neu-button-secondary',
    ghost: 'bg-transparent text-primary hover:bg-primary/10 rounded-xl',
  };

  return (
    <button
      type="button"
      className={`${base} ${sizeMap[size]} ${variantMap[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
