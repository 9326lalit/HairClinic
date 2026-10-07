'use client';

import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TermsPage() {
  const router = useRouter();
  return (
    <div className="max-w-3xl mx-auto my-12 p-8 border border-border bg-gray-50 flex flex-col gap-6">
      <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer text-xs uppercase tracking-wider font-bold" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" /> Go Back
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold uppercase text-gray-900 flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" /> Terms & Conditions
        </h1>
        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Last Updated: July 06, 2026</span>
      </div>

      <div className="text-xs text-muted-foreground flex flex-col gap-4 leading-relaxed">
        <p className="text-gray-800">
          By scheduling appointments, submitting consultation queries, or accessing the CarePlus digital platform, you agree to these operational Terms and Conditions.
        </p>

        <h3 className="text-xs uppercase font-bold text-gray-900 pt-2 border-b border-border pb-1">1. Appointment Scheduling and Cancellations</h3>
        <p>
          Submitted reservation requests represent non-binding slots until checked in or confirmed by our receptionist. Patients can cancel or reschedule up to 2 hours before the appointment via phone support.
        </p>

        <h3 className="text-xs uppercase font-bold text-gray-900 pt-2 border-b border-border pb-1">2. Portal Access Security</h3>
        <p>
          Secure staff login credentials (assigned for Doctors and Receptionists/Admins) are strictly personal. Sharing system access or accessing folders with restricted roles is a violation of clinic policy and will be recorded in audit logs.
        </p>

        <h3 className="text-xs uppercase font-bold text-gray-900 pt-2 border-b border-border pb-1">3. Billing Policies</h3>
        <p>
          Consultation fees, medicine charges, and GST are calculated during the billing stage. Payment method routes must be finalized upon check-out. All invoices are final after checkout.
        </p>

        <h3 className="text-xs uppercase font-bold text-gray-900 pt-2 border-b border-border pb-1">4. Electronic Records</h3>
        <p>
          Digital image timeline checks are captured strictly for progress comparison during diagnoses. By registering, patients consent to visual progress charting inside their local medical files.
        </p>
      </div>
    </div>
  );
}
