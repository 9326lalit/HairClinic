'use client';

import React, { Suspense } from 'react';
import BillingManager from '../../../../features/billing/BillingManager';

export default function AdminBillingPage() {
  return (
    <Suspense fallback={<div className="text-xs uppercase font-bold tracking-wider text-muted-foreground animate-pulse">Loading Invoices...</div>}>
      <BillingManager role="RECEPTIONIST" defaultTab="Invoices" />
    </Suspense>
  );
}
