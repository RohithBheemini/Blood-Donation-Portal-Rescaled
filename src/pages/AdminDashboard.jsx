import React, { useState } from 'react';
import {
  LayoutDashboard,
  Droplet,
  Users,
  AlertTriangle,
  Calendar,
  Plus,
  Minus,
  CheckCircle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Phone,
  Hospital,
  MapPin,
  ShieldCheck,
  Send
} from 'lucide-react';
import { usePortal } from '../context/usePortal';
import { dataService } from '../services/dataService';

const AdminDashboard = () => {
  const {
    inventory,
    donors,
    requests,
    camps,
    totalUnits,
    setInventoryUnits,
    refreshData,
    bloodGroups,
    notify,
    notifyToast
  } = usePortal();

  const [activeTab, setActiveTab] = useState('inventory');
  const [donorSearch, setDonorSearch] = useState('');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState('ALL');

  // New camp form state
  const [newCamp, setNewCamp] = useState({
    title: '',
    organizer: '',
    date: '',
    time: '09:00 AM - 03:00 PM',
    venue: '',
    city: '',
    expectedDonors: 100,
    contact: ''
  });

  const handleAdjustStock = (bg, delta) => {
    const current = inventory[bg] || 0;
    const nextVal = Math.max(0, current + delta);
    setInventoryUnits(bg, nextVal);
  };

  const handleAddCamp = async (e) => {
    e.preventDefault();
    if (!newCamp.title || !newCamp.date || !newCamp.venue || !newCamp.city) {
      notify('warning', 'Missing Fields', 'Please complete all required camp details.');
      return;
    }
    await dataService.addCamp({
      ...newCamp,
      expectedDonors: parseInt(newCamp.expectedDonors, 10) || 100
    });
    await refreshData();
    notifyToast('success', `Camp "${newCamp.title}" published successfully!`);
    setNewCamp({
      title: '',
      organizer: '',
      date: '',
      time: '09:00 AM - 03:00 PM',
      venue: '',
      city: '',
      expectedDonors: 100,
      contact: ''
    });
  };

  const filteredDonors = donors.filter(d => {
    const matchesSearch =
      (d.fullName && d.fullName.toLowerCase().includes(donorSearch.toLowerCase())) ||
      (d.city && d.city.toLowerCase().includes(donorSearch.toLowerCase())) ||
      (d.id && d.id.toLowerCase().includes(donorSearch.toLowerCase()));

    const matchesGroup = selectedGroupFilter === 'ALL' || d.bloodGroup === selectedGroupFilter;

    return matchesSearch && matchesGroup;
  });

  return (
    <div className="container page-content">
      {/* HEADER */}
      <div className="page-header-row">
        <div>
          <span className="page-eyebrow">Internal Staff & Hospital Admin Desk</span>
          <h1 className="page-title">Blood Bank Management Center</h1>
          <p className="page-subtitle">
            Manage inventory reserves, track hospital emergency requisitions, coordinate donors, and publish camps.
          </p>
        </div>

        <button className="btn-secondary" onClick={refreshData}>
          <RefreshCw size={16} /> Refresh Metrics
        </button>
      </div>

      {/* METRICS ROW */}
      <div className="admin-stats-overview">
        <div className="admin-stat-card">
          <div className="stat-icon-wrap icon-stock">
            <Droplet size={24} />
          </div>
          <div>
            <span className="admin-stat-val">{totalUnits}</span>
            <span className="admin-stat-lbl">Total Units in Storage</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrap icon-donors">
            <Users size={24} />
          </div>
          <div>
            <span className="admin-stat-val">{donors.length}</span>
            <span className="admin-stat-lbl">Registered Donors</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrap icon-emergency">
            <AlertTriangle size={24} />
          </div>
          <div>
            <span className="admin-stat-val">
              {requests.filter(r => r.status === 'Urgent Need').length}
            </span>
            <span className="admin-stat-lbl">Active Emergencies</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrap icon-camps">
            <Calendar size={24} />
          </div>
          <div>
            <span className="admin-stat-val">{camps.length}</span>
            <span className="admin-stat-lbl">Scheduled Mobile Camps</span>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="admin-tabs-nav">
        <button
          className={`admin-tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          <Droplet size={18} /> Live Inventory Adjuster
        </button>

        <button
          className={`admin-tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          <AlertTriangle size={18} /> Emergency Requests ({requests.length})
        </button>

        <button
          className={`admin-tab-btn ${activeTab === 'donors' ? 'active' : ''}`}
          onClick={() => setActiveTab('donors')}
        >
          <Users size={18} /> Donor Directory ({donors.length})
        </button>

        <button
          className={`admin-tab-btn ${activeTab === 'camps' ? 'active' : ''}`}
          onClick={() => setActiveTab('camps')}
        >
          <Calendar size={18} /> Add New Blood Camp
        </button>
      </div>

      {/* TAB CONTENT: INVENTORY ADJUSTER */}
      {activeTab === 'inventory' && (
        <div className="admin-tab-panel">
          <div className="panel-header">
            <h3>Blood Reserve Units Adjuster</h3>
            <p>Update physical stock units directly after laboratory cross-matching or hospital dispatch.</p>
          </div>

          <div className="admin-inventory-grid">
            {bloodGroups.map(bg => {
              const count = inventory[bg] || 0;
              return (
                <div key={bg} className="admin-stock-adjust-card">
                  <div className="stock-group-badge">{bg}</div>
                  <div className="stock-control-cluster">
                    <button
                      className="btn-stock-adjust btn-decrement"
                      onClick={() => handleAdjustStock(bg, -1)}
                      title="Deduct 1 unit"
                    >
                      <Minus size={18} />
                    </button>

                    <div className="stock-digit-box">
                      <span className="stock-digit">{count}</span>
                      <small>Units</small>
                    </div>

                    <button
                      className="btn-stock-adjust btn-increment"
                      onClick={() => handleAdjustStock(bg, 1)}
                      title="Add 1 unit"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  <div className="stock-quick-actions">
                    <button
                      className="btn-tiny-add"
                      onClick={() => handleAdjustStock(bg, 5)}
                    >
                      +5 Units
                    </button>
                    <button
                      className="btn-tiny-add"
                      onClick={() => handleAdjustStock(bg, 10)}
                    >
                      +10 Units
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: PATIENT REQUESTS QUEUE */}
      {activeTab === 'requests' && (
        <div className="admin-tab-panel">
          <div className="panel-header">
            <h3>Hospital Requisitions & Patient Pipeline</h3>
            <p>Review submitted patient blood requisitions and coordinate dispatches.</p>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Req ID</th>
                  <th>Patient</th>
                  <th>Group</th>
                  <th>Units</th>
                  <th>Urgency</th>
                  <th>Hospital & City</th>
                  <th>Attender Phone</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req.id}>
                    <td><strong>#{req.id}</strong></td>
                    <td>{req.patientName}</td>
                    <td>
                      <span className="table-blood-pill">{req.bloodGroup}</span>
                    </td>
                    <td>{req.unitsRequired} Units</td>
                    <td>
                      <span className={`urgency-pill urgency-${req.urgency.toLowerCase()}`}>
                        {req.urgency}
                      </span>
                    </td>
                    <td>{req.hospitalName}, {req.city}</td>
                    <td>
                      <a href={`tel:${req.phone}`} className="table-phone-link">
                        <Phone size={14} /> {req.phone}
                      </a>
                    </td>
                    <td>
                      <span className="status-cell-badge">{req.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: DONORS DIRECTORY */}
      {activeTab === 'donors' && (
        <div className="admin-tab-panel">
          <div className="panel-header">
            <h3>Registered Voluntary Donors Registry</h3>
            <p>Direct lookup for all registered life-savers across cities.</p>
          </div>

          <div className="donor-filter-bar">
            <div className="search-box">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search donor name, city, or ID..."
                value={donorSearch}
                onChange={(e) => setDonorSearch(e.target.value)}
              />
            </div>

            <select
              value={selectedGroupFilter}
              onChange={(e) => setSelectedGroupFilter(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Blood Groups</option>
              {bloodGroups.map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Donor ID</th>
                  <th>Full Name</th>
                  <th>Blood Group</th>
                  <th>Age / Weight</th>
                  <th>City</th>
                  <th>Phone</th>
                  <th>Tier Badge</th>
                  <th>Donation History</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonors.map(d => (
                  <tr key={d.id}>
                    <td><strong>{d.id}</strong></td>
                    <td>{d.fullName}</td>
                    <td>
                      <span className="table-blood-pill">{d.bloodGroup}</span>
                    </td>
                    <td>{d.age} yrs / {d.weight} kg</td>
                    <td>{d.city || 'Not provided'}</td>
                    <td>
                      <a href={`tel:${d.phone}`} className="table-phone-link">
                        <Phone size={14} /> {d.phone}
                      </a>
                    </td>
                    <td>
                      <span className="tier-tag">{d.badge || 'Silver Lifesaver'}</span>
                    </td>
                    <td>{d.donationsCount || 1} Donations</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PUBLISH NEW CAMP */}
      {activeTab === 'camps' && (
        <div className="admin-tab-panel">
          <div className="panel-header">
            <h3>Publish A New Mobile Donation Drive</h3>
            <p>Schedule an upcoming blood donation camp for community participation.</p>
          </div>

          <form onSubmit={handleAddCamp} className="camp-publish-form">
            <div className="form-grid-2">
              <div className="form-field">
                <label>Camp Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. City Tech Park Mega Drive 2026"
                  value={newCamp.title}
                  onChange={(e) => setNewCamp({ ...newCamp, title: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label>Organizer Organization *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Red Cross Chapter / Rotary Club"
                  value={newCamp.organizer}
                  onChange={(e) => setNewCamp({ ...newCamp, organizer: e.target.value })}
                />
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-field">
                <label>Camp Date *</label>
                <input
                  type="date"
                  required
                  value={newCamp.date}
                  onChange={(e) => setNewCamp({ ...newCamp, date: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label>Timings *</label>
                <input
                  type="text"
                  required
                  placeholder="09:00 AM - 03:00 PM"
                  value={newCamp.time}
                  onChange={(e) => setNewCamp({ ...newCamp, time: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label>Expected Donors Goal</label>
                <input
                  type="number"
                  placeholder="100"
                  value={newCamp.expectedDonors}
                  onChange={(e) => setNewCamp({ ...newCamp, expectedDonors: e.target.value })}
                />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-field">
                <label>Full Venue Address *</label>
                <input
                  type="text"
                  required
                  placeholder="Building, Street, Landmark"
                  value={newCamp.venue}
                  onChange={(e) => setNewCamp({ ...newCamp, venue: e.target.value })}
                />
              </div>

              <div className="form-field">
                <label>City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bangalore"
                  value={newCamp.city}
                  onChange={(e) => setNewCamp({ ...newCamp, city: e.target.value })}
                />
              </div>
            </div>

            <div className="form-field">
              <label>Organizer Helpline Contact</label>
              <input
                type="text"
                placeholder="+91 9876543210"
                value={newCamp.contact}
                onChange={(e) => setNewCamp({ ...newCamp, contact: e.target.value })}
              />
            </div>

            <div className="form-submit-row">
              <button type="submit" className="btn-primary">
                <Send size={16} /> Publish Camp to Portal
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
