import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Droplet,
  LayoutDashboard,
  Menu,
  X,
  HelpCircle
} from 'lucide-react';
import { usePortal } from '../context/usePortal';
import BloodCompatibilityModal from './BloodCompatibilityModal';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [compatModalOpen, setCompatModalOpen] = useState(false);
  const { urgentRequestsCount } = usePortal();

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header className="app-navbar">
        <div className="nav-container">
          <Link to="/" className="brand-logo" onClick={closeMenu}>
            <div className="brand-icon-wrap">
              <Droplet className="brand-icon" size={28} />
            </div>
            <div className="brand-text">
              <span className="brand-title">BloodLife</span>
              <span className="brand-subtitle">Donation Management Portal</span>
            </div>
          </Link>

          <nav className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Home
            </NavLink>

            <NavLink
              to="/inventory"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Available Blood
            </NavLink>

            <NavLink
              to="/donate"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Donate Blood
            </NavLink>

            <NavLink
              to="/request"
              className={({ isActive }) => `nav-link nav-highlight ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Request Blood
            </NavLink>

            <NavLink
              to="/requests-feed"
              className={({ isActive }) => `nav-link nav-alert-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <span>Emergency Feed</span>
              {urgentRequestsCount > 0 && (
                <span className="nav-badge-pulse">{urgentRequestsCount}</span>
              )}
            </NavLink>

            <NavLink
              to="/camps"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Camps & Drives
            </NavLink>

            <NavLink
              to="/eligibility"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Eligibility
            </NavLink>

            <NavLink
              to="/donor-card"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Donor Card
            </NavLink>

            <NavLink
              to="/admin"
              className={({ isActive }) => `nav-link admin-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <LayoutDashboard size={16} />
              <span>Admin</span>
            </NavLink>

            <button
              className="btn-compat-guide"
              onClick={() => {
                setCompatModalOpen(true);
                closeMenu();
              }}
              title="Compatibility Matrix"
            >
              <HelpCircle size={16} /> Compatibility Guide
            </button>
          </nav>

          <div className="nav-actions">
            <button
              className="mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <BloodCompatibilityModal
        isOpen={compatModalOpen}
        onClose={() => setCompatModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
