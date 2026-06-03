import React from 'react';

// Top-level app bar / page header. Inset search + actions on the right.
export default function TopBar({
  title,
  subtitle,
  searchPlaceholder = 'Search…',
  onSearch,
  actions, // ReactNode
}) {
  return (
    <header className="w-full px-8 pt-8 pb-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          {title && <h1 className="type-headline-lg text-on-surface">{title}</h1>}
          {subtitle && <p className="type-body-md text-on-surface-variant mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          <div className="neu-inset-sm flex items-center gap-2 px-4 py-2 min-w-[280px]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-grey">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              placeholder={searchPlaceholder}
              onChange={(e) => onSearch?.(e.target.value)}
              className="flex-1 bg-transparent border-0 outline-none text-body-md text-on-surface placeholder:text-neutral-grey"
            />
          </div>
          {actions}
        </div>
      </div>
    </header>
  );
}
