'use client';

import React, { Suspense } from 'react';
import BillingManager from '../../../../features/billing/BillingManager';

export default function AdminPaymentsPage() {
  return (
    <Suspense fallback={<div className="text-xs uppercase font-bold tracking-wider text-muted-foreground animate-pulse">Loading Payments logs...</div>}>
      <BillingManager role="RECEPTIONIST" defaultTab="Payments" />
    </Suspense>
  );
}
