'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Shield, 
  Clock, 
  Users, 
  Calendar, 
  ChevronRight, 
  Award, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  Phone, 
  Mail, 
  Star 
} from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function LandingPage() {
  const router = useRouter();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const stats = [
    { value: '15+', label: 'Specialist Doctors' },
    { value: '25k+', label: 'Happy Patients' },
    { value: '12+', label: 'Clinical Departments' },
    { value: '99.2%', label: 'Satisfaction Rate' },
  ];

  const services = [
    { title: 'General Medicine', desc: 'Comprehensive health checks, disease management, and preventative healthcare advice.' },
    { title: 'Dermatology & Skin Check', desc: 'Acne, eczema, psoriasis, mole checks, lesion monitoring with high-res digital history.' },
    { title: 'Pediatric Care', desc: 'Immunizations, development monitoring, and specialized medical care for children.' },
    { title: 'Geriatric Medicine', desc: 'Tailored healthcare services and chronic illness support for elderly patients.' },
    { title: 'Cardiology Diagnostics', desc: 'Heart health evaluations, blood pressure control, and ECG screenings.' },
    { title: 'Orthopedics & Joint Care', desc: 'Treatment for arthritis, fractures, sports injuries, and rehabilitation plans.' },
  ];

  const doctors = [
    { name: 'Dr. John Doe', spec: 'Senior Dermatologist', exp: '16 Years Experience', edu: 'MD - Dermatology, AIIMS' },
    { name: 'Dr. Sarah Smith', spec: 'Consultant Pediatrician', exp: '12 Years Experience', edu: 'MD - Pediatrics, JIPMER' },
    { name: 'Dr. Vijay Kumar', spec: 'General Physician', exp: '20 Years Experience', edu: 'MBBS, MD - Internal Medicine' },
    { name: 'Dr. Neha Sharma', spec: 'Cardiologist Specialist', exp: '10 Years Experience', edu: 'DM - Cardiology, KEM Mumbai' },
  ];

  const testimonials = [
    { text: "The skin tracking comparison tool at CarePlus helped us monitor my treatment progress clearly. Dr. John Doe is extremely professional and explained everything thoroughly.", author: "Jane Smith", role: "Software Engineer" },
    { text: "Very efficient clinic management. There is virtually no waiting time when you book ahead. The digital prescriptions make it so easy to retrieve refills.", author: "Michael Johnson", role: "Business Analyst" },
    { text: "We take our son to Dr. Sarah, and she is amazing. The receptionists are always helpful with booking follow-ups and processing payments quickly.", author: "Vijay Mehta", role: "Parent" },
  ];

  const faqs = [
    { q: "How do I register as a new patient?", a: "New patients can be registered at the reception desk during their first visit. Please bring a valid government ID and any existing medical records." },
    { q: "Can I view my medical and prescription history online?", a: "Yes, once registered, all your clinical notes, image timelines, and prescriptions are securely saved in our electronic database for future consultations." },
    { q: "What should I do in case of an emergency?", a: "For critical medical emergencies, please visit the nearest hospital emergency room. Our clinic handles scheduled appointments and urgent general care during operating hours." },
    { q: "Do you offer billing invoice printouts?", a: "Yes, detailed GST-compliant invoices are generated immediately upon payment. We accept cash, UPI, cards, and bank transfers." }
  ];

  const gallery = [
    { title: 'Main Reception & Lounge', desc: 'Spacious, clean lobby and patient welcome desks.' },
    { title: 'Dermatology Lab', desc: 'Equipped with digital lesion imaging systems.' },
    { title: 'Consultation Room 1', desc: 'Comfortable consultation space for private assessments.' },
    { title: 'Pediatric Care Ward', desc: 'Kid-friendly vaccination and check-up facilities.' },
    { title: 'Pharmacy & Dispensing', desc: 'In-house dispensary for immediate prescription refills.' },
    { title: 'Advanced Diagnostics Suite', desc: 'ECG, Nebulization, and outpatient diagnostics setup.' }
  ];

  return (
    <div className="flex flex-col">
      
      {/* 1. HERO SECTION */}
      <section className="bg-gray-50 border-b border-border py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-primary px-3 py-1 text-xs font-bold uppercase tracking-wider flat-border w-max border-blue-200">
              <Shield className="h-4 w-4" /> Trusted Healthcare Provider
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold uppercase tracking-tight text-gray-900 leading-tight">
              Enterprise Grade <span className="text-primary">Clinical Excellence</span>
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              CarePlus delivers highly customized, digital-first healthcare solutions. Our modern multi-specialty clinic features high-res clinical tracking, structured digital records, and professional diagnostics to ensure optimal health outcomes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => router.push('/book-appointment')}
                className="text-xs uppercase tracking-wider font-semibold"
              >
                Schedule Appointment <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  const element = document.getElementById('services');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs uppercase tracking-wider font-semibold"
              >
                Explore Services
              </Button>
            </div>
          </div>
          
          {/* Hero Decorative Grid */}
          <div className="bg-white border border-border p-8 flex flex-col gap-6 justify-between h-96 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 border-b border-l border-border -z-0" />
            <div className="z-10 flex flex-col gap-4">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Operational Highlights</span>
              <h2 className="text-2xl font-bold uppercase text-gray-900">Modern Digital Healthcare</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Our clinic runs fully customized electronic health record integrations. This supports instantaneous prescription dispatch, GST-auditable billing, and direct visual clinical tracking.
              </p>
            </div>
            <div className="z-10 grid grid-cols-2 gap-4 border-t border-border pt-6 bg-white">
              <div className="flex gap-2 items-start">
                <Clock className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <h4 className="text-xs font-bold uppercase text-gray-900">No Wait Policy</h4>
                  <p className="text-[11px] text-muted-foreground">Strict queue discipline.</p>
                </div>
              </div>
              <div className="flex gap-2 items-start">
                <Users className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <h4 className="text-xs font-bold uppercase text-gray-900">Unified Portal</h4>
                  <p className="text-[11px] text-muted-foreground">Electronic history access.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CLINIC INTRODUCTION & WHY CHOOSE US */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-border bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
            <span className="text-xs uppercase tracking-wider text-primary font-bold">About CarePlus</span>
            <h2 className="text-3xl font-bold uppercase text-gray-900">Digital-First Healthcare Systems</h2>
            <hr className="w-16 border-t-2 border-primary mx-auto my-2" />
            <p className="text-xs text-muted-foreground">
              CarePlus Multi-Specialty Clinic bridges medical precision with administrative transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-border p-8 bg-gray-50 flex flex-col gap-4">
              <Award className="h-8 w-8 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Certified Specialists</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Our board-certified physicians, dermatologists, and pediatricians have extensive clinical research backgrounds from premium institutes.
              </p>
            </div>
            
            <div className="border border-border p-8 bg-gray-50 flex flex-col gap-4">
              <Calendar className="h-8 w-8 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Digital Progress Tracking</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Unique clinical image recording workflows enable side-by-side skin wound comparisons and progress mapping across patient visits.
              </p>
            </div>

            <div className="border border-border p-8 bg-gray-50 flex flex-col gap-4">
              <Shield className="h-8 w-8 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Transparent Billing</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Fully compliant GST invoicing, transparent consultation rates, breakdown of medicine charges, and flexible digital payout routes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CLINIC STATISTICS */}
      <section className="bg-primary text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col gap-1 border-r border-blue-400 last:border-0 pr-4 sm:pr-0">
              <span className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight">{stat.value}</span>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-blue-100 font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SERVICES */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-border bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
            <span className="text-xs uppercase tracking-wider text-primary font-bold">Our Competence</span>
            <h2 className="text-3xl font-bold uppercase text-gray-900">Multi-Specialty Care Solutions</h2>
            <hr className="w-16 border-t-2 border-primary mx-auto my-2" />
            <p className="text-xs text-muted-foreground">
              Comprehensive care operations covering all diagnostic, pediatric, orthopedic, and dermatological needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc, idx) => (
              <div key={idx} className="bg-white border border-border p-6 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-primary" />
                  <h3 className="text-xs uppercase font-bold tracking-wider text-gray-900">{svc.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. OUR DOCTORS */}
      <section id="doctors" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-border bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
            <span className="text-xs uppercase tracking-wider text-primary font-bold">Medical Team</span>
            <h2 className="text-3xl font-bold uppercase text-gray-900">Board Certified Specialists</h2>
            <hr className="w-16 border-t-2 border-primary mx-auto my-2" />
            <p className="text-xs text-muted-foreground">
              Consult with clinical experts who maintain active medical research profiles and clinical guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doc, idx) => (
              <div key={idx} className="border border-border bg-gray-50 p-6 flex flex-col gap-4">
                {/* Doctor Avatar Mock */}
                <div className="w-full aspect-square bg-gray-200 border border-border flex items-center justify-center text-gray-400">
                  <Users className="h-12 w-12" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-xs uppercase font-bold tracking-wider text-gray-900">{doc.name}</h3>
                  <span className="text-xs text-primary font-semibold">{doc.spec}</span>
                  <span className="text-[10px] text-muted-foreground">{doc.edu}</span>
                  <span className="text-[11px] text-gray-500 font-medium pt-1">{doc.exp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CLINIC GALLERY */}
      <section id="gallery" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-border bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
            <span className="text-xs uppercase tracking-wider text-primary font-bold">Inside CarePlus</span>
            <h2 className="text-3xl font-bold uppercase text-gray-900">Clinic Infrastructure</h2>
            <hr className="w-16 border-t-2 border-primary mx-auto my-2" />
            <p className="text-xs text-muted-foreground">
              View our premium corporate spaces, consultation rooms, diagnostic suites, and customer desks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((item, idx) => (
              <div key={idx} className="bg-white border border-border p-4 flex flex-col gap-3">
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 border border-border">
                  <span className="text-xs font-semibold uppercase tracking-wider">Infrastructure Mock {idx + 1}</span>
                </div>
                <div>
                  <h3 className="text-xs uppercase font-bold tracking-wider text-gray-900">{item.title}</h3>
                  <p className="text-[11px] text-muted-foreground leading-normal mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. PATIENT TESTIMONIALS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-border bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
            <span className="text-xs uppercase tracking-wider text-primary font-bold">Feedback</span>
            <h2 className="text-3xl font-bold uppercase text-gray-900">Patient Experiences</h2>
            <hr className="w-16 border-t-2 border-primary mx-auto my-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="border border-border p-8 bg-gray-50 flex flex-col justify-between gap-6">
                <p className="text-xs italic text-gray-600 leading-relaxed">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex justify-between items-center border-t border-border pt-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">{t.author}</h4>
                    <span className="text-[10px] text-muted-foreground">{t.role}</span>
                  </div>
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-border bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 flex flex-col gap-3">
            <span className="text-xs uppercase tracking-wider text-primary font-bold font-semibold">Information Desk</span>
            <h2 className="text-3xl font-bold uppercase text-gray-900">Frequently Asked Questions</h2>
            <hr className="w-16 border-t-2 border-primary mx-auto my-2" />
          </div>

          <div className="flex flex-col border border-border bg-white">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="border-b border-border last:border-0">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex justify-between items-center p-5 text-left font-bold text-xs uppercase tracking-wider text-gray-900 hover:bg-gray-50 cursor-pointer focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-muted-foreground leading-relaxed border-t border-gray-50 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. APPOINTMENT CTA & CONTACT */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Details */}
          <div className="flex flex-col gap-8 justify-between">
            <div className="flex flex-col gap-4">
              <span className="text-xs uppercase tracking-wider text-primary font-bold">Get In Touch</span>
              <h2 className="text-3xl font-bold uppercase text-gray-900">Connect With CarePlus</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Contact our support desk for scheduling adjustments, GST invoicing printouts, clinic direction requests, or portal password support.
              </p>
            </div>

            <div className="flex flex-col gap-4 border border-border p-6 bg-gray-50">
              <div className="flex gap-3 items-center text-xs text-gray-800">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>1st Floor, Apex Heights, Gachibowli Road, Hyderabad - 500032</span>
              </div>
              <div className="flex gap-3 items-center text-xs text-gray-800">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span>+91 40 2345 6789</span>
              </div>
              <div className="flex gap-3 items-center text-xs text-gray-800">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>info@careplus.com</span>
              </div>
            </div>

            {/* Google Map Mock Placeholder */}
            <div className="w-full h-44 border border-border bg-gray-100 flex items-center justify-center text-gray-400">
              <div className="text-center p-4">
                <MapPin className="h-6 w-6 text-primary mx-auto mb-2" />
                <span className="text-xs uppercase font-bold tracking-wider text-gray-700 block">Map Location Placeholder</span>
                <span className="text-[10px] text-muted-foreground block mt-1">Gachibowli Road, Hyderabad, India</span>
              </div>
            </div>
          </div>

          {/* Quick Consultation Form */}
          <div className="border border-border p-8 bg-gray-50 flex flex-col gap-6">
            <h3 className="text-xs uppercase font-bold tracking-wider text-gray-900 border-b border-border pb-4">Schedule Quick Consultation</h3>
            
            <form onSubmit={(e) => { e.preventDefault(); alert("Appointment query sent successfully! Our help desk will contact you shortly."); }} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Full Name</label>
                <input required type="text" placeholder="John Doe" className="border border-border p-3 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Mobile Number</label>
                  <input required type="tel" placeholder="+91 99999 88888" className="border border-border p-3 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Email Address</label>
                  <input required type="email" placeholder="john@example.com" className="border border-border p-3 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Department</label>
                <select className="border border-border p-3 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-primary">
                  <option>General Medicine</option>
                  <option>Dermatology & Skin Check</option>
                  <option>Pediatric & Child Care</option>
                  <option>Cardiology Screenings</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Describe symptoms</label>
                <textarea rows={3} placeholder="Please provide brief details about your visit request..." className="border border-border p-3 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full text-xs font-semibold uppercase tracking-wider mt-2">
                Submit Reservation Query
              </Button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}
