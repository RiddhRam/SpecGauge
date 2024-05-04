// Bootstrap design
import "bootstrap/dist/css/bootstrap.css";
import WebDefaultPage from "./components/WebDefaultPage";
import WebHome from "./components/WebHome";
import NoPage from "./components/NoPage";
//import WebSearch from "./components/WebSearch";
//import WebLogIn from "./components/accounts/WebLogIn";
//import WebUserAccount from "./components/accounts/WebUserAccount";

import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import * as amplitude from "@amplitude/analytics-react-native";

// Firebase
import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  initializeAuth,
  onAuthStateChanged,
} from "firebase/auth";
import { getFunctions } from "firebase/functions";

/*amplitude.init("2f7a0b5502e80160174b1723e01a117d", null, {
  logLevel: amplitude.Types.LogLevel.None,
});*/

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
const functions = getFunctions();
//connectFunctionsEmulator(functions, "127.0.0.1", 5001);

const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
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
          element={
            <WebHome
              userVal={userVal}
              functions={functions}
              amplitude={amplitude}
            ></WebHome>
          }
        ></Route>
        {/* the home page */}
        <Route path="*" element={<NoPage></NoPage>}></Route>
        {/* any other page, go to home */}
      </Routes>
    </BrowserRouter>
  );
}
