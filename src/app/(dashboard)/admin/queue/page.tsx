'use client';

import React, { Suspense } from 'react';
import QueueManager from '../../../../features/appointments/QueueManager';

export default function AdminQueuePage() {
  return (
    <Suspense fallback={<div className="text-xs uppercase font-bold tracking-wider text-muted-foreground animate-pulse">Loading live clinical queue...</div>}>
      <QueueManager />
    </Suspense>
  );
}
