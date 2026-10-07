'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const success = useCallback((message: string) => toast(message, 'success'), [toast]);
  const error = useCallback((message: string) => toast(message, 'error'), [toast]);
  const warning = useCallback((message: string) => toast(message, 'warning'), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="w-85 p-4 pointer-events-auto flex items-start gap-3 bg-white border border-border shadow-lg"
            style={{
              borderLeftWidth: '4px',
              borderLeftColor: t.type === 'success' ? '#16a34a' : t.type === 'warning' ? '#ea580c' : '#ef4444',
            }}
          >
            <div className="shrink-0 mt-0.5">
              {t.type === 'success' && <CheckCircle className="h-5 w-5 text-green-600" />}
              {t.type === 'warning' && <AlertTriangle className="h-5 w-5 text-orange-600" />}
              {t.type === 'error' && <AlertCircle className="h-5 w-5 text-red-600" />}
            </div>
            
            <div className="flex-1 text-sm text-gray-800 font-medium">
              {t.message}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="shrink-0 text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
