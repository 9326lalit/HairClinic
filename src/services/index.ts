import { MOCK_PATIENTS, MOCK_APPOINTMENTS, MOCK_PRESCRIPTIONS, MOCK_INVOICES, MOCK_PAYMENTS, DEFAULT_CLINIC_SETTINGS } from '../mock-data';
import { Patient, Appointment, Prescription, Invoice, Payment, ClinicSettings } from '../types';

// Helper to safely access localStorage on the client
const isClient = typeof window !== 'undefined';

const getStorageItem = <T>(key: string, defaultValue: T): T => {
  if (!isClient) return defaultValue;
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
};

const setStorageItem = <T>(key: string, value: T): void => {
  if (isClient) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// Initialize localStorage if empty
export const initializeDatabase = () => {
  if (!isClient) return;
  if (!localStorage.getItem('cms_patients')) {
    localStorage.setItem('cms_patients', JSON.stringify(MOCK_PATIENTS));
  }
  if (!localStorage.getItem('cms_appointments')) {
    localStorage.setItem('cms_appointments', JSON.stringify(MOCK_APPOINTMENTS));
  }
  if (!localStorage.getItem('cms_prescriptions')) {
    localStorage.setItem('cms_prescriptions', JSON.stringify(MOCK_PRESCRIPTIONS));
  }
  if (!localStorage.getItem('cms_invoices')) {
    localStorage.setItem('cms_invoices', JSON.stringify(MOCK_INVOICES));
  }
  if (!localStorage.getItem('cms_payments')) {
    localStorage.setItem('cms_payments', JSON.stringify(MOCK_PAYMENTS));
  }
  if (!localStorage.getItem('cms_settings')) {
    localStorage.setItem('cms_settings', JSON.stringify(DEFAULT_CLINIC_SETTINGS));
  }
};

// Patient Service
export const patientService = {
  getAll: (): Patient[] => {
    initializeDatabase();
    return getStorageItem('cms_patients', MOCK_PATIENTS);
  },
  getById: (id: string): Patient | undefined => {
    return patientService.getAll().find(p => p.id === id);
  },
  create: (patientData: Omit<Patient, 'id' | 'lastVisit' | 'imageHistory'>): Patient => {
    const patients = patientService.getAll();
    const newId = `PT-${1000 + patients.length + 1}`;
    const newPatient: Patient = {
      ...patientData,
      id: newId,
      lastVisit: new Date().toISOString().split('T')[0],
      imageHistory: [],
    };
    patients.push(newPatient);
    setStorageItem('cms_patients', patients);
    return newPatient;
  },
  update: (patient: Patient): Patient => {
    const patients = patientService.getAll();
    const idx = patients.findIndex(p => p.id === patient.id);
    if (idx !== -1) {
      patients[idx] = patient;
      setStorageItem('cms_patients', patients);
    }
    return patient;
  },
  addImage: (patientId: string, url: string): Patient | undefined => {
    const patients = patientService.getAll();
    const idx = patients.findIndex(p => p.id === patientId);
    if (idx !== -1) {
      const patient = patients[idx];
      const newImg = {
        id: `img-${Date.now()}`,
        url,
        date: new Date().toISOString().split('T')[0],
      };
      patient.imageHistory = [...patient.imageHistory, newImg];
      patients[idx] = patient;
      setStorageItem('cms_patients', patients);
      return patient;
    }
    return undefined;
  }
};

// Appointment Service
export const appointmentService = {
  getAll: (): Appointment[] => {
    initializeDatabase();
    return getStorageItem('cms_appointments', MOCK_APPOINTMENTS);
  },
  getById: (id: string): Appointment | undefined => {
    return appointmentService.getAll().find(a => a.id === id);
  },
  create: (appointmentData: Omit<Appointment, 'id'>): Appointment => {
    const appointments = appointmentService.getAll();
    const newId = `AP-${2000 + appointments.length + 1}`;
    const newAppointment: Appointment = {
      ...appointmentData,
      id: newId,
    };
    appointments.push(newAppointment);
    setStorageItem('cms_appointments', appointments);
    return newAppointment;
  },
  updateStatus: (id: string, status: Appointment['status']): Appointment | undefined => {
    const appointments = appointmentService.getAll();
    const idx = appointments.findIndex(a => a.id === id);
    if (idx !== -1) {
      appointments[idx].status = status;
      // If completed, update patient last visit
      if (status === 'Completed') {
        const patientId = appointments[idx].patientId;
        const patient = patientService.getById(patientId);
        if (patient) {
          patient.lastVisit = new Date().toISOString().split('T')[0];
          patientService.update(patient);
        }
      }
      setStorageItem('cms_appointments', appointments);
      return appointments[idx];
    }
    return undefined;
  }
};

// Prescription Service
export const prescriptionService = {
  getAll: (): Prescription[] => {
    initializeDatabase();
    return getStorageItem('cms_prescriptions', MOCK_PRESCRIPTIONS);
  },
  getById: (id: string): Prescription | undefined => {
    return prescriptionService.getAll().find(p => p.id === id);
  },
  create: (prescriptionData: Omit<Prescription, 'id'>): Prescription => {
    const prescriptions = prescriptionService.getAll();
    const newId = `PR-${3000 + prescriptions.length + 1}`;
    const newPrescription: Prescription = {
      ...prescriptionData,
      id: newId,
    };
    prescriptions.push(newPrescription);
    setStorageItem('cms_prescriptions', prescriptions);
    return newPrescription;
  }
};

// Billing Service
export const billingService = {
  getAll: (): Invoice[] => {
    initializeDatabase();
    return getStorageItem('cms_invoices', MOCK_INVOICES);
  },
  getByInvoiceNumber: (invoiceNumber: string): Invoice | undefined => {
    return billingService.getAll().find(i => i.invoiceNumber === invoiceNumber);
  },
  create: (invoiceData: Omit<Invoice, 'invoiceNumber' | 'date'>): Invoice => {
    const invoices = billingService.getAll();
    const dateStr = new Date().toISOString().split('T')[0];
    const newInvoice: Invoice = {
      ...invoiceData,
      invoiceNumber: `INV-2026-${(invoices.length + 1).toString().padStart(3, '0')}`,
      date: dateStr,
    };
    invoices.push(newInvoice);
    setStorageItem('cms_invoices', invoices);
    return newInvoice;
  },
  updateStatus: (invoiceNumber: string, status: Invoice['status']): Invoice | undefined => {
    const invoices = billingService.getAll();
    const idx = invoices.findIndex(i => i.invoiceNumber === invoiceNumber);
    if (idx !== -1) {
      invoices[idx].status = status;
      setStorageItem('cms_invoices', invoices);
      return invoices[idx];
    }
    return undefined;
  }
};

// Payment Service
export const paymentService = {
  getAll: (): Payment[] => {
    initializeDatabase();
    return getStorageItem('cms_payments', MOCK_PAYMENTS);
  },
  create: (paymentData: Omit<Payment, 'id' | 'paidDate'>): Payment => {
    const payments = paymentService.getAll();
    const newId = `TXN-${9000 + payments.length + 1}`;
    const newPayment: Payment = {
      ...paymentData,
      id: newId,
      paidDate: new Date().toISOString().split('T')[0],
    };
    payments.push(newPayment);
    setStorageItem('cms_payments', payments);
    
    // Update invoice status accordingly
    const invoice = billingService.getByInvoiceNumber(paymentData.invoiceNumber);
    if (invoice) {
      let finalStatus: Invoice['status'] = 'Paid';
      if (paymentData.status === 'Partially Paid') {
        finalStatus = 'Partially Paid';
      }
      billingService.updateStatus(paymentData.invoiceNumber, finalStatus);
    }

    return newPayment;
  }
};

// Settings Service
export const settingsService = {
  get: (): ClinicSettings => {
    initializeDatabase();
    return getStorageItem('cms_settings', DEFAULT_CLINIC_SETTINGS);
  },
  update: (settings: ClinicSettings): ClinicSettings => {
    setStorageItem('cms_settings', settings);
    return settings;
  }
};
