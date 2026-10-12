import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Droplet,
  Users,
  AlertCircle,
  Calendar,
  ArrowRight,
  ShieldAlert,
  Clock,
  MapPin,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { usePortal } from '../context/usePortal';
import { FAQS } from '../data/mockData';

const Home = () => {
  const {
    inventory,
    donors,
    requests,
    camps,
    totalUnits,
    criticalShortageGroups,
    pledgeForRequest,
    bloodGroups
  } = usePortal();

  const [faqOpenIndex, setFaqOpenIndex] = useState(0);

  const urgentRequests = requests.filter(r => r.status === 'Urgent Need').slice(0, 3);
  const upcomingCamps = camps.slice(0, 3);

  const getStockStatus = (units) => {
    if (units === 0) return { label: 'Out of Stock', cls: 'status-empty' };
    if (units <= 2) return { label: 'Critical Low', cls: 'status-critical' };
    if (units <= 5) return { label: 'Moderate', cls: 'status-moderate' };
    return { label: 'Optimal', cls: 'status-good' };
  };

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-text-content">
            <div className="hero-badge">
              <Sparkles size={16} /> Verified Life Support Network
            </div>
            <h1 className="hero-title">
              Give Blood, Save Lives. <br />
              <span className="hero-highlight">Every Drop Matters.</span>
            </h1>
            <p className="hero-subtitle">
              Join thousands of heroes who stand ready to bridge the gap between emergency hospital demands and voluntary donors. Real-time blood inventory, quick emergency requests, and certified donor registry.
            </p>

            <div className="hero-cta-group">
              <Link to="/donate" className="btn-cta btn-primary-cta">
                <Heart size={20} /> Register as Donor
              </Link>
              <Link to="/request" className="btn-cta btn-secondary-cta">
                <AlertCircle size={20} /> Request Blood Now
              </Link>
              <Link to="/inventory" className="btn-cta btn-outline-cta">
                <Droplet size={20} /> View Inventory
              </Link>
            </div>

            {criticalShortageGroups.length > 0 && (
              <div className="critical-warning-box">
                <ShieldAlert size={20} className="text-red-500" />
                <span>
                  High Urgency: Critical inventory shortage for{' '}
                  <strong>{criticalShortageGroups.join(', ')}</strong>. Donors of these groups are urgently needed!
                </span>
              </div>
            )}
          </div>

          {/* QUICK HERO STATS */}
          <div className="hero-stats-panel">
            <div className="hero-stat-card">
              <div className="stat-card-icon icon-blood">
                <Droplet size={28} />
              </div>
              <div className="stat-card-data">
                <span className="stat-number">{totalUnits}</span>
                <span className="stat-label">Units in Reserve</span>
              </div>
            </div>

            <div className="hero-stat-card">
              <div className="stat-card-icon icon-donors">
                <Users size={28} />
              </div>
              <div className="stat-card-data">
                <span className="stat-number">{donors.length}</span>
                <span className="stat-label">Verified Donors</span>
              </div>
            </div>

            <div className="hero-stat-card">
              <div className="stat-card-icon icon-urgent">
                <AlertCircle size={28} />
              </div>
              <div className="stat-card-data">
                <span className="stat-number">{requests.filter(r => r.status === 'Urgent Need').length}</span>
                <span className="stat-label">Active Emergencies</span>
              </div>
            </div>

            <div className="hero-stat-card">
              <div className="stat-card-icon icon-camps">
                <Calendar size={28} />
              </div>
              <div className="stat-card-data">
                <span className="stat-number">{camps.length}</span>
                <span className="stat-label">Mobile Blood Camps</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE INVENTORY GLANCE */}
      <section className="section-inventory-glance">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Real-Time Blood Bank Reserve</span>
              <h2 className="section-heading">Live Blood Stock Snapshot</h2>
            </div>
            <Link to="/inventory" className="link-see-all">
              Full Inventory Analysis <ArrowRight size={16} />
            </Link>
          </div>

          <div className="inventory-glance-grid">
            {bloodGroups.map(bg => {
              const units = inventory[bg] || 0;
              const status = getStockStatus(units);
              return (
                <div key={bg} className={`glance-card ${status.cls}`}>
                  <div className="glance-top">
                    <span className="glance-group">{bg}</span>
                    <span className={`glance-badge ${status.cls}`}>{status.label}</span>
                  </div>
                  <div className="glance-units">
                    <span className="units-huge">{units}</span>
                    <span className="units-desc">Available Units</span>
                  </div>
                  <div className="glance-actions">
                    <Link to="/request" className="btn-tiny-action">Request {bg}</Link>
                    <Link to="/donate" className="btn-tiny-donate">Donate</Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* EMERGENCY BLOOD REQUESTS STREAM */}
      {urgentRequests.length > 0 && (
        <section className="section-urgent-stream">
          <div className="container">
            <div className="section-header">
              <div>
                <span className="section-eyebrow text-red">Critical Alert Stream</span>
                <h2 className="section-heading">Urgent Blood Requests In Your Area</h2>
              </div>
              <Link to="/requests-feed" className="link-see-all">
                View All Requests ({requests.length}) <ArrowRight size={16} />
              </Link>
            </div>

            <div className="urgent-cards-grid">
              {urgentRequests.map(req => (
                <div key={req.id} className="urgent-card">
                  <div className="urgent-card-top">
                    <div className="urgent-group-badge">
                      <Droplet size={18} />
                      <span>{req.bloodGroup} Needed</span>
                    </div>
                    <span className={`urgency-pill urgency-${req.urgency.toLowerCase()}`}>
                      {req.urgency}
                    </span>
                  </div>

                  <h3 className="urgent-patient">{req.patientName}</h3>
                  <p className="urgent-reason">{req.reason}</p>

                  <div className="urgent-meta-details">
                    <div className="meta-row">
                      <MapPin size={15} />
                      <span>{req.hospitalName}, {req.city}</span>
                    </div>
                    <div className="meta-row">
                      <Clock size={15} />
                      <span>{req.unitsRequired} Units Required (Pledged: {req.pledges || 0})</span>
                    </div>
                  </div>

                  <div className="urgent-card-footer">
                    <button
                      className="btn-pledge-action"
                      onClick={() => pledgeForRequest(req.id, 'Anonymous Lifesaver')}
                    >
                      <Heart size={16} /> Pledge Blood For This Patient
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3-STEP DONATION PROCESS */}
      <section className="section-steps">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">How It Works</span>
            <h2 className="section-heading">Your Journey As A Lifesaver</h2>
            <p className="section-desc">
              Donating blood is simple, quick, and completely safe. Here is what to expect in three easy steps:
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3>Quick Registration & Quiz</h3>
              <p>
                Fill out our simple digital registration form and quick 60-second eligibility screening to verify criteria like age and weight.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <h3>Visit Center or Mobile Camp</h3>
              <p>
                Arrive at your nearest partnered hospital blood bank or community drive for a free mini-health screening and sterile donation.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <h3>Save Up To 3 Lives & Get ID</h3>
              <p>
                Your blood is processed, tested, and dispatched to ICU patients or trauma units. Receive your digital donor certificate and badge!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* UPCOMING DONATION CAMPS */}
      <section className="section-camps-glance">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="section-eyebrow">Community Drives</span>
              <h2 className="section-heading">Upcoming Blood Donation Camps</h2>
            </div>
            <Link to="/camps" className="link-see-all">
              All Camps ({camps.length}) <ArrowRight size={16} />
            </Link>
          </div>

          <div className="camps-cards-grid">
            {upcomingCamps.map(camp => (
              <div key={camp.id} className="camp-card">
                <div className="camp-card-header">
                  <span className="camp-date-pill">
                    <Calendar size={14} /> {camp.date}
                  </span>
                  <span className="camp-time-pill">
                    <Clock size={14} /> {camp.time}
                  </span>
                </div>
                <h3 className="camp-title">{camp.title}</h3>
                <p className="camp-org">Organized by: {camp.organizer}</p>
                <div className="camp-location">
                  <MapPin size={16} />
                  <span>{camp.venue}, {camp.city}</span>
                </div>
                <div className="camp-footer">
                  <span className="camp-reg-count">
                    <strong>{camp.registeredCount}</strong> / {camp.expectedDonors} Donors Registered
                  </span>
                  <Link to="/camps" className="btn-camp-register">
                    Join Camp
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQS ACCORDION */}
      <section className="section-faqs">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-eyebrow">Frequently Asked Questions</span>
            <h2 className="section-heading">Everything You Need to Know</h2>
          </div>

          <div className="faqs-accordion">
            {FAQS.map((faq, idx) => {
              const isOpen = faqOpenIndex === idx;
              return (
                <div key={idx} className={`faq-item ${isOpen ? 'open' : ''}`}>
                  <button
                    className="faq-question-btn"
                    onClick={() => setFaqOpenIndex(isOpen ? -1 : idx)}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {isOpen && (
                    <div className="faq-answer-panel">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="section-bottom-cta">
        <div className="container cta-banner-inner">
          <div className="cta-banner-text">
            <h2>Ready to Make an Impact?</h2>
            <p>Every single pint of blood can be separated into red cells, platelets, and plasma to rescue 3 patients.</p>
          </div>
          <div className="cta-banner-actions">
            <Link to="/donate" className="btn-cta btn-primary-cta">
              Become a Registered Donor
            </Link>
            <Link to="/request" className="btn-cta btn-secondary-cta">
              Post Emergency Request
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
