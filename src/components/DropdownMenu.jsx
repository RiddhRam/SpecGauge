import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const DropdownMenu = ({ label, menuItems, amplitude }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  return (
    <div
      className="dropdown"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="dropdown-toggle">{label}</button>
      {isOpen && (
        <ul className="dropdown-menu">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                onClick={(event) => {
                  event.preventDefault();
                  amplitude.track("Navigation Button", {
                    // Screen type
                    Type: label,
                    // Category type
                    Category: item.label,
                  });
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
