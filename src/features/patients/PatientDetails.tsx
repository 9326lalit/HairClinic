'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  Heart, 
  Calendar, 
  FileText, 
  Receipt, 
  Image as ImageIcon, 
  Plus, 
  Columns,
  Play,
  Sparkles,
  Printer
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Dialog } from '../../components/ui/dialog';
import { 
  patientService, 
  appointmentService, 
  prescriptionService, 
  billingService 
} from '../../services';
import { Patient, Appointment, Prescription, Invoice, Role } from '../../types';
import { useToast } from '../../components/ui/toast';

interface PatientDetailsProps {
  id: string;
  role: Role;
}

export default function PatientDetails({ id, role }: PatientDetailsProps) {
  const router = useRouter();
  const toast = useToast();
  
  const [patient, setPatient] = useState<Patient | undefined>(undefined);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  
  // Image comparison states
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]); // holds ids

  // Consent & Consultation Form states
  const [isConsentOpen, setIsConsentOpen] = useState(false);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  // Consultation form field states
  const [formNorwoodStage, setFormNorwoodStage] = useState<'Stage I' | 'Stage II' | 'Stage III' | 'Stage. III Vertex' | 'Stage IV' | 'Stage V' | 'Stage VI' | 'Stage VII' | any>('Stage III');
  const [formSystemicDiseases, setFormSystemicDiseases] = useState<string[]>([]);
  const [formOnMedication, setFormOnMedication] = useState('');
  const [formLocalAnesthesiaBefore, setFormLocalAnesthesiaBefore] = useState('');
  const [formAddictions, setFormAddictions] = useState<string[]>([]);
  const [formAllergyHistory, setFormAllergyHistory] = useState('');
  const [formHairLossHistory, setFormHairLossHistory] = useState('');
  const [formTreatmentGiven, setFormTreatmentGiven] = useState('');
  const [formRemarks, setFormRemarks] = useState('');

  const loadData = () => {
    const p = patientService.getById(id);
    setPatient(p);
    
    if (p) {
      const allApps = appointmentService.getAll().filter(a => a.patientId === id);
      setAppointments(allApps);
      
      const allPres = prescriptionService.getAll().filter(pr => pr.patientId === id);
      setPrescriptions(allPres);
      
      const allInvs = billingService.getAll().filter(inv => inv.patientId === id);
      setInvoices(allInvs);

      if (p.hairConsultation) {
        setFormNorwoodStage(p.hairConsultation.norwoodStage);
        setFormSystemicDiseases(p.hairConsultation.systemicDiseases);
        setFormOnMedication(p.hairConsultation.onMedication);
        setFormLocalAnesthesiaBefore(p.hairConsultation.localAnesthesiaBefore);
        setFormAddictions(p.hairConsultation.addictions);
        setFormAllergyHistory(p.hairConsultation.allergyHistory);
        setFormHairLossHistory(p.hairConsultation.hairLossHistory);
        setFormTreatmentGiven(p.hairConsultation.treatmentGiven);
        setFormRemarks(p.hairConsultation.remarks);
      }
    }
  };

  const handleSaveConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) return;
    const updatedConsultation = {
      norwoodStage: formNorwoodStage,
      systemicDiseases: formSystemicDiseases,
      onMedication: formOnMedication,
      localAnesthesiaBefore: formLocalAnesthesiaBefore,
      addictions: formAddictions,
      allergyHistory: formAllergyHistory,
      hairLossHistory: formHairLossHistory,
      treatmentGiven: formTreatmentGiven,
      remarks: formRemarks,
    };
    const updatedPatient = {
      ...patient,
      hairConsultation: updatedConsultation,
    };
    patientService.update(updatedPatient);
    toast.success('Hair Consultation assessment sheet recorded successfully.');
    setIsConsultationModalOpen(false);
    loadData();
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (!patient) {
    return (
      <div className="border border-border p-8 text-center text-xs text-muted-foreground bg-white">
        Patient record ID "{id}" not found in the database.
      </div>
    );
  }

  // Handle adding custom mock follow-up image
  const handleAddFollowupImage = () => {
    // Generate a mock follow-up image based on history length
    const nextImgNum = patient.imageHistory.length + 1;
    let mockUrl = `/images/derm-jane-3.svg`; // default Jane healed
    if (patient.id === 'PT-1002') {
      mockUrl = `/images/wound-mike-2.svg`;
    }
    
    patientService.addImage(patient.id, mockUrl);
    toast.success('Mock check-up clinical image appended to patient file timeline.');
    loadData();
  };

  const handleToggleSelectImage = (imgId: string) => {
    setSelectedImages((prev) => {
      if (prev.includes(imgId)) {
        return prev.filter(x => x !== imgId);
      }
      if (prev.length >= 2) {
        toast.warning('You can select a maximum of 2 images for side-by-side comparison.');
        return [prev[1], imgId];
      }
      return [...prev, imgId];
    });
  };

  // Automated default comparison images (Oldest vs Newest) if none are selected
  const handleQuickCompare = () => {
    if (patient.imageHistory.length < 2) {
      toast.warning('At least 2 clinical images are required in history to compare.');
      return;
    }
    
    if (selectedImages.length === 2) {
      setIsCompareOpen(true);
    } else {
      // Auto select first (oldest) and last (latest)
      const oldest = patient.imageHistory[0].id;
      const latest = patient.imageHistory[patient.imageHistory.length - 1].id;
      setSelectedImages([oldest, latest]);
      setIsCompareOpen(true);
    }
  };

  const compareImage1 = patient.imageHistory.find(img => img.id === selectedImages[0]);
  const compareImage2 = patient.imageHistory.find(img => img.id === selectedImages[1]);

  return (
    <div className="flex flex-col gap-6">
      
      {/* Back button */}
      <div 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer text-xs uppercase tracking-wider font-bold w-max"
      >
        <ArrowLeft className="h-4 w-4" /> Back to List
      </div>

      {/* Patient Profile Card */}
      <div className="bg-white border border-border grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
        
        {/* Left Column: Photo & Core */}
        <div className="p-6 flex flex-col items-center justify-center text-center gap-4">
          <div className="h-24 w-24 bg-gray-100 border border-border flex items-center justify-center font-bold text-3xl text-primary uppercase select-none">
            {patient.fullName.substring(0, 2)}
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-bold uppercase text-gray-900">{patient.fullName}</h2>
            <span className="text-[10px] text-muted-foreground">ID: {patient.id}</span>
            <span className="mt-1"><Badge variant={patient.status === 'Active' ? 'success' : 'secondary'}>{patient.status}</Badge></span>
          </div>
        </div>

        {/* Mid Column: Contact & General */}
        <div className="p-6 md:col-span-2 flex flex-col gap-4 text-xs">
          <h3 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Demographic Information</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
            <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-gray-400" /> <span>{patient.mobileNumber}</span></div>
            <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-gray-400" /> <span className="truncate">{patient.email}</span></div>
            <div className="flex items-center gap-2"><User className="h-4 w-4 text-gray-400" /> <span>{patient.gender} | Age {patient.age}</span></div>
            <div className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-gray-400" /> <span>{patient.occupation}</span></div>
            <div className="flex items-center gap-2"><Heart className="h-4 w-4 text-gray-400" /> <span>Blood Group: {patient.bloodGroup}</span></div>
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-gray-400" /> <span>DOB: {patient.dob}</span></div>
          </div>
          
          <div className="flex gap-2 items-start border-t border-gray-100 pt-3 text-gray-700">
            <MapPin className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
            <span>{patient.address}</span>
          </div>
        </div>

        {/* Right Column: Emergency & Actions */}
        <div className="p-6 flex flex-col gap-4 text-xs justify-between">
          <div>
            <h3 className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">Emergency Contact</h3>
            <div className="flex flex-col gap-1 text-gray-800 font-semibold bg-gray-50 p-3 border-l-2 border-primary">
              <span>{patient.emergencyContact.name} ({patient.emergencyContact.relation})</span>
              <span className="text-muted-foreground font-medium">{patient.emergencyContact.phone}</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 w-full">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsConsentOpen(true)}
              className="w-full text-xs uppercase font-bold tracking-wider"
            >
              <FileText className="h-3.5 w-3.5 mr-1.5" /> Transplant Consent
            </Button>
            
            {role === 'DOCTOR' && (
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => router.push(`/doctor/prescriptions?patientId=${patient.id}`)}
                className="w-full text-xs uppercase font-bold tracking-wider"
              >
                <Play className="h-3 w-3 mr-1" /> New Prescription
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Clinical Diagnosis Notes Summary */}
      <div className="bg-white border border-border p-6 flex flex-col gap-3">
        <h3 className="text-xs uppercase font-bold tracking-wider text-gray-900 border-b border-border pb-2">Medical History & Allergies Summary</h3>
        <p className="text-xs text-gray-700 leading-relaxed">
          {patient.medicalNotes || 'No chronic histories or allergies documented.'}
        </p>
      </div>

      {/* Hair Consultation Assessment Sheet (As requested by user form) */}
      <div className="bg-white border border-border p-6 flex flex-col gap-4 animate-in fade-in duration-200">
        <div className="flex justify-between items-center border-b border-border pb-2">
          <h3 className="text-xs uppercase font-bold tracking-wider text-gray-900 flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-primary" /> Hair Consultation Chart (Norwood Scale)
          </h3>
          {role === 'DOCTOR' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsConsultationModalOpen(true)}
              className="text-[10px] uppercase font-bold tracking-wider h-7 py-0.5 px-3"
            >
              {patient.hairConsultation ? 'Edit Assessment' : 'Record Assessment'}
            </Button>
          )}
        </div>

        {patient.hairConsultation ? (
          <div className="text-xs flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Norwood Stage Indicator */}
              <div className="border border-border p-4 bg-gray-50 flex flex-col items-center justify-center text-center gap-3">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Norwood Loss Scale</span>
                <div className="h-16 w-16 bg-pink-100 flex items-center justify-center border border-pink-200 text-primary font-bold text-sm">
                  {patient.hairConsultation.norwoodStage}
                </div>
                <p className="text-[10px] text-muted-foreground leading-normal max-w-[180px]">
                  Visual assessment shows {patient.hairConsultation.norwoodStage} hair thinning pattern.
                </p>
              </div>

              {/* Checklists */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Systemic History Check</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['HTN', 'DM2', 'Thyroid', 'Bleeding', 'Keloid'].map((d) => {
                      const isActive = patient.hairConsultation?.systemicDiseases.includes(d);
                      return (
                        <span 
                          key={d} 
                          className={`px-2 py-0.5 text-[9px] font-bold uppercase border ${
                            isActive 
                              ? 'bg-pink-50 border-pink-200 text-primary' 
                              : 'bg-gray-100 border-gray-200 text-gray-400 line-through'
                          }`}
                        >
                          {d}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Addiction Risk Check</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Smoking', 'Alcohol', 'Tobacco'].map((a) => {
                      const isActive = patient.hairConsultation?.addictions.includes(a);
                      return (
                        <span 
                          key={a} 
                          className={`px-2 py-0.5 text-[9px] font-bold uppercase border ${
                            isActive 
                              ? 'bg-orange-50 border-orange-200 text-orange-700' 
                              : 'bg-gray-100 border-gray-200 text-gray-400 line-through'
                          }`}
                        >
                          {a}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-1 sm:col-span-2 border-t border-gray-100 pt-2">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Medications & Anesthesia</span>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Medications</strong>: {patient.hairConsultation.onMedication || 'None.'}<br />
                    <strong>Anesthesia History</strong>: {patient.hairConsultation.localAnesthesiaBefore || 'None.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border pt-3">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Hair Loss / Treatments History</span>
                <p className="text-gray-700 leading-normal">
                  {patient.hairConsultation.hairLossHistory || 'No prior treatments noted.'}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-primary tracking-wider font-semibold">Treatment Prescribed / Grafts</span>
                <p className="text-gray-900 font-bold bg-pink-50/30 p-2.5 border-l-2 border-primary">
                  {patient.hairConsultation.treatmentGiven || 'No treatments advised.'}
                </p>
              </div>
            </div>

            {patient.hairConsultation.remarks && (
              <div className="bg-gray-50 border border-border p-3 mt-1">
                <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Clinical Remarks / Planning</span>
                <p className="text-gray-700 mt-1 italic">"{patient.hairConsultation.remarks}"</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground text-xs flex flex-col items-center justify-center gap-2 bg-gray-50 border border-dashed border-border">
            <span>No active hair consultation or Norwood assessment recorded for this patient.</span>
            {role === 'DOCTOR' && (
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => setIsConsultationModalOpen(true)}
                className="text-[10px] uppercase font-bold tracking-wider mt-1"
              >
                Start Hair Assessment Form
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Image Gallery Timeline */}
      <div className="bg-white border border-border p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-border pb-2">
          <h3 className="text-xs uppercase font-bold tracking-wider text-gray-900 flex items-center gap-2">
            <ImageIcon className="h-4.5 w-4.5 text-primary" /> Visual Diagnostics Progress Timeline
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleQuickCompare}
              disabled={patient.imageHistory.length < 2}
              className="text-[10px] uppercase font-bold tracking-wider"
            >
              <Columns className="h-3.5 w-3.5 mr-1" /> Compare Images
            </Button>
            {role === 'RECEPTIONIST' && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddFollowupImage}
                className="text-[10px] uppercase font-bold tracking-wider"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Progress Image
              </Button>
            )}
          </div>
        </div>

        {patient.imageHistory.length === 0 ? (
          <div className="text-center py-8 text-xs text-muted-foreground">No progressive skin/wound diagnostic photographs captured in this patient file.</div>
        ) : (
          <div className="flex flex-col gap-2">
            <span className="text-[10px] text-muted-foreground">Select up to 2 images below and click &ldquo;Compare Images&rdquo; to analyze progression side-by-side.</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 mt-2">
              {patient.imageHistory.map((img) => {
                const isSelected = selectedImages.includes(img.id);
                return (
                  <div 
                    key={img.id}
                    onClick={() => handleToggleSelectImage(img.id)}
                    className={`border p-2 cursor-pointer transition-all flex flex-col gap-2 ${
                      isSelected ? 'border-primary bg-blue-50 ring-1 ring-primary' : 'border-border bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="w-full aspect-[4/3] relative bg-white border border-border flex items-center justify-center text-[10px] uppercase text-muted-foreground overflow-hidden">
                      <img src={img.url} alt={img.date} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-bold">
                      <span className="text-gray-500">{img.date}</span>
                      {isSelected && <Badge variant="primary" className="py-0 px-1 text-[8px]">Selected</Badge>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Grid: Appointments, Prescriptions, Financials */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Box 1: Appointments History */}
        <div className="bg-white border border-border flex flex-col">
          <div className="p-4 border-b border-border bg-gray-50">
            <h3 className="text-xs uppercase font-bold tracking-wider text-gray-900">Appointments ({appointments.length})</h3>
          </div>
          <div className="divide-y divide-border overflow-y-auto max-h-60 text-xs">
            {appointments.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">No visits.</div>
            ) : (
              appointments.map((a) => (
                <div key={a.id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-gray-900">{a.date}</span>
                    <span className="text-[10px] text-muted-foreground">{a.time} | Consultant: {a.doctorName}</span>
                  </div>
                  <Badge 
                    variant={
                      a.status === 'Completed' ? 'success' :
                      a.status === 'Consulting' ? 'info' :
                      a.status === 'Waiting' ? 'warning' : 'secondary'
                    }
                  >
                    {a.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Box 2: Prescriptions History */}
        <div className="bg-white border border-border flex flex-col">
          <div className="p-4 border-b border-border bg-gray-50">
            <h3 className="text-xs uppercase font-bold tracking-wider text-gray-900">Prescriptions ({prescriptions.length})</h3>
          </div>
          <div className="divide-y divide-border overflow-y-auto max-h-60 text-xs">
            {prescriptions.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">No prescriptions issued.</div>
            ) : (
              prescriptions.map((pr) => (
                <div key={pr.id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-gray-900">{pr.diagnosis}</span>
                    <span className="text-[10px] text-muted-foreground">{pr.date} | {pr.medicines.length} Medicines</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      const prefix = role === 'DOCTOR' ? '/doctor' : '/admin';
                      router.push(`${prefix}/prescriptions?id=${pr.id}`);
                    }}
                    className="text-[9px] font-bold uppercase py-0.5 h-6"
                  >
                    View
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Box 3: Invoice Outstandings */}
        <div className="bg-white border border-border flex flex-col">
          <div className="p-4 border-b border-border bg-gray-50">
            <h3 className="text-xs uppercase font-bold tracking-wider text-gray-900">Financial History ({invoices.length})</h3>
          </div>
          <div className="divide-y divide-border overflow-y-auto max-h-60 text-xs">
            {invoices.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">No transactions.</div>
            ) : (
              invoices.map((inv) => (
                <div key={inv.invoiceNumber} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-gray-900">{inv.invoiceNumber}</span>
                    <span className="text-[10px] text-muted-foreground">Rs. {inv.grandTotal} | {inv.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={inv.status === 'Paid' ? 'success' : inv.status === 'Pending' ? 'destructive' : 'warning'}>
                      {inv.status}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        const prefix = role === 'DOCTOR' ? '/doctor' : '/admin';
                        router.push(`${prefix}/billing?invoice=${inv.invoiceNumber}`);
                      }}
                      className="text-[9px] font-bold uppercase py-0.5 h-6"
                    >
                      Bill
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Side-by-Side Image Comparison Modal */}
      {isCompareOpen && compareImage1 && compareImage2 && (
        <Dialog
          isOpen={isCompareOpen}
          onClose={() => setIsCompareOpen(false)}
          title="Clinical Comparison Screen"
          size="xl"
          footer={
            <Button variant="outline" size="sm" onClick={() => setIsCompareOpen(false)} className="text-xs uppercase font-bold">
              Close Comparison
            </Button>
          }
        >
          <div className="flex flex-col gap-4 text-xs">
            <p className="text-muted-foreground">Analyzing side-by-side progression for {patient.fullName}.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              {/* Oldest Image */}
              <div className="border border-border p-4 bg-gray-50 flex flex-col gap-3">
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Older Visual Record ({compareImage1.date})</span>
                <div className="w-full aspect-[4/3] bg-white border border-border flex items-center justify-center overflow-hidden">
                  <img src={compareImage1.url} alt="Older Check" className="object-cover w-full h-full" />
                </div>
                <div className="p-3 bg-white border border-border text-gray-700 leading-normal">
                  <strong>Status</strong>: Initial Assessment. Pathological observations noted.
                </div>
              </div>
              
              {/* Latest Image */}
              <div className="border border-border p-4 bg-gray-50 flex flex-col gap-3">
                <span className="text-[10px] uppercase font-bold text-primary tracking-wider">Latest Visual Record ({compareImage2.date})</span>
                <div className="w-full aspect-[4/3] bg-white border border-border flex items-center justify-center overflow-hidden">
                  <img src={compareImage2.url} alt="Latest Check" className="object-cover w-full h-full" />
                </div>
                <div className="p-3 bg-white border border-border text-gray-700 leading-normal">
                  <strong>Status</strong>: Follow-up Check. Progressing healing vectors observed.
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      )}

      {/* 1. Hair Consultation Edit/Add Modal */}
      {isConsultationModalOpen && (
        <Dialog
          isOpen={isConsultationModalOpen}
          onClose={() => setIsConsultationModalOpen(false)}
          title="Hair Consultation Assessment Sheet"
          size="lg"
        >
          <form onSubmit={handleSaveConsultation} className="text-xs flex flex-col gap-4 max-h-[75vh] overflow-y-auto pr-1">
            <p className="text-muted-foreground">Complete the hair consultation details corresponding to the patient's scalp examination.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Norwood Hair Loss Scale Stage</label>
                <select
                  value={formNorwoodStage}
                  onChange={(e) => setFormNorwoodStage(e.target.value as any)}
                  className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
                >
                  <option value="Stage I">Stage I</option>
                  <option value="Stage II">Stage II</option>
                  <option value="Stage III">Stage III</option>
                  <option value="Stage III Vertex">Stage III Vertex</option>
                  <option value="Stage IV">Stage IV</option>
                  <option value="Stage V">Stage V</option>
                  <option value="Stage VI">Stage VI</option>
                  <option value="Stage VII">Stage VII</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Systemic Illness History</label>
                <div className="grid grid-cols-3 gap-2 border border-border p-2.5 bg-white">
                  {['HTN', 'DM2', 'Thyroid', 'Bleeding', 'Keloid'].map((d) => {
                    const isChecked = formSystemicDiseases.includes(d);
                    return (
                      <label key={d} className="flex items-center gap-1.5 cursor-pointer font-medium">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormSystemicDiseases([...formSystemicDiseases, d]);
                            } else {
                              setFormSystemicDiseases(formSystemicDiseases.filter(x => x !== d));
                            }
                          }}
                          className="accent-primary"
                        />
                        <span>{d}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Active Medications / Details</label>
                <input
                  type="text"
                  value={formOnMedication}
                  onChange={(e) => setFormOnMedication(e.target.value)}
                  placeholder="E.g., Takes Amlodipine 5mg once daily"
                  className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Local Anesthesia History / Complications</label>
                <input
                  type="text"
                  value={formLocalAnesthesiaBefore}
                  onChange={(e) => setFormLocalAnesthesiaBefore(e.target.value)}
                  placeholder="E.g., Yes, dental extract in 2024, no side effects"
                  className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Addiction Risk Profiles</label>
                <div className="grid grid-cols-3 gap-2 border border-border p-2.5 bg-white">
                  {['Smoking', 'Alcohol', 'Tobacco'].map((a) => {
                    const isChecked = formAddictions.includes(a);
                    return (
                      <label key={a} className="flex items-center gap-1.5 cursor-pointer font-medium">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormAddictions([...formAddictions, a]);
                            } else {
                              setFormAddictions(formAddictions.filter(x => x !== a));
                            }
                          }}
                          className="accent-primary"
                        />
                        <span>{a}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Allergies & Skin Sensitivity details</label>
                <input
                  type="text"
                  value={formAllergyHistory}
                  onChange={(e) => setFormAllergyHistory(e.target.value)}
                  placeholder="E.g., None reported / Allergic to Sulfonamides"
                  className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">History of Alopecia / Prior Hair Treatments</label>
              <input
                type="text"
                value={formHairLossHistory}
                onChange={(e) => setFormHairLossHistory(e.target.value)}
                placeholder="E.g., Progressive thinning for 5 years. Minoxidil used for 6 months."
                className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-primary tracking-wider font-bold">Treatment Given / Grafts Prescribed</label>
                <textarea
                  rows={2}
                  value={formTreatmentGiven}
                  onChange={(e) => setFormTreatmentGiven(e.target.value)}
                  placeholder="E.g., FUE Hair Transplant advised. 2500 Grafts planned."
                  className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Clinical Remarks & Recommendations</label>
                <textarea
                  rows={2}
                  value={formRemarks}
                  onChange={(e) => setFormRemarks(e.target.value)}
                  placeholder="E.g., Strong donor hair logs. Scalp is ready."
                  className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-border pt-4 mt-2">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setIsConsultationModalOpen(false)}
                className="text-xs uppercase font-bold tracking-wider"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                className="text-xs uppercase font-bold tracking-wider"
              >
                Save Assessment
              </Button>
            </div>
          </form>
        </Dialog>
      )}

      {/* 2. Follicle Hair Transplant Consent Form Printable Modal */}
      {isConsentOpen && (
        <Dialog
          isOpen={isConsentOpen}
          onClose={() => setIsConsentOpen(false)}
          title="Transplant Consent Agreement Follicle"
          size="xl"
          footer={
            <div className="flex justify-between items-center w-full gap-4 text-xs font-semibold print:hidden">
              <span className="text-muted-foreground">Press Ctrl+P to trigger standard system printer directly.</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsConsentOpen(false)} className="text-xs uppercase font-bold">
                  Close Form
                </Button>
                <Button variant="primary" size="sm" onClick={() => window.print()} className="text-xs uppercase font-bold">
                  <Printer className="h-4 w-4 mr-2" /> Print Consent
                </Button>
              </div>
            </div>
          }
        >
          {/* Print Style Injector */}
          <style dangerouslySetInnerHTML={{__html: `
            @media print {
              body * {
                visibility: hidden !important;
              }
              #printable-consent-area, #printable-consent-area * {
                visibility: visible !important;
              }
              #printable-consent-area {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                font-size: 11px !important;
                line-height: 1.5 !important;
              }
            }
          `}} />

          {/* Form Content */}
          <div id="printable-consent-area" className="text-xs flex flex-col gap-6 p-4 max-h-[70vh] overflow-y-auto print:max-h-none print:overflow-visible pr-2 print:p-0">
            
            {/* Header branding */}
            <div className="flex justify-between items-start border-b-2 border-primary pb-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 font-serif">Elevate Aesthetique</h2>
                <span className="text-[10px] text-gray-500 leading-normal">
                  Follicle Hair Transplant Center | Hair & Skin Clinical Services
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-primary tracking-wider">Consent Document</span>
                <p className="text-[10px] text-gray-500">Date: {new Date().toISOString().split('T')[0]}</p>
              </div>
            </div>

            <div className="text-center font-bold uppercase text-gray-900 text-sm tracking-wider border-b border-border pb-2">
              Consent Form for Hair Transplant Surgery
            </div>

            {/* Demographics confirmation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-border p-4 bg-gray-50/50">
              <div className="flex flex-col gap-1.5">
                <p>I, <strong>{patient.fullName}</strong>, Age: <strong>{patient.age}</strong>, Sex: <strong>{patient.gender}</strong>, hereby give consent to have Hair Transplant surgery performed on me by operative surgeon of Elevate Aesthetique Hair Transplant Clinic and his team.</p>
                <p><strong>Permanent Address</strong>: {patient.address}</p>
              </div>
              <div className="flex flex-col gap-1.5 leading-relaxed text-gray-700">
                <p><strong>Primary Phone</strong>: {patient.mobileNumber}</p>
                <p><strong>Email Coordinate</strong>: {patient.email}</p>
                <p><strong>Emergency Contact</strong>: {patient.emergencyContact.name} ({patient.emergencyContact.relation}) - {patient.emergencyContact.phone}</p>
              </div>
            </div>

            {/* Scrollable guidelines checklist (Points 1 to 16 matching picture) */}
            <div className="flex flex-col gap-3.5 leading-relaxed text-gray-800 font-medium">
              <h3 className="text-[10px] uppercase font-bold text-gray-900 tracking-wider border-b border-border pb-1">I have understood the following surgical guidelines:</h3>
              <ol className="list-decimal pl-4 flex flex-col gap-3">
                <li>I am aware that hair transplantation is an elective surgery which restores my bald area with new hair.</li>
                <li>I am aware that the procedure will be performed under local anaesthesia and give consent for the same.</li>
                <li>Doctor has explained to me the procedure / steps of surgery and I have understood those.</li>
                <li>Hair Transplantation will not stop my pre-existing hair fall for that I need to treat hair fall separately, Doctor will not take any guarantee or warranty of my pre-existing hair.</li>
                <li>Density of transplanted area depends upon donor like quality of hair, colour of hair and number of hair follicle per grafts and these varies from person to person. Doctors can try to implant maximum number of grafts per square centimetre, area without taking risk of skin necrosis. The clinic does not charge for density; I will be charged as per number of grafts, not as per desired density. I understand that density of hair transplant cannot be as dense as non-bald area.</li>
                <li>Hairline is discussed with me and I agree for that. Doctor explained to me all pros and cons of my hairline.</li>
                <li>I give permission to use my available grafts according to the area of baldness and Doctor's decision regarding it.</li>
                <li>Scaring is always present after surgery. It is a small round scar. It may be at the Donor site or it may be at the transplanted zone due to slit making.</li>
                <li>I understand that minor / major allergic / hypersensitivity reactions are known to drugs used during surgery. This reaction is not predictable; it may vary from itching / rashes to severe cardio-respiratory arrest.</li>
                <li>I disclosed to the Doctor that I do not have any history of systemic illness or allergic reaction except: <strong>{patient.hairConsultation?.allergyHistory || 'None reported'}</strong>.</li>
                <li>I understand that operation is a collective approach of team, it will consist of Doctors, technicians and O.T. assistants; Doctors cannot perform surgery alone and need to be supported by O.T. staff. As hair transplantation is a long duration procedure, I understand that some part of surgery will also be done by expert technicians.</li>
                <li>I have been advised to undergo FUE / RTFUE hair transplant surgery with approximate grafts availability matching the doctor's assessment. Any changes in graft numbers will be explained to me and I am ready for that.</li>
                <li>I understand that all recommendations made during my consultation and treatment are estimates. If the Doctor or I feel an additional procedure is necessary, I understand that there will be additional surgical fees for that.</li>
                <li>I give consent to Dr. John Doe and his team to take and exhibit before, after and during the surgery photographs and videos of me for the purpose of education and case records.</li>
                <li>I understand that success of the hair transplant procedure also depends on my compliance. I need to closely follow all instructions, pre-operative, and post-operative activities and precautions.</li>
                <li>I understand that the results of Hair Transplant take approximately 9 to 12 months, so I will not comment and expect results before the said duration.</li>
              </ol>
            </div>

            {/* Complications Checklist */}
            <div className="border border-border p-4 bg-gray-50/50 flex flex-col gap-3 font-medium">
              <h3 className="text-[10px] uppercase font-bold text-gray-900 tracking-wider border-b border-border pb-1">Complications of Procedure Explained:</h3>
              <ul className="list-disc pl-4 flex flex-col gap-2 leading-relaxed text-gray-700">
                <li><strong>Post-operative swelling</strong>: Very normal phenomenon after surgery. Swelling of forehead, round the eyes, and below the eyes can be present up to 2 weeks.</li>
                <li><strong>Itching and redness</strong>: Common at both the donor and transplanted areas, and may persist for 2 to 4 months of surgery.</li>
                <li><strong>Boils or folliculitis</strong>: A common sequela of hair transplant, present up to 6 months to 1 year. This is not life-threatening and is easily treated.</li>
                <li><strong>Numbness and dryness of head</strong>: Minor side effects due to cutting of superficial sensory nerves during grafts placement.</li>
                <li><strong>Hair loss on Transplanted area</strong>: Temporary shedding phase. Growth starts from month 7, and final density is achieved at 1 year. Hiccups may occur post surgery.</li>
              </ul>
            </div>

            {/* Signatures block */}
            <div className="grid grid-cols-3 gap-6 pt-10 mt-6 border-t border-border text-center font-semibold">
              <div className="flex flex-col gap-12">
                <span className="border-t border-gray-400 pt-2 text-gray-700">Patient's Signature</span>
                <span className="text-[10px] text-muted-foreground">Date: ________________</span>
              </div>
              <div className="flex flex-col gap-12">
                <span className="border-t border-gray-400 pt-2 text-gray-700">Witness / Parent Signature</span>
                <span className="text-[10px] text-muted-foreground">Relation: _______________</span>
              </div>
              <div className="flex flex-col gap-12">
                <span className="border-t border-gray-400 pt-2 text-gray-700">Doctor's Signature</span>
                <span className="text-[10px] text-muted-foreground font-bold">Dr. John Doe (Reg: 54321-A)</span>
              </div>
            </div>

          </div>
        </Dialog>
      )}

    </div>
  );
}
