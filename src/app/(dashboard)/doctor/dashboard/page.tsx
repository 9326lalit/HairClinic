'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Calendar, 
  Clock, 
  TrendingUp, 
  FileText, 
  AlertCircle, 
  CheckCircle,
  Play
} from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { 
  appointmentService, 
  patientService, 
  prescriptionService, 
  billingService 
} from '../../../../services';
import { Appointment, Prescription, Patient } from '../../../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DoctorDashboard() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    // Load live mock data
    const todayStr = new Date().toISOString().split('T')[0];
    const allApps = appointmentService.getAll();
    const todayApps = allApps.filter(a => a.date === todayStr && a.doctorName.includes('Doe'));
    setAppointments(todayApps);
    
    setPrescriptions(prescriptionService.getAll().slice(0, 5));
    setPatients(patientService.getAll());
    
    const totalPaid = billingService.getAll()
      .filter(i => i.status === 'Paid')
      .reduce((sum, current) => sum + current.grandTotal, 0);
    setRevenue(totalPaid);
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const pendingApps = appointments.filter(a => a.status === 'Waiting' || a.status === 'Booked');
  const consultingApp = appointments.find(a => a.status === 'Consulting');
  const completedApps = appointments.filter(a => a.status === 'Completed');

  // Chart data representing weekly consultation counts
  const consultationChartData = [
    { name: 'Mon', consultations: 8, revenue: 4800 },
    { name: 'Tue', consultations: 12, revenue: 7200 },
    { name: 'Wed', consultations: 10, revenue: 6000 },
    { name: 'Thu', consultations: 15, revenue: 9000 },
    { name: 'Fri', consultations: 11, revenue: 6600 },
    { name: 'Sat', consultations: 5, revenue: 3000 },
  ];

  const handleStartConsultation = (appId: string) => {
    appointmentService.updateStatus(appId, 'Consulting');
    router.push(`/doctor/patients/${appointments.find(a => a.id === appId)?.patientId}?consultingApp=${appId}`);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold uppercase text-gray-900">Welcome, Dr. John Doe</h1>
        <p className="text-xs text-muted-foreground">Here is your clinical schedule and consultation overview for today.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="flat-card flex justify-between items-start bg-white">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Today's Queue</span>
            <span className="text-2xl font-bold uppercase text-gray-900">{appointments.length}</span>
            <span className="text-[10px] text-muted-foreground">{pendingApps.length} patients pending</span>
          </div>
          <Users className="h-5 w-5 text-primary" />
        </div>

        {/* Stat 2 */}
        <div className="flat-card flex justify-between items-start bg-white">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Consulting Now</span>
            <span className="text-sm font-bold uppercase text-primary truncate max-w-[150px]">
              {consultingApp ? consultingApp.patientName : 'No Active Patient'}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {consultingApp ? `Room 1 | Started at ${consultingApp.time}` : 'Idle'}
            </span>
          </div>
          <Clock className="h-5 w-5 text-primary animate-pulse" />
        </div>

        {/* Stat 3 */}
        <div className="flat-card flex justify-between items-start bg-white">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Completed Today</span>
            <span className="text-2xl font-bold uppercase text-gray-900">{completedApps.length}</span>
            <span className="text-[10px] text-green-600 font-semibold">{appointments.length ? `${Math.round((completedApps.length / appointments.length) * 100)}%` : '0%'} check-out rate</span>
          </div>
          <CheckCircle className="h-5 w-5 text-green-600" />
        </div>

        {/* Stat 4 */}
        <div className="flat-card flex justify-between items-start bg-white">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Patients</span>
            <span className="text-2xl font-bold uppercase text-gray-900">{patients.length}</span>
            <span className="text-[10px] text-muted-foreground">Registered in database</span>
          </div>
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Appointments & Queue */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Today's Queue Management Table */}
          <div className="bg-white border border-border flex flex-col">
            <div className="p-4 border-b border-border bg-gray-50 flex justify-between items-center">
              <h2 className="text-xs uppercase font-bold tracking-wider text-gray-900">Today's Appointment Queue</h2>
              <span className="text-[10px] bg-blue-50 text-primary border border-blue-200 px-2 py-0.5 font-bold uppercase">{todayStr}</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-gray-50 text-gray-500 uppercase font-bold tracking-wider">
                    <th className="p-4">Time</th>
                    <th className="p-4">Patient Name</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Complaint Notes</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        No appointments scheduled for you today.
                      </td>
                    </tr>
                  ) : (
                    appointments.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50">
                        <td className="p-4 font-semibold text-gray-900">{app.time}</td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900">{app.patientName}</span>
                            <span className="text-[10px] text-muted-foreground">{app.patientId}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge 
                            variant={
                              app.status === 'Completed' ? 'success' :
                              app.status === 'Consulting' ? 'info' :
                              app.status === 'Waiting' ? 'warning' : 'secondary'
                            }
                          >
                            {app.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-muted-foreground max-w-xs truncate" title={app.notes}>
                          {app.notes}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            {app.status !== 'Completed' && app.status !== 'Consulting' && (
                              <Button 
                                variant="primary" 
                                size="sm" 
                                onClick={() => handleStartConsultation(app.id)}
                                className="text-[10px] font-bold uppercase tracking-wider py-1 h-7"
                              >
                                <Play className="h-3 w-3 mr-1" /> Consult
                              </Button>
                            )}
                            {app.status === 'Consulting' && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => router.push(`/doctor/patients/${app.patientId}?consultingApp=${app.id}`)}
                                className="text-[10px] font-bold uppercase tracking-wider text-primary border-blue-200 py-1 h-7 bg-blue-50"
                              >
                                Resume
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => router.push(`/doctor/patients/${app.patientId}`)}
                              className="text-[10px] font-bold uppercase tracking-wider py-1 h-7"
                            >
                              Chart
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

          {/* Consultation Chart */}
          <div className="bg-white border border-border p-4 flex flex-col gap-4">
            <h2 className="text-xs uppercase font-bold tracking-wider text-gray-900">Weekly Clinical Workload</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={consultationChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ borderRadius: 0, fontSize: 11 }} />
                  <Bar dataKey="consultations" fill="#2563eb" barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Column: Alerts & Recent Prescriptions */}
        <div className="flex flex-col gap-6">
          
          {/* Active Consultation Box */}
          <div className="bg-white border border-border p-6 flex flex-col gap-4">
            <h2 className="text-xs uppercase font-bold tracking-wider text-gray-900 border-b border-border pb-2">Active Consultation</h2>
            {consultingApp ? (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{consultingApp.patientName}</h3>
                    <span className="text-[10px] text-muted-foreground">ID: {consultingApp.patientId} | Slot: {consultingApp.time}</span>
                  </div>
                  <Badge variant="info">In Progress</Badge>
                </div>
                <p className="text-xs text-muted-foreground italic bg-gray-50 p-3 border-l-2 border-primary">
                  &ldquo;{consultingApp.notes}&rdquo;
                </p>
                <Button 
                  variant="primary" 
                  size="md"
                  onClick={() => router.push(`/doctor/patients/${consultingApp.patientId}?consultingApp=${consultingApp.id}`)}
                  className="w-full text-xs font-bold uppercase tracking-wider"
                >
                  Write Prescription & Notes
                </Button>
              </div>
            ) : (
              <div className="text-center py-6 flex flex-col gap-3 items-center text-muted-foreground text-xs">
                <AlertCircle className="h-8 w-8 text-gray-300" />
                <span>No consultation active right now. Select a patient from the queue below to start.</span>
              </div>
            )}
          </div>

          {/* Recent Prescriptions Issued */}
          <div className="bg-white border border-border flex flex-col">
            <div className="p-4 border-b border-border bg-gray-50">
              <h2 className="text-xs uppercase font-bold tracking-wider text-gray-900">Recent Prescriptions</h2>
            </div>
            
            <div className="flex flex-col divide-y divide-border">
              {prescriptions.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground">No recent prescriptions.</div>
              ) : (
                prescriptions.map((pres) => (
                  <div key={pres.id} className="p-4 hover:bg-gray-50 flex justify-between items-center text-xs">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-gray-900">{pres.patientName}</span>
                      <span className="text-[10px] text-muted-foreground">{pres.diagnosis}</span>
                      <span className="text-[9px] text-gray-400">{pres.date}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => router.push(`/doctor/prescriptions?id=${pres.id}`)}
                      className="text-[9px] font-bold uppercase py-0.5 h-6 px-2"
                    >
                      Print
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
