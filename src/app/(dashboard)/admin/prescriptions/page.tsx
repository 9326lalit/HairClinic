'use client';

import React, { Suspense } from 'react';
import PrescriptionWizard from '../../../../features/prescriptions/PrescriptionWizard';

export default function AdminPrescriptionsPage() {
  return (
    <Suspense fallback={<div className="text-xs uppercase font-bold tracking-wider text-muted-foreground animate-pulse">Loading Prescription list...</div>}>
      <PrescriptionWizard role="RECEPTIONIST" />
    </Suspense>
  );
}
