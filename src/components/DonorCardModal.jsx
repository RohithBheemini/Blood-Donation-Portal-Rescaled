import React from 'react';
import { X, Printer, Award, ShieldCheck, Heart, Droplets } from 'lucide-react';

const DonorCardModal = ({ donor, isOpen, onClose }) => {
  if (!isOpen || !donor) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container donor-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <Award className="text-red-500" size={24} />
            <h3>Digital Donor Identity Card</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body printable-area">
          <div className="donor-card-badge">
            <div className="badge-header">
              <div className="badge-brand">
                <Droplets size={22} className="blood-icon-pulse" />
                <div>
                  <h4>LIFE-SAVER NETWORK</h4>
                  <small>National Blood Donor Registry</small>
                </div>
              </div>
              <div className="blood-type-pill">
                <span>{donor.bloodGroup}</span>
              </div>
            </div>

            <div className="badge-body">
              <div className="donor-primary-info">
                <h3 className="donor-name">{donor.fullName}</h3>
                <p className="donor-meta-id">ID: <strong>{donor.id || 'DON-REG'}</strong></p>
              </div>

              <div className="donor-specs-grid">
                <div className="spec-box">
                  <span className="spec-label">City</span>
                  <span className="spec-value">{donor.city || 'Verified City'}</span>
                </div>
                <div className="spec-box">
                  <span className="spec-label">Donation Count</span>
                  <span className="spec-value">{donor.donationsCount || 1} Times</span>
                </div>
                <div className="spec-box">
                  <span className="spec-label">Hero Tier</span>
                  <span className="spec-value tier-tag">{donor.badge || 'Silver Lifesaver'}</span>
                </div>
                <div className="spec-box">
                  <span className="spec-label">Status</span>
                  <span className="spec-value status-active">
                    <ShieldCheck size={14} /> Active Donor
                  </span>
                </div>
              </div>

              <div className="badge-footer-row">
                <div className="qr-box-mock">
                  <div className="qr-pixels">
                    {/* Simulated SVG QR code */}
                    <svg viewBox="0 0 100 100" width="60" height="60">
                      <rect width="100" height="100" fill="#ffffff" />
                      <path d="M10 10h30v30h-30z M60 10h30v30h-30z M10 60h30v30h-30z M20 20h10v10h-10z M70 20h10v10h-10z M20 70h10v10h-10z M50 20h5v10h-5z M50 50h30v5h-30z M60 60h10v10h-10z M80 75h10v15h-10z M50 80h15v10h-15z" fill="#1e293b" />
                    </svg>
                  </div>
                  <small>Scan to Verify</small>
                </div>
                <div className="pledge-notice">
                  <Heart size={16} className="text-red-500" />
                  <p>"A single donation can save up to 3 lives. Thank you for being a selfless hero."</p>
                  <small>Issued on: {donor.registrationDate ? new Date(donor.registrationDate).toLocaleDateString() : new Date().toLocaleDateString()}</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={handlePrint}>
            <Printer size={16} /> Print / Save PDF
          </button>
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonorCardModal;
