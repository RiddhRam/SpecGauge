// Firebase
import { initializeApp } from "firebase/app";
import { browserLocalPersistence, initializeAuth } from "firebase/auth";
//import { getFirestore } from "firebase/firestore";

import { getAnalytics, isSupported } from "firebase/analytics";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyA10cNsdHKS-hVwScviUKrmcXbduduTFVA",
  authDomain: "specgauge-6226e.firebaseapp.com",
  projectId: "specgauge-6226e",
  storageBucket: "specgauge-6226e.appspot.com",
  messagingSenderId: "497900705831",
  appId: "1:497900705831:web:632c2bfe74cb3f98ea9602",
  measurementId: "G-HERKE02P50",
};

// Initialize firebase
const app = initializeApp(firebaseConfig);
//connectFunctionsEmulator(functions, "127.0.0.1", 5001);
//const db = getFirestore();

const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
});

let analytics = null;

const analyticsSettings = import.meta.env.VITE_REACT_APP_DISABLE_ANALYTICS;
if (analyticsSettings !== "true") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics();
    }
  });
}

const functions = getFunctions();

export { app, auth, analytics, functions };
