import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { useEffect } from "react";
import SetTitleAndDescription from "../functions/SetTitleAndDescription";

export default function Information({
  amplitude,
  isMobile,
  title,
  text,
  description,
}) {
  useEffect(() => {
    amplitude.track("Screen", { Screen: title });
    SetTitleAndDescription(title, description);
  }, [title]);
  return (
    <>
      <Navbar isMobile={isMobile} page="aboutus" amplitude={amplitude}></Navbar>
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
      <Footer amplitude={amplitude} isMobile={isMobile}></Footer>
    </>
  );
}
