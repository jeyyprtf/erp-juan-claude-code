import React, { useId } from 'react';

// Reusable Inset (sunken) Text Input — Level -1 elevation.
// Search bar variant adds leading icon support.
export default function Input({
  label,
  placeholder = '',
  value,
  onChange,
  leadingIcon = null, // pass <svg /> or text
  trailingIcon = null,
  className = '',
  id,
  ...rest
}) {
  const reactId = useId();
  const inputId = id || reactId;
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="type-label-md text-on-surface-variant uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="neu-inset-sm flex items-center gap-2 px-4 py-2.5">
        {leadingIcon && <span className="text-neutral-grey shrink-0">{leadingIcon}</span>}
        <input
          id={inputId}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-0 outline-none text-body-md text-on-surface placeholder:text-neutral-grey"
          {...rest}
        />
        {trailingIcon && <span className="text-neutral-grey shrink-0">{trailingIcon}</span>}
      </div>
    </div>
  );
}
