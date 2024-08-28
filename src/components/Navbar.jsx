import { Link } from "react-router-dom";

import SpecGaugeLogo from "/favicon.svg?url";
import { DropdownMenu } from "./DropdownMenu";

import { auth } from "../firebaseConfig";

export const Navbar = ({ isMobile }) => {
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
            width: "40px",
            padding: 10,
          }}
        ></img>
        <h1 style={{ color: "#4ca0d7" }}>SpecGauge</h1>
      </Link>
      {/* The links */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto auto 1fr",
          gridTemplateRows: "65px",
          alignItems: "center",
          columnGap: "10px",
        }}
      >
        {/* Give user the option to go to home page */}
        <Link to="/home" className="NavbarText">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: isMobile ? "11px" : "14px",
              marginLeft: "35px",
            }}
          >
            <p className="NavbarText">Home</p>
          </div>
        </Link>

        <DropdownMenu
          label="Compare"
          menuItems={[
            { label: "Vehicles", path: "/comparison/automobiles" },
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifySelf: "end",
          }}
        >
          {auth.currentUser ? (
            /*  Account */
            <Link to="/account" className="NavbarText">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  textAlign: "center",
                  fontSize: isMobile ? "11px" : "14px",
                  marginRight: "30px",
                }}
              >
                <p className="NavbarText">Account</p>
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
                  fontSize: isMobile ? "11px" : "14px",
                  marginRight: "30px",
                }}
              >
                <p className="NavbarText">Log In</p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
