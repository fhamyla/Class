import React, { forwardRef } from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  className = '',
  label,
  error,
  id,
  ...props
}, ref) => {
  const inputId = id || props.name || Math.random().toString(36).substr(2, 9);
  return <div className="w-full space-y-2">
        {label && <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
            {label}
          </label>}
        <input ref={ref} id={inputId} className={`
            flex h-12 w-full rounded-lg border border-warm-gray bg-white px-4 py-2 text-base ring-offset-cream file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
            ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}
            ${className}
          `} {...props} />
        {error && <p className="text-sm text-red-600" role="alert">
            {error}
          </p>}
      </div>;
});
Input.displayName = 'Input';