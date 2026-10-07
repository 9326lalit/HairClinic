'use client';

import React, { Suspense } from 'react';
import PrescriptionWizard from '../../../../features/prescriptions/PrescriptionWizard';

export default function DoctorPrescriptionsPage() {
  return (
    <Suspense fallback={<div className="text-xs uppercase font-bold tracking-wider text-muted-foreground animate-pulse">Loading Prescription wizard...</div>}>
      <PrescriptionWizard role="DOCTOR" />
    </Suspense>
  );
}
