import React, { useState } from 'react';
import { X, CheckCircle, Info, HeartPulse } from 'lucide-react';
import { usePortal } from '../context/usePortal';

const BloodCompatibilityModal = ({ isOpen, onClose }) => {
  const { bloodGroups, bloodCompatibility } = usePortal();
  const [selectedGroup, setSelectedGroup] = useState('O+');

  if (!isOpen) return null;

  const currentInfo = bloodCompatibility[selectedGroup] || { canDonateTo: [], canReceiveFrom: [] };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <HeartPulse className="text-red-500" size={24} />
            <h3>Blood Type Compatibility Guide</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-desc">
            Selecting the right match is vital for safe transfusions. Choose a blood type below to explore compatibility:
          </p>

          <div className="group-chips-selector">
            {bloodGroups.map(bg => (
              <button
                key={bg}
                className={`group-chip ${selectedGroup === bg ? 'active' : ''}`}
                onClick={() => setSelectedGroup(bg)}
              >
                {bg}
              </button>
            ))}
          </div>

          <div className="compatibility-details-grid">
            <div className="compat-card compat-give">
              <h4>
                <span className="dot dot-give"></span>
                {selectedGroup} Can Donate To:
              </h4>
              <div className="compat-list">
                {currentInfo.canDonateTo.map(bg => (
                  <span key={bg} className="match-tag match-give">
                    <CheckCircle size={14} /> {bg}
                  </span>
                ))}
              </div>
              {selectedGroup === 'O-' && (
                <div className="badge-highlight">
                  🌟 Universal Red Cell Donor: Can help ANY patient in emergencies!
                </div>
              )}
            </div>

            <div className="compat-card compat-receive">
              <h4>
                <span className="dot dot-receive"></span>
                {selectedGroup} Can Receive From:
              </h4>
              <div className="compat-list">
                {currentInfo.canReceiveFrom.map(bg => (
                  <span key={bg} className="match-tag match-receive">
                    <CheckCircle size={14} /> {bg}
                  </span>
                ))}
              </div>
              {selectedGroup === 'AB+' && (
                <div className="badge-highlight">
                  🌟 Universal Recipient: Can safely receive red blood cells from any type!
                </div>
              )}
            </div>
          </div>

          <div className="compat-matrix-table-wrap">
            <h4>Quick Reference Table</h4>
            <table className="compat-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Can Donate To</th>
                  <th>Can Receive From</th>
                </tr>
              </thead>
              <tbody>
                {bloodGroups.map(bg => (
                  <tr key={bg} className={selectedGroup === bg ? 'row-highlighted' : ''}>
                    <td><strong>{bg}</strong></td>
                    <td>{bloodCompatibility[bg].canDonateTo.join(', ')}</td>
                    <td>{bloodCompatibility[bg].canReceiveFrom.join(', ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

export default BloodCompatibilityModal;
