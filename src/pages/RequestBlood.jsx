import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  Hospital,
  MapPin,
  Phone,
  Droplet,
  User,
  Clock,
  ShieldCheck,
  Send
} from 'lucide-react';
import { usePortal } from '../context/usePortal';

const RequestBlood = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const preselectedGroup = location.state?.preselectedGroup || '';

  const { createBloodRequest, bloodGroups, notify } = usePortal();

  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: preselectedGroup || '',
    unitsRequired: 1,
    urgency: 'HIGH',
    hospitalName: '',
    hospitalWard: '',
    city: '',
    contactPerson: '',
    phone: '',
    alternatePhone: '',
    reason: '',
    doctorInCharge: '',
    consentVerified: false
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validate = () => {
    if (!formData.patientName.trim()) {
      notify('warning', 'Patient Name Required', 'Please enter the patient’s full name.');
      return false;
    }
    if (!formData.bloodGroup) {
      notify('warning', 'Blood Group Required', 'Please select the required blood group.');
      return false;
    }
    if (!formData.hospitalName.trim()) {
      notify('warning', 'Hospital Name Required', 'Please specify the treating hospital name.');
      return false;
    }
    if (!formData.city.trim()) {
      notify('warning', 'City Required', 'Please specify the city where blood is needed.');
      return false;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      notify('warning', 'Valid Phone Required', 'Please provide an active 10-digit emergency contact number.');
      return false;
    }
    if (!formData.reason.trim()) {
      notify('warning', 'Medical Reason', 'Please enter the medical reason (e.g. Surgery, Trauma, Anemia).');
      return false;
    }
    if (!formData.consentVerified) {
      notify('warning', 'Verification Required', 'Please verify the doctor’s requisition consent.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const created = await createBloodRequest({
        ...formData,
        unitsRequired: parseInt(formData.unitsRequired, 10) || 1
      });

      await notify(
        'success',
        'Emergency Request Broadcasted! 🚨',
        `Request #${created.id} for ${formData.bloodGroup} at ${formData.hospitalName} is now live on our emergency network. Matching voluntary donors are being alerted.`
      );

      navigate('/requests-feed');
    } catch (err) {
      notify('error', 'Request Failed', err.message || 'Unable to submit emergency request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container page-content">
      <div className="page-header-row text-center">
        <div>
          <span className="page-eyebrow text-red">24/7 Patient Emergency Desk</span>
          <h1 className="page-title">Submit Urgent Blood Request</h1>
          <p className="page-subtitle">
            Broadcast emergency blood requirements directly to voluntary donors and partnered hospital blood banks.
          </p>
        </div>
      </div>

      <div className="request-form-container">
        <form onSubmit={handleSubmit} className="request-blood-form">
          {/* PATIENT & URGENCY */}
          <div className="form-card-section">
            <div className="section-title-wrap">
              <AlertCircle className="text-red-500" size={20} />
              <h3>1. Patient & Urgency Level</h3>
            </div>

            <div className="form-grid-3">
              <div className="form-field">
                <label>Patient Full Name *</label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  placeholder="e.g. Ramesh Patel"
                  required
                />
              </div>

              <div className="form-field">
                <label>Required Blood Group *</label>
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
                <label>Units Needed *</label>
                <input
                  type="number"
                  name="unitsRequired"
                  min="1"
                  max="10"
                  value={formData.unitsRequired}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-field">
                <label>Priority / Urgency Level *</label>
                <select name="urgency" value={formData.urgency} onChange={handleChange}>
                  <option value="CRITICAL">CRITICAL (Needed within 2-4 hours - ICU / Trauma)</option>
                  <option value="HIGH">HIGH (Needed within 12 hours - Major Surgery)</option>
                  <option value="STANDARD">STANDARD (Needed in 24-48 hours - Scheduled Procedure)</option>
                </select>
              </div>

              <div className="form-field">
                <label>Medical Diagnosis / Purpose *</label>
                <input
                  type="text"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="e.g. Emergency Cardiac Surgery, Dengue Platelets"
                  required
                />
              </div>
            </div>
          </div>

          {/* HOSPITAL & LOCATION */}
          <div className="form-card-section">
            <div className="section-title-wrap">
              <Hospital className="text-red-500" size={20} />
              <h3>2. Hospital Location & Attending Doctor</h3>
            </div>

            <div className="form-grid-3">
              <div className="form-field">
                <label>Hospital / Clinic Name *</label>
                <input
                  type="text"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  placeholder="e.g. Apollo Speciality Hospital"
                  required
                />
              </div>

              <div className="form-field">
                <label>Ward / Room / Bed Number</label>
                <input
                  type="text"
                  name="hospitalWard"
                  value={formData.hospitalWard}
                  onChange={handleChange}
                  placeholder="e.g. ICU Bed 4, 3rd Floor"
                />
              </div>

              <div className="form-field">
                <label>City / Location *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Bangalore"
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label>Doctor In Charge (Optional)</label>
              <input
                type="text"
                name="doctorInCharge"
                value={formData.doctorInCharge}
                onChange={handleChange}
                placeholder="e.g. Dr. K. Srinivas"
              />
            </div>
          </div>

          {/* ATTENDER CONTACT DETAILS */}
          <div className="form-card-section">
            <div className="section-title-wrap">
              <Phone className="text-red-500" size={20} />
              <h3>3. Attender / Contact Details</h3>
            </div>

            <div className="form-grid-3">
              <div className="form-field">
                <label>Contact Person Name *</label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  placeholder="e.g. Relative or Hospital Attender"
                  required
                />
              </div>

              <div className="form-field">
                <label>Primary Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 9845012345"
                  required
                />
              </div>

              <div className="form-field">
                <label>Alternate Emergency Phone</label>
                <input
                  type="tel"
                  name="alternatePhone"
                  value={formData.alternatePhone}
                  onChange={handleChange}
                  placeholder="Secondary phone"
                />
              </div>
            </div>

            <label className="checkbox-control mt-4">
              <input
                type="checkbox"
                name="consentVerified"
                checked={formData.consentVerified}
                onChange={handleChange}
                required
              />
              <span className="checkbox-text">
                I verify that this blood requisition is formally advised by a certified doctor/hospital and understand that false requests will be reported.
              </span>
            </label>
          </div>

          <div className="form-submit-row">
            <button
              type="submit"
              className="btn-primary btn-submit-request"
              disabled={submitting}
            >
              <Send size={18} />
              {submitting ? 'Broadcasting Request...' : 'Post Emergency Request to Network'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestBlood;
