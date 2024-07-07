import { Link } from "react-router-dom";
import SpecGaugeLogo from "../assets/SpecGauge SEO Logo.webp";
import HomeIcon from "../assets/Home Icon.webp";
import ProfileIcon from "../assets/Profile Icon.webp";
import { DropdownMenu } from "./DropdownMenu";

import { getAuth } from "firebase/auth";

export const Navbar = ({ isMobile, page }) => {
  const auth = getAuth();

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
            fontSize: isMobile ? 20 : 30,
            padding: 10,
            textAlign: "center",
            fontWeight: "bold",
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
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={HomeIcon}
                alt="Home Icon"
                style={
                  isMobile
                    ? { width: 20, height: 21 }
                    : { width: 25, height: 26 }
                }
              ></img>

              <p className="NavbarText">Home</p>
            </div>
          </Link>
        ) : (
          // Need this so the navbar doesn't shift when changing screens
          <div></div>
        )}

        {/* Compare dropdown */}
        <DropdownMenu
          label="Compare"
          menuItems={[
            { label: "Automobiles", path: "/comparison/automobiles" },
            { label: "Consoles", path: "/comparison/consoles" },
            { label: "CPUs", path: "/comparison/cpus" },
            { label: "Graphics Cards", path: "/comparison/graphicsCards" },
            { label: "Drones", path: "/comparison/drones" },
          ]}
        ></DropdownMenu>

        {/* Predict dropdown */}
        <DropdownMenu
          label="Predict"
          menuItems={[
            { label: "Automobiles", path: "/prediction/automobiles" },
            { label: "CPUs", path: "/prediction/cpus" },
            { label: "Graphics Cards", path: "/prediction/graphicsCards" },
          ]}
        ></DropdownMenu>

        {/* If not on an account handling page, give user the option to go to an account handling page */}
        <div style={{ justifySelf: "end" }}>
          {page != "account" && page != "login" ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
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
                    }}
                  >
                    <img
                      src={ProfileIcon}
                      alt="Profile Icon"
                      style={
                        isMobile
                          ? { width: 20, height: 20 }
                          : { width: 25, height: 25 }
                      }
                    ></img>
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
                    }}
                  >
                    <img
                      src={ProfileIcon}
                      alt="Profile Icon"
                      style={
                        isMobile
                          ? { width: 20, height: 20 }
                          : { width: 25, height: 25 }
                      }
                    ></img>
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
