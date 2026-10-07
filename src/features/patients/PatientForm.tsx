'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { patientService } from '../../services';
import { Patient } from '../../types';
import { useToast } from '../../components/ui/toast';

const patientSchema = z.object({
  fullName: z.string().min(2, 'Full Name must be at least 2 characters'),
  mobileNumber: z.string().min(10, 'Mobile Number must be at least 10 characters'),
  email: z.string().email('Invalid email address'),
  age: z.coerce.number().min(0, 'Age must be 0 or greater').max(120, 'Age must be under 120'),
  gender: z.enum(['Male', 'Female', 'Other']),
  dob: z.string().min(1, 'Date of birth is required'),
  bloodGroup: z.string().min(1, 'Blood group is required'),
  occupation: z.string().min(2, 'Occupation is required'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  emergencyName: z.string().min(2, 'Emergency Contact Name is required'),
  emergencyRelation: z.string().min(2, 'Emergency Contact Relation is required'),
  emergencyPhone: z.string().min(10, 'Emergency phone must be at least 10 characters'),
  medicalNotes: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientSchema>;

interface PatientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  patient?: Patient;
}

export default function PatientForm({ isOpen, onClose, onSuccess, patient }: PatientFormProps) {
  const toast = useToast();
  const isEditMode = !!patient;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      fullName: '',
      mobileNumber: '',
      email: '',
      age: 0,
      gender: 'Male',
      dob: '',
      bloodGroup: 'O+',
      occupation: '',
      address: '',
      emergencyName: '',
      emergencyRelation: '',
      emergencyPhone: '',
      medicalNotes: '',
    },
  });

  // Pre-fill form values in edit mode
  useEffect(() => {
    if (patient) {
      reset({
        fullName: patient.fullName,
        mobileNumber: patient.mobileNumber,
        email: patient.email,
        age: patient.age,
        gender: patient.gender,
        dob: patient.dob,
        bloodGroup: patient.bloodGroup,
        occupation: patient.occupation,
        address: patient.address,
        emergencyName: patient.emergencyContact.name,
        emergencyRelation: patient.emergencyContact.relation,
        emergencyPhone: patient.emergencyContact.phone,
        medicalNotes: patient.medicalNotes,
      });
    } else {
      reset();
    }
  }, [patient, reset]);

  const onSubmit = (data: PatientFormValues) => {
    const payload = {
      fullName: data.fullName,
      mobileNumber: data.mobileNumber,
      email: data.email,
      age: data.age,
      gender: data.gender,
      dob: data.dob,
      bloodGroup: data.bloodGroup,
      occupation: data.occupation,
      address: data.address,
      emergencyContact: {
        name: data.emergencyName,
        relation: data.emergencyRelation,
        phone: data.emergencyPhone,
      },
      medicalNotes: data.medicalNotes || '',
      status: (patient?.status || 'Active') as 'Active' | 'Inactive',
      photoUrl: patient?.photoUrl || `/avatars/patient-${Math.floor(Math.random() * 5) + 1}.svg`,
    };

    try {
      if (isEditMode && patient) {
        patientService.update({
          ...patient,
          ...payload,
        });
        toast.success(`Patient record updated: "${data.fullName}"`);
      } else {
        patientService.create(payload);
        toast.success(`Patient registered successfully: "${data.fullName}"`);
      }
      onSuccess();
    } catch (err) {
      toast.error('An error occurred while saving the record.');
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Edit Patient Record' : 'Register New Patient'}
      size="xl"
      footer={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" type="button" onClick={onClose} className="text-xs uppercase font-bold tracking-wider">
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="button" onClick={handleSubmit(onSubmit)} className="text-xs uppercase font-bold tracking-wider">
            Save Record
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 text-xs">
        
        {/* Fake Photo Upload */}
        <div className="flex flex-col gap-1.5 border border-dashed border-border p-4 bg-gray-50 text-center items-center justify-center">
          <span className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Patient Photograph</span>
          <input 
            type="file" 
            accept="image/*"
            className="text-[10px] text-gray-500 mt-2 cursor-pointer outline-none"
            onChange={() => toast.success('Mock photo attached successfully.')}
          />
          <span className="text-[9px] text-muted-foreground mt-1">Accepts JPG, PNG formats. Max limit 2MB.</span>
        </div>

        {/* Section 1: Demographics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Full Name</label>
            <input
              type="text"
              {...register('fullName')}
              className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
            />
            {errors.fullName?.message && <span className="text-destructive text-[10px] font-semibold">{errors.fullName.message as string}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Mobile Number</label>
            <input
              type="tel"
              {...register('mobileNumber')}
              className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
            />
            {errors.mobileNumber?.message && <span className="text-destructive text-[10px] font-semibold">{errors.mobileNumber.message as string}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Email Address</label>
            <input
              type="email"
              {...register('email')}
              className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
            />
            {errors.email?.message && <span className="text-destructive text-[10px] font-semibold">{errors.email.message as string}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Age</label>
            <input
              type="number"
              {...register('age')}
              className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
            />
            {errors.age?.message && <span className="text-destructive text-[10px] font-semibold">{errors.age.message as string}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Date of Birth</label>
            <input
              type="date"
              {...register('dob')}
              className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
            />
            {errors.dob?.message && <span className="text-destructive text-[10px] font-semibold">{errors.dob.message as string}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Gender</label>
            <select
              {...register('gender')}
              className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Blood Group</label>
            <select
              {...register('bloodGroup')}
              className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
            >
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Occupation</label>
            <input
              type="text"
              {...register('occupation')}
              className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
            />
            {errors.occupation?.message && <span className="text-destructive text-[10px] font-semibold">{errors.occupation.message as string}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Home/Billing Address</label>
            <input
              type="text"
              {...register('address')}
              className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
            />
            {errors.address?.message && <span className="text-destructive text-[10px] font-semibold">{errors.address.message as string}</span>}
          </div>
        </div>

        {/* Section 2: Emergency Contact */}
        <h3 className="text-xs uppercase font-bold tracking-wider text-gray-900 border-b border-border pb-1">Emergency Contact</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Contact Name</label>
            <input
              type="text"
              {...register('emergencyName')}
              className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
            />
            {errors.emergencyName?.message && <span className="text-destructive text-[10px] font-semibold">{errors.emergencyName.message as string}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Relation</label>
            <input
              type="text"
              {...register('emergencyRelation')}
              className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
            />
            {errors.emergencyRelation?.message && <span className="text-destructive text-[10px] font-semibold">{errors.emergencyRelation.message as string}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Mobile Number</label>
            <input
              type="tel"
              {...register('emergencyPhone')}
              className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
            />
            {errors.emergencyPhone?.message && <span className="text-destructive text-[10px] font-semibold">{errors.emergencyPhone.message as string}</span>}
          </div>
        </div>

        {/* Section 3: Clinical Notes */}
        <h3 className="text-xs uppercase font-bold tracking-wider text-gray-900 border-b border-border pb-1">Medical Brief</h3>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Clinical Notes / Allergies Summary</label>
          <textarea
            rows={3}
            {...register('medicalNotes')}
            placeholder="E.g., Allergic to Penicillin, history of cardiovascular checks..."
            className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none resize-none"
          />
        </div>

      </form>
    </Dialog>
  );
}
