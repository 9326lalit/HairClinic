'use client';

import React, { Suspense } from 'react';
import ReportsDashboard from '../../../../features/reports/ReportsDashboard';

export default function DoctorReportsPage() {
  return (
    <Suspense fallback={<div className="text-xs uppercase font-bold tracking-wider text-muted-foreground animate-pulse">Loading Reports dashboard...</div>}>
      <ReportsDashboard />
    </Suspense>
  );
}
