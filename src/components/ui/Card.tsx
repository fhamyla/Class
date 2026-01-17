import React from 'react';
interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}
export function Card({
  children,
  className = '',
  title,
  description
}: CardProps) {
  return <div className={`rounded-xl border border-warm-gray/30 bg-white/80 backdrop-blur-sm shadow-sm ${className}`}>
      {(title || description) && <div className="p-6 pb-2">
          {title && <h3 className="text-xl font-semibold leading-none tracking-tight text-gray-900">
              {title}
            </h3>}
          {description && <p className="mt-2 text-sm text-gray-500">{description}</p>}
        </div>}
      <div className="p-6 pt-4">{children}</div>
    </div>;
}