import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useEffect } from "react";
import SetTitleAndDescription from "../functions/SetTitleAndDescription";
import RemoveCanonical from "../functions/RemoveCanonical";

import { logEvent } from "firebase/analytics";
import { analytics } from "../firebaseConfig";

export default function Information({ isMobile, title, text, description }) {
  useEffect(() => {
    if (analytics != null) {
      logEvent(analytics, "Screen", {
        Screen: title,
        Platform: isMobile ? "Mobile" : "Computer",
      });
    }
    SetTitleAndDescription(title, description, window.location.href);
  }, [title]);

  useEffect(() => {
    RemoveCanonical();
  }, []);
  return (
    <div // Scroll to the top when page loads
      onLoad={() => {
        window.scrollTo(0, 0);
      }}
    >
      <Navbar isMobile={isMobile}></Navbar>
      <div
        style={{ alignItems: "flex-start", paddingLeft: 20, paddingBottom: 40 }}
        className="LargeContainer"
      >
        {/* title and logo */}

        <p
          style={{ paddingLeft: 0, fontWeight: "bold" }}
          className="HeaderText"
        >
          {title}
        </p>
        <div>{text}</div>
      </div>
      <Footer isMobile={isMobile}></Footer>
    </div>
  );
}
