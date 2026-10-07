'use client';

import React, { Suspense } from 'react';
import PatientList from '../../../../features/patients/PatientList';

export default function DoctorPatientsPage() {
  return (
    <Suspense fallback={<div className="text-xs uppercase font-bold tracking-wider text-muted-foreground animate-pulse">Loading Patients list...</div>}>
      <PatientList role="DOCTOR" />
    </Suspense>
  );
}
