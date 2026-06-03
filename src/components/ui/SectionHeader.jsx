import React from 'react';

// Section header (label-md uppercase + heading + optional action).
export default function SectionHeader({ eyebrow, title, action, className = '' }) {
  return (
    <div className={`flex items-end justify-between gap-4 mb-4 ${className}`}>
      <div>
        {eyebrow && <span className="type-label-md uppercase tracking-wider text-on-surface-variant">{eyebrow}</span>}
        {title && <h2 className="type-headline-md text-on-surface mt-1">{title}</h2>}
      </div>
      {action}
    </div>
  );
}
