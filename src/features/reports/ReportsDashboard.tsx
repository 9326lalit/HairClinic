'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend } from 'recharts';
import { BarChart3, Download, TrendingUp, Users, Calendar, HelpCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { billingService, patientService, appointmentService } from '../../services';
import { useToast } from '../../components/ui/toast';

export default function ReportsDashboard() {
  const toast = useToast();
  const [reportType, setReportType] = useState<'Revenue' | 'Patients' | 'Appointments'>('Revenue');

  // Load basic mock totals
  const totalPaid = billingService.getAll().filter(i => i.status === 'Paid').reduce((sum, curr) => sum + curr.grandTotal, 0);
  const totalPatients = patientService.getAll().length;
  const totalAppointments = appointmentService.getAll().length;

  // Chart data
  const revenueData = [
    { date: 'Jul 01', revenue: 4200, consults: 5 },
    { date: 'Jul 02', revenue: 5800, consults: 7 },
    { date: 'Jul 03', revenue: 4900, consults: 6 },
    { date: 'Jul 04', revenue: 7500, consults: 9 },
    { date: 'Jul 05', revenue: 9200, consults: 11 },
    { date: 'Jul 06', revenue: totalPaid, consults: 8 }, // dynamic from service
  ];

  const patientDemographics = [
    { name: 'New Patients', value: 40 },
    { name: 'Returning Patients', value: 60 },
  ];

  const COLORS = ['#2563eb', '#16a34a'];

  const appointmentStatuses = [
    { status: 'Completed', count: appointmentService.getAll().filter(a => a.status === 'Completed').length },
    { status: 'Booked/Waiting', count: appointmentService.getAll().filter(a => a.status === 'Booked' || a.status === 'Waiting' || a.status === 'Consulting').length },
    { status: 'Cancelled', count: appointmentService.getAll().filter(a => a.status === 'Cancelled').length },
  ];

  const handleExport = () => {
    toast.success(`${reportType} statement downloaded successfully.`);
    // Mock export download
    const headers = 'Metric,Value\n';
    const rows = `Total Revenue,${totalPaid}\nRegistered Patients,${totalPatients}\nConsultation Schedules,${totalAppointments}\n`;
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `${reportType}_Report_${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Title & Export */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold uppercase text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" /> Reports & Analytics
          </h1>
          <p className="text-xs text-muted-foreground">Monitor outpatient summaries, clinical billing volumes, and checkout ratios.</p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleExport}
          className="text-xs uppercase tracking-wider font-semibold"
        >
          <Download className="h-4 w-4 mr-2" /> Export Report (CSV)
        </Button>
      </div>

      {/* Analytics highlights row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flat-card flex gap-4 items-center bg-white">
          <div className="h-10 w-10 bg-blue-50 border border-blue-100 text-primary flex items-center justify-center">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-gray-400">Total Collections</span>
            <span className="text-sm font-bold text-gray-900">Rs. {totalPaid}.00</span>
          </div>
        </div>

        <div className="flat-card flex gap-4 items-center bg-white">
          <div className="h-10 w-10 bg-green-50 border border-green-100 text-green-700 flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-gray-400">Patients Logged</span>
            <span className="text-sm font-bold text-gray-900">{totalPatients} Registered</span>
          </div>
        </div>

        <div className="flat-card flex gap-4 items-center bg-white">
          <div className="h-10 w-10 bg-orange-50 border border-orange-100 text-orange-700 flex items-center justify-center">
            <Calendar className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-gray-400">Consultation Schedules</span>
            <span className="text-sm font-bold text-gray-900">{totalAppointments} Booked</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-border bg-white text-xs select-none">
        {(['Revenue', 'Patients', 'Appointments'] as const).map((tab) => {
          const isActive = reportType === tab;
          return (
            <button
              key={tab}
              onClick={() => setReportType(tab)}
              className={`px-6 py-3 font-semibold uppercase tracking-wider cursor-pointer border-b-2 transition-all ${
                isActive ? 'border-primary text-primary bg-blue-50/20' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab} Analysis
            </button>
          );
        })}
      </div>

      {/* Main Chart Card */}
      <div className="bg-white border border-border p-6 flex flex-col gap-6">
        <h2 className="text-xs uppercase font-bold tracking-wider text-gray-900">
          {reportType} Visual Analytics Graph
        </h2>
        
        <div className="h-80 w-full">
          {reportType === 'Revenue' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: 0, fontSize: 11 }} />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {reportType === 'Patients' && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={patientDemographics}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {patientDemographics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 0, fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          )}

          {reportType === 'Appointments' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appointmentStatuses}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="status" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: 0, fontSize: 11 }} />
                <Bar dataKey="count" fill="#2563eb" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

    </div>
  );
}
