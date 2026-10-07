'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, Menu, X, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const router = useRouter();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/#about' },
    { label: 'Doctors', href: '/#doctors' },
    { label: 'Services', href: '/#services' },
    { label: 'Gallery', href: '/#gallery' },
    { label: 'FAQ', href: '/#faq' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Top Banner Info */}
      <div className="bg-gray-100 text-xs border-b border-border py-2 px-4 sm:px-6 md:px-8 hidden sm:flex justify-between items-center text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> +91 40 2345 6789</span>
          <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> info@elevate.com</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" /> Gachibowli Road, Hyderabad
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 font-serif font-bold text-lg tracking-wide select-none">
            <span className="text-gray-900">E</span>
            <span className="text-primary font-serif">A</span>
            <span className="text-gray-900 text-sm uppercase tracking-widest font-sans ml-2 font-bold">Elevate</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.label} 
                href={link.href} 
                className="text-xs uppercase tracking-wider font-semibold text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Login Button */}
          <div className="hidden md:flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push('/login')}
              className="text-xs uppercase tracking-wider font-semibold"
            >
              Portal Login
            </Button>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => router.push('/book-appointment')}
              className="text-xs uppercase tracking-wider font-semibold"
            >
              Book Appointment
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-500 hover:text-primary p-2 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-white py-4 px-4 flex flex-col gap-4">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold text-muted-foreground hover:text-primary uppercase tracking-wider"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <hr className="border-border" />
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                className="w-full text-xs uppercase tracking-wider font-semibold"
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push('/login');
                }}
              >
                Portal Login
              </Button>
              <Button 
                variant="primary" 
                className="w-full text-xs uppercase tracking-wider font-semibold"
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push('/book-appointment');
                }}
              >
                Book Appointment
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Corporate Footer */}
      <footer className="bg-gray-900 text-white border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Col 1: About */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-1.5 font-serif font-bold text-lg tracking-wide">
                <span className="text-white">E</span>
                <span className="text-primary font-serif">A</span>
                <span className="text-white text-sm uppercase tracking-widest font-sans ml-2 font-bold">Elevate</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                State of the art medical services offering patient-centered healthcare solutions, advanced diagnostics, and compassionate clinical care.
              </p>
            </div>

            {/* Col 2: Services */}
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold mb-4 text-primary">Services</h4>
              <ul className="flex flex-col gap-2 text-xs text-gray-400">
                <li>General Consultation</li>
                <li>Dermatology & Skin Check</li>
                <li>Pediatric & Child Health</li>
                <li>Geriatrics & Elderly Care</li>
                <li>Diagnostics & Nebulization</li>
              </ul>
            </div>

            {/* Col 3: Links */}
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold mb-4 text-primary">Legal & Links</h4>
              <ul className="flex flex-col gap-2 text-xs text-gray-400">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms & Conditions</Link></li>
                <li><Link href="/login" className="hover:text-white">Staff Login</Link></li>
                <li><Link href="/book-appointment" className="hover:text-white">Online Booking</Link></li>
              </ul>
            </div>

            {/* Col 4: Contact */}
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold mb-4 text-primary">Clinic Hours</h4>
              <ul className="flex flex-col gap-2 text-xs text-gray-400">
                <li className="flex justify-between"><span>Mon - Fri:</span> <span>08:00 AM - 08:00 PM</span></li>
                <li className="flex justify-between"><span>Saturday:</span> <span>09:00 AM - 05:00 PM</span></li>
                <li className="flex justify-between"><span>Sunday:</span> <span>Closed (Emergency Only)</span></li>
                <li className="pt-2 text-white font-semibold">Call Support: +91 40 2345 6789</li>
              </ul>
            </div>
          </div>

          <hr className="border-gray-800 my-8" />

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} Elevate Aesthetique Hair & Skin Clinic. All rights reserved.</p>
            <p>Designed for Enterprise SaaS Operations.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
