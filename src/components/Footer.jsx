import InstagramLogo from "../assets/instagram icon.webp";
import TikTokLogo from "../assets/tiktok icon.webp";
import XLogo from "../assets/x icon.webp";
import { Link } from "react-router-dom";

export const Footer = ({ isMobile }) => {
  return (
    <div
      className="ReverseBackground"
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "10px 0",
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

        {/* X */}
        <Link to="https://twitter.com/SpecGauge" className="LinkWithImage">
          <img src={XLogo} alt="X Logo" style={{ width: 35, height: 35 }}></img>
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
        <Link
          to="/aboutus"
          style={{
            marginLeft: 10,
          }}
        >
          <p className="ReversePlainText" style={{ fontSize: 14 }}>
            About Us
          </p>
        </Link>

        {/* Terms of Service */}
        <Link
          to="/termsofservice"
          style={{
            marginLeft: 10,
          }}
        >
          <p className="ReversePlainText" style={{ fontSize: 14 }}>
            Terms of Service
          </p>
        </Link>

        {/* Privacy Policy */}
        <Link
          to="/privacypolicy"
          style={{
            marginLeft: 10,
          }}
        >
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
          href="mailto:SpecGauge@gmail.com?subject=Hello&body=I%20wanted%20to%20reach%20out%20because..."
          style={{
            textDecoration: "none",
            fontSize: isMobile ? 12 : 20,
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
