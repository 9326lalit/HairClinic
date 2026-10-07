'use client';

import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PrivacyPolicyPage() {
  const router = useRouter();
  return (
    <div className="max-w-3xl mx-auto my-12 p-8 border border-border bg-gray-50 flex flex-col gap-6">
      <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer text-xs uppercase tracking-wider font-bold" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" /> Go Back
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold uppercase text-gray-900 flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" /> Privacy Policy
        </h1>
        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Last Updated: July 06, 2026</span>
      </div>

      <div className="text-xs text-muted-foreground flex flex-col gap-4 leading-relaxed">
        <p className="text-gray-800">
          At CarePlus, we take the confidentiality and privacy of patient healthcare data seriously. This Privacy Policy details how we handle electronic health records, images, prescriptions, and demographic inputs.
        </p>

        <h3 className="text-xs uppercase font-bold text-gray-900 pt-2 border-b border-border pb-1">1. Information Collection</h3>
        <p>
          We collect demographics (name, email, age, date of birth, emergency contact info) and diagnostic inputs (clinical descriptions, medical history notes, skin lesion or wound check progress tracking photos) to maintain accurate medical charts.
        </p>

        <h3 className="text-xs uppercase font-bold text-gray-900 pt-2 border-b border-border pb-1">2. Data Security</h3>
        <p>
          All data is structured to mock real-world HIPAA compliance pathways. Administrative portal operations (role verification for Doctors and Receptionists/Admins) ensure that unauthorized individuals never have access to sensitive patient logs or diagnostic records.
        </p>

        <h3 className="text-xs uppercase font-bold text-gray-900 pt-2 border-b border-border pb-1">3. Invoicing and Payments</h3>
        <p>
          Transaction records (invoice details, GST breakdowns, method of payments) are archived for financial audits and clinic reporting. No credit card information is cached on local storage.
        </p>

        <h3 className="text-xs uppercase font-bold text-gray-900 pt-2 border-b border-border pb-1">4. Contact</h3>
        <p>
          If you have questions about data retention, clinical image deletion requests, or portal credentials, contact our support team at info@careplus.com.
        </p>
      </div>
    </div>
  );
}
