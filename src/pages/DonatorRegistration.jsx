import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  User,
  Heart,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Award
} from 'lucide-react';
import { usePortal } from '../context/usePortal';
import DonorCardModal from '../components/DonorCardModal';

const DonatorRegistration = () => {
  const location = useLocation();
  const preselectedGroup = location.state?.preselectedGroup || '';

  const { registerNewDonor, bloodGroups, notify } = usePortal();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    gender: 'Male',
    weight: '',
    bloodGroup: preselectedGroup || '',
    city: '',
    address: '',
    emergencyContact: '',
    healthConditions: '',
    medications: '',
    lastDonationMonthsAgo: 'Never / First Time',
    isAbove18: false,
    willingForEmergencyCalls: true
  });

  const [loading, setLoading] = useState(false);
  const [createdDonor, setCreatedDonor] = useState(null);
  const [showCardModal, setShowCardModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validate = () => {
    if (!formData.fullName.trim()) {
      notify('warning', 'Missing Name', 'Please enter your full name.');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      notify('warning', 'Invalid Email', 'Please provide a valid email address.');
      return false;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      notify('warning', 'Invalid Phone', 'Please provide a valid 10-digit contact number.');
      return false;
    }
    const age = parseInt(formData.age, 10);
    if (!age || age < 18 || age > 65) {
      notify('warning', 'Age Requirement', 'Blood donors must be between 18 and 65 years of age.');
      return false;
    }
    const weight = parseInt(formData.weight, 10);
    if (!weight || weight < 50) {
      notify('warning', 'Weight Requirement', 'Minimum body weight for donor safety is 50 kg.');
      return false;
    }
    if (!formData.bloodGroup) {
      notify('warning', 'Blood Group Required', 'Please select your blood group.');
      return false;
    }
    if (!formData.isAbove18) {
      notify('warning', 'Eligibility Consent', 'You must verify that you are at least 18 years old.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const donor = await registerNewDonor({
        ...formData,
        age: parseInt(formData.age, 10),
        weight: parseInt(formData.weight, 10)
      });

      setCreatedDonor(donor);

      await notify(
        'success',
        'Registration Successful! 🎉',
        `Thank you ${formData.fullName}! Your donor profile is now active and 1 unit has been registered to ${formData.bloodGroup}. You can now view your Digital Donor ID Card.`
      );

      setShowCardModal(true);

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        age: '',
        gender: 'Male',
        weight: '',
        bloodGroup: '',
        city: '',
        address: '',
        emergencyContact: '',
        healthConditions: '',
        medications: '',
        lastDonationMonthsAgo: 'Never / First Time',
        isAbove18: false,
        willingForEmergencyCalls: true
      });
    } catch (err) {
      notify('error', 'Registration Failed', err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-content">
      <div className="page-header-row text-center">
        <div>
          <span className="page-eyebrow">Voluntary Donor Network</span>
          <h1 className="page-title">Register As A Blood Donor</h1>
          <p className="page-subtitle">
            Every 2 seconds, someone in India needs blood. Your registration connects you directly with critical hospital patients.
          </p>
        </div>
      </div>

      <div className="registration-layout">
        <div className="registration-main-card">
          <form onSubmit={handleSubmit} className="donor-form">
            {/* SECTION 1: PERSONAL INFORMATION */}
            <div className="form-card-section">
              <div className="section-title-wrap">
                <User className="text-red-500" size={20} />
                <h3>1. Personal Details</h3>
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label>Full Legal Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Rohith Kumar"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. rohith@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-field">
                  <label>Primary Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. +91 9876543210"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Gender *</label>
                  <select name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>City / Region *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Bangalore, Hyderabad"
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label>Residential Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street, Area, Landmark"
                  />
                </div>

                <div className="form-field">
                  <label>Emergency Contact Phone</label>
                  <input
                    type="tel"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    placeholder="Contact person's phone"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: MEDICAL & DONATION STATS */}
            <div className="form-card-section">
              <div className="section-title-wrap">
                <Heart className="text-red-500" size={20} />
                <h3>2. Medical & Blood Group Info</h3>
              </div>

              <div className="form-grid-3">
                <div className="form-field">
                  <label>Blood Group *</label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Blood Group</option>
                    {bloodGroups.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label>Age (Years) * [18 - 65]</label>
                  <input
                    type="number"
                    name="age"
                    min="18"
                    max="65"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="e.g. 24"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Body Weight (kg) * [Min 50kg]</label>
                  <input
                    type="number"
                    name="weight"
                    min="50"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="e.g. 68"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Last Blood Donation Time</label>
                <select
                  name="lastDonationMonthsAgo"
                  value={formData.lastDonationMonthsAgo}
                  onChange={handleChange}
                >
                  <option value="Never / First Time">Never / First Time Donor</option>
                  <option value="More than 6 months ago">More than 6 months ago (Eligible)</option>
                  <option value="3 to 6 months ago">3 to 6 months ago (Eligible)</option>
                  <option value="Less than 3 months ago">Less than 3 months ago (Waiting interval)</option>
                </select>
              </div>

              <div className="form-grid-2">
                <div className="form-field">
                  <label>Any Chronic Health Conditions?</label>
                  <input
                    type="text"
                    name="healthConditions"
                    value={formData.healthConditions}
                    onChange={handleChange}
                    placeholder="Diabetes, Hypertension, or 'None'"
                  />
                </div>

                <div className="form-field">
                  <label>Current Medications / Antibiotics</label>
                  <input
                    type="text"
                    name="medications"
                    value={formData.medications}
                    onChange={handleChange}
                    placeholder="List regular medications or 'None'"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: CONSENT & ELIGIBILITY */}
            <div className="form-card-section consent-section">
              <div className="section-title-wrap">
                <ShieldCheck className="text-green-600" size={20} />
                <h3>3. Verification & Consent</h3>
              </div>

              <label className="checkbox-control">
                <input
                  type="checkbox"
                  name="isAbove18"
                  checked={formData.isAbove18}
                  onChange={handleChange}
                  required
                />
                <span className="checkbox-text">
                  I confirm that I am at least 18 years of age, weigh 50kg or above, and am in sound physical health to donate blood safely.
                </span>
              </label>

              <label className="checkbox-control">
                <input
                  type="checkbox"
                  name="willingForEmergencyCalls"
                  checked={formData.willingForEmergencyCalls}
                  onChange={handleChange}
                />
                <span className="checkbox-text">
                  I consent to receive urgent SMS / calls from partner hospitals or verified patients during high-priority emergencies.
                </span>
              </label>
            </div>

            <div className="form-submit-row">
              <button
                type="submit"
                className="btn-primary btn-submit-donor"
                disabled={loading}
              >
                {loading ? 'Processing Registration...' : 'Complete Registration & Get Donor Card'}
              </button>
            </div>
          </form>
        </div>

        {/* SIDEBAR TIPS & BENEFITS */}
        <div className="registration-sidebar">
          <div className="donor-perks-card">
            <h3><Award size={20} className="text-red-500" /> Donor Benefits</h3>
            <ul className="perks-list">
              <li>
                <CheckCircle2 size={16} />
                <span><strong>Instant Digital ID Card:</strong> Printable badge with QR code verification.</span>
              </li>
              <li>
                <CheckCircle2 size={16} />
                <span><strong>Free Health Check:</strong> Free hemoglobin, pulse, blood pressure check on visit.</span>
              </li>
              <li>
                <CheckCircle2 size={16} />
                <span><strong>Hero Recognition:</strong> Earn Bronze, Silver, Gold badges with each donation.</span>
              </li>
              <li>
                <CheckCircle2 size={16} />
                <span><strong>Save 3 Lives:</strong> Red cells, plasma, and platelets benefit multiple patients.</span>
              </li>
            </ul>
          </div>

          <div className="donor-guideline-box">
            <h4><AlertCircle size={18} /> Quick Pre-Donation Tips</h4>
            <ul>
              <li>Drink at least 500ml of water before donation</li>
              <li>Eat a healthy low-fat meal 2-3 hours prior</li>
              <li>Avoid alcohol 24 hours before donating</li>
              <li>Get at least 6-8 hours of sleep the night before</li>
            </ul>
          </div>
        </div>
      </div>

      {/* DIGITAL DONOR CARD MODAL */}
      <DonorCardModal
        donor={createdDonor}
        isOpen={showCardModal}
        onClose={() => setShowCardModal(false)}
      />
    </div>
  );
};

export default DonatorRegistration;
