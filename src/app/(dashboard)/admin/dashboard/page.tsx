'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Calendar, 
  Receipt, 
  CreditCard, 
  Plus, 
  Clock,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { 
  appointmentService, 
  patientService, 
  billingService,
  paymentService
} from '../../../../services';
import { Appointment, Invoice, Patient } from '../../../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    // Load live mock data
    const allApps = appointmentService.getAll();
    const todayStr = new Date().toISOString().split('T')[0];
    const todayApps = allApps.filter(a => a.date === todayStr);
    setAppointments(todayApps);
    
    setInvoices(billingService.getAll());
    setPatients(patientService.getAll());

    const totalPaid = paymentService.getAll().reduce((sum, current) => sum + current.amount, 0);
    setRevenue(totalPaid);
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const registeredToday = patients.filter(p => p.lastVisit === todayStr);
  const pendingPayments = invoices.filter(i => i.status === 'Pending' || i.status === 'Partially Paid');
  const activeQueue = appointments.filter(a => a.status === 'Waiting' || a.status === 'Consulting');

  // Chart data representing weekly collections
  const collectionsChartData = [
    { name: 'Mon', revenue: 4500, bills: 5 },
    { name: 'Tue', revenue: 6500, bills: 8 },
    { name: 'Wed', revenue: 5200, bills: 6 },
    { name: 'Thu', revenue: 8900, bills: 10 },
    { name: 'Fri', revenue: 7100, bills: 7 },
    { name: 'Sat', revenue: 3500, bills: 4 },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header and Add buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold uppercase text-gray-900">Welcome, Reception Desk</h1>
          <p className="text-xs text-muted-foreground">Manage today's appointments, check-ins, payments, and registration logs.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push('/admin/appointments')}
            className="text-xs uppercase tracking-wider font-semibold"
          >
            <Calendar className="h-4 w-4 mr-2" /> Book Appointment
          </Button>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => router.push('/admin/patients?add=true')}
            className="text-xs uppercase tracking-wider font-semibold"
          >
            <Plus className="h-4 w-4 mr-1" /> Register Patient
          </Button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="flat-card flex justify-between items-start bg-white">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Today's Appointments</span>
            <span className="text-2xl font-bold uppercase text-gray-900">{appointments.length}</span>
            <span className="text-[10px] text-muted-foreground">{activeQueue.length} active in queue</span>
          </div>
          <Calendar className="h-5 w-5 text-primary" />
        </div>

        {/* Stat 2 */}
        <div className="flat-card flex justify-between items-start bg-white">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">New Registrations</span>
            <span className="text-2xl font-bold uppercase text-gray-900">{registeredToday.length}</span>
            <span className="text-[10px] text-muted-foreground">Registered today</span>
          </div>
          <Users className="h-5 w-5 text-primary" />
        </div>

        {/* Stat 3 */}
        <div className="flat-card flex justify-between items-start bg-white">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Pending Payments</span>
            <span className="text-2xl font-bold uppercase text-gray-900">{pendingPayments.length}</span>
            <span className="text-[10px] text-destructive font-semibold">
              Rs. {pendingPayments.reduce((sum, curr) => sum + (curr.grandTotal - (curr.status === 'Partially Paid' ? 400 : 0)), 0)}
            </span>
          </div>
          <Receipt className="h-5 w-5 text-destructive" />
        </div>

        {/* Stat 4 */}
        <div className="flat-card flex justify-between items-start bg-white">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Revenue</span>
            <span className="text-2xl font-bold uppercase text-gray-900">Rs. {revenue}</span>
            <span className="text-[10px] text-green-600 font-semibold">Received so far</span>
          </div>
          <TrendingUp className="h-5 w-5 text-green-600" />
        </div>
      </div>

      {/* Main Workspace grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns: Queue & Payments */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Active Appointments Table */}
          <div className="bg-white border border-border flex flex-col">
            <div className="p-4 border-b border-border bg-gray-50 flex justify-between items-center">
              <h2 className="text-xs uppercase font-bold tracking-wider text-gray-900">Today's Appointment Board</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => router.push('/admin/queue')}
                className="text-[10px] uppercase tracking-wider font-bold text-primary p-0 h-6"
              >
                Manage Queue <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-gray-50 text-gray-500 uppercase font-bold tracking-wider">
                    <th className="p-4">Time</th>
                    <th className="p-4">Patient</th>
                    <th className="p-4">Consultant</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        No appointments booked for today.
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
                        <td className="p-4 text-gray-700">{app.doctorName}</td>
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
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            {app.status === 'Booked' && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                  appointmentService.updateStatus(app.id, 'Waiting');
                                  setAppointments(appointmentService.getAll().filter(a => a.date === todayStr));
                                }}
                                className="text-[10px] font-bold uppercase tracking-wider py-1 h-7 border-orange-200 text-orange-600 bg-orange-50"
                              >
                                Check In
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => router.push(`/admin/patients/${app.patientId}`)}
                              className="text-[10px] font-bold uppercase tracking-wider py-1 h-7"
                            >
                              Profile
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

          {/* Revenue Chart */}
          <div className="bg-white border border-border p-4 flex flex-col gap-4">
            <h2 className="text-xs uppercase font-bold tracking-wider text-gray-900">Collections History</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={collectionsChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ borderRadius: 0, fontSize: 11 }} />
                  <Bar dataKey="revenue" fill="#16a34a" barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Column: Pending Invoices & Queue quick check */}
        <div className="flex flex-col gap-6">
          
          {/* Action Queue Status */}
          <div className="bg-white border border-border p-6 flex flex-col gap-4">
            <h2 className="text-xs uppercase font-bold tracking-wider text-gray-900 border-b border-border pb-2">Active Queue Breakdown</h2>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Waiting in Lounge:</span>
                <span className="font-bold text-gray-900">{appointments.filter(a => a.status === 'Waiting').length} Patients</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Active Consultations:</span>
                <span className="font-bold text-primary">{appointments.filter(a => a.status === 'Consulting').length} Patients</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">Completed Sessions:</span>
                <span className="font-bold text-green-600">{appointments.filter(a => a.status === 'Completed').length} Patients</span>
              </div>
            </div>
            <Button 
              variant="primary" 
              size="md"
              onClick={() => router.push('/admin/queue')}
              className="w-full text-xs font-bold uppercase tracking-wider"
            >
              Queue Management Panel
            </Button>
          </div>

          {/* Pending Invoices */}
          <div className="bg-white border border-border flex flex-col">
            <div className="p-4 border-b border-border bg-gray-50">
              <h2 className="text-xs uppercase font-bold tracking-wider text-gray-900">Pending Outpatient Bills</h2>
            </div>
            
            <div className="flex flex-col divide-y divide-border">
              {pendingPayments.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground">No pending bills.</div>
              ) : (
                pendingPayments.map((inv) => (
                  <div key={inv.invoiceNumber} className="p-4 hover:bg-gray-50 flex justify-between items-center text-xs">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-gray-900">{inv.patientName}</span>
                      <span className="text-[10px] text-muted-foreground">Rs. {inv.grandTotal}</span>
                      <span className="text-[9px] text-gray-400">{inv.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">{inv.status}</Badge>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => router.push(`/admin/billing?invoice=${inv.invoiceNumber}`)}
                        className="text-[9px] font-bold uppercase py-0.5 h-6 px-2"
                      >
                        Receive
                      </Button>
                    </div>
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
