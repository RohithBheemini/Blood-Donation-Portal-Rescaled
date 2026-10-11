import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { PortalProvider } from './context/PortalProvider';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EmergencyTicker from './components/EmergencyTicker';
import Home from './pages/Home';
import AvailableBlood from './pages/AvailableBlood';
import DonatorRegistration from './pages/DonatorRegistration';
import RequestBlood from './pages/RequestBlood';
import RequestsFeed from './pages/RequestsFeed';
import DonationCamps from './pages/DonationCamps';
import EligibilityChecker from './pages/EligibilityChecker';
import DonorCardLookup from './pages/DonorCardLookup';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  return (
    <PortalProvider>
      <Router>
        <div className="app-shell">
          <EmergencyTicker />
          <Navbar />
          <main className="app-main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/inventory" element={<AvailableBlood />} />
              <Route path="/donate" element={<DonatorRegistration />} />
              <Route path="/request" element={<RequestBlood />} />
              <Route path="/requests-feed" element={<RequestsFeed />} />
              <Route path="/camps" element={<DonationCamps />} />
              <Route path="/eligibility" element={<EligibilityChecker />} />
              <Route path="/donor-card" element={<DonorCardLookup />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </PortalProvider>
  );
}

export default App;
