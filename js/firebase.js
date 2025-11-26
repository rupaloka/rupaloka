// firebase.js — VERSI COMPAT (WAJIB untuk kode lama yang sudah saya kasih)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js";

// Config kamu (sudah benar)
const firebaseConfig = {
  apiKey: "AIzaSyBiE0oYuXiPNJKC4p7PtfkFeI0sci3BdgI",
  authDomain: "rupaloka-keuangan.firebaseapp.com",
  projectId: "rupaloka-keuangan",
  storageBucket: "rupaloka-keuangan.firebasestorage.app",
  messagingSenderId: "740474161638",
  appId: "1:740474161638:web:1b1a62ad204085a8226e27"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Ini yang bikin semua kode lama jalan
const db = firebase.firestore();

console.log("Firebase berhasil diinisialisasi!");
