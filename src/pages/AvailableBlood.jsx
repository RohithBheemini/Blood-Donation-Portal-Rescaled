import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';

const AvailableBlood = () => {
  const [bloodInventory, setBloodInventory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const fetchBloodInventory = async () => {
    try {
      setLoading(true);
      setError('');
      
      const inventory = {};
      
      // Initialize all blood groups with 0 units
      bloodGroups.forEach(group => {
        inventory[group] = 0;
      });

      // Fetch all blood inventory documents
      const allDocsSnapshot = await getDocs(collection(db, 'bloodInventory'));
      console.log('Total documents in bloodInventory collection:', allDocsSnapshot.size);
      
      let availableCount = 0;
      allDocsSnapshot.forEach((doc) => {
        const data = doc.data();
        
        if (data.status === 'available' && bloodGroups.includes(data.bloodGroup)) {
          availableCount++;
          inventory[data.bloodGroup] += data.units || 1;
        }
      });
      
      console.log('Available documents found:', availableCount);
      console.log('Final inventory:', inventory);

      setBloodInventory(inventory);
      setLastUpdated(new Date());
      
    } catch (err) {
      console.error('Error fetching blood inventory:', err);
      setError(`Failed to fetch blood inventory: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Load data only once on component mount
  useEffect(() => {
    fetchBloodInventory();
  }, []); // Empty dependency array - only run once

  const getCardClass = (units) => {
    if (units === 0) return 'blood-card unavailable';
    if (units <= 2) return 'blood-card low-stock';
    if (units <= 5) return 'blood-card medium-stock';
    return 'blood-card high-stock';
  };

  const getStatusText = (units) => {
    if (units === 0) return 'Not Available';
    if (units <= 2) return 'Low Stock';
    if (units <= 5) return 'Medium Stock';
    return 'Good Stock';
  };

  const refreshInventory = () => {
    console.log('Manual refresh triggered');
    fetchBloodInventory();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading blood inventory...</p>
      </div>
    );
  }

  return (
    <div className="available-blood-container">
      <div className="blood-header">
        <h2>Available Blood Inventory</h2>
        <button onClick={refreshInventory} className="refresh-btn">
          🔄 Refresh Inventory
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="blood-grid">
        {bloodGroups.map((bloodGroup) => {
          const units = bloodInventory[bloodGroup] || 0;
          return (
            <div key={bloodGroup} className={getCardClass(units)}>
              <div className="blood-card-header">
                <h3 className="blood-group">{bloodGroup}</h3>
                <div className="blood-icon">🩸</div>
              </div>
              
              <div className="blood-card-body">
                <div className="units-display">
                  <span className="units-number">{units}</span>
                  <span className="units-label">Units Available</span>
                </div>
                
                <div className="status-indicator">
                  <span className={`status-text ${units === 0 ? 'unavailable' : units <= 2 ? 'low' : units <= 5 ? 'medium' : 'high'}`}>
                    {getStatusText(units)}
                  </span>
                </div>
              </div>

              <div className="blood-card-footer">
                <small>Last updated: {lastUpdated.toLocaleTimeString()}</small>
              </div>
            </div>
          );
        })}
      </div>

      <div className="inventory-summary">
        <h3>Inventory Summary</h3>
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-label">Total Units:</span>
            <span className="stat-value">
              {Object.values(bloodInventory).reduce((total, units) => total + units, 0)}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Available Groups:</span>
            <span className="stat-value">
              {Object.values(bloodInventory).filter(units => units > 0).length}/8
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Low Stock Groups:</span>
            <span className="stat-value">
              {Object.values(bloodInventory).filter(units => units > 0 && units <= 2).length}
            </span>
          </div>
        </div>
      </div>

      <div className="legend">
        <h4>Stock Levels</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-color unavailable"></div>
            <span>Not Available (0 units)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color low-stock"></div>
            <span>Low Stock (1-2 units)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color medium-stock"></div>
            <span>Medium Stock (3-5 units)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color high-stock"></div>
            <span>Good Stock (6+ units)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailableBlood;
