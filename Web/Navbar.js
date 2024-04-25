import { SGStyles } from "../styles/styles";

import { Link } from "react-router-dom";
import { Text, View } from "react-native-web";

export const Navbar = ({ page, userVal }) => {
  // initialize SGStyles as styles
  const styles = SGStyles();

  return (
    <View style={styles.containerStyles.navbarContainer}>
      {/* The title and logo */}
      <Text style={[styles.textStyles.text, { display: "block" }]}>
        SpecGauge
      </Text>
      {/* The links */}
      {/* If currently on the page of one of the links, that link is highlighted */}
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        {page === "home" ? (
          <Link to="/home" style={styles.textStyles.navbarTextSelected}>
            Home
          </Link>
        ) : (
          <Link to="/home" style={styles.textStyles.navbarText}>
            Home
          </Link>
        )}

        {page === "search" ? (
          <Link to="/search" style={styles.textStyles.navbarTextSelected}>
            Search
          </Link>
        ) : (
          <Link to="/search" style={styles.textStyles.navbarText}>
            Search
          </Link>
        )}

        {/* If logged in show "My Account" link. If logged out show "Sign Up/Log In" link. */}
        {userVal ? (
          <>
            {page === "account" ? (
              <Link to="/account" style={styles.textStyles.navbarTextSelected}>
                My Account
              </Link>
            ) : (
              <Link to="/account" style={styles.textStyles.navbarText}>
                My Account
              </Link>
            )}
          </>
        ) : (
          <>
            {page === "login" ? (
              <Link to="/login" style={styles.textStyles.navbarTextSelected}>
                Sign Up/Log In
              </Link>
            ) : (
              <Link to="/login" style={styles.textStyles.navbarText}>
                Sign Up/Log In
              </Link>
            )}
          </>
        )}
      </View>
    </View>
  );
};
