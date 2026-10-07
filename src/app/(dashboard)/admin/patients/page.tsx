'use client';

import React, { Suspense } from 'react';
import PatientList from '../../../../features/patients/PatientList';

export default function AdminPatientsPage() {
  return (
    <Suspense fallback={<div className="text-xs uppercase font-bold tracking-wider text-muted-foreground animate-pulse">Loading Patients database...</div>}>
      <PatientList role="RECEPTIONIST" />
    </Suspense>
  );
}
