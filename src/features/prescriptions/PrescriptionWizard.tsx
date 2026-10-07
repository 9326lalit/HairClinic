'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FileText, Plus, Trash2, Printer, ArrowLeft, HeartPulse, Check } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Dialog } from '../../components/ui/dialog';
import { prescriptionService, patientService, appointmentService } from '../../services';
import { Prescription, Patient, Medicine, Role } from '../../types';
import { useToast } from '../../components/ui/toast';

interface PrescriptionWizardProps {
  role: Role;
}

export default function PrescriptionWizard({ role }: PrescriptionWizardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  
  // Active UI modes
  const [viewingPrescription, setViewingPrescription] = useState<Prescription | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);

  // Form State for creating a prescription
  const [targetPatient, setTargetPatient] = useState<Patient | null>(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [medicines, setMedicines] = useState<Medicine[]>([
    { name: '', dosage: '1 Tablet', morning: true, afternoon: false, night: true, days: 5, instructions: 'After food' }
  ]);

  const loadData = () => {
    setPrescriptions(prescriptionService.getAll());
    setPatients(patientService.getAll());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle query parameter actions (such as viewing a specific prescription, or creating one for a patient)
  useEffect(() => {
    const idParam = searchParams.get('id');
    const patientIdParam = searchParams.get('patientId');

    if (idParam) {
      const pres = prescriptionService.getById(idParam);
      if (pres) {
        setViewingPrescription(pres);
        setIsCreateMode(false);
      }
    } else if (patientIdParam) {
      const pat = patientService.getById(patientIdParam);
      if (pat) {
        setTargetPatient(pat);
        setIsCreateMode(true);
        setViewingPrescription(null);
      }
    } else {
      setViewingPrescription(null);
      setIsCreateMode(false);
    }
  }, [searchParams, prescriptions]);

  const handleAddMedicineRow = () => {
    setMedicines([
      ...medicines,
      { name: '', dosage: '1 Tablet', morning: true, afternoon: false, night: true, days: 5, instructions: 'After food' }
    ]);
  };

  const handleRemoveMedicineRow = (index: number) => {
    if (medicines.length === 1) {
      toast.warning('A prescription must contain at least one medicine.');
      return;
    }
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index: number, field: keyof Medicine, value: any) => {
    const updated = [...medicines];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setMedicines(updated);
  };

  const handleSavePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPatient) return;
    if (!diagnosis.trim()) {
      toast.error('Diagnosis is a required field.');
      return;
    }

    // Verify medicine names are filled
    const invalidMedicines = medicines.some(m => !m.name.trim());
    if (invalidMedicines) {
      toast.error('Please enter the name of all medications.');
      return;
    }

    // Generate prescription
    const newPres = prescriptionService.create({
      patientId: targetPatient.id,
      patientName: targetPatient.fullName,
      patientAge: targetPatient.age,
      patientGender: targetPatient.gender,
      appointmentId: `AP-${Date.now().toString().substring(7)}`,
      doctorName: 'Dr. John Doe',
      date: new Date().toISOString().split('T')[0],
      diagnosis,
      medicines,
    });

    toast.success(`Prescription issued successfully for ${targetPatient.fullName}`);
    
    // Clear create state and set viewing to show print view
    setIsCreateMode(false);
    setViewingPrescription(newPres);
    loadData();
  };

  if (viewingPrescription) {
    return (
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        <div 
          onClick={() => {
            setViewingPrescription(null);
            router.push(role === 'DOCTOR' ? '/doctor/prescriptions' : '/admin/prescriptions');
          }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer text-xs uppercase tracking-wider font-bold w-max no-print"
        >
          <ArrowLeft className="h-4 w-4" /> Return to list
        </div>

        {/* Printable prescription layout */}
        <div className="bg-white border border-border p-8 md:p-12 flex flex-col gap-8 shadow-sm print:border-0 print:shadow-none print:p-0">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-primary pb-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">Elevate Aesthetique Hair & Skin Clinic</h2>
              <span className="text-[10px] text-gray-500 leading-relaxed">
                1st Floor, Apex Heights, Gachibowli Road, Hyderabad - 500032<br />
                Phone: +91 40 2345 6789 | Email: info@elevate.com
              </span>
            </div>
            
            <div className="text-right flex flex-col gap-1">
              <h3 className="text-sm font-bold text-primary uppercase">{viewingPrescription.doctorName}</h3>
              <span className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold">MD - Dermatology, AIIMS</span>
              <span className="text-[9px] text-gray-400 font-medium">Reg No: 54321-A</span>
            </div>
          </div>

          {/* Patient Details Sub-header */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs border-b border-border pb-4 bg-gray-50 p-4">
            <div><strong>Patient Name:</strong> <span className="text-gray-800">{viewingPrescription.patientName}</span></div>
            <div><strong>Age / Gender:</strong> <span className="text-gray-800">{viewingPrescription.patientAge} Y / {viewingPrescription.patientGender}</span></div>
            <div><strong>Prescription ID:</strong> <span className="text-gray-800">{viewingPrescription.id}</span></div>
            <div><strong>Date:</strong> <span className="text-gray-800">{viewingPrescription.date}</span></div>
          </div>

          {/* Rx Diagnosis */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold uppercase text-gray-900 tracking-wider">Diagnosis / Assessment:</h4>
            <p className="text-xs text-gray-800 bg-gray-50/50 p-3 border-l-2 border-primary font-medium">{viewingPrescription.diagnosis}</p>
          </div>

          {/* Rx Symbol & Medicines Table */}
          <div className="flex flex-col gap-4">
            <div className="text-2xl font-serif text-primary italic font-semibold">R&#x211E;</div>
            
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-border text-gray-500 uppercase font-bold tracking-wider">
                  <th className="pb-3 text-left">Medicine Name</th>
                  <th className="pb-3 text-center">Morning</th>
                  <th className="pb-3 text-center">Afternoon</th>
                  <th className="pb-3 text-center">Night</th>
                  <th className="pb-3 text-center">Days</th>
                  <th className="pb-3 text-right">Intake Instructions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {viewingPrescription.medicines.map((med, idx) => (
                  <tr key={idx}>
                    <td className="py-4 font-semibold text-gray-900">{med.name}</td>
                    <td className="py-4 text-center">{med.morning ? '1' : '0'}</td>
                    <td className="py-4 text-center">{med.afternoon ? '1' : '0'}</td>
                    <td className="py-4 text-center">{med.night ? '1' : '0'}</td>
                    <td className="py-4 text-center font-medium text-gray-800">{med.days} Days</td>
                    <td className="py-4 text-right text-muted-foreground">{med.instructions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer signature */}
          <div className="mt-12 flex justify-between items-end">
            <div className="text-[10px] text-gray-400">
              * Generate digital prescription, verified credentials.
            </div>
            <div className="text-center flex flex-col gap-1 items-center">
              <div className="w-40 border-b border-gray-400 py-3" />
              <span className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Authorized Signature</span>
              <span className="text-[9px] text-muted-foreground">{viewingPrescription.doctorName}</span>
            </div>
          </div>

        </div>

        {/* Action Button */}
        <div className="flex gap-2 justify-end no-print">
          <Button 
            variant="outline" 
            size="md"
            onClick={() => {
              setViewingPrescription(null);
              router.push(role === 'DOCTOR' ? '/doctor/prescriptions' : '/admin/prescriptions');
            }}
            className="text-xs uppercase font-bold"
          >
            Close Preview
          </Button>
          <Button 
            variant="primary" 
            size="md"
            onClick={() => window.print()}
            className="text-xs uppercase font-bold"
          >
            <Printer className="h-4 w-4 mr-2" /> Print Prescription
          </Button>
        </div>
      </div>
    );
  }

  if (isCreateMode && targetPatient) {
    return (
      <div className="max-w-3xl mx-auto bg-white border border-border p-8 flex flex-col gap-6">
        <div 
          onClick={() => {
            setIsCreateMode(false);
            setTargetPatient(null);
            router.push('/doctor/prescriptions');
          }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer text-xs uppercase tracking-wider font-bold w-max"
        >
          <ArrowLeft className="h-4 w-4" /> Cancel Wizard
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold uppercase text-gray-900">Create Prescription</h1>
          <p className="text-xs text-muted-foreground">Draft medical prescription for the patient.</p>
        </div>

        {/* Target Patient info */}
        <div className="border border-border p-4 bg-gray-50 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div><strong>Patient Name:</strong> <span className="text-gray-800">{targetPatient.fullName}</span></div>
          <div><strong>Age / Gender:</strong> <span className="text-gray-800">{targetPatient.age} Y / {targetPatient.gender}</span></div>
          <div><strong>Patient ID:</strong> <span className="text-gray-800">{targetPatient.id}</span></div>
          <div><strong>Blood Group:</strong> <span className="text-gray-800">{targetPatient.bloodGroup}</span></div>
        </div>

        {/* Prescription creator form */}
        <form onSubmit={handleSavePrescription} className="flex flex-col gap-6 text-xs">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Diagnosis / Assessment Findings</label>
            <input 
              required
              type="text" 
              placeholder="E.g., Contact Dermatitis, Acute Pharyngitis, Mild Hypertension..."
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="border border-border p-3 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center border-b border-border pb-2">
              <h3 className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Medication Table</h3>
              <Button 
                variant="outline" 
                size="sm"
                type="button"
                onClick={handleAddMedicineRow}
                className="text-[9px] uppercase tracking-wider font-bold"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Medicine
              </Button>
            </div>

            <div className="flex flex-col gap-4">
              {medicines.map((med, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end border border-border p-4 bg-gray-50">
                  
                  <div className="md:col-span-4 flex flex-col gap-1">
                    <label className="text-[9px] uppercase font-bold text-gray-500">Medicine Name</label>
                    <input 
                      required
                      type="text" 
                      placeholder="E.g., Paracetamol 500mg"
                      value={med.name}
                      onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                      className="border border-border p-2 bg-white text-xs focus:outline-none rounded-none"
                    />
                  </div>

                  <div className="md:col-span-2 flex flex-col gap-1">
                    <label className="text-[9px] uppercase font-bold text-gray-500">Dosage</label>
                    <select
                      value={med.dosage}
                      onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                      className="border border-border p-2 bg-white text-xs focus:outline-none rounded-none"
                    >
                      <option>1 Tablet</option>
                      <option>2 Tablets</option>
                      <option>1/2 Tablet</option>
                      <option>5 ml</option>
                      <option>10 ml</option>
                      <option>1 Application</option>
                    </select>
                  </div>

                  <div className="md:col-span-3 flex justify-between items-center bg-white border border-border p-2 text-[10px] font-bold">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={med.morning} 
                        onChange={(e) => handleMedicineChange(index, 'morning', e.target.checked)}
                        className="accent-primary"
                      /> M
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={med.afternoon} 
                        onChange={(e) => handleMedicineChange(index, 'afternoon', e.target.checked)}
                        className="accent-primary"
                      /> A
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={med.night} 
                        onChange={(e) => handleMedicineChange(index, 'night', e.target.checked)}
                        className="accent-primary"
                      /> N
                    </label>
                  </div>

                  <div className="md:col-span-1 flex flex-col gap-1">
                    <label className="text-[9px] uppercase font-bold text-gray-500">Days</label>
                    <input 
                      required
                      type="number" 
                      value={med.days}
                      min={1}
                      onChange={(e) => handleMedicineChange(index, 'days', parseInt(e.target.value) || 1)}
                      className="border border-border p-2 bg-white text-xs focus:outline-none rounded-none"
                    />
                  </div>

                  <div className="md:col-span-2 flex flex-col gap-1">
                    <label className="text-[9px] uppercase font-bold text-gray-500">Instructions</label>
                    <select
                      value={med.instructions}
                      onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                      className="border border-border p-2 bg-white text-xs focus:outline-none rounded-none"
                    >
                      <option>After food</option>
                      <option>Before food</option>
                      <option>With milk</option>
                      <option>External use only</option>
                    </select>
                  </div>

                  <button 
                    type="button"
                    onClick={() => handleRemoveMedicineRow(index)}
                    className="p-2 border border-border hover:bg-red-50 hover:text-destructive cursor-pointer bg-white text-gray-400 mt-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                </div>
              ))}
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full text-xs font-semibold uppercase tracking-wider">
            Issue Medical Prescription & View Preview
          </Button>

        </form>
      </div>
    );
  }

  // DEFAULT MODE: LIST PRESCRIPTIONS
  return (
    <div className="flex flex-col gap-6">
      
      {/* Title & info */}
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold uppercase text-gray-900 flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" /> Clinical Prescriptions
        </h1>
        <p className="text-xs text-muted-foreground">Browse historical medication releases and printable dosage instructions.</p>
      </div>

      {/* Grid List */}
      <div className="bg-white border border-border flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-gray-50 text-gray-500 uppercase font-bold tracking-wider">
                <th className="p-4">Prescription ID</th>
                <th className="p-4">Patient Name</th>
                <th className="p-4">Consultant Doctor</th>
                <th className="p-4">Date Issued</th>
                <th className="p-4">Diagnosis Summary</th>
                <th className="p-4">Medicines Count</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {prescriptions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-muted-foreground">
                    No prescription history found in clinical archives.
                  </td>
                </tr>
              ) : (
                prescriptions.map((pr) => (
                  <tr key={pr.id} className="hover:bg-gray-50">
                    <td className="p-4 font-semibold text-gray-900">{pr.id}</td>
                    <td className="p-4 font-semibold text-gray-900">{pr.patientName}</td>
                    <td className="p-4 text-gray-700">{pr.doctorName}</td>
                    <td className="p-4 text-gray-800">{pr.date}</td>
                    <td className="p-4 font-medium text-gray-900">{pr.diagnosis}</td>
                    <td className="p-4">
                      <span className="font-semibold text-primary bg-blue-50 border border-blue-100 px-2 py-0.5">{pr.medicines.length} Medicines</span>
                    </td>
                    <td className="p-4 text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          const prefix = role === 'DOCTOR' ? '/doctor' : '/admin';
                          router.push(`${prefix}/prescriptions?id=${pr.id}`);
                        }}
                        className="text-[10px] font-bold uppercase tracking-wider h-7 py-1"
                      >
                        Print Layout
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
