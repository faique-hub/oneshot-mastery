import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC9D9Ag1lDYrzPfpkAuS6yV7VuPiSI9zT8",
  authDomain: "one-shot-mastery.firebaseapp.com",
  projectId: "one-shot-mastery",
  storageBucket: "one-shot-mastery.firebasestorage.app",
  messagingSenderId: "27279348304",
  appId: "1:27279348304:web:505be12e56a163dc6eb755"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

window.downloadWithGoogleSignIn = async function (pdfPath) {
  try {

    // User login nahi hai to Google Sign-In kholo
    if (!auth.currentUser) {
      await signInWithPopup(auth, provider);
    }

    // Login successful hone ke baad PDF download
    const link = document.createElement("a");
    link.href = pdfPath;
    link.download = "";

    document.body.appendChild(link);
    link.click();
    link.remove();

  } catch (error) {
    console.error("Google Sign-In Error:", error);

    alert(
      "Sign-In Error:\n" +
      error.code +
      "\n\n" +
      error.message
   );
  }
};