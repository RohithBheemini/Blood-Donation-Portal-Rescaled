import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Activity } from 'lucide-react';
import { usePortal } from '../context/usePortal';

const EmergencyTicker = () => {
  const { requests } = usePortal();
  const criticalRequests = requests.filter(r => r.urgency === 'CRITICAL' || r.status === 'Urgent Need');

  if (criticalRequests.length === 0) return null;

  const topReq = criticalRequests[0];

  return (
    <div className="emergency-ticker-banner">
      <div className="ticker-content">
        <div className="ticker-badge">
          <Activity size={16} className="pulse-icon" />
          <span>URGENT ALERT</span>
        </div>
        <p className="ticker-text">
          Critical Need for <strong>{topReq.bloodGroup}</strong> at {topReq.hospitalName} ({topReq.city}) - Patient: {topReq.patientName} ({topReq.unitsRequired} units required)
        </p>
        <Link to="/requests-feed" className="ticker-action">
          View Emergency Feed <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default EmergencyTicker;
