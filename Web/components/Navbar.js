import { NavLink } from "react-router-dom";
import { SGStyles } from "../../styles/styles";
import "./Navbar.css";

export const Navbar = () => {
  // initialize SGStyles as styles
  const styles = SGStyles();

  return (
    <nav style={styles.containerStyles.navbarContainer}>
      <ul>
        <li>
          <NavLink to="/home" style={styles.textStyles.navbarText}>
            <img src="./icons/favicon.jpg" />
            {"   "}Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/login" style={styles.textStyles.navbarText}>
            Sign Up or Log In
          </NavLink>
        </li>
        <li>
          <NavLink to="/jpfea" style={styles.textStyles.navbarText}>
            Error 404
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
