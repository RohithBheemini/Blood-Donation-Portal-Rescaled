import React, { useState } from 'react';
import {
  Search,
  ShieldCheck,
  Printer,
  Heart,
  Droplets,
  AlertCircle
} from 'lucide-react';
import { usePortal } from '../context/usePortal';
import DonorCardModal from '../components/DonorCardModal';

const DonorCardLookup = () => {
  const { donors } = usePortal();
  const [query, setQuery] = useState('');
  const [matchedDonor, setMatchedDonor] = useState(null);
  const [searched, setSearched] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const q = query.trim().toLowerCase();
    const found = donors.find(d =>
      (d.id && d.id.toLowerCase() === q) ||
      (d.phone && d.phone.replace(/[\s+-]/g, '').includes(q.replace(/[\s+-]/g, ''))) ||
      (d.email && d.email.toLowerCase() === q) ||
      (d.fullName && d.fullName.toLowerCase().includes(q))
    );

    setMatchedDonor(found || null);
    setSearched(true);
  };

  const loadSample = (sampleId) => {
    const found = donors.find(d => d.id === sampleId);
    if (found) {
      setQuery(sampleId);
      setMatchedDonor(found);
      setSearched(true);
    }
  };

  return (
    <div className="container page-content">
      <div className="page-header-row text-center">
        <div>
          <span className="page-eyebrow">Digital Donor Identity</span>
          <h1 className="page-title">Digital Donor Card & Certificate</h1>
          <p className="page-subtitle">
            Look up your verified blood donor registration card, track your hero tier, and print your digital lifesaver badge.
          </p>
        </div>
      </div>

      <div className="donor-lookup-wrap">
        <form onSubmit={handleSearch} className="lookup-search-form">
          <div className="lookup-input-box">
            <Search size={22} className="lookup-search-icon" />
            <input
              type="text"
              placeholder="Enter Donor ID (e.g. DON-1001), Registered Phone, or Email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="btn-primary">
              Search Donor Card
            </button>
          </div>
        </form>

        <div className="sample-quick-picks">
          <span>Try quick sample profiles:</span>
          {donors.slice(0, 3).map(d => (
            <button
              key={d.id}
              className="sample-pick-chip"
              onClick={() => loadSample(d.id)}
            >
              {d.fullName} ({d.id})
            </button>
          ))}
        </div>

        {searched && (
          <div className="lookup-results-section">
            {matchedDonor ? (
              <div className="matched-donor-card-view">
                <div className="matched-card-hero">
                  <div className="donor-card-badge">
                    <div className="badge-header">
                      <div className="badge-brand">
                        <Droplets size={24} className="blood-icon-pulse text-red-500" />
                        <div>
                          <h4>LIFE-SAVER NETWORK</h4>
                          <small>National Voluntary Blood Registry</small>
                        </div>
                      </div>
                      <div className="blood-type-pill">
                        <span>{matchedDonor.bloodGroup}</span>
                      </div>
                    </div>

                    <div className="badge-body">
                      <div className="donor-primary-info">
                        <h3 className="donor-name">{matchedDonor.fullName}</h3>
                        <p className="donor-meta-id">Donor ID: <strong>{matchedDonor.id}</strong></p>
                      </div>

                      <div className="donor-specs-grid">
                        <div className="spec-box">
                          <span className="spec-label">City</span>
                          <span className="spec-value">{matchedDonor.city || 'Verified'}</span>
                        </div>
                        <div className="spec-box">
                          <span className="spec-label">Donation Count</span>
                          <span className="spec-value">{matchedDonor.donationsCount || 1} Times</span>
                        </div>
                        <div className="spec-box">
                          <span className="spec-label">Hero Tier</span>
                          <span className="spec-value tier-tag">{matchedDonor.badge || 'Silver Lifesaver'}</span>
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
                          <svg viewBox="0 0 100 100" width="60" height="60">
                            <rect width="100" height="100" fill="#ffffff" />
                            <path d="M10 10h30v30h-30z M60 10h30v30h-30z M10 60h30v30h-30z M20 20h10v10h-10z M70 20h10v10h-10z M20 70h10v10h-10z M50 20h5v10h-5z M50 50h30v5h-30z M60 60h10v10h-10z M80 75h10v15h-10z M50 80h15v10h-15z" fill="#1e293b" />
                          </svg>
                          <small>Scan to Verify</small>
                        </div>
                        <div className="pledge-notice">
                          <Heart size={16} className="text-red-500" />
                          <p>"Every donation counts. Thank you for your humanitarian service."</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="matched-card-actions">
                  <button className="btn-primary" onClick={() => setModalOpen(true)}>
                    <Printer size={16} /> Print Full Official Certificate
                  </button>
                </div>
              </div>
            ) : (
              <div className="empty-results-box">
                <AlertCircle size={36} className="text-amber-500" />
                <h3>No Donor Record Found</h3>
                <p>We could not find an active donor matching "{query}". Please check the phone number, email, or Donor ID.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <DonorCardModal
        donor={matchedDonor}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default DonorCardLookup;
