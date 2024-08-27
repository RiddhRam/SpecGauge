import InstagramLogo from "../assets/instagram icon.webp";
import TikTokLogo from "../assets/tiktok icon.webp";
import YouTubeLogo from "../assets/youtube icon.webp";

import { Link, useNavigate } from "react-router-dom";

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
          display: "grid",
          gridTemplateColumns: `repeat(2, 1fr)`,
          gridTemplateRows: `65px 50px 50px 50px 65px 50px 50px 50px`,
          columnGap: "60px",
          rowGap: "3px",
          gridAutoFlow: "column",
          paddingRight: "10px",
          paddingLeft: "10px",
        }}
      >
        {/* Column 1 */}

        {/* Social Media */}
        <h3
          className="ReversePlainText"
          style={{
            fontSize: isMobile ? 20 : 30,
            userSelect: "none",
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
          ></img>
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
          ></img>
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
          ></img>
          <p className="ReversePlainText" style={{ fontSize: 12 }}>
            SpecGauge
          </p>
        </Link>

        {/* Information */}
        <h3
          className="ReversePlainText"
          style={{
            fontSize: isMobile ? 20 : 30,
            userSelect: "none",
          }}
        >
          Information
        </h3>

        {/* About us */}
        <Link to="/aboutus" className="LinkWithImage">
          <p className="ReversePlainText" style={{ fontSize: 14 }}>
            About Us
          </p>
        </Link>

        {/* Terms of Service */}
        <Link to="/termsofservice" className="LinkWithImage">
          <p className="ReversePlainText" style={{ fontSize: 14 }}>
            Terms of Service
          </p>
        </Link>

        {/* Privacy Policy */}
        <Link to="/privacypolicy" className="LinkWithImage">
          <p className="ReversePlainText" style={{ fontSize: 14 }}>
            Privacy Policy
          </p>
        </Link>

        {/* Column 2*/}

        {/* Contact Us */}
        <h3
          className="ReversePlainText"
          style={{
            fontSize: isMobile ? 20 : 30,
            userSelect: "none",
          }}
        >
          Contact Us
        </h3>

        {/* Email */}
        <a
          href="mailto:SpecGauge@gmail.com"
          style={{
            textDecoration: "none",
            fontSize: isMobile ? 13 : 20,
            userSelect: "none",
            marginTop: 15,
          }}
        >
          Email: SpecGauge@gmail.com
        </a>
      </div>
    </div>
  );
};
