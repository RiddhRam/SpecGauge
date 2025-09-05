import InstagramLogo from "../assets/instagram icon.webp";
import TikTokLogo from "../assets/tiktok icon.webp";
import YouTubeLogo from "../assets/youtube icon.webp";

import { Link } from "react-router-dom";

export const Footer = ({ isMobile }) => {
  return (
    <div
      className="ReverseBackground"
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "10px 10px",
      }}
    >
      <div
        className="ReverseBackground"
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "30px" : "60px",
          alignItems: isMobile ? "center" : "flex-start",
          paddingLeft: "10px",
        }}
      >
        {/* Social Media Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", justifyContent: "center" }}>
          <h3
            className="ReversePlainText"
            style={{
              fontSize: isMobile ? 20 : 30,
              userSelect: "none",
              marginBottom: "10px",
              textAlign: "center"
            }}
          >
            Social Media
          </h3>

          {/* Instagram */}
          <Link
            to="https://www.instagram.com/specgauge"
            className="LinkWithImage"
          >
            <img
              src={InstagramLogo}
              alt="Instagram Logo"
              style={{ width: 35, height: 35 }}
            />
            <p className="ReversePlainText" style={{ fontSize: 12 }}>
              SpecGauge
            </p>
          </Link>

          {/* TikTok */}
          <Link
            to="https://www.tiktok.com/@specgauge_official"
            className="LinkWithImage"
          >
            <img
              src={TikTokLogo}
              alt="TikTok Logo"
              style={{ width: 35, height: 35 }}
            />
            <p className="ReversePlainText" style={{ fontSize: 12 }}>
              SpecGauge_Official
            </p>
          </Link>

          {/* YouTube */}
          <Link to="https://www.youtube.com/@SpecGauge" className="LinkWithImage">
            <img
              src={YouTubeLogo}
              alt="YouTube Logo"
              style={{ width: 35, height: 35 }}
            />
            <p className="ReversePlainText" style={{ fontSize: 12 }}>
              SpecGauge
            </p>
          </Link>
        </div>

        {/* Contact Us Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <h3
            className="ReversePlainText"
            style={{
              fontSize: isMobile ? 20 : 30,
              userSelect: "none",
              marginBottom: "10px",
              textAlign: "center"
            }}
          >
            Contact Us
          </h3>

          {/* Email */}
          <a
            href="mailto:SpecGauge@gmail.com"
            style={{
              textDecoration: "none",
              fontSize: isMobile ? 11 : 18,
              userSelect: "none",
              textAlign: "center"
            }}
          >
            Email: SpecGauge@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
};