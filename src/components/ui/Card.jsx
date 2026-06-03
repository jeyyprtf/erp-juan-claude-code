import React from 'react';

// Reusable Neumorphic Card (Level 1 Extruded)
// Used by all four screens for bento boxes, kanban cards, list items.
export default function Card({
  as: Tag = 'div',
  variant = 'extruded', // 'extruded' | 'extruded-sm' | 'extruded-lg' | 'flat'
  padding = 'p-6', // Tailwind padding utility
  className = '',
  children,
  ...rest
}) {
  const variantClass = {
    extruded: 'neu-extruded',
    'extruded-sm': 'neu-extruded-sm',
    'extruded-lg': 'neu-extruded-lg',
    flat: 'neu-flat',
  }[variant];

  return (
    <Tag className={`${variantClass} ${padding} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
