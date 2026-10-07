'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Search, Filter, Plus, Clock, FileText, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Dialog } from '../../components/ui/dialog';
import { appointmentService, patientService } from '../../services';
import { Appointment, Patient, Role } from '../../types';
import { useToast } from '../../components/ui/toast';

interface AppointmentListProps {
  role: Role;
}

export default function AppointmentList({ role }: AppointmentListProps) {
  const router = useRouter();
  const toast = useToast();
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchVal, setSearchVal] = useState('');
  
  // Tabs: All, Today, Tomorrow, Completed, Cancelled
  const [activeTab, setActiveTab] = useState<'All' | 'Today' | 'Tomorrow' | 'Completed' | 'Cancelled'>('All');

  // Book Appointment dialog states
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('Dr. John Doe');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');

  const loadAppointments = () => {
    setAppointments(appointmentService.getAll());
    setPatients(patientService.getAll());
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId || !bookingDate || !bookingTime) {
      toast.error('Please complete all scheduling fields.');
      return;
    }

    const patient = patients.find(p => p.id === selectedPatientId);
    if (!patient) return;

    appointmentService.create({
      patientId: patient.id,
      patientName: patient.fullName,
      doctorName: selectedDoctor,
      date: bookingDate,
      time: bookingTime,
      status: 'Booked',
      notes: bookingNotes,
    });

    toast.success(`Appointment scheduled successfully for "${patient.fullName}"`);
    setIsBookOpen(false);
    
    // Reset Form
    setSelectedPatientId('');
    setBookingDate('');
    setBookingTime('');
    setBookingNotes('');

    loadAppointments();
  };

  // Filter Logic
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const filteredAppointments = appointments.filter((app) => {
    // Search
    const matchesSearch = 
      app.patientName.toLowerCase().includes(searchVal.toLowerCase()) ||
      app.id.toLowerCase().includes(searchVal.toLowerCase()) ||
      app.doctorName.toLowerCase().includes(searchVal.toLowerCase());
      
    // Tabs
    let matchesTab = true;
    if (activeTab === 'Today') {
      matchesTab = app.date === todayStr;
    } else if (activeTab === 'Tomorrow') {
      matchesTab = app.date === tomorrowStr;
    } else if (activeTab === 'Completed') {
      matchesTab = app.status === 'Completed';
    } else if (activeTab === 'Cancelled') {
      matchesTab = app.status === 'Cancelled';
    }

    return matchesSearch && matchesTab;
  });

  // Sort by date then time
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const dateTimeA = new Date(`${a.date}T${a.time}`);
    const dateTimeB = new Date(`${b.date}T${b.time}`);
    return dateTimeA.getTime() - dateTimeB.getTime();
  });

  const handleCancel = (appId: string) => {
    appointmentService.updateStatus(appId, 'Cancelled');
    toast.success('Appointment marked as Cancelled.');
    loadAppointments();
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Title & Trigger */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold uppercase text-gray-900">Appointments Desk</h1>
          <p className="text-xs text-muted-foreground">Monitor outpatient schedules, consultation assignments, and booking slots.</p>
        </div>
        {role === 'RECEPTIONIST' && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsBookOpen(true)}
            className="text-xs uppercase tracking-wider font-semibold"
          >
            <Plus className="h-4.5 w-4.5 mr-1" /> Schedule Consultation
          </Button>
        )}
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-border bg-white text-xs select-none">
        {(['All', 'Today', 'Tomorrow', 'Completed', 'Cancelled'] as const).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold uppercase tracking-wider cursor-pointer border-b-2 transition-all ${
                isActive ? 'border-primary text-primary bg-blue-50/20' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by Patient Name, Consultation ID, Doctor..."
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          className="w-full border border-border p-2.5 pl-10 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
        />
      </div>

      {/* Appointments Grid Table */}
      <div className="bg-white border border-border flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-gray-50 text-gray-500 uppercase font-bold tracking-wider">
                <th className="p-4">App ID</th>
                <th className="p-4">Patient Name</th>
                <th className="p-4">Consultant Doctor</th>
                <th className="p-4">Date</th>
                <th className="p-4">Time</th>
                <th className="p-4">Status</th>
                <th className="p-4">Notes</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedAppointments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-muted-foreground">
                    No scheduled consultations found.
                  </td>
                </tr>
              ) : (
                sortedAppointments.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="p-4 font-semibold text-gray-900">{app.id}</td>
                    <td className="p-4 font-semibold text-gray-900">{app.patientName}</td>
                    <td className="p-4 text-gray-700">{app.doctorName}</td>
                    <td className="p-4 text-gray-800">{app.date}</td>
                    <td className="p-4 font-semibold text-gray-900">{app.time}</td>
                    <td className="p-4">
                      <Badge 
                        variant={
                          app.status === 'Completed' ? 'success' :
                          app.status === 'Consulting' ? 'info' :
                          app.status === 'Waiting' ? 'warning' :
                          app.status === 'Cancelled' ? 'destructive' : 'secondary'
                        }
                      >
                        {app.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground max-w-xs truncate" title={app.notes}>
                      {app.notes || '-'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {role === 'RECEPTIONIST' && app.status === 'Booked' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              appointmentService.updateStatus(app.id, 'Waiting');
                              loadAppointments();
                              toast.success('Patient checked-in successfully.');
                            }}
                            className="text-[10px] font-bold uppercase tracking-wider py-1 h-7 border-orange-200 text-orange-600 bg-orange-50"
                          >
                            Check In
                          </Button>
                        )}
                        {role === 'RECEPTIONIST' && app.status !== 'Cancelled' && app.status !== 'Completed' && (
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleCancel(app.id)}
                            className="text-[10px] font-bold uppercase tracking-wider py-1 h-7"
                          >
                            Cancel
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            const prefix = role === 'DOCTOR' ? '/doctor' : '/admin';
                            router.push(`${prefix}/patients/${app.patientId}`);
                          }}
                          className="text-[10px] font-bold uppercase tracking-wider py-1 h-7"
                        >
                          View File
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book Appointment Modal */}
      {isBookOpen && (
        <Dialog
          isOpen={isBookOpen}
          onClose={() => setIsBookOpen(false)}
          title="Schedule Outpatient Consultation"
          size="md"
          footer={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsBookOpen(false)} className="text-xs uppercase font-bold">
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="button" onClick={handleBookAppointment} className="text-xs uppercase font-bold">
                Confirm Slot
              </Button>
            </div>
          }
        >
          <form onSubmit={handleBookAppointment} className="flex flex-col gap-4 text-xs">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Select Patient</label>
              <select
                required
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
              >
                <option value="">-- Select Registered Patient --</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.fullName} ({p.id})</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Consultant Doctor</label>
              <select
                required
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
              >
                <option>Dr. John Doe (Dermatology)</option>
                <option>Dr. Sarah Smith (Pediatrics)</option>
                <option>Dr. Vijay Kumar (General Medicine)</option>
                <option>Dr. Neha Sharma (Cardiology)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Appointment Date</label>
                <input
                  required
                  type="date"
                  value={bookingDate}
                  min={todayStr}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Preferred Time Slot</label>
                <input
                  required
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Reason for Visit / Complaint Notes</label>
              <textarea
                rows={3}
                placeholder="Brief description of clinical concern..."
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
                className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none resize-none"
              />
            </div>

          </form>
        </Dialog>
      )}

    </div>
  );
}
