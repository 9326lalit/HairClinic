'use client';

import React, { Suspense } from 'react';
import AppointmentList from '../../../../features/appointments/AppointmentList';

export default function DoctorAppointmentsPage() {
  return (
    <Suspense fallback={<div className="text-xs uppercase font-bold tracking-wider text-muted-foreground animate-pulse">Loading Appointments list...</div>}>
      <AppointmentList role="DOCTOR" />
    </Suspense>
  );
}
