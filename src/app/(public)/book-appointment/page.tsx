'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, Calendar, Clock, User, Phone, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '../../../components/ui/button';

export default function BookAppointmentPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    dob: '',
    gender: 'Male',
    doctor: 'Dr. John Doe',
    date: '',
    time: '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 border border-border bg-gray-50 flex flex-col items-center text-center gap-6">
        <CheckCircle className="h-16 w-16 text-green-600" />
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold uppercase text-gray-900">Request Submitted Successfully!</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your appointment reservation request has been registered in our system. A clinic receptionist will contact you on <strong>{formData.mobileNumber}</strong> within 2 hours to confirm your slot.
          </p>
        </div>
        
        <div className="w-full border-t border-b border-border py-4 text-left flex flex-col gap-2 text-xs">
          <span className="flex justify-between"><strong>Patient:</strong> <span>{formData.fullName}</span></span>
          <span className="flex justify-between"><strong>Specialist:</strong> <span>{formData.doctor}</span></span>
          <span className="flex justify-between"><strong>Requested Slot:</strong> <span>{formData.date} at {formData.time}</span></span>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={() => router.push('/')} className="text-xs uppercase tracking-wider font-semibold">
            Return Home
          </Button>
          <Button variant="primary" size="sm" onClick={() => setSubmitted(false)} className="text-xs uppercase tracking-wider font-semibold">
            Request Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-12 p-8 border border-border bg-gray-50 flex flex-col gap-6">
      <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer text-xs uppercase tracking-wider font-bold" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" /> Go Back
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold uppercase text-gray-900 flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" /> Book Appointment
        </h1>
        <p className="text-xs text-muted-foreground leading-normal">
          Fill in this registration form to request a consultation with one of our board-certified specialists. All electronic records are securely handled.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <h3 className="text-xs uppercase font-bold tracking-wider text-gray-900 border-b border-border pb-2">1. Patient Demographics</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Full Name</label>
            <input 
              required 
              type="text" 
              placeholder="Jane Smith"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="border border-border p-3 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-primary" 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Mobile Number</label>
            <input 
              required 
              type="tel" 
              placeholder="+91 98765 43210"
              value={formData.mobileNumber}
              onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
              className="border border-border p-3 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-primary" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Email Address</label>
            <input 
              required 
              type="email" 
              placeholder="jane@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="border border-border p-3 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-primary" 
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Date of Birth</label>
            <input 
              required 
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              className="border border-border p-3 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-primary" 
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Gender</label>
            <select 
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="border border-border p-3 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <h3 className="text-xs uppercase font-bold tracking-wider text-gray-900 border-b border-border pb-2">2. Consultation Preferences</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Preferred Doctor</label>
            <select 
              value={formData.doctor}
              onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
              className="border border-border p-3 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option>Dr. John Doe (Dermatologist)</option>
              <option>Dr. Sarah Smith (Pediatrician)</option>
              <option>Dr. Vijay Kumar (General Medicine)</option>
              <option>Dr. Neha Sharma (Cardiologist)</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Preferred Date</label>
            <input 
              required 
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="border border-border p-3 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-primary" 
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Preferred Time Slot</label>
            <input 
              required 
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="border border-border p-3 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-primary" 
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Reasons for Visit / Medical History Details</label>
          <textarea 
            rows={3} 
            placeholder="E.g., tracking a skin lesion, regular pediatric vaccination refill, blood pressure evaluation details..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="border border-border p-3 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-primary resize-none" 
          />
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full text-xs font-semibold uppercase tracking-wider mt-2">
          Request Consultation Slot
        </Button>
      </form>
    </div>
  );
}
