import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, Hospital, Heart, Shield, CheckCircle2, Droplet } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-top-strip">
        <div className="container strip-content">
          <div className="strip-item">
            <PhoneCall className="strip-icon" size={20} />
            <div>
              <span className="strip-title">24x7 Emergency Blood Request</span>
              <strong>1800-123-4567 (Toll Free)</strong>
            </div>
          </div>
          <div className="strip-item">
            <Hospital className="strip-icon" size={20} />
            <div>
              <span className="strip-title">Central Blood Bank Helpline</span>
              <strong>1800-987-6543 (Hospitals & Staff)</strong>
            </div>
          </div>
          <div className="strip-item">
            <Heart className="strip-icon" size={20} />
            <div>
              <span className="strip-title">Lifesaver Pledge</span>
              <strong>1 Donation = Up to 3 Lives Saved</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="container footer-content-grid">
        <div className="footer-col brand-col">
          <div className="footer-logo">
            <Droplet size={24} className="text-red-500" />
            <h3>BloodLife Management Portal</h3>
          </div>
          <p className="footer-about">
            Connecting selfless voluntary blood donors with hospitals, patients in critical care, and emergency blood banks in real time. Built with care for humanity.
          </p>
          <div className="footer-stats-badge">
            <Shield size={16} /> 100% Verified Donor & Inventory Network
          </div>
        </div>

        <div className="footer-col">
          <h4>Quick Navigation</h4>
          <ul className="footer-links">
            <li><Link to="/inventory">Live Blood Inventory</Link></li>
            <li><Link to="/donate">Register as Blood Donor</Link></li>
            <li><Link to="/request">Submit Emergency Request</Link></li>
            <li><Link to="/requests-feed">Urgent Requests Board</Link></li>
            <li><Link to="/camps">Mobile Donation Camps</Link></li>
            <li><Link to="/eligibility">Eligibility Guidelines</Link></li>
            <li><Link to="/donor-card">My Digital Donor Card</Link></li>
            <li><Link to="/admin">Blood Bank Control Desk</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Donor Eligibility Criteria</h4>
          <ul className="footer-checklist">
            <li><CheckCircle2 size={14} /> Age: 18 – 65 years old</li>
            <li><CheckCircle2 size={14} /> Minimum weight: 50 kg</li>
            <li><CheckCircle2 size={14} /> Normal pulse and blood pressure</li>
            <li><CheckCircle2 size={14} /> Minimum 3 months since last donation</li>
            <li><CheckCircle2 size={14} /> Free from active cold, flu, or infection</li>
            <li><CheckCircle2 size={14} /> Hemoglobin ≥ 12.5 g/dL</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Blood Types We Support</h4>
          <div className="footer-blood-tags">
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
              <span key={bg} className="footer-bg-tag">{bg}</span>
            ))}
          </div>
          <p className="footer-note">
            In medical emergencies, every second matters. Keep emergency contact details verified before submitting requests.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>&copy; {new Date().getFullYear()} BloodLife Portal. All rights reserved.</p>
          <p>Strictly compliant with National Blood Transfusion Council (NBTC) safety standards.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
