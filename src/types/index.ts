export type Role = 'DOCTOR' | 'RECEPTIONIST';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  photoUrl?: string;
}

export type AppointmentStatus = 'Booked' | 'Waiting' | 'Consulting' | 'Completed' | 'Cancelled';

export interface HairConsultation {
  norwoodStage: 'Stage I' | 'Stage II' | 'Stage III' | 'Stage. III Vertex' | 'Stage IV' | 'Stage V' | 'Stage VI' | 'Stage VII';
  systemicDiseases: string[]; // HTN, DM2, Thyroid, Bleeding, Keloid, etc.
  onMedication: string;
  localAnesthesiaBefore: string;
  addictions: string[]; // Smoking, Alcohol, Tobacco, etc.
  allergyHistory: string;
  hairLossHistory: string;
  treatmentGiven: string;
  remarks: string;
}

export interface Patient {
  id: string;
  photoUrl: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  bloodGroup: string;
  occupation: string;
  address: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  medicalNotes: string;
  lastVisit: string;
  status: 'Active' | 'Inactive';
  imageHistory: Array<{
    id: string;
    url: string;
    date: string;
  }>;
  hairConsultation?: HairConsultation;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes: string;
}

export interface Medicine {
  name: string;
  dosage: string;
  morning: boolean;
  afternoon: boolean;
  night: boolean;
  days: number;
  instructions: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  appointmentId: string;
  doctorName: string;
  date: string;
  diagnosis: string;
  medicines: Medicine[];
}

export interface Invoice {
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  consultationFee: number;
  medicineCharges: number;
  otherCharges: number;
  gst: number;
  discount: number;
  grandTotal: number;
  status: 'Paid' | 'Partially Paid' | 'Pending' | 'Refunded';
  date: string;
}

export interface Payment {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  paymentMethod: 'Cash' | 'UPI' | 'Card' | 'Bank Transfer';
  amount: number;
  paidDate: string;
  status: 'Paid' | 'Partially Paid' | 'Pending' | 'Refunded';
}

export interface ClinicSettings {
  clinicName: string;
  clinicLogo: string;
  address: string;
  phoneNumber: string;
  gstNumber: string;
  invoicePrefix: string;
  timezone: string;
  language: string;
  theme: 'light' | 'dark' | 'corporate';
}
