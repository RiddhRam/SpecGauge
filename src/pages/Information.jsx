import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { useEffect } from "react";
import SetTitleAndDescription from "../functions/SetTitleAndDescription";
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
    SetTitleAndDescription(title, description);
  }, [title]);
  return (
    <>
      <Navbar isMobile={isMobile} page="aboutus"></Navbar>
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
    </>
  );
}
