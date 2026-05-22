  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBsfydmfracRNsWWnbdXysAqrrxI0qypfg",
    authDomain: "idisc-10f16.firebaseapp.com",
    projectId: "idisc-10f16",
    storageBucket: "idisc-10f16.firebasestorage.app",
    messagingSenderId: "817810918667",
    appId: "1:817810918667:web:28977612a85102e8bda60e",
    measurementId: "G-X2HK2WV0LV"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
export const dbCloud =
    getFirestore(app);

export const auth =
    getAuth(app);