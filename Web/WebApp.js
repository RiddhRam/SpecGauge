// Boostrap design
import "bootstrap/dist/css/bootstrap.css";
import WebHome from "./components/WebHome";
import WebLogIn from "./components/WebLogIn";
import WebDefaultPage from "./components/WebDefaultPage";
import NoPage from "./components/NoPage";

import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Firebase
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  onAuthStateChanged,
  browserSessionPersistence,
} from "firebase/auth";

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

const auth = initializeAuth(app, {
  persistence: browserSessionPersistence,
});

export default function WebApp() {
  // userVal of firebase
  const [userVal, setUserVal] = useState(false);

  useEffect(() => {
    // listen for changes (sign in, sign out)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // update userVal upon any change
      setUserVal(user);
    });

    return () => {
      unsubscribe();
    };
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WebDefaultPage></WebDefaultPage>}></Route>
        {/* in case user goes to specgauge.com, instead of specgauge.com/home */}
        <Route
          index
          path="/home"
          element={<WebHome userVal={userVal}></WebHome>}
        ></Route>
        {/* the home page */}
        <Route path="/login" element={<WebLogIn></WebLogIn>}></Route>
        {/* the sign up/log in page */}
        <Route path="*" element={<NoPage></NoPage>}></Route>
        {/* any other page, error 404 */}
      </Routes>
    </BrowserRouter>
  );
}
