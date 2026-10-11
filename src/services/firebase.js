import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAU0_AHcyiIDEkXlZ9DkUOA_km4OS4flFw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "blood-donation-managemen-fd4dc.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "blood-donation-managemen-fd4dc",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "blood-donation-managemen-fd4dc.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1001045922127",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1001045922127:web:223230d1c5635ab0f5353a",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-23KKVLWWQ4"
};

let app = null;
let db = null;
let isFirebaseInitialized = false;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db = getFirestore(app);
  isFirebaseInitialized = true;
} catch (error) {
  console.warn("Firebase initialization warning (switching to offline repository mode):", error.message);
}

export { app, db, isFirebaseInitialized };
