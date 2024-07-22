import { Link } from "react-router-dom";

import SpecGaugeLogo from "../assets/SpecGauge SEO Logo.webp";
import { DropdownMenu } from "./DropdownMenu";

import { auth } from "../firebaseConfig";

export const Navbar = ({ isMobile, page }) => {
  return (
    <div className="NavbarContainer">
      {/* The title and logo */}
      <Link
        style={{
          display: "flex",
          textDecorationLine: "none",
          justifyContent: "center",
          alignItems: "center",
          margin: "0 auto",
        }}
        to="/"
      >
        <img
          src={SpecGaugeLogo}
          alt="SpecGauge Logo"
          style={{
            imageRendering: "crisp-edges",
            objectFit: "contain",
            width: isMobile ? "30px" : "50px",
          }}
        ></img>
        <p
          style={{
            color: "#4ca0d7",
            fontSize: isMobile ? 30 : 40,
            padding: 10,
            textAlign: "center",
          }}
        >
          SpecGauge
        </p>
      </Link>
      {/* The links */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto auto 1fr",
          gridTemplateRows: "65px",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {/* If not on the home page, give user the option to go to home page */}
        {page != "home" ? (
          <Link to="/home" className="NavbarText">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: isMobile ? "13px" : "14px",
              }}
            >
              <p className="NavbarText">Home</p>
            </div>
          </Link>
        ) : (
          // Need this so the navbar doesn't shift when changing screens
          <div></div>
        )}

        <DropdownMenu
          label="Compare"
          menuItems={[
            { label: "Vehicles", path: "/comparison/automobiles" },
            { label: "Consoles", path: "/comparison/consoles" },
            { label: "CPUs", path: "/comparison/cpus" },
            { label: "Graphics Cards", path: "/comparison/graphicsCards" },
            { label: "Drones", path: "/comparison/drones" },
          ]}
        ></DropdownMenu>

        <DropdownMenu
          label="Predict"
          menuItems={[
            { label: "Vehicles", path: "/prediction/automobiles" },
            { label: "CPUs", path: "/prediction/cpus" },
            { label: "Graphics Cards", path: "/prediction/graphicsCards" },
          ]}
        ></DropdownMenu>
        {/* Compare dropdown */}

        {/* If not on an account handling page, give user the option to go to an account handling page */}
        <div style={{ justifySelf: "end" }}>
          {page != "account" && page != "login" ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: isMobile ? "10.5px" : "14px",
              }}
            >
              {auth.currentUser ? (
                /* My Account */
                <Link to="/account" className="NavbarText">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      textAlign: "center",
                      fontSize: isMobile ? "10.5px" : "14px",
                    }}
                  >
                    <p className="NavbarText">My Account</p>
                  </div>
                </Link>
              ) : (
                /* Log In */
                <Link to="/login" className="NavbarText">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      textAlign: "center",
                      fontSize: isMobile ? "13px" : "14px",
                    }}
                  >
                    <p className="NavbarText">Log In</p>
                  </div>
                </Link>
              )}
            </div>
          ) : (
            // Need this so the navbar doesn't shift when changing screens
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};
