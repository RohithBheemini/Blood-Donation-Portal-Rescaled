import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Droplet,
  MapPin,
  Clock,
  Phone,
  Heart,
  Filter,
  Search,
  CheckCircle,
  Share2,
  AlertTriangle
} from 'lucide-react';
import { usePortal } from '../context/usePortal';

const RequestsFeed = () => {
  const { requests, pledgeForRequest, bloodGroups, notifyToast, notify } = usePortal();

  const [selectedGroup, setSelectedGroup] = useState('ALL');
  const [selectedUrgency, setSelectedUrgency] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const handlePledge = async (req) => {
    const success = await pledgeForRequest(req.id, 'Voluntary Donor');
    if (success) {
      notify(
        'success',
        'Pledge Registered! 🩸',
        `Thank you for stepping up to help ${req.patientName} at ${req.hospitalName}. Please contact the attender at ${req.phone} to coordinate donation time.`
      );
    }
  };

  const handleShare = (req) => {
    const text = `🚨 URGENT BLOOD NEED: ${req.bloodGroup} needed for ${req.patientName} at ${req.hospitalName}, ${req.city}. Contact: ${req.phone}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      notifyToast('info', 'Alert copied to clipboard! Share on WhatsApp / Social Media.');
    } else {
      notifyToast('info', text);
    }
  };

  const filteredRequests = requests.filter(r => {
    const matchesGroup = selectedGroup === 'ALL' || r.bloodGroup === selectedGroup;
    const matchesUrgency = selectedUrgency === 'ALL' || r.urgency === selectedUrgency;
    const matchesSearch =
      r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.city.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesGroup && matchesUrgency && matchesSearch;
  });

  return (
    <div className="container page-content">
      <div className="page-header-row">
        <div>
          <span className="page-eyebrow text-red">Live Community Broadcast</span>
          <h1 className="page-title">Emergency Blood Requests Board</h1>
          <p className="page-subtitle">
            Verified patient requirements in regional hospitals. Step up to save a life today.
          </p>
        </div>

        <Link to="/request" className="btn-primary">
          <Activity size={16} /> Post New Emergency Request
        </Link>
      </div>

      {/* FILTER BAR */}
      <div className="feed-toolbar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search patient, hospital, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="toolbar-dropdowns">
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">All Blood Groups</option>
            {bloodGroups.map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>

          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">All Urgency Levels</option>
            <option value="CRITICAL">Critical (Immediate)</option>
            <option value="HIGH">High Priority</option>
            <option value="STANDARD">Standard</option>
          </select>
        </div>
      </div>

      {/* REQUESTS LIST */}
      {filteredRequests.length === 0 ? (
        <div className="empty-results-box">
          <CheckCircle size={36} className="text-green-500" />
          <h3>No Pending Requests Match Filters</h3>
          <p>No active emergencies match the selected filter criteria right now.</p>
        </div>
      ) : (
        <div className="requests-feed-grid">
          {filteredRequests.map(req => {
            const isFulfilled = req.status === 'Fulfilled' || (req.pledges >= req.unitsRequired);
            return (
              <div key={req.id} className={`request-feed-card urgency-border-${req.urgency.toLowerCase()}`}>
                <div className="card-top-info">
                  <div className="blood-circle-badge">
                    <span>{req.bloodGroup}</span>
                  </div>

                  <div className="patient-headline">
                    <h3>{req.patientName}</h3>
                    <span className="req-id-tag">#{req.id}</span>
                  </div>

                  <span className={`urgency-badge urgency-${req.urgency.toLowerCase()}`}>
                    {req.urgency}
                  </span>
                </div>

                <p className="request-diagnosis">
                  <strong>Medical Condition:</strong> {req.reason}
                </p>

                <div className="request-meta-grid">
                  <div className="meta-item">
                    <MapPin size={16} />
                    <span>{req.hospitalName}, {req.city} {req.hospitalWard ? `(${req.hospitalWard})` : ''}</span>
                  </div>

                  <div className="meta-item">
                    <Clock size={16} />
                    <span>Units Required: <strong>{req.unitsRequired}</strong> | Pledged: <strong>{req.pledges || 0}</strong></span>
                  </div>

                  <div className="meta-item">
                    <Phone size={16} />
                    <span>Contact: {req.contactPerson} ({req.phone})</span>
                  </div>
                </div>

                {/* PROGRESS BAR */}
                <div className="pledge-progress-wrap">
                  <div className="pledge-progress-labels">
                    <span>Pledge Fulfillment</span>
                    <span>{req.pledges || 0} / {req.unitsRequired} Units</span>
                  </div>
                  <div className="pledge-bar">
                    <div
                      className="pledge-bar-fill"
                      style={{ width: `${Math.min(100, ((req.pledges || 0) / req.unitsRequired) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="request-actions-row">
                  {isFulfilled ? (
                    <span className="status-fulfilled-tag">
                      <CheckCircle size={16} /> Request Fulfilled
                    </span>
                  ) : (
                    <button
                      className="btn-primary btn-pledge"
                      onClick={() => handlePledge(req)}
                    >
                      <Heart size={16} /> Pledge Donation
                    </button>
                  )}

                  <a href={`tel:${req.phone}`} className="btn-secondary btn-call">
                    <Phone size={16} /> Call Attender
                  </a>

                  <button
                    className="btn-icon-share"
                    onClick={() => handleShare(req)}
                    title="Share Emergency"
                  >
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RequestsFeed;
