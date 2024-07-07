import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import SpecGaugeLogo from "../assets/SpecGauge SEO Logo.webp";
import { useEffect } from "react";
import SetTitleAndDescription from "../functions/SetTitleAndDescription";

export default function NoPage({ isMobile }) {
  // Initialize useNavigate as navigate
  const navigate = useNavigate();

  useEffect(() => {
    SetTitleAndDescription(
      "Error 404: Page not found",
      "Error 404: Page not found."
    );
  });

  return (
    <>
      <Navbar isMobile={isMobile} page="nopage"></Navbar>
      <div className="LargeContainer">
        {/* title and logo */}
        <div
          style={{
            alignItems: "center",
            display: "flex",
          }}
        >
          <img
            src={SpecGaugeLogo}
            alt="SpecGauge Logo"
            style={{
              imageRendering: "crisp-edges",
              objectFit: "contain",
              width: "50px",
            }}
          ></img>

          <h1 id="LogoText">SpecGauge</h1>
        </div>
        <p className="ErrorText">Error 404: Page not found</p>
        <button
          className="NormalButton"
          onClick={() => {
            navigate("/home");
            // send user to home page
          }}
        >
          Go to home page
        </button>
      </div>
      <Footer isMobile={isMobile}></Footer>
    </>
  );
}
