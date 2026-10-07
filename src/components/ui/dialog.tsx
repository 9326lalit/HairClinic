import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './button';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Dialog = ({ isOpen, onClose, title, children, footer, size = 'md' }: DialogProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-5xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:pl-64 transition-all duration-200">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity" 
        onClick={onClose}
      />
      
      {/* Content Container */}
      <div className={`relative w-full ${sizeClasses[size]} bg-white border border-border flex flex-col z-10`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-gray-50">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">{title}</h3>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-gray-200 text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-4 border-t border-border bg-gray-50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
export default Dialog;
