import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Building,
  CheckCircle,
  Phone,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { usePortal } from '../context/usePortal';

const DonationCamps = () => {
  const { camps, registerForCamp, notify } = usePortal();

  const [selectedCamp, setSelectedCamp] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [participantForm, setParticipantForm] = useState({
    name: '',
    phone: '',
    bloodGroup: 'O+',
    email: ''
  });

  const handleOpenRegister = (camp) => {
    setSelectedCamp(camp);
    setModalOpen(true);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!participantForm.name.trim() || !participantForm.phone.trim()) {
      notify('warning', 'Missing Details', 'Please enter your name and phone number.');
      return;
    }

    await registerForCamp(selectedCamp.id, participantForm);
    setModalOpen(false);
    setParticipantForm({ name: '', phone: '', bloodGroup: 'O+', email: '' });
    notify(
      'success',
      'Camp Slot Confirmed! 🎯',
      `You are registered for "${selectedCamp.title}" on ${selectedCamp.date}. An SMS confirmation has been scheduled to ${participantForm.phone}.`
    );
  };

  return (
    <div className="container page-content">
      <div className="page-header-row">
        <div>
          <span className="page-eyebrow">Mobile Blood Drives</span>
          <h1 className="page-title">Community Blood Donation Camps</h1>
          <p className="page-subtitle">
            Partnered with the Red Cross, rotary clubs, tech campuses, and universities to bring life-saving donation facilities near you.
          </p>
        </div>
      </div>

      <div className="camps-list-grid">
        {camps.map(camp => {
          const percentFull = Math.min(100, Math.round(((camp.registeredCount || 0) / (camp.expectedDonors || 100)) * 100));
          return (
            <div key={camp.id} className="camp-card-detail">
              <div className="camp-top-badge">
                <span className="camp-badge-date">
                  <Calendar size={15} /> {camp.date}
                </span>
                <span className="camp-badge-time">
                  <Clock size={15} /> {camp.time}
                </span>
              </div>

              <h3 className="camp-card-title">{camp.title}</h3>
              <p className="camp-card-org">
                <Building size={16} /> Organized by: <strong>{camp.organizer}</strong>
              </p>

              <div className="camp-venue-box">
                <MapPin size={18} className="text-red-500" />
                <div>
                  <strong>{camp.venue}</strong>
                  <p>{camp.city}</p>
                </div>
              </div>

              <div className="camp-progress-section">
                <div className="progress-labels">
                  <span>Capacity Target: {camp.expectedDonors} Donors</span>
                  <span><strong>{camp.registeredCount}</strong> Registered ({percentFull}%)</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${percentFull}%` }}></div>
                </div>
              </div>

              <div className="camp-card-bottom">
                <div className="camp-contact-hint">
                  <Phone size={14} /> Helpline: {camp.contact}
                </div>
                <button
                  className="btn-primary"
                  onClick={() => handleOpenRegister(camp)}
                >
                  Register to Donate at Camp
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* HOST A CAMP BANNER */}
      <div className="host-camp-banner">
        <div className="host-camp-text">
          <Sparkles size={28} className="text-amber-400" />
          <div>
            <h3>Want to Organize a Blood Drive at Your Company or College?</h3>
            <p>Our mobile phlebotomy team provides sterile beds, doctors, refreshments, and official certificates free of charge.</p>
          </div>
        </div>
        <a href="tel:18001234567" className="btn-secondary">
          Request Camp Organizer Team
        </a>
      </div>

      {/* REGISTRATION MODAL */}
      {modalOpen && selectedCamp && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Register for {selectedCamp.title}</h3>
              <button className="modal-close-btn" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleRegisterSubmit} className="modal-body">
              <p className="modal-desc">
                Venue: <strong>{selectedCamp.venue}, {selectedCamp.city}</strong> on <strong>{selectedCamp.date}</strong> ({selectedCamp.time})
              </p>

              <div className="form-field">
                <label>Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={participantForm.name}
                  onChange={(e) => setParticipantForm({ ...participantForm, name: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit number"
                  value={participantForm.phone}
                  onChange={(e) => setParticipantForm({ ...participantForm, phone: e.target.value })}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label>Blood Group</label>
                  <select
                    value={participantForm.bloodGroup}
                    onChange={(e) => setParticipantForm({ ...participantForm, bloodGroup: e.target.value })}
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="Optional email"
                    value={participantForm.email}
                    onChange={(e) => setParticipantForm({ ...participantForm, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="submit" className="btn-primary">
                  Confirm Camp Slot
                </button>
                <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationCamps;
