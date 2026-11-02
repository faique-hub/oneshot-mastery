
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-analytics.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9D9Agl1DYrzPfpkAuS6yV7VuPiSI9zT8",
  authDomain: "one-shot-mastery.firebaseapp.com",
  projectId: "one-shot-mastery",
  storageBucket: "one-shot-mastery.firebasestorage.app",
  messagingSenderId: "27279348304",
  appId: "1:27279348304:web:505be12e56a163dc6eb755",
  measurementId: "G-NBJFK92NFP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Analytics (Active)
const analytics = getAnalytics(app);

// Direct PDF Download (No Sign-In Required)
window.downloadWithGoogleSignIn = function (pdfPath) {
  try {
    const link = document.createElement("a");
    link.href = pdfPath;
    link.download = "";

    document.body.appendChild(link);
    link.click();
    link.remove();

  } catch (error) {
    console.error("PDF Download Error:", error);
    alert("PDF download failed. Please try again.");
  }
};
