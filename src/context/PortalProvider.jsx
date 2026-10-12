import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { PortalContext } from './PortalContext';
import { dataService } from '../services/dataService';
import { BLOOD_GROUPS, BLOOD_COMPATIBILITY } from '../data/mockData';

export const PortalProvider = ({ children }) => {
  const [inventory, setInventory] = useState({});
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [invData, donorData, reqData, campData] = await Promise.all([
        dataService.getInventory(),
        dataService.getDonors(),
        dataService.getRequests(),
        dataService.getCamps()
      ]);
      setInventory(invData);
      setDonors(donorData);
      setRequests(reqData);
      setCamps(campData);
    } catch (err) {
      console.error('Portal context loading failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Show SweetAlert toast helper
  const notify = (icon, title, text) => {
    return Swal.fire({
      icon,
      title,
      text,
      confirmButtonColor: '#dc2626'
    });
  };

  const notifyToast = (icon, title) => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
    Toast.fire({
      icon,
      title
    });
  };

  // Donor Registration
  const registerNewDonor = async (formData) => {
    try {
      const createdDonor = await dataService.registerDonor(formData);
      setDonors(prev => [createdDonor, ...prev]);
      setInventory(prev => ({
        ...prev,
        [formData.bloodGroup]: (prev[formData.bloodGroup] || 0) + 1
      }));
      return createdDonor;
    } catch (err) {
      console.error('Registration failed:', err);
      throw err;
    }
  };

  // Create Blood Request
  const createBloodRequest = async (requestData) => {
    try {
      const created = await dataService.createRequest(requestData);
      setRequests(prev => [created, ...prev]);
      return created;
    } catch (err) {
      console.error('Request creation error:', err);
      throw err;
    }
  };

  // Pledge blood for request
  const pledgeForRequest = async (requestId, pledgerName) => {
    try {
      const updated = await dataService.pledgeDonation(requestId, { pledgerName });
      setRequests(updated);
      notifyToast('success', 'Thank you! Your donation pledge was recorded.');
      return true;
    } catch (err) {
      notify('error', 'Pledge failed', err.message);
      return false;
    }
  };

  // Update Inventory Units (Admin)
  const setInventoryUnits = async (bloodGroup, count) => {
    try {
      const updated = await dataService.updateInventoryCount(bloodGroup, count);
      setInventory(updated);
      notifyToast('success', `${bloodGroup} inventory updated to ${count} units`);
    } catch (err) {
      notify('error', 'Update Failed', err.message);
    }
  };

  // Register for a donation camp
  const registerForCamp = async (campId, participantInfo) => {
    try {
      const updated = await dataService.registerCampParticipant(campId, participantInfo);
      setCamps(updated);
      notifyToast('success', 'Registered successfully for the blood camp!');
      return true;
    } catch (err) {
      notify('error', 'Camp registration error', err.message);
      return false;
    }
  };

  // Calculate high-level stats
  const totalUnits = Object.values(inventory).reduce((sum, val) => sum + (Number(val) || 0), 0);
  const criticalShortageGroups = BLOOD_GROUPS.filter(bg => (inventory[bg] || 0) <= 2);
  const urgentRequestsCount = requests.filter(r => r.status === 'Urgent Need' || r.urgency === 'CRITICAL').length;

  return (
    <PortalContext.Provider
      value={{
        inventory,
        donors,
        requests,
        camps,
        loading,
        totalUnits,
        criticalShortageGroups,
        urgentRequestsCount,
        refreshData: loadAllData,
        registerNewDonor,
        createBloodRequest,
        pledgeForRequest,
        setInventoryUnits,
        registerForCamp,
        notify,
        notifyToast,
        bloodCompatibility: BLOOD_COMPATIBILITY,
        bloodGroups: BLOOD_GROUPS
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export default PortalProvider;
