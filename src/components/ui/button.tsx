import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive' | 'ghost' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={twMerge(
          clsx(
            'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer rounded-none border-0',
            {
              'bg-primary text-primary-foreground hover:bg-pink-700': variant === 'primary',
              'bg-secondary text-secondary-foreground hover:bg-gray-200 border border-border': variant === 'secondary',
              'border border-border bg-background hover:bg-gray-50 hover:text-foreground text-foreground': variant === 'outline',
              'bg-destructive text-destructive-foreground hover:bg-red-600': variant === 'destructive',
              'bg-success text-success-foreground hover:bg-green-700': variant === 'success',
              'bg-warning text-warning-foreground hover:bg-orange-700': variant === 'warning',
              'hover:bg-gray-100 hover:text-foreground text-muted-foreground': variant === 'ghost',
            },
            {
              'h-8 px-3 text-xs': size === 'sm',
              'h-10 px-4 py-2 text-sm': size === 'md',
              'h-12 px-6 text-base': size === 'lg',
            }
          ),
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
