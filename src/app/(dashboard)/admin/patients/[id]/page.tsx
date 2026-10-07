'use client';

import React, { use } from 'react';
import PatientDetails from '../../../../../features/patients/PatientDetails';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdminPatientDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  return <PatientDetails role="RECEPTIONIST" id={resolvedParams.id} />;
}
