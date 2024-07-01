import InstagramLogo from "../assets/instagram icon.webp";
import TikTokLogo from "../assets/tiktok icon.webp";
import XLogo from "../assets/x icon.webp";

export const Footer = ({ isMobile }) => {
  return (
    <div
      className="ReverseBackground"
      style={{
        display: "flex",
        justifyContent: "space-around",
      }}
    >
      {/* Social Media */}
      <div style={{ display: "inline" }}>
        <h3
          className="ReversePlainText"
          style={{
            fontSize: isMobile ? 20 : 30,
            userSelect: "none",
            marginLeft: isMobile ? 15 : 0,
          }}
        >
          Social Media
        </h3>

        {/* Instagram */}
        <a
          href={`https://www.instagram.com/specgauge`}
          target="_blank"
          className="LinkWithImage"
          style={{ marginTop: -8 }}
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
      </div>
      {/* Contact Us */}
      <div style={{ justifyContent: "center" }}>
        <h3
          className="ReversePlainText"
          style={{
            fontSize: isMobile ? 20 : 30,
            userSelect: "none",
            marginLeft: isMobile ? 25 : -8,
          }}
        >
          Contact Us
        </h3>

        {/* Email*/}
        <a
          href="mailto:SpecGauge@gmail.com?subject=Hello&body=I%20wanted%20to%20reach%20out%20because..."
          style={{
            textDecoration: "none",
            fontSize: isMobile ? 12 : 20,
            userSelect: "none",
            marginLeft: isMobile ? 15 : 0,
          }}
        >
          Email: SpecGauge@gmail.com
        </a>
      </div>
      {/* Information */}
      {/*}
      <div style={{ display: "block" }}>
        <h3
          className="ReversePlainText"
          style={{
            fontSize: isMobile ? 20 : 30,
            userSelect: "none",
            marginLeft: isMobile ? 15 : 0,
          }}
        >
          Social Media
        </h3>

        /* Instagram *;/
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
          <p
            className="ReversePlainText"
            style={{ fontSize: 12, marginTop: 8 }}
          >
            SpecGauge
          </p>
        </a>

        /* TikTok *;/
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
          <p
            className="ReversePlainText"
            style={{ fontSize: 12, marginTop: 8 }}
          >
            SpecGauge_Official
          </p>
        </a>
        {/* X *;/}
        <a
          href={`https://twitter.com/SpecGauge`}
          target="_blank"
          className="LinkWithImage"
        >
          <img src={XLogo} alt="X Logo" style={{ width: 35, height: 35 }}></img>
          <p
            className="ReversePlainText"
            style={{ fontSize: 12, marginTop: 8 }}
          >
            SpecGauge
          </p>
        </a>
      </div>
      */}
    </div>
  );
};
