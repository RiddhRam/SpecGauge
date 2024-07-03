import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import WebAccountHandler from "../components/WebAccountHandler";
import SetTitleAndDescription from "../functions/SetTitleAndDescription";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { getAuth } from "firebase/auth";

export default function WebLogIn({ amplitude, isMobile }) {
  // Initialize useNavigate as navigate
  const navigate = useNavigate();

  const auth = getAuth();

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
    amplitude.track("Screen", { Screen: "Log In" });
    SetTitleAndDescription(
      "SpecGauge | Sign up or Log in",
      "Create an account to save comparisons across all your devices."
    );
  }, []);

  return (
    <>
      {/* navbar */}
      <Navbar page={"login"} amplitude={amplitude} />

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

      <Footer amplitude={amplitude} isMobile={isMobile} />
    </>
  );
}
