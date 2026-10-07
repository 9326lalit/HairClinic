'use client';

import React, { use } from 'react';
import PatientDetails from '../../../../../features/patients/PatientDetails';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DoctorPatientDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  return <PatientDetails role="DOCTOR" id={resolvedParams.id} />;
}
