import InstagramLogo from "../assets/instagram icon.webp";
import TikTokLogo from "../assets/tiktok icon.webp";
import XLogo from "../assets/x icon.webp";

export const Footer = ({ isMobile }) => {
  const currentDomain = window.location.origin;
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
        <a
          href={`https://www.instagram.com/specgauge`}
          target="_blank"
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
        </a>

        {/* TikTok */}
        <a
          href={`https://www.tiktok.com/@specgauge_official`}
          target="_blank"
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
        </a>

        {/* X */}
        <a
          href={`https://twitter.com/SpecGauge`}
          target="_blank"
          className="LinkWithImage"
        >
          <img src={XLogo} alt="X Logo" style={{ width: 35, height: 35 }}></img>
          <p className="ReversePlainText" style={{ fontSize: 12 }}>
            SpecGauge
          </p>
        </a>

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
        <a
          href={`${currentDomain}/aboutus`}
          target="_self"
          style={{
            marginLeft: 10,
          }}
        >
          <p className="ReversePlainText" style={{ fontSize: 14 }}>
            About Us
          </p>
        </a>

        {/* Terms of Service */}
        <a
          href={`${currentDomain}/termsofservice`}
          target="_self"
          style={{
            marginLeft: 10,
          }}
        >
          <p className="ReversePlainText" style={{ fontSize: 14 }}>
            Terms of Service
          </p>
        </a>

        {/* Privacy Policy */}
        <a
          href={`${currentDomain}/privacypolicy`}
          target="_self"
          style={{
            marginLeft: 10,
          }}
        >
          <p className="ReversePlainText" style={{ fontSize: 14 }}>
            Privacy Policy
          </p>
        </a>

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
