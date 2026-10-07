'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../lib/auth-context';
import { 
  Activity, 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  Bell, 
  Search, 
  User, 
  LayoutDashboard, 
  Users, 
  Calendar, 
  ListOrdered, 
  FileText, 
  CreditCard, 
  Receipt, 
  BarChart3, 
  Settings, 
  LogOut, 
  ShieldAlert,
  X 
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useToast } from '../../components/ui/toast';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, role, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const toast = useToast();
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [globalSearchVal, setGlobalSearchVal] = useState('');

  // Handle Auth redirect
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col gap-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Activity className="h-8 w-8 text-primary animate-pulse" />
        <span>Verifying secure staff session...</span>
      </div>
    );
  }

  // Handle RBAC route protection
  const isDoctorRoute = pathname.startsWith('/doctor');
  const isAdminRoute = pathname.startsWith('/admin');
  const isAuthorized = (isDoctorRoute && role === 'DOCTOR') || (isAdminRoute && role === 'RECEPTIONIST');

  // Custom 403 Access Denied screen
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-border p-8 flex flex-col gap-6 text-center">
          <ShieldAlert className="h-16 w-16 text-destructive mx-auto" />
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-bold uppercase tracking-wider text-gray-900">403 - Access Denied</h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your staff credentials do not grant access to this module. Attempting to enter restricted areas has been registered in the clinic audit logs.
            </p>
          </div>
          <div className="border border-border p-4 bg-gray-50 text-left text-xs flex flex-col gap-1 text-gray-800">
            <span><strong>Logged User:</strong> {user?.name}</span>
            <span><strong>Designation:</strong> {role === 'DOCTOR' ? 'Specialist Doctor' : 'Receptionist / Admin'}</span>
            <span><strong>Requested URI:</strong> {pathname}</span>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1 text-xs font-bold uppercase tracking-wider"
              onClick={logout}
            >
              Sign Out
            </Button>
            <Button 
              variant="primary" 
              className="flex-1 text-xs font-bold uppercase tracking-wider"
              onClick={() => {
                if (role === 'DOCTOR') {
                  router.push('/doctor/dashboard');
                } else {
                  router.push('/admin/dashboard');
                }
              }}
            >
              Back to Portal
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Prepare role-specific sidebar navigation links
  const doctorLinks = [
    { label: 'Dashboard', href: '/doctor/dashboard', icon: LayoutDashboard },
    { label: 'Patients', href: '/doctor/patients', icon: Users },
    { label: 'Appointments', href: '/doctor/appointments', icon: Calendar },
    { label: 'Prescriptions', href: '/doctor/prescriptions', icon: FileText },
    { label: 'Reports', href: '/doctor/reports', icon: BarChart3 },
    { label: 'Profile', href: '/doctor/profile', icon: User },
  ];

  const adminLinks = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Patients', href: '/admin/patients', icon: Users },
    { label: 'Appointments', href: '/admin/appointments', icon: Calendar },
    { label: 'Queue', href: '/admin/queue', icon: ListOrdered },
    { label: 'Billing', href: '/admin/billing', icon: Receipt },
    { label: 'Payments', href: '/admin/payments', icon: CreditCard },
    { label: 'Reports', href: '/admin/reports', icon: BarChart3 },
    { label: 'Profile', href: '/admin/profile', icon: User },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const activeLinks = role === 'DOCTOR' ? doctorLinks : adminLinks;

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearchVal.trim()) {
      toast.success(`Searching patients database for: "${globalSearchVal}"`);
      const targetUrl = role === 'DOCTOR' ? '/doctor/patients' : '/admin/patients';
      router.push(`${targetUrl}?search=${encodeURIComponent(globalSearchVal)}`);
      setGlobalSearchVal('');
    }
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  const mockNotifications = [
    { id: '1', text: 'New appointment booked: Jane Smith (10:00 AM)', time: '5m ago' },
    { id: '2', text: 'Prescription pending review for PT-1002', time: '1h ago' },
    { id: '3', text: 'Invoice INV-2026-004 partially paid by David Wilson', time: '2h ago' },
  ];

  return (
    <div className="h-screen w-full bg-gray-100 flex overflow-hidden">
      
      {/* 1. LEFT SIDEBAR (Desktop) */}
      <aside 
        className={`hidden md:flex flex-col bg-gray-900 border-r border-gray-800 text-gray-300 transition-all duration-200 shrink-0 select-none ${
          isSidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800 bg-gray-950">
          {!isSidebarCollapsed && (
            <Link href="/" className="flex items-center gap-1.5 font-serif font-bold text-sm tracking-wide">
              <span className="text-white">E</span>
              <span className="text-primary font-serif">A</span>
              <span className="text-white text-xs uppercase tracking-widest font-sans ml-2 font-semibold">Elevate Portal</span>
            </Link>
          )}
          {isSidebarCollapsed && (
            <span className="font-serif text-lg font-bold text-white mx-auto">
              E<span className="text-primary font-serif">A</span>
            </span>
          )}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="text-gray-500 hover:text-white p-1 focus:outline-none cursor-pointer hidden md:block"
          >
            {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 py-4 flex flex-col gap-1">
          {activeLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-semibold transition-colors duration-150 ${
                  isActive 
                    ? 'bg-primary text-white border-l-4 border-blue-400' 
                    : 'hover:bg-gray-800 hover:text-white'
                }`}
                title={link.label}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                {!isSidebarCollapsed && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / User section */}
        <div className="p-4 border-t border-gray-800 bg-gray-950 flex flex-col gap-3">
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-gray-800 border border-gray-700 flex items-center justify-center font-bold text-sm text-primary uppercase">
                {user?.name.substring(0, 2)}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-bold text-white truncate">{user?.name}</span>
                <span className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold truncate">
                  {role === 'DOCTOR' ? 'Specialist Doctor' : 'Receptionist'}
                </span>
              </div>
            </div>
          )}
          <button
            onClick={() => {
              logout();
              toast.success('Successfully logged out.');
            }}
            className="flex items-center gap-3 px-1 py-2 text-xs font-semibold uppercase tracking-wider hover:text-white text-gray-400 w-full text-left cursor-pointer focus:outline-none"
            title="Logout"
          >
            <LogOut className="h-4 w-4 shrink-0 text-destructive" />
            {!isSidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* 2. MOBILE DRAWER SIDEBAR */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/60" onClick={() => setIsMobileSidebarOpen(false)} />
          
          {/* Drawer Panel */}
          <aside className="relative w-64 bg-gray-900 text-gray-300 flex flex-col z-10 animate-in slide-in-from-left duration-150">
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800 bg-gray-950">
              <Link href="/" className="flex items-center gap-1.5 font-serif font-bold text-sm tracking-wide">
                <span className="text-white">E</span>
                <span className="text-primary font-serif">A</span>
                <span className="text-white text-xs uppercase tracking-widest font-sans ml-2 font-semibold">Elevate Portal</span>
              </Link>
              <button onClick={() => setIsMobileSidebarOpen(false)} className="text-gray-400 p-1 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 py-4 flex flex-col gap-1">
              {activeLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-semibold ${
                      isActive ? 'bg-primary text-white border-l-4 border-blue-400' : 'hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-gray-800 bg-gray-950 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-gray-800 border border-gray-700 flex items-center justify-center font-bold text-sm text-primary uppercase">
                  {user?.name.substring(0, 2)}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">{user?.name}</span>
                  <span className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold">
                    {role === 'DOCTOR' ? 'Specialist Doctor' : 'Receptionist'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  toast.success('Successfully logged out.');
                }}
                className="flex items-center gap-3 px-1 py-2 text-xs font-semibold uppercase tracking-wider hover:text-white text-gray-400 w-full text-left cursor-pointer"
              >
                <LogOut className="h-4 w-4 text-destructive" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* 3. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* TOP NAVBAR */}
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 sm:px-6 md:px-8 shrink-0 select-none">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Trigger */}
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-700 p-2 md:hidden focus:outline-none"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Date Display */}
            <span className="hidden lg:inline text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {formattedDate}
            </span>
          </div>

          <div className="flex items-center gap-6">
            {/* Global Search Bar */}
            <form onSubmit={handleGlobalSearch} className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search patient, ID, phone..."
                value={globalSearchVal}
                onChange={(e) => setGlobalSearchVal(e.target.value)}
                className="border border-border p-2 pl-8 w-60 text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
              />
            </form>

            {/* Notification Center */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="text-gray-500 hover:text-primary p-2 focus:outline-none relative cursor-pointer"
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-1 right-1.5 h-2 w-2 bg-destructive rounded-full" />
              </button>
              
              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-border shadow-xl z-30 animate-in fade-in slide-in-from-top-1 duration-150 rounded-none">
                    <div className="p-3 border-b border-border bg-gray-50 flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold text-gray-900 tracking-wider">Clinical Alerts</span>
                      <span className="text-[9px] text-primary hover:underline cursor-pointer" onClick={() => { setNotificationsOpen(false); toast.success("Cleared notifications queue."); }}>Clear All</span>
                    </div>
                    <div className="flex flex-col divide-y divide-border">
                      {mockNotifications.map((notif) => (
                        <div key={notif.id} className="p-3 text-[11px] hover:bg-gray-50 flex justify-between items-start gap-2">
                          <span className="text-gray-700 leading-normal">{notif.text}</span>
                          <span className="text-[9px] text-gray-400 shrink-0 font-medium">{notif.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Badging */}
            <div className="flex items-center gap-2 border-l border-border pl-4">
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-gray-900">{user?.name}</span>
                <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
                  {role === 'DOCTOR' ? 'Dr. Designation' : 'Reception Desk'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* WORKSPACE CONTENT ROUTER */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-gray-50">
          {children}
        </main>
      </div>

    </div>
  );
}
