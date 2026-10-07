'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, ArrowUpDown, Download, Plus, Eye, Edit, ShieldAlert } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { patientService } from '../../services';
import { Patient, Role } from '../../types';
import { useToast } from '../../components/ui/toast';
import PatientForm from './PatientForm';

interface PatientListProps {
  role: Role;
}

export default function PatientList({ role }: PatientListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchVal, setSearchVal] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [genderFilter, setGenderFilter] = useState<string>('All');
  
  // Sort State
  const [sortKey, setSortKey] = useState<keyof Patient>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Add Patient Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | undefined>(undefined);

  const loadPatients = () => {
    setPatients(patientService.getAll());
  };

  useEffect(() => {
    loadPatients();
  }, []);

  // Listen to Global Search query
  useEffect(() => {
    const query = searchParams.get('search');
    if (query) {
      setSearchVal(query);
    }
    const addParam = searchParams.get('add');
    if (addParam === 'true' && role === 'RECEPTIONIST') {
      setIsFormOpen(true);
    }
  }, [searchParams, role]);

  // Handle Sort
  const handleSort = (key: keyof Patient) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  // Filter & Search Logic
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = 
      patient.id.toLowerCase().includes(searchVal.toLowerCase()) ||
      patient.fullName.toLowerCase().includes(searchVal.toLowerCase()) ||
      patient.mobileNumber.toLowerCase().includes(searchVal.toLowerCase());
      
    const matchesStatus = statusFilter === 'All' || patient.status === statusFilter;
    const matchesGender = genderFilter === 'All' || patient.gender === genderFilter;
    
    return matchesSearch && matchesStatus && matchesGender;
  });

  // Sort Logic
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    const valA = a[sortKey];
    const valB = b[sortKey];

    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    }
    return 0;
  });

  // Pagination Logic
  const totalPages = Math.ceil(sortedPatients.length / itemsPerPage);
  const paginatedPatients = sortedPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportCSV = () => {
    toast.success('Patients spreadsheet exported successfully.');
    // Simulated CSV download
    const headers = 'ID,Name,Phone,Age,Gender,Blood,LastVisit,Status\n';
    const rows = filteredPatients.map(p => 
      `"${p.id}","${p.fullName}","${p.mobileNumber}",${p.age},"${p.gender}","${p.bloodGroup}","${p.lastVisit}","${p.status}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `Patients_Export_${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
  };

  const handleRowClick = (patientId: string) => {
    const prefix = role === 'DOCTOR' ? '/doctor' : '/admin';
    router.push(`${prefix}/patients/${patientId}`);
  };

  const handleAddSuccess = () => {
    loadPatients();
    setIsFormOpen(false);
    setEditingPatient(undefined);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold uppercase text-gray-900">Patient Database</h1>
          <p className="text-xs text-muted-foreground">Search and manage electronic health records and visual diagnosis timelines.</p>
        </div>
        
        <div className="flex gap-2 shrink-0">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportCSV}
            className="text-xs uppercase tracking-wider font-semibold"
          >
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
          {role === 'RECEPTIONIST' && (
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => {
                setEditingPatient(undefined);
                setIsFormOpen(true);
              }}
              className="text-xs uppercase tracking-wider font-semibold"
            >
              <Plus className="h-4.5 w-4.5 mr-1" /> Add Patient Record
            </Button>
          )}
        </div>
      </div>

      {/* Search and Filters panel */}
      <div className="border border-border p-4 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Patient Name, ID, or Phone..."
            value={searchVal}
            onChange={(e) => {
              setSearchVal(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full border border-border p-2.5 pl-10 text-xs bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold uppercase">
            <Filter className="h-3.5 w-3.5" /> Filters:
          </div>
          
          <select 
            value={statusFilter} 
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="border border-border p-2 text-xs bg-white focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Records</option>
            <option value="Inactive">Inactive Records</option>
          </select>

          <select 
            value={genderFilter} 
            onChange={(e) => { setGenderFilter(e.target.value); setCurrentPage(1); }}
            className="border border-border p-2 text-xs bg-white focus:outline-none"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

      </div>

      {/* Data Table */}
      <div className="bg-white border border-border flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-gray-50 text-gray-500 uppercase font-bold tracking-wider select-none">
                <th className="p-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('id')}>
                  Patient ID <ArrowUpDown className="inline h-3 w-3 ml-1" />
                </th>
                <th className="p-4">Photo</th>
                <th className="p-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('fullName')}>
                  Full Name <ArrowUpDown className="inline h-3 w-3 ml-1" />
                </th>
                <th className="p-4">Mobile Number</th>
                <th className="p-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('age')}>
                  Age <ArrowUpDown className="inline h-3 w-3 ml-1" />
                </th>
                <th className="p-4">Gender</th>
                <th className="p-4">Blood Group</th>
                <th className="p-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('lastVisit')}>
                  Last Visit <ArrowUpDown className="inline h-3 w-3 ml-1" />
                </th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedPatients.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-12 text-center text-muted-foreground text-xs">
                    No patient records match the search query and active filters.
                  </td>
                </tr>
              ) : (
                paginatedPatients.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleRowClick(p.id)}>
                    <td className="p-4 font-semibold text-gray-900">{p.id}</td>
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <div className="h-8 w-8 bg-gray-100 border border-border flex items-center justify-center font-bold text-[10px] text-primary uppercase">
                        {p.fullName.substring(0, 2)}
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-gray-900">{p.fullName}</td>
                    <td className="p-4 text-muted-foreground">{p.mobileNumber}</td>
                    <td className="p-4 text-gray-800">{p.age}</td>
                    <td className="p-4 text-gray-800">{p.gender}</td>
                    <td className="p-4 text-gray-800 font-medium">{p.bloodGroup}</td>
                    <td className="p-4 text-muted-foreground">{p.lastVisit}</td>
                    <td className="p-4">
                      <Badge variant={p.status === 'Active' ? 'success' : 'secondary'}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleRowClick(p.id)}
                          className="h-7 w-7 p-0"
                          title="View Records"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        {role === 'RECEPTIONIST' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              setEditingPatient(p);
                              setIsFormOpen(true);
                            }}
                            className="h-7 w-7 p-0"
                            title="Edit Record"
                          >
                            <Edit className="h-3.5 w-3.5 text-primary" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Panel */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-border bg-gray-50 flex justify-between items-center text-xs select-none">
            <span className="text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredPatients.length)} of {filteredPatients.length} records
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="text-[10px] uppercase font-bold tracking-wider"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="text-[10px] uppercase font-bold tracking-wider"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Inline slide-over / Modal for Add & Edit Patient */}
      {isFormOpen && (
        <PatientForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingPatient(undefined);
          }}
          onSuccess={handleAddSuccess}
          patient={editingPatient}
        />
      )}

    </div>
  );
}
