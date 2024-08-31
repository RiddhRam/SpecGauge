import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebaseConfig";

export const DropdownMenu = ({ label, menuItems, isMobile }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  return (
    <div
      className="dropdown"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="dropdown-toggle"
        style={isMobile ? {} : { fontSize: "18px", padding: "10px" }}
      >
        {label}
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                onClick={(event) => {
                  event.preventDefault();
                  if (analytics != null) {
                    logEvent(analytics, "Navigation Button", {
                      // Screen type
                      Type: label,
                      // Category type
                      Category: item.label,
                    });
                  }
                  navigate(item.path);
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
