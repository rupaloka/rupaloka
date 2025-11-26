// firebase.js — Versi Modular V10 (2025 stable, no compat issues)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, where, doc, deleteDoc, onSnapshot, updateDoc } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyBiE0oYuXiPNJKC4p7PtfkFeI0sci3BdgI",
  authDomain: "rupaloka-keuangan.firebaseapp.com",
  projectId: "rupaloka-keuangan",
  storageBucket: "rupaloka-keuangan.firebasestorage.app",
  messagingSenderId: "740474161638",
  appId: "1:740474161638:web:1b1a62ad204085a8226e27"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("Firebase Modular V10 siap!");
export { db, collection, addDoc, getDocs, query, orderBy, where, doc, deleteDoc, onSnapshot, updateDoc };
