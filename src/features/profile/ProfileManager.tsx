'use client';

import React, { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { User, Save, Lock, UserCog } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useToast } from '../../components/ui/toast';

export default function ProfileManager() {
  const { user, role } = useAuth();
  const toast = useToast();

  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  
  // Password States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Staff profile details updated successfully.');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please complete all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }
    toast.success('Portal security credentials updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold uppercase text-gray-900 flex items-center gap-2">
          <UserCog className="h-6 w-6 text-primary" /> My Staff Profile
        </h1>
        <p className="text-xs text-muted-foreground">Manage your personal display coordinates and update portal system passwords.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Photo & Role badge */}
        <div className="bg-white border border-border p-6 flex flex-col items-center text-center gap-4 h-max">
          <div className="h-20 w-20 bg-gray-100 border border-border flex items-center justify-center font-bold text-2xl text-primary uppercase select-none">
            {fullName.substring(0, 2)}
          </div>
          
          <div className="flex flex-col gap-1">
            <h3 className="text-xs font-bold uppercase text-gray-900">{fullName}</h3>
            <span className="text-[10px] text-muted-foreground">{email}</span>
            <span className="mt-2">
              <Badge variant="primary">
                {role === 'DOCTOR' ? 'Specialist Doctor' : 'Receptionist / Admin'}
              </Badge>
            </span>
          </div>

          <input 
            type="file" 
            accept="image/*"
            className="text-[9px] text-gray-400 mt-2 cursor-pointer outline-none"
            onChange={() => toast.success('Mock profile photograph updated.')}
          />
        </div>

        {/* Right Columns: Edit info & Change Password */}
        <div className="md:col-span-2 flex flex-col gap-6">
          
          {/* Edit info */}
          <div className="bg-white border border-border p-6 flex flex-col gap-4">
            <h3 className="text-xs uppercase font-bold text-gray-900 border-b border-border pb-2">Profile Information</h3>
            
            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Display Name</label>
                <input 
                  required
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Email Coordinates</label>
                <input 
                  required
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
                />
              </div>

              <Button type="submit" variant="primary" size="sm" className="w-max text-xs uppercase font-bold tracking-wider">
                <Save className="h-4 w-4 mr-2" /> Save Details
              </Button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white border border-border p-6 flex flex-col gap-4">
            <h3 className="text-xs uppercase font-bold text-gray-900 border-b border-border pb-2">Change Portal Password</h3>
            
            <form onSubmit={handleChangePassword} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Current Password</label>
                <input 
                  required
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">New Password</label>
                  <input 
                    required
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Confirm New Password</label>
                  <input 
                    required
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" size="sm" className="w-max text-xs uppercase font-bold tracking-wider">
                <Lock className="h-4 w-4 mr-2" /> Change Password
              </Button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}

// Local Badge component to avoid imports
function Badge({ children, variant }: { children: React.ReactNode; variant: 'primary' | 'secondary' }) {
  return (
    <span className={`inline-flex px-2 py-0.5 text-[9px] uppercase font-bold tracking-wider border ${
      variant === 'primary' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-800 border-gray-200'
    }`}>
      {children}
    </span>
  );
}
