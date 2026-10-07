'use client';

import React, { Suspense } from 'react';
import ProfileManager from '../../../../features/profile/ProfileManager';

export default function DoctorProfilePage() {
  return (
    <Suspense fallback={<div className="text-xs uppercase font-bold tracking-wider text-muted-foreground animate-pulse">Loading Profile...</div>}>
      <ProfileManager />
    </Suspense>
  );
}
