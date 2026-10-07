'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ListOrdered, CheckCircle, Clock, UserCheck, ArrowRight, Play, Check, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { appointmentService } from '../../services';
import { Appointment } from '../../types';
import { useToast } from '../../components/ui/toast';

export default function QueueManager() {
  const router = useRouter();
  const toast = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const loadAppointments = () => {
    // Only load today's appointments for active queue management
    const todayStr = new Date().toISOString().split('T')[0];
    const all = appointmentService.getAll();
    const today = all.filter(a => a.date === todayStr);
    setAppointments(today);
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleUpdateStatus = (appId: string, status: Appointment['status']) => {
    appointmentService.updateStatus(appId, status);
    toast.success(`Appointment status updated to: ${status}`);
    loadAppointments();
  };

  // Grouping appointments
  const waitingQueue = appointments.filter(a => a.status === 'Booked' || a.status === 'Waiting');
  const consultingQueue = appointments.filter(a => a.status === 'Consulting');
  const completedQueue = appointments.filter(a => a.status === 'Completed');

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header Info */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold uppercase text-gray-900 flex items-center gap-2">
          <ListOrdered className="h-6 w-6 text-primary" /> Clinic Queue Dashboard
        </h1>
        <p className="text-xs text-muted-foreground">Manage active consult check-ins and session progressions in real-time.</p>
      </div>

      {/* Queue Board Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMN 1: WAITING QUEUE */}
        <div className="bg-white border border-border flex flex-col min-h-[500px]">
          <div className="p-4 border-b border-border bg-gray-50 flex justify-between items-center select-none">
            <span className="text-xs uppercase font-bold text-gray-900 tracking-wider flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" /> Waiting / Checked In
            </span>
            <Badge variant="warning">{waitingQueue.length}</Badge>
          </div>
          
          <div className="p-4 flex flex-col gap-3 overflow-y-auto max-h-[600px]">
            {waitingQueue.length === 0 ? (
              <div className="text-center py-12 text-xs text-muted-foreground">Waiting queue is empty.</div>
            ) : (
              waitingQueue.map((app) => (
                <div key={app.id} className="border border-border p-4 bg-gray-50 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{app.patientName}</h4>
                      <span className="text-[10px] text-muted-foreground">ID: {app.patientId} | Slot: {app.time}</span>
                    </div>
                    <Badge variant={app.status === 'Waiting' ? 'warning' : 'secondary'}>{app.status}</Badge>
                  </div>
                  
                  <div className="text-[11px] text-gray-600 border-t border-gray-200/60 pt-2 font-medium">
                    <strong>Consultant</strong>: {app.doctorName}<br />
                    <span className="italic text-muted-foreground">&ldquo;{app.notes || 'General checkup'}&rdquo;</span>
                  </div>

                  <div className="flex gap-2 justify-end border-t border-gray-200/60 pt-3">
                    {app.status === 'Booked' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(app.id, 'Waiting')}
                        className="text-[10px] font-bold uppercase tracking-wider h-7 py-1 px-3 border-orange-200 text-orange-600 bg-orange-50"
                      >
                        Check In
                      </Button>
                    )}
                    {app.status === 'Waiting' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleUpdateStatus(app.id, 'Consulting')}
                        className="text-[10px] font-bold uppercase tracking-wider h-7 py-1 px-3"
                      >
                        <Play className="h-3 w-3 mr-1" /> Start Consult
                      </Button>
                    )}
                    <button 
                      onClick={() => handleUpdateStatus(app.id, 'Cancelled')}
                      className="p-1 text-gray-400 hover:text-destructive cursor-pointer hover:bg-gray-100 rounded-none border-0"
                      title="Cancel Appointment"
                    >
                      <XCircle className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMN 2: CONSULTING NOW */}
        <div className="bg-white border border-border flex flex-col min-h-[500px]">
          <div className="p-4 border-b border-border bg-gray-50 flex justify-between items-center select-none">
            <span className="text-xs uppercase font-bold text-gray-900 tracking-wider flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-primary animate-pulse" /> Consulting Rooms
            </span>
            <Badge variant="info">{consultingQueue.length}</Badge>
          </div>
          
          <div className="p-4 flex flex-col gap-3 overflow-y-auto max-h-[600px]">
            {consultingQueue.length === 0 ? (
              <div className="text-center py-12 text-xs text-muted-foreground">No active consultations in progress.</div>
            ) : (
              consultingQueue.map((app) => (
                <div key={app.id} className="border border-primary p-4 bg-blue-50/20 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{app.patientName}</h4>
                      <span className="text-[10px] text-muted-foreground">ID: {app.patientId} | Room 1</span>
                    </div>
                    <Badge variant="info">In Session</Badge>
                  </div>
                  
                  <div className="text-[11px] text-gray-600 border-t border-gray-200/60 pt-2 font-medium">
                    <strong>Consultant</strong>: {app.doctorName}<br />
                    <span className="italic text-muted-foreground">&ldquo;{app.notes || 'General checkup'}&rdquo;</span>
                  </div>

                  <div className="flex gap-2 justify-end border-t border-gray-200/60 pt-3">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleUpdateStatus(app.id, 'Completed')}
                      className="text-[10px] font-bold uppercase tracking-wider h-7 py-1 px-3"
                    >
                      <Check className="h-3.5 w-3.5 mr-1" /> Checkout Complete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMN 3: COMPLETED CONSULTATIONS */}
        <div className="bg-white border border-border flex flex-col min-h-[500px]">
          <div className="p-4 border-b border-border bg-gray-50 flex justify-between items-center select-none">
            <span className="text-xs uppercase font-bold text-gray-900 tracking-wider flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" /> Checkout Completed
            </span>
            <Badge variant="success">{completedQueue.length}</Badge>
          </div>
          
          <div className="p-4 flex flex-col gap-3 overflow-y-auto max-h-[600px]">
            {completedQueue.length === 0 ? (
              <div className="text-center py-12 text-xs text-muted-foreground">No checkouts completed today.</div>
            ) : (
              completedQueue.map((app) => (
                <div key={app.id} className="border border-border p-4 bg-gray-50 flex flex-col gap-2 opacity-75">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{app.patientName}</h4>
                      <span className="text-[10px] text-muted-foreground">ID: {app.patientId} | Checked out</span>
                    </div>
                    <Badge variant="success">Completed</Badge>
                  </div>
                  
                  <div className="text-[11px] text-gray-500 border-t border-gray-100 pt-2 font-medium">
                    <strong>Consultant</strong>: {app.doctorName}
                  </div>

                  <div className="flex gap-2 justify-end border-t border-gray-100 pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/billing?patientId=${app.patientId}`)}
                      className="text-[10px] font-bold uppercase tracking-wider h-7 py-1 px-3 text-primary border-blue-200 hover:bg-blue-50"
                    >
                      Process Bill
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
