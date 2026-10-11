import { collection, getDocs, addDoc, doc, setDoc } from 'firebase/firestore';
import { db, isFirebaseInitialized } from './firebase';
import {
  INITIAL_INVENTORY,
  INITIAL_DONORS,
  INITIAL_REQUESTS,
  INITIAL_CAMPS,
  BLOOD_GROUPS
} from '../data/mockData';

const STORAGE_KEYS = {
  INVENTORY: 'bdp_inventory_v2',
  DONORS: 'bdp_donors_v2',
  REQUESTS: 'bdp_requests_v2',
  CAMPS: 'bdp_camps_v2'
};

const getLocal = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const setLocal = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error('Local storage write error:', err);
  }
};

export const dataService = {
  // --- INVENTORY ---
  async getInventory() {
    let localInv = getLocal(STORAGE_KEYS.INVENTORY, null);
    if (!localInv) {
      localInv = { ...INITIAL_INVENTORY };
      setLocal(STORAGE_KEYS.INVENTORY, localInv);
    }

    if (!isFirebaseInitialized || !db) {
      return localInv;
    }

    try {
      const snap = await getDocs(collection(db, 'bloodInventory'));
      if (snap.empty) {
        return localInv;
      }
      
      const inventory = {};
      BLOOD_GROUPS.forEach(bg => { inventory[bg] = 0; });
      
      snap.forEach(d => {
        const data = d.data();
        if (data.bloodGroup && BLOOD_GROUPS.includes(data.bloodGroup)) {
          inventory[data.bloodGroup] = (inventory[data.bloodGroup] || 0) + (Number(data.units) || 1);
        }
      });
      
      // Combine with local buffer for any items
      setLocal(STORAGE_KEYS.INVENTORY, inventory);
      return inventory;
    } catch (err) {
      console.warn('Firestore inventory fetch failed, using local repository:', err.message);
      return localInv;
    }
  },

  async updateInventoryCount(bloodGroup, newCount) {
    const current = await this.getInventory();
    const updated = { ...current, [bloodGroup]: Math.max(0, Number(newCount)) };
    setLocal(STORAGE_KEYS.INVENTORY, updated);

    if (isFirebaseInitialized && db) {
      try {
        // Record inventory snapshot in Firestore
        await setDoc(doc(db, 'bloodInventorySummary', bloodGroup), {
          bloodGroup,
          units: updated[bloodGroup],
          updatedAt: new Date().toISOString()
        });
      } catch (e) {
        console.warn('Firestore inventory summary sync failed:', e.message);
      }
    }
    return updated;
  },

  // --- DONORS ---
  async getDonors() {
    let localDonors = getLocal(STORAGE_KEYS.DONORS, null);
    if (!localDonors) {
      localDonors = [...INITIAL_DONORS];
      setLocal(STORAGE_KEYS.DONORS, localDonors);
    }

    if (!isFirebaseInitialized || !db) {
      return localDonors;
    }

    try {
      const snap = await getDocs(collection(db, 'donors'));
      if (snap.empty) {
        return localDonors;
      }
      const remoteDonors = [];
      snap.forEach(d => {
        remoteDonors.push({ id: d.id, ...d.data() });
      });
      setLocal(STORAGE_KEYS.DONORS, remoteDonors);
      return remoteDonors;
    } catch (err) {
      console.warn('Firestore donors fetch failed, using local repository:', err.message);
      return localDonors;
    }
  },

  async registerDonor(donorData) {
    const newId = `DON-${Date.now().toString().slice(-4)}`;
    const fullDonor = {
      id: newId,
      ...donorData,
      donationsCount: 1,
      lastDonationDate: new Date().toISOString().split('T')[0],
      registrationDate: new Date().toISOString(),
      status: 'Eligible',
      badge: 'Silver Lifesaver'
    };

    // Save locally
    const currentDonors = await this.getDonors();
    const updated = [fullDonor, ...currentDonors];
    setLocal(STORAGE_KEYS.DONORS, updated);

    // Increment inventory unit for donor's group
    const inventory = await this.getInventory();
    const currentUnits = inventory[donorData.bloodGroup] || 0;
    await this.updateInventoryCount(donorData.bloodGroup, currentUnits + 1);

    // Sync with Firestore if available
    if (isFirebaseInitialized && db) {
      try {
        const docRef = await addDoc(collection(db, 'donors'), fullDonor);
        fullDonor.firestoreId = docRef.id;

        await addDoc(collection(db, 'bloodInventory'), {
          bloodGroup: donorData.bloodGroup,
          donorName: donorData.fullName,
          donorId: newId,
          donationDate: new Date().toISOString(),
          units: 1,
          status: 'available'
        });
      } catch (err) {
        console.warn('Firestore donor registration sync failed, saved locally:', err.message);
      }
    }

    return fullDonor;
  },

  // --- EMERGENCY REQUESTS ---
  async getRequests() {
    let localReq = getLocal(STORAGE_KEYS.REQUESTS, null);
    if (!localReq) {
      localReq = [...INITIAL_REQUESTS];
      setLocal(STORAGE_KEYS.REQUESTS, localReq);
    }

    if (!isFirebaseInitialized || !db) {
      return localReq;
    }

    try {
      const snap = await getDocs(collection(db, 'bloodRequests'));
      if (snap.empty) return localReq;
      const remote = [];
      snap.forEach(d => remote.push({ id: d.id, ...d.data() }));
      setLocal(STORAGE_KEYS.REQUESTS, remote);
      return remote;
    } catch (err) {
      console.warn('Firestore requests fetch fallback to local:', err.message);
      return localReq;
    }
  },

  async createRequest(reqData) {
    const newId = `REQ-${Date.now().toString().slice(-4)}`;
    const newRequest = {
      id: newId,
      ...reqData,
      status: 'Urgent Need',
      createdAt: new Date().toISOString(),
      pledges: 0
    };

    const currentReqs = await this.getRequests();
    const updated = [newRequest, ...currentReqs];
    setLocal(STORAGE_KEYS.REQUESTS, updated);

    if (isFirebaseInitialized && db) {
      try {
        await addDoc(collection(db, 'bloodRequests'), newRequest);
      } catch (err) {
        console.warn('Firestore request creation sync warning:', err.message);
      }
    }

    return newRequest;
  },

  async pledgeDonation(requestId, pledgerInfo = {}) {
    const list = await this.getRequests();
    const updated = list.map(item => {
      if (item.id === requestId) {
        const nextPledges = (item.pledges || 0) + 1;
        const newStatus = nextPledges >= (item.unitsRequired || 1) ? 'Fulfilled' : 'Matching';
        const recentPledgers = [...(item.recentPledgers || []), { ...pledgerInfo, pledgedAt: new Date().toISOString() }];
        return { ...item, pledges: nextPledges, status: newStatus, recentPledgers };
      }
      return item;
    });
    setLocal(STORAGE_KEYS.REQUESTS, updated);
    return updated;
  },

  // --- DONATION CAMPS ---
  async getCamps() {
    let camps = getLocal(STORAGE_KEYS.CAMPS, null);
    if (!camps) {
      camps = [...INITIAL_CAMPS];
      setLocal(STORAGE_KEYS.CAMPS, camps);
    }
    return camps;
  },

  async registerCampParticipant(campId, participantInfo = {}) {
    const camps = await this.getCamps();
    const updated = camps.map(c => {
      if (c.id === campId) {
        const participants = [...(c.participants || []), { ...participantInfo, registeredAt: new Date().toISOString() }];
        return {
          ...c,
          registeredCount: (c.registeredCount || 0) + 1,
          participants
        };
      }
      return c;
    });
    setLocal(STORAGE_KEYS.CAMPS, updated);
    return updated;
  },

  async addCamp(campData) {
    const newId = `CAMP-${Date.now().toString().slice(-3)}`;
    const camp = {
      id: newId,
      ...campData,
      registeredCount: 0,
      status: 'Upcoming'
    };
    const camps = await this.getCamps();
    const updated = [camp, ...camps];
    setLocal(STORAGE_KEYS.CAMPS, updated);
    return camp;
  }
};
