import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  RefreshCw,
  Search,
  Filter,
  AlertTriangle,
  HelpCircle,
  Heart
} from 'lucide-react';
import { usePortal } from '../context/usePortal';
import BloodCompatibilityModal from '../components/BloodCompatibilityModal';

const AvailableBlood = () => {
  const {
    inventory,
    loading,
    totalUnits,
    criticalShortageGroups,
    refreshData,
    bloodCompatibility,
    bloodGroups
  } = usePortal();

  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [compatModalOpen, setCompatModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const getStockStatus = (units) => {
    if (units === 0) {
      return { text: 'Out of Stock', level: 'empty', color: '#6b7280', badgeClass: 'badge-empty' };
    }
    if (units <= 2) {
      return { text: 'Critical Low', level: 'low', color: '#ef4444', badgeClass: 'badge-critical' };
    }
    if (units <= 5) {
      return { text: 'Moderate Stock', level: 'medium', color: '#f59e0b', badgeClass: 'badge-moderate' };
    }
    return { text: 'Optimal Reserve', level: 'optimal', color: '#10b981', badgeClass: 'badge-optimal' };
  };

  const filteredGroups = bloodGroups.filter(bg => {
    const units = inventory[bg] || 0;
    const matchesSearch = bg.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'CRITICAL') return units <= 2;
    if (filterType === 'AVAILABLE') return units > 0;
    if (filterType === 'OPTIMAL') return units > 5;
    if (filterType === 'UNIVERSAL') return bg === 'O-' || bg === 'AB+';
    return true;
  });

  return (
    <div className="container page-content">
      {/* PAGE HEADER */}
      <div className="page-header-row">
        <div>
          <span className="page-eyebrow">Real-Time Blood Bank Reserve</span>
          <h1 className="page-title">Available Blood Inventory</h1>
          <p className="page-subtitle">
            Monitored 24/7 across regional central blood banks and partner hospital storage units.
          </p>
        </div>

        <div className="header-actions-group">
          <button
            className="btn-secondary"
            onClick={() => setCompatModalOpen(true)}
          >
            <HelpCircle size={16} /> Compatibility Guide
          </button>
          <button
            className={`btn-primary refresh-button ${isRefreshing ? 'spin' : ''}`}
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw size={16} /> {isRefreshing ? 'Updating...' : 'Sync Stock'}
          </button>
        </div>
      </div>

      {/* METRIC HIGHLIGHTS STRIP */}
      <div className="inventory-stats-strip">
        <div className="inv-stat-card">
          <div className="inv-stat-title">Total Blood Units</div>
          <div className="inv-stat-value text-red-600">{totalUnits}</div>
          <div className="inv-stat-subtitle">Across 8 blood groups</div>
        </div>

        <div className="inv-stat-card">
          <div className="inv-stat-title">Critical Shortage Groups</div>
          <div className="inv-stat-value text-amber-600">
            {criticalShortageGroups.length}
          </div>
          <div className="inv-stat-subtitle">
            {criticalShortageGroups.length > 0
              ? `${criticalShortageGroups.join(', ')} require urgent donors`
              : 'All groups maintain adequate stock'}
          </div>
        </div>

        <div className="inv-stat-card">
          <div className="inv-stat-title">Universal Red Cell Donor (O-)</div>
          <div className="inv-stat-value">
            {inventory['O-'] || 0} <span className="unit-label">Units</span>
          </div>
          <div className="inv-stat-subtitle">Compatible with all patients</div>
        </div>

        <div className="inv-stat-card">
          <div className="inv-stat-title">Universal Recipient (AB+)</div>
          <div className="inv-stat-value">
            {inventory['AB+'] || 0} <span className="unit-label">Units</span>
          </div>
          <div className="inv-stat-subtitle">Can receive any red cell group</div>
        </div>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="inventory-toolbar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search group (e.g. A+, O-)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-chips">
          <span className="filter-label"><Filter size={14} /> Filter:</span>
          {[
            { id: 'ALL', label: 'All (8)' },
            { id: 'AVAILABLE', label: 'In Stock' },
            { id: 'CRITICAL', label: 'Critical Shortage' },
            { id: 'OPTIMAL', label: 'Optimal' },
            { id: 'UNIVERSAL', label: 'Universal (O- / AB+)' }
          ].map(f => (
            <button
              key={f.id}
              className={`filter-btn ${filterType === f.id ? 'active' : ''}`}
              onClick={() => setFilterType(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* INVENTORY CARDS GRID */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Connecting to blood bank repositories...</p>
        </div>
      ) : filteredGroups.length === 0 ? (
        <div className="empty-results-box">
          <AlertTriangle size={36} className="text-amber-500" />
          <h3>No Blood Groups Match Filter</h3>
          <p>Try resetting the filter search criteria to view all groups.</p>
          <button className="btn-secondary" onClick={() => { setFilterType('ALL'); setSearchQuery(''); }}>
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="blood-cards-main-grid">
          {filteredGroups.map(bg => {
            const units = inventory[bg] || 0;
            const status = getStockStatus(units);
            const compat = bloodCompatibility[bg] || { canDonateTo: [], canReceiveFrom: [] };

            return (
              <div key={bg} className={`blood-inventory-card border-${status.level}`}>
                <div className="card-top-row">
                  <div className="blood-badge-wrap">
                    <span className="blood-group-tag">{bg}</span>
                    {bg === 'O-' && <span className="tag-universal">Universal Donor</span>}
                    {bg === 'AB+' && <span className="tag-universal-rec">Universal Recipient</span>}
                  </div>
                  <span className={`status-pill ${status.badgeClass}`}>
                    {status.text}
                  </span>
                </div>

                <div className="card-units-block">
                  <div className="units-number-large">{units}</div>
                  <span className="units-label-text">Available Units in Bank</span>
                </div>

                {/* STOCK LEVEL BAR */}
                <div className="stock-progress-bar">
                  <div
                    className={`progress-fill fill-${status.level}`}
                    style={{ width: `${Math.min(100, (units / 20) * 100)}%` }}
                  ></div>
                </div>

                {/* COMPATIBILITY SUMMARY */}
                <div className="compatibility-preview-box">
                  <div className="compat-preview-line">
                    <span className="preview-label">Can Give To:</span>
                    <span className="preview-values">{compat.canDonateTo.slice(0, 3).join(', ')}{compat.canDonateTo.length > 3 ? '...' : ''}</span>
                  </div>
                  <div className="compat-preview-line">
                    <span className="preview-label">Can Receive:</span>
                    <span className="preview-values">{compat.canReceiveFrom.slice(0, 3).join(', ')}{compat.canReceiveFrom.length > 3 ? '...' : ''}</span>
                  </div>
                </div>

                {/* CARD FOOTER ACTIONS */}
                <div className="card-actions-row">
                  <Link
                    to="/request"
                    state={{ preselectedGroup: bg }}
                    className="btn-action-request"
                  >
                    Request {bg}
                  </Link>
                  <Link
                    to="/donate"
                    state={{ preselectedGroup: bg }}
                    className="btn-action-donate"
                  >
                    <Heart size={14} /> Donate
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* STOCK LEVEL LEGEND */}
      <div className="stock-legend-banner">
        <h4>Understanding Inventory Stock Thresholds</h4>
        <div className="legend-pills-row">
          <div className="legend-chip">
            <span className="legend-dot dot-critical"></span>
            <strong>Critical (0 - 2 Units):</strong> Immediate donor call required
          </div>
          <div className="legend-chip">
            <span className="legend-dot dot-moderate"></span>
            <strong>Moderate (3 - 5 Units):</strong> Meets local routine demand
          </div>
          <div className="legend-chip">
            <span className="legend-dot dot-optimal"></span>
            <strong>Optimal (&gt; 5 Units):</strong> Ready for standard transfusions
          </div>
        </div>
      </div>

      <BloodCompatibilityModal
        isOpen={compatModalOpen}
        onClose={() => setCompatModalOpen(false)}
      />
    </div>
  );
};

export default AvailableBlood;
