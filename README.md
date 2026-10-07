# CarePlus CMS - Clinic Management System

A modern, comprehensive, and responsive **Clinic Management System (CMS)** built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS**.

CarePlus CMS streamlines clinic workflows, patient administration, outpatient (OPD) queueing, digital prescriptions, GST billing, and clinical analytics for medical practices and multi-specialty clinics.

---

## 🌟 Key Features

### 1. 🌐 Public Portal & Patient Self-Service
* **Modern Clinic Landing Page**: Hero showcase, services overview, doctors catalog, patient testimonials, contact information, and operating hours.
* **Online Appointment Booking (`/book-appointment`)**: Interactive booking form allowing patients to select specialty, doctor, date, and preferred time slot.
* **Compliance & Information**: Privacy Policy and Terms of Service pages.

### 2. 👨‍⚕️ Doctor Portal (`/doctor/dashboard`)
* **Consultation Dashboard**: Real-time overview of today's appointments, pending consultations, and completed patient visits.
* **Electronic Health Records (EHR)**: View patient clinical history, past diagnoses, allergies, and vital stats.
* **Digital Prescription Maker (`/doctor/prescriptions`)**:
  * Add diagnosis, symptoms, and clinical advice.
  * Prescribe medications with dosage, frequency, duration, and instructions.
  * Print and export professional prescriptions.
* **Doctor Analytics (`/doctor/reports`)**: Track patient visit trends and consultation volume.

### 3. 👩‍💼 Receptionist & Admin Portal (`/admin/dashboard`)
* **Clinical Operations Overview**: High-level clinic KPIs (daily revenue, patient footfall, active queue, pending invoices).
* **Patient Directory (`/admin/patients`)**: Register new patients, edit profiles, search records, and manage demographics.
* **Live OPD Queue Management (`/admin/queue`)**:
  * Real-time token number assignment.
  * Status transitions (Waiting, In Consultation, Completed, Cancelled).
* **Appointment Scheduling (`/admin/appointments`)**: Schedule, reschedule, or cancel patient appointments.
* **GST Billing & Invoicing (`/admin/billing`)**:
  * Generate itemized consultation and procedure bills.
  * Automatic subtotal, GST (tax), and discount calculations.
  * Printable receipt and invoice generation.
* **Payment Tracking (`/admin/payments`)**: Record cash, card, and UPI transactions with payment status tracking.
* **Clinic Reports (`/admin/reports`)**: Interactive revenue charts, patient influx graphs, and consultation summaries powered by Recharts.
* **Clinic Configuration (`/admin/settings`)**: Manage clinic profile, operating hours, consultation fees, and GSTIN numbers.

---

## 🔐 Demo Login Credentials

The system includes pre-configured mock credentials and rapid 1-click login buttons on the login page:

**Login URL**: [http://localhost:3000/login](http://localhost:3000/login)

| Role | Email | Password | Redirect Dashboard |
| :--- | :--- | :--- | :--- |
| **Specialist Doctor** | `doctor@careplus.com` | `doctor123` | `/doctor/dashboard` |
| **Receptionist / Admin** | `admin@careplus.com` | `admin123` | `/admin/dashboard` |

> ⚡ **Quick Login Tip**: On the login page, you can simply click the **"Login as Doctor"** or **"Login as Admin"** button under *Demo Quick Action Login* to sign in instantly without typing credentials!

---

## 🛠️ Technology Stack

* **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server & Client Components)
* **Library**: [React 19](https://react.dev/)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Charts & Visualizations**: [Recharts](https://recharts.org/)
* **Animations**: [Framer Motion](https://www.framer.com/motion/)
* **Form Handling & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

---

## 📁 Project Structure

```text
clinic-management-system/
├── public/                 # Static assets and icons
├── src/
│   ├── app/
│   │   ├── (auth)/         # Authentication routes (/login)
│   │   ├── (dashboard)/    # Protected portals
│   │   │   ├── admin/      # Receptionist & Admin modules (patients, queue, billing, reports)
│   │   │   └── doctor/     # Doctor clinical modules (appointments, prescriptions, EHR)
│   │   ├── (public)/       # Public website and patient booking (/book-appointment)
│   │   ├── globals.css     # Global CSS styles and Tailwind configurations
│   │   └── layout.tsx      # Root application layout
│   ├── components/         # Reusable UI components (buttons, tables, modals, cards, charts)
│   ├── constants/          # Role permissions, navigation links, and config constants
│   ├── features/           # Feature-specific logic and specialized components
│   ├── lib/                # Auth context provider, session helpers, utilities
│   ├── mock-data/          # Comprehensive clinical mock datasets (patients, bills, Rx)
│   ├── services/           # Data services and state handling
│   └── types/              # TypeScript interfaces and data models
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v18.18.0 or higher recommended) and npm installed.

### Installation

1. **Clone the repository or navigate to the directory**:
   ```bash
   cd "Clinic Management System"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the Next.js development server at `localhost:3000` |
| `npm run build` | Builds the optimized production application |
| `npm run start` | Runs the compiled production build |
| `npm run lint` | Runs ESLint to check for code issues |

---

## 📄 License
This project is private and developed for clinical management and healthcare demonstrations.
