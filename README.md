# 🩸 BloodLife - Upgraded Blood Donation Management Portal

A modern, enterprise-grade, full-lifecycle Blood Donation and Emergency Management Portal built with **React 19**, **Vite**, **Firebase Firestore**, **React Router v7**, and **Lucide Icons**.

---

## 🌟 Key Capabilities & Upgrades

### 1. 🏥 Real-Time Blood Bank Inventory
- **Live stock monitoring** across all 8 blood groups (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`).
- **Interactive Stock Gauges & Thresholds**: Automatic classification into *Critical Shortage* ($\le 2$ units), *Moderate Reserve*, and *Optimal Reserve*.
- **Live Search & Filter**: Filter by stock status, search specific blood types, or isolate Universal Donors (`O-`) and Universal Recipients (`AB+`).
- **Interactive Blood Compatibility Matrix Guide**: Detailed visual matching engine showing who can donate to whom and who can receive from whom.

### 2. 🚨 24/7 Patient Emergency Blood Requisition Desk
- **Emergency Ticker**: Flashing network alert bar broadcasting critical ICU/trauma blood demands across the portal.
- **Urgent Requisition Form**: Hospital patient intake capturing patient details, units needed, treating hospital, ward/room, contact attender, and urgency priority (*CRITICAL*, *HIGH*, *STANDARD*).
- **Public Emergency Board**: Real-time listing with pledge fulfillment trackers, one-click WhatsApp/clipboard sharing, direct attender phone links, and a *"Pledge Donation"* button for eligible voluntary donors.

### 3. 🧑‍⚕️ Certified Donor Registration & Medical Screening
- Multi-section registration capturing personal details, verified city, contact numbers, emergency contact, age, weight, and existing conditions.
- Real-time client validation enforcing National Blood Transfusion Council criteria (Age 18–65, Min weight 50 kg).
- **SweetAlert2 Notifications**: Interactive feedback and confirmation on every action.
- **Instant Digital Donor ID Badge**: Automatically generates a verifiable digital donor card upon registration.

### 4. 🪪 Digital Donor Identity Card & Certificate Generator
- Accessible via `/donor-card` by searching phone number, email, or Donor ID.
- Holographic medical badge styling, Hero Tier ranking (*Bronze Starter*, *Silver Lifesaver*, *Gold Hero*, *Platinum Guardian*), simulated QR verification code, and total donation tally.
- **Print & PDF Support**: Built-in `@media print` CSS enables donors to print or save their official certificate with a single click.

### 5. ⛺ Community Blood Donation Camps & Mobile Drives
- Directory of scheduled drives organized by the Red Cross, universities, and corporate tech parks.
- Capacity tracker showing registered donors vs. event capacity.
- One-click registration modal for donors to reserve a donation slot.

### 6. 🩺 60-Second Interactive Eligibility Quiz
- Fast 6-question medical self-assessment evaluating age, weight, 90-day donation interval, recent tattoos/piercings, medications, and surgeries.
- Instant verdict with clinical explanations and direct routing to registration.

### 7. 🛡️ Hospital Admin & Blood Bank Staff Control Desk
- **Inventory Adjuster**: Live unit counter controls (`+` / `-` / batch additions) to update reserve levels in real time.
- **Requisition Pipeline**: Review all pending patient requisitions, contact attenders, and monitor fulfillment.
- **Donor Directory**: Searchable registry of all active life-savers.
- **Drive Publisher**: Form to publish new mobile blood donation camps directly to the portal.

### 8. ⚡ Resilient Offline & Firestore Hybrid Architecture
- Seamless data synchronization with Firebase Firestore when online.
- Resilient local persistence repository that automatically buffers state and seeds clinical mock data if Firebase rules reject access or the network is offline.

---

## 📂 Project Architecture

```
blood-donation-portal/
├── .env.example                     # Environment template for Firebase credentials
├── index.html                       # HTML5 entry with Inter font & blood drop icon
├── package.json                     # Dependencies & scripts
├── vite.config.js                   # Rollup code-splitting chunks (vendor, ui, firebase)
├── src/
│   ├── assets/                      # Static assets
│   ├── components/
│   │   ├── Navbar.jsx               # Responsive sticky navbar with mobile drawer
│   │   ├── Footer.jsx               # Emergency helplines & safety criteria
│   │   ├── EmergencyTicker.jsx      # High-urgency hospital alert banner
│   │   ├── BloodCompatibilityModal.jsx # Interactive blood type guide
│   │   └── DonorCardModal.jsx       # Printable digital donor badge modal
│   ├── context/
│   │   └── PortalContext.jsx        # Centralized React Context & SweetAlert2 helper
│   ├── data/
│   │   └── mockData.js              # Comprehensive seeds (inventory, donors, requests, camps)
│   ├── pages/
│   │   ├── Home.jsx                 # Landing page with hero, live metrics & FAQs
│   │   ├── AvailableBlood.jsx       # Live inventory stock & filters
│   │   ├── DonatorRegistration.jsx  # Multi-step donor intake form
│   │   ├── RequestBlood.jsx         # Emergency patient blood requisition form
│   │   ├── RequestsFeed.jsx         # Public emergency requests stream
│   │   ├── DonationCamps.jsx        # Mobile blood camps & registration
│   │   ├── EligibilityChecker.jsx   # 60-second interactive eligibility quiz
│   │   ├── DonorCardLookup.jsx      # Digital donor ID lookup & print
│   │   └── AdminDashboard.jsx       # Blood bank staff management center
│   ├── services/
│   │   ├── firebase.js              # Safe Firebase initialization with .env support
│   │   └── dataService.js           # Hybrid repository (Firestore + LocalStorage)
│   ├── App.jsx                      # Router and root shell
│   ├── App.css                      # Modern healthcare design system stylesheet
│   ├── index.css                    # Design tokens & CSS reset
│   └── main.jsx                     # Vite React DOM entry
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd blood-donation-portal
npm install
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env` to supply custom Firebase credentials:
```bash
cp .env.example .env
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## 🛡️ Tech Stack
- **React 19**: Modern component architecture with Hooks.
- **Vite 7**: High-speed build tool and development server.
- **React Router v7**: Client-side single-page routing.
- **Firebase Firestore v12**: Cloud persistence for donor documents and inventory.
- **Lucide Icons**: Healthcare and interface iconography.
- **SweetAlert2**: Responsive alert dialogs and toast notifications.
