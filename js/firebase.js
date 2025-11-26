// firebase.js — Versi 2025 Compat (pasti jalan di GitHub Pages)
const firebaseConfig = {
  apiKey: "AIzaSyBiE0oYuXiPNJKC4p7PtfkFeI0sci3BdgI",
  authDomain: "rupaloka-keuangan.firebaseapp.com",
  projectId: "rupaloka-keuangan",
  storageBucket: "rupaloka-keuangan.firebasestorage.app",
  messagingSenderId: "740474161638",
  appId: "1:740474161638:web:1b1a62ad204085a8226e27"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

console.log("Firebase siap! Versi 10.13.2");
