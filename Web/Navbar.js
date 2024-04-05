import { Link } from "react-router-dom";
import { Text, View } from "react-native-web";
import { SGStyles } from "../styles/styles";

export const Navbar = ({ page, userVal }) => {
  // initialize SGStyles as styles
  const styles = SGStyles();

  return (
    <View style={styles.containerStyles.navbarContainer}>
      <Text style={[styles.textStyles.text, { display: "block" }]}>
        SpecGuage
      </Text>
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
