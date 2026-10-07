'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth-context';
import { Activity, Lock, Mail, ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useToast } from '../../../components/ui/toast';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const toast = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all standard credentials fields.');
      return;
    }
    
    // Check if matching mock accounts
    if (email.toLowerCase().includes('doctor')) {
      login('DOCTOR');
      toast.success('Successfully logged in as Specialist Doctor.');
    } else if (email.toLowerCase().includes('admin') || email.toLowerCase().includes('receptionist')) {
      login('RECEPTIONIST');
      toast.success('Successfully logged in as Receptionist/Admin.');
    } else {
      toast.warning('Unrecognized demo credentials. Using default Receptionist login.');
      login('RECEPTIONIST');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left panel (visual intro) */}
      <div className="flex-1 bg-gray-50 flex flex-col justify-between p-8 sm:p-12 md:p-16 border-r border-border">
        <div 
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer text-xs uppercase tracking-wider font-bold w-max"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Website
        </div>
        
        <div className="my-auto flex flex-col gap-6 max-w-md">
          <div className="flex items-center gap-2 text-primary font-bold text-lg uppercase tracking-wider">
            <Activity className="h-7 w-7 stroke-[2.5]" />
            <span className="text-gray-900">CarePlus CMS</span>
          </div>
          <h2 className="text-3xl font-bold uppercase text-gray-900 leading-tight">
            Enterprise Clinical Operations Suite
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Access secure electronic health records, schedule patient consultations, issue GST billing invoices, manage clinical timelines, and analyze reports.
          </p>
        </div>

        <div className="text-[10px] text-muted-foreground uppercase font-semibold">
          Authorized Staff Only. Connections are monitored.
        </div>
      </div>

      {/* Right panel (form) */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-sm flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-bold uppercase tracking-tight text-gray-900">Staff Portal Login</h1>
            <p className="text-xs text-muted-foreground">Sign in to manage clinical workflow.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  required
                  type="email"
                  placeholder="doctor@careplus.com or admin@careplus.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-border p-3 pl-10 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-border p-3 pl-10 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
                />
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-primary rounded-none"
                />
                Remember Me
              </label>
              <span 
                onClick={() => toast.warning('Demo credentials: Use doctor@careplus.com or admin@careplus.com.')}
                className="text-primary font-semibold hover:underline cursor-pointer"
              >
                Forgot Password?
              </span>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full text-xs font-semibold uppercase tracking-wider mt-2">
              Sign In
            </Button>
          </form>

          {/* Quick Mock Login Helpers */}
          <div className="border border-border p-4 bg-gray-50 flex flex-col gap-3">
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider flex items-center gap-1">
              <ShieldAlert className="h-3.5 w-3.5 text-orange-600" /> Demo Quick Action Login
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-[10px] uppercase tracking-wider font-semibold border-blue-200 text-primary hover:bg-blue-50"
                onClick={() => {
                  setEmail('doctor@careplus.com');
                  setPassword('doctor123');
                  login('DOCTOR');
                  toast.success('Demo login: Redirecting as Doctor John Doe');
                }}
              >
                Login as Doctor
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-[10px] uppercase tracking-wider font-semibold border-green-200 text-green-700 hover:bg-green-50"
                onClick={() => {
                  setEmail('admin@careplus.com');
                  setPassword('admin123');
                  login('RECEPTIONIST');
                  toast.success('Demo login: Redirecting as Receptionist Sarah');
                }}
              >
                Login as Admin
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
