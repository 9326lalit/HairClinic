'use client';

import React from 'react';
import { AuthProvider } from '../lib/auth-context';
import { ToastProvider } from './ui/toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </AuthProvider>
  );
}
export default Providers;
