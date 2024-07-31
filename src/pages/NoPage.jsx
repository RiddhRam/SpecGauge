import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import SpecGaugeLogo from "../assets/SpecGauge SEO Logo.webp";
import { useEffect } from "react";
import SetTitleAndDescription from "../functions/SetTitleAndDescription";
import SetCanonical from "../functions/SetCanonical";

export default function NoPage({ isMobile }) {
  // Initialize useNavigate as navigate
  const navigate = useNavigate();

  useEffect(() => {
    SetTitleAndDescription(
      "Error 404: Page not found",
      "Error 404: Page not found.",
      window.location.href
    );
    SetCanonical(window.location.origin + "/404");
  }, []);

  return (
    <div // Scroll to the top when page loads
      onLoad={() => {
        window.scrollTo(0, 0);
      }}
    >
      <Navbar isMobile={isMobile}></Navbar>
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
    </div>
  );
}
