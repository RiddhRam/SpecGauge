import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import WebAccountHandler from "../components/WebAccountHandler";
import SetTitleAndDescription from "../functions/SetTitleAndDescription";
import RemoveCanonical from "../functions/RemoveCanonical";

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { logEvent } from "firebase/analytics";
import { auth, analytics } from "../firebaseConfig";

export default function WebLogIn({ isMobile }) {
  // Initialize useNavigate as navigate
  const navigate = useNavigate();

  // send user to log in if not logged in
  useEffect(() => {
    // Use a timeout, in case they are logged in but firebase needs to verify
    setTimeout(() => {
      if (auth.currentUser) {
        navigate("/account");
      }
    }, 500);
  });

  useEffect(() => {
    if (analytics != null) {
      logEvent(analytics, "Screen", {
        Screen: "Log In",
        Platform: isMobile ? "Mobile" : "Computer",
      });
    }
    SetTitleAndDescription(
      "SpecGauge | Sign Up or Log In",
      "Create an account to save comparisons across all your devices.",
      window.location.href
    );
    RemoveCanonical();
  }, []);

  return (
    <div // Scroll to the top when page loads
      onLoad={() => {
        window.scrollTo(0, 0);
      }}
    >
      {/* navbar */}
      <Navbar isMobile={isMobile}></Navbar>

      {/* main body */}
      <div className="LargeContainer">
        {/* This is in a seperate component so it can be reused in a mini window too */}
        <WebAccountHandler
          screenType={"tab"}
          isMobile={isMobile}
        ></WebAccountHandler>
        <button
          onClick={() => {
            navigate("/home");
            {
              /* Send user to the home page */
            }
          }}
          className="NormalButtonNoBackground"
          style={{ marginTop: 20 }}
        >
          <p>Continue without an account</p>
        </button>
        {/* If user doesn't want to use an account, only available if on browser or if they don't want to save comparisons */}
      </div>
      <Footer isMobile={isMobile}></Footer>
    </div>
  );
}
