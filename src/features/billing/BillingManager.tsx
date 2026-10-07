'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Receipt, CreditCard, Plus, Printer, ArrowLeft, Check, DollarSign, Wallet, FileSpreadsheet } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Dialog } from '../../components/ui/dialog';
import { billingService, paymentService, patientService } from '../../services';
import { Invoice, Payment, Patient, Role } from '../../types';
import { useToast } from '../../components/ui/toast';

interface BillingManagerProps {
  role: Role;
  defaultTab?: 'Invoices' | 'Payments';
}

export default function BillingManager({ role, defaultTab }: BillingManagerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);

  // Navigation / view states
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [paymentTargetInvoice, setPaymentTargetInvoice] = useState<Invoice | null>(null);

  // Tab State: Invoices vs Payments
  const [activeSubTab, setActiveSubTab] = useState<'Invoices' | 'Payments'>(defaultTab || 'Invoices');

  // Form State: Generate Invoice
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [consultFee, setConsultFee] = useState(500);
  const [medicineCharges, setMedicineCharges] = useState(0);
  const [otherCharges, setOtherCharges] = useState(0);
  const [discount, setDiscount] = useState(0);

  // Form State: Receive Payment
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'UPI' | 'Card' | 'Bank Transfer'>('UPI');
  const [paymentAmount, setPaymentAmount] = useState(0);

  const loadData = () => {
    setInvoices(billingService.getAll());
    setPayments(paymentService.getAll());
    setPatients(patientService.getAll());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Listen to incoming queries from appointments checkout
  useEffect(() => {
    const invoiceNum = searchParams.get('invoice');
    const patientIdParam = searchParams.get('patientId');

    if (invoiceNum) {
      const inv = billingService.getByInvoiceNumber(invoiceNum);
      if (inv) {
        setViewingInvoice(inv);
      }
    } else if (patientIdParam) {
      const pat = patientService.getById(patientIdParam);
      if (pat) {
        setSelectedPatientId(pat.id);
        setIsGenerateOpen(true);
      }
    }
  }, [searchParams, invoices]);

  // GST Calculation: 18% of sum(fees) minus discount
  const calculateTotal = () => {
    const subtotal = consultFee + medicineCharges + otherCharges;
    const discounted = Math.max(0, subtotal - discount);
    const gst = Math.round(discounted * 0.18);
    const grandTotal = discounted + gst;
    return { gst, grandTotal };
  };

  const handleGenerateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) {
      toast.error('Please select a patient.');
      return;
    }

    const patient = patients.find(p => p.id === selectedPatientId);
    if (!patient) return;

    const { gst, grandTotal } = calculateTotal();

    const newInvoice = billingService.create({
      patientId: patient.id,
      patientName: patient.fullName,
      consultationFee: consultFee,
      medicineCharges,
      otherCharges,
      gst,
      discount,
      grandTotal,
      status: 'Pending',
    });

    toast.success(`Invoice ${newInvoice.invoiceNumber} generated for ${patient.fullName}`);
    
    // Reset Form
    setSelectedPatientId('');
    setConsultFee(500);
    setMedicineCharges(0);
    setOtherCharges(0);
    setDiscount(0);
    
    setIsGenerateOpen(false);
    setViewingInvoice(newInvoice);
    loadData();
  };

  const handleReceivePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentTargetInvoice) return;
    if (paymentAmount <= 0 || paymentAmount > paymentTargetInvoice.grandTotal) {
      toast.error(`Invalid payment amount. Amount must be between 1 and ${paymentTargetInvoice.grandTotal}`);
      return;
    }

    const isPartial = paymentAmount < paymentTargetInvoice.grandTotal;
    
    paymentService.create({
      invoiceNumber: paymentTargetInvoice.invoiceNumber,
      patientId: paymentTargetInvoice.patientId,
      patientName: paymentTargetInvoice.patientName,
      paymentMethod,
      amount: paymentAmount,
      status: isPartial ? 'Partially Paid' : 'Paid',
    });

    toast.success(`Received Rs. ${paymentAmount} via ${paymentMethod} for invoice ${paymentTargetInvoice.invoiceNumber}`);
    
    setIsReceiveOpen(false);
    setPaymentTargetInvoice(null);
    setPaymentAmount(0);
    loadData();
  };

  if (viewingInvoice) {
    return (
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        <div 
          onClick={() => {
            setViewingInvoice(null);
            router.push(role === 'DOCTOR' ? '/doctor/reports' : '/admin/billing');
          }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer text-xs uppercase tracking-wider font-bold w-max no-print"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Invoices
        </div>

        {/* Printable Invoice Page */}
        <div className="bg-white border border-border p-8 md:p-12 flex flex-col gap-8 shadow-sm print:border-0 print:shadow-none print:p-0">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-border pb-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">Elevate Aesthetique Hair & Skin Clinic</h2>
              <span className="text-[10px] text-gray-500 leading-relaxed">
                1st Floor, Apex Heights, Gachibowli Road, Hyderabad - 500032<br />
                Phone: +91 40 2345 6789 | GSTIN: 36AAAAA1111A1Z1
              </span>
            </div>
            <div className="text-right flex flex-col gap-1">
              <h3 className="text-sm font-bold uppercase text-primary">Tax Invoice</h3>
              <span className="text-xs text-gray-700 font-semibold">{viewingInvoice.invoiceNumber}</span>
              <span className="text-[10px] text-gray-400 font-medium">Date: {viewingInvoice.date}</span>
            </div>
          </div>

          {/* Demographics info */}
          <div className="grid grid-cols-2 gap-6 text-xs bg-gray-50 p-4 border border-border">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase font-bold text-gray-400">Billed To:</span>
              <strong className="text-gray-900">{viewingInvoice.patientName}</strong>
              <span className="text-gray-500">ID: {viewingInvoice.patientId}</span>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <span className="text-[10px] uppercase font-bold text-gray-400">Invoice Details:</span>
              <span>Status: <Badge variant={viewingInvoice.status === 'Paid' ? 'success' : viewingInvoice.status === 'Pending' ? 'destructive' : 'warning'}>{viewingInvoice.status}</Badge></span>
              <span className="text-gray-500">Facility Code: GACHI-01</span>
            </div>
          </div>

          {/* Pricing breakdown table */}
          <div className="flex flex-col gap-4">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border text-gray-500 uppercase font-bold tracking-wider">
                  <th className="pb-3 text-left">Item Description</th>
                  <th className="pb-3 text-right">Taxable Value (Rs.)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-3 text-gray-800">Specialist Consultation Fee (Dr. John Doe)</td>
                  <td className="py-3 text-right text-gray-900 font-medium">{viewingInvoice.consultationFee}.00</td>
                </tr>
                {viewingInvoice.medicineCharges > 0 && (
                  <tr>
                    <td className="py-3 text-gray-800">Pharmacy Medication Charges</td>
                    <td className="py-3 text-right text-gray-900 font-medium">{viewingInvoice.medicineCharges}.00</td>
                  </tr>
                )}
                {viewingInvoice.otherCharges > 0 && (
                  <tr>
                    <td className="py-3 text-gray-800">Diagnostics / Other Procedures Care charges</td>
                    <td className="py-3 text-right text-gray-900 font-medium">{viewingInvoice.otherCharges}.00</td>
                  </tr>
                )}
                
                {/* Math Totals */}
                <tr className="border-t-2 border-border font-medium">
                  <td className="py-3 text-gray-600 text-right">Subtotal:</td>
                  <td className="py-3 text-right text-gray-900">
                    {(viewingInvoice.consultationFee + viewingInvoice.medicineCharges + viewingInvoice.otherCharges)}.00
                  </td>
                </tr>
                {viewingInvoice.discount > 0 && (
                  <tr className="text-destructive font-semibold">
                    <td className="py-3 text-right">Discount:</td>
                    <td className="py-3 text-right">-{viewingInvoice.discount}.00</td>
                  </tr>
                )}
                <tr>
                  <td className="py-3 text-gray-600 text-right">CGST + SGST (18% on Taxable):</td>
                  <td className="py-3 text-right text-gray-900 font-semibold">{viewingInvoice.gst}.00</td>
                </tr>
                <tr className="border-t-2 border-primary bg-blue-50/20 font-bold text-sm">
                  <td className="py-4 text-primary text-right uppercase">Grand Total (INR):</td>
                  <td className="py-4 text-right text-primary">Rs. {viewingInvoice.grandTotal}.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer Terms */}
          <div className="mt-8 pt-4 border-t border-border flex justify-between items-end">
            <div className="text-[10px] text-gray-400">
              * This is a computer generated digital invoice. GST taxes paid.
            </div>
            <div className="text-center">
              <div className="w-40 border-b border-gray-400 py-3" />
              <span className="text-[9px] uppercase font-bold text-gray-500 block mt-1">Cashier / Accountant</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-2 justify-end no-print">
          <Button 
            variant="outline" 
            size="md"
            onClick={() => setViewingInvoice(null)}
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
            <Printer className="h-4 w-4 mr-2" /> Print Invoice
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold uppercase text-gray-900 flex items-center gap-2">
            <Receipt className="h-6 w-6 text-primary" /> Finance & Billing Desk
          </h1>
          <p className="text-xs text-muted-foreground">Manage GST-auditable outpatient invoicing and payment receipts log sheets.</p>
        </div>
        {role === 'RECEPTIONIST' && (
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => setIsGenerateOpen(true)}
            className="text-xs uppercase tracking-wider font-semibold"
          >
            <Plus className="h-4.5 w-4.5 mr-1" /> Generate Tax Invoice
          </Button>
        )}
      </div>

      {/* Sub Tabs: Invoices vs Payments */}
      <div className="flex border-b border-border bg-white text-xs select-none">
        <button
          onClick={() => setActiveSubTab('Invoices')}
          className={`px-6 py-3 font-semibold uppercase tracking-wider cursor-pointer border-b-2 transition-all ${
            activeSubTab === 'Invoices' ? 'border-primary text-primary bg-blue-50/20' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Invoices Issued ({invoices.length})
        </button>
        <button
          onClick={() => setActiveSubTab('Payments')}
          className={`px-6 py-3 font-semibold uppercase tracking-wider cursor-pointer border-b-2 transition-all ${
            activeSubTab === 'Payments' ? 'border-primary text-primary bg-blue-50/20' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Payment Transactions ({payments.length})
        </button>
      </div>

      {activeSubTab === 'Invoices' ? (
        /* INVOICES SECTION */
        <div className="bg-white border border-border flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-gray-50 text-gray-500 uppercase font-bold tracking-wider">
                  <th className="p-4">Invoice Number</th>
                  <th className="p-4">Patient Name</th>
                  <th className="p-4">Consultation Fee</th>
                  <th className="p-4">Meds Charges</th>
                  <th className="p-4">Other Charges</th>
                  <th className="p-4">GST (18%)</th>
                  <th className="p-4 text-destructive">Discount</th>
                  <th className="p-4">Grand Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-12 text-center text-muted-foreground">
                      No invoices issued in this billing session.
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => (
                    <tr key={inv.invoiceNumber} className="hover:bg-gray-50">
                      <td className="p-4 font-semibold text-gray-900">{inv.invoiceNumber}</td>
                      <td className="p-4 font-semibold text-gray-900">{inv.patientName}</td>
                      <td className="p-4 text-gray-800">Rs. {inv.consultationFee}</td>
                      <td className="p-4 text-gray-800">Rs. {inv.medicineCharges}</td>
                      <td className="p-4 text-gray-800">Rs. {inv.otherCharges}</td>
                      <td className="p-4 text-gray-800">Rs. {inv.gst}</td>
                      <td className="p-4 text-destructive font-semibold">-{inv.discount}</td>
                      <td className="p-4 font-bold text-gray-900">Rs. {inv.grandTotal}</td>
                      <td className="p-4">
                        <Badge variant={inv.status === 'Paid' ? 'success' : inv.status === 'Pending' ? 'destructive' : 'warning'}>
                          {inv.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          {role === 'RECEPTIONIST' && inv.status !== 'Paid' && (
                            <Button 
                              variant="success" 
                              size="sm" 
                              onClick={() => {
                                setPaymentTargetInvoice(inv);
                                setPaymentAmount(inv.grandTotal);
                                setIsReceiveOpen(true);
                              }}
                              className="text-[10px] font-bold uppercase tracking-wider py-1 h-7 bg-green-600 hover:bg-green-700 text-white"
                            >
                              <DollarSign className="h-3 w-3 mr-0.5" /> Receive
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setViewingInvoice(inv)}
                            className="text-[10px] font-bold uppercase tracking-wider py-1 h-7"
                          >
                            Print view
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
      ) : (
        /* TRANSACTIONS SECTION */
        <div className="bg-white border border-border flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-gray-50 text-gray-500 uppercase font-bold tracking-wider">
                  <th className="p-4">Txn Reference</th>
                  <th className="p-4">Invoice No</th>
                  <th className="p-4">Patient Name</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Amount Paid</th>
                  <th className="p-4">Transaction Date</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-muted-foreground">
                      No payments recorded in history sheet yet.
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="p-4 font-semibold text-gray-900">{p.id}</td>
                      <td className="p-4 text-gray-800">{p.invoiceNumber}</td>
                      <td className="p-4 font-semibold text-gray-900">{p.patientName}</td>
                      <td className="p-4 font-semibold text-primary">{p.paymentMethod}</td>
                      <td className="p-4 font-bold text-gray-900">Rs. {p.amount}</td>
                      <td className="p-4 text-muted-foreground">{p.paidDate}</td>
                      <td className="p-4">
                        <Badge variant={p.status === 'Paid' ? 'success' : 'warning'}>{p.status}</Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Generate Invoice Modal */}
      {isGenerateOpen && (
        <Dialog
          isOpen={isGenerateOpen}
          onClose={() => setIsGenerateOpen(false)}
          title="Create Tax Invoicing sheet"
          size="md"
          footer={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsGenerateOpen(false)} className="text-xs uppercase font-bold">
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="button" onClick={handleGenerateInvoice} className="text-xs uppercase font-bold">
                Generate Invoice
              </Button>
            </div>
          }
        >
          <form onSubmit={handleGenerateInvoice} className="flex flex-col gap-4 text-xs">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Billed To (Patient)</label>
              <select
                required
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
              >
                <option value="">-- Select Patient --</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.fullName} ({p.id})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Consultation Fee (Rs.)</label>
                <input
                  required
                  type="number"
                  value={consultFee}
                  min={0}
                  onChange={(e) => setConsultFee(parseInt(e.target.value) || 0)}
                  className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Pharmacy charges (Rs.)</label>
                <input
                  required
                  type="number"
                  value={medicineCharges}
                  min={0}
                  onChange={(e) => setMedicineCharges(parseInt(e.target.value) || 0)}
                  className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Other Diagnostic Fees (Rs.)</label>
                <input
                  required
                  type="number"
                  value={otherCharges}
                  min={0}
                  onChange={(e) => setOtherCharges(parseInt(e.target.value) || 0)}
                  className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Discount Value (Rs.)</label>
                <input
                  required
                  type="number"
                  value={discount}
                  min={0}
                  onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
                  className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
                />
              </div>
            </div>

            <div className="border-t border-border pt-4 bg-gray-50 p-4 flex flex-col gap-2 font-medium">
              <div className="flex justify-between">
                <span>Calculated Tax GST (18% on Taxable):</span>
                <span>Rs. {calculateTotal().gst}.00</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-primary">
                <span>Grand Total (With GST):</span>
                <span>Rs. {calculateTotal().grandTotal}.00</span>
              </div>
            </div>

          </form>
        </Dialog>
      )}

      {/* Receive Payment Modal */}
      {isReceiveOpen && paymentTargetInvoice && (
        <Dialog
          isOpen={isReceiveOpen}
          onClose={() => {
            setIsReceiveOpen(false);
            setPaymentTargetInvoice(null);
          }}
          title={`Receive Payment: ${paymentTargetInvoice.invoiceNumber}`}
          size="sm"
          footer={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsReceiveOpen(false)} className="text-xs uppercase font-bold">
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="button" onClick={handleReceivePayment} className="text-xs uppercase font-bold">
                Record Transaction
              </Button>
            </div>
          }
        >
          <form onSubmit={handleReceivePayment} className="flex flex-col gap-4 text-xs">
            
            <div className="flex flex-col gap-1.5 border border-border p-3 bg-gray-50">
              <span className="flex justify-between"><strong>Billed Patient:</strong> <span>{paymentTargetInvoice.patientName}</span></span>
              <span className="flex justify-between"><strong>Invoice Due:</strong> <strong className="text-primary">Rs. {paymentTargetInvoice.grandTotal}</strong></span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
              >
                <option value="UPI">UPI (Google Pay, PhonePe)</option>
                <option value="Cash">Cash Handover</option>
                <option value="Card">POS Credit/Debit Card</option>
                <option value="Bank Transfer">Direct Bank NEFT/RTGS</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-700 tracking-wider">Amount Received (Rs.)</label>
              <input
                required
                type="number"
                value={paymentAmount}
                min={1}
                max={paymentTargetInvoice.grandTotal}
                onChange={(e) => setPaymentAmount(parseInt(e.target.value) || 0)}
                className="border border-border p-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary rounded-none"
              />
              <span className="text-[9px] text-muted-foreground mt-1">If amount is less than Rs. {paymentTargetInvoice.grandTotal}, the invoice is marked as Partially Paid.</span>
            </div>

          </form>
        </Dialog>
      )}

    </div>
  );
}
