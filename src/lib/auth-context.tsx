'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User, Role } from '../types';
import { ROLE_PERMISSIONS, Permission } from '../constants';

interface AuthContextType {
  user: User | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (role: Role) => void;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Its time to shoot the reel and deliver the project to client 
  useEffect(() => {
    // Load mock user session on mount
    const storedRole = localStorage.getItem('cms_user_role') as Role | null;
    if (storedRole === 'DOCTOR') {
      setUser({
        id: 'USR-01',
        name: 'Dr. John Doe',
        email: 'john.doe@elevate.com',
        role: 'DOCTOR',
      });
    } else if (storedRole === 'RECEPTIONIST') {
      setUser({
        id: 'USR-02',
        name: 'Sarah receptionist',
        email: 'sarah.r@elevate.com',
        role: 'RECEPTIONIST',
      });
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  const login = (role: Role) => {
    setIsLoading(true);
    localStorage.setItem('cms_user_role', role);
    const mockUser: User = role === 'DOCTOR'
      ? { id: 'USR-01', name: 'Dr. John Doe', email: 'john.doe@elevate.com', role: 'DOCTOR' }
      : { id: 'USR-02', name: 'Sarah receptionist', email: 'sarah.r@elevate.com', role: 'RECEPTIONIST' };

    setUser(mockUser);
    setIsLoading(false);

    if (role === 'DOCTOR') {
      router.push('/doctor/dashboard');
    } else {
      router.push('/admin/dashboard');
    }
  };

  const logout = () => {
    localStorage.removeItem('cms_user_role');
    setUser(null);
    router.push('/login');
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    const permissions = ROLE_PERMISSIONS[user.role];
    return permissions.includes(permission);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, role: user?.role || null, isAuthenticated, isLoading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
