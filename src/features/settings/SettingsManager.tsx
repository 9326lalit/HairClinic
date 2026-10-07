'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { settingsService } from '../../services';
import { ClinicSettings } from '../../types';
import { useToast } from '../../components/ui/toast';

export default function SettingsManager() {
  const toast = useToast();
  const [settings, setSettings] = useState<ClinicSettings | null>(null);

  useEffect(() => {
    setSettings(settingsService.get());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    
    settingsService.update(settings);
    toast.success('Clinic settings saved and updated globally.');
  };

  if (!settings) {
    return (
      <div className="text-xs uppercase font-bold tracking-wider text-muted-foreground animate-pulse">
        Loading clinic configuration settings...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold uppercase text-gray-900 flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" /> System & Clinic Settings
        </h1>
        <p className="text-xs text-muted-foreground">Adjust invoice configurations, system localization, and general clinic parameters.</p>
      </div>

      {/* Settings Form */}
      <div className="bg-white border border-border p-8 flex flex-col gap-6">
        <h2 className="text-xs uppercase font-bold tracking-wider text-gray-900 border-b border-border pb-3">Clinic Identification</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Clinic Display Name</label>
              <input 
                required
                type="text" 
                value={settings.clinicName}
                onChange={(e) => setSettings({ ...settings, clinicName: e.target.value })}
                className="border border-border p-3 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Clinic Logo URL</label>
              <input 
                required
                type="text" 
                value={settings.clinicLogo}
                onChange={(e) => setSettings({ ...settings, clinicLogo: e.target.value })}
                className="border border-border p-3 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Clinic Phone Contact</label>
              <input 
                required
                type="tel" 
                value={settings.phoneNumber}
                onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                className="border border-border p-3 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Clinic Address</label>
              <input 
                required
                type="text" 
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="border border-border p-3 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
              />
            </div>
          </div>

          <h2 className="text-xs uppercase font-bold tracking-wider text-gray-900 border-b border-border pb-3 pt-2">Billing & Tax</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">GSTIN Number</label>
              <input 
                required
                type="text" 
                value={settings.gstNumber}
                onChange={(e) => setSettings({ ...settings, gstNumber: e.target.value })}
                className="border border-border p-3 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Invoice Prefix Code</label>
              <input 
                required
                type="text" 
                value={settings.invoicePrefix}
                onChange={(e) => setSettings({ ...settings, invoicePrefix: e.target.value })}
                className="border border-border p-3 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
              />
            </div>
          </div>

          <h2 className="text-xs uppercase font-bold tracking-wider text-gray-900 border-b border-border pb-3 pt-2">Localization & UI</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Local Timezone</label>
              <select 
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                className="border border-border p-3 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
              >
                <option>Asia/Kolkata (IST)</option>
                <option>America/New_York (EST)</option>
                <option>Europe/London (GMT)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Primary Language</label>
              <select 
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="border border-border p-3 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Telugu</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Portal Theme Style</label>
              <select 
                value={settings.theme}
                onChange={(e) => setSettings({ ...settings, theme: e.target.value as any })}
                className="border border-border p-3 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
              >
                <option value="corporate">Elevate Corporate Light (Flat)</option>
                <option value="light">Vanilla Minimalist</option>
                <option value="dark">Secure Dark Portal</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button
              variant="outline"
              size="md"
              type="button"
              onClick={() => setSettings(settingsService.get())}
              className="text-xs uppercase font-bold tracking-wider"
            >
              <RefreshCw className="h-4 w-4 mr-2" /> Reset
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              className="text-xs uppercase font-bold tracking-wider"
            >
              <Save className="h-4 w-4 mr-2" /> Save Config
            </Button>
          </div>

        </form>
      </div>

    </div>
  );
}
