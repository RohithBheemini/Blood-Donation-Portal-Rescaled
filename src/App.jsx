import React, { useState } from 'react';
import DonatorRegistration from './pages/DonatorRegistration';
import AvailableBlood from './pages/AvailableBlood';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('available-blood');

  const renderPage = () => {
    switch (currentPage) {
      case 'donator-registration':
        return <DonatorRegistration />;
      case 'available-blood':
        return <AvailableBlood />;
      default:
        return <AvailableBlood />;
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <h1>🩸 Blood Donation Portal</h1>
            <p>Saving Lives, One Donation at a Time</p>
          </div>
          
          <nav className="navigation">
            <button
              className={`nav-btn ${currentPage === 'available-blood' ? 'active' : ''}`}
              onClick={() => setCurrentPage('available-blood')}
            >
              Available Blood
            </button>
            <button
              className={`nav-btn ${currentPage === 'donator-registration' ? 'active' : ''}`}
              onClick={() => setCurrentPage('donator-registration')}
            >
              Register as Donor
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        {renderPage()}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Emergency Contact</h3>
            <p>📞 Emergency Blood Request: 1800-123-4567</p>
            <p>🏥 Hospital Blood Bank: 1800-987-6543</p>
          </div>
          
          <div className="footer-section">
            <h3>Important Information</h3>
            <ul>
              <li>Donor must be 18-65 years old</li>
              <li>Minimum weight: 50 kg</li>
              <li>Gap between donations: 3 months</li>
              <li>Health screening required</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>About Blood Donation</h3>
            <p>Every donation can save up to 3 lives. Be a hero today!</p>
            <div className="social-links">
              <span>Follow us: </span>
              <a href="#" className="social-link">Facebook</a>
              <a href="#" className="social-link">Twitter</a>
              <a href="#" className="social-link">Instagram</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 Blood Donation Portal. All rights reserved.</p>
          <p>Developed with ❤️ for humanity</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
