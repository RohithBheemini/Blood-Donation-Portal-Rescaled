
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
const firebaseConfig = {
   apiKey: "AIzaSyAU0_AHcyiIDEkXlZ9DkUOA_km4OS4flFw",
  authDomain: "blood-donation-managemen-fd4dc.firebaseapp.com",
  projectId: "blood-donation-managemen-fd4dc",
  storageBucket: "blood-donation-managemen-fd4dc.firebasestorage.app",
  messagingSenderId: "1001045922127",
  appId: "1:1001045922127:web:223230d1c5635ab0f5353a",
  measurementId: "G-23KKVLWWQ4"
};
const app = initializeApp(firebaseConfig);
const db=getFirestore(app);
export{db}
