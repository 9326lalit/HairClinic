import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline' | 'info';
}

export const Badge = ({ className, variant = 'primary', ...props }: BadgeProps) => {
  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider rounded-none',
          {
            'bg-blue-50 text-blue-700 border border-blue-200': variant === 'primary',
            'bg-gray-100 text-gray-800 border border-gray-200': variant === 'secondary',
            'bg-green-50 text-green-700 border border-green-200': variant === 'success',
            'bg-orange-50 text-orange-700 border border-orange-200': variant === 'warning',
            'bg-red-50 text-red-700 border border-red-200': variant === 'destructive',
            'bg-blue-50 text-indigo-700 border border-indigo-200': variant === 'info',
            'border border-border text-foreground': variant === 'outline',
          }
        ),
        className
      )}
      {...props}
    />
  );
};
export default Badge;
