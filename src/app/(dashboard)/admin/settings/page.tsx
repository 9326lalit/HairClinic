'use client';

import React, { Suspense } from 'react';
import SettingsManager from '../../../../features/settings/SettingsManager';

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={<div className="text-xs uppercase font-bold tracking-wider text-muted-foreground animate-pulse">Loading Clinic settings...</div>}>
      <SettingsManager />
    </Suspense>
  );
}
