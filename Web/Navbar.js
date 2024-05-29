import { SGStyles } from "../styles/styles";

import { Link } from "react-router-dom";
import { Image, Text, View } from "react-native-web";

import { getAuth } from "firebase/auth";

export const Navbar = ({ page }) => {
  // initialize SGStyles as styles
  const styles = SGStyles();

  const auth = getAuth();

  return (
    <View style={styles.containerStyles.navbarContainer}>
      {/* The title and logo */}
      <Link
        style={{
          textDecorationLine: "none",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../assets/SpecGauge Logo.svg")}
            style={{ width: 35, height: 35 }}
          ></Image>
          <Text style={[styles.textStyles.text]}>SpecGauge</Text>
        </View>
      </Link>
      {/* The links */}
      {/* If currently on the page of one of the links, that link is highlighted */}
      {page == "login" && (
        <View style={{ justifyContent: "flex-start" }}>
          <Link to="/home" style={styles.textStyles.navbarText}>
            <Image
              source={require("../assets/Home Icon.png")}
              style={{ width: 35, height: 37 }}
            ></Image>
          </Link>
        </View>
      )}
      {page == "account" && (
        <View style={{ justifyContent: "flex-start" }}>
          <Link to="/home" style={styles.textStyles.navbarText}>
            <Image
              source={require("../assets/Home Icon.png")}
              style={{ width: 35, height: 37 }}
            ></Image>
          </Link>
        </View>
      )}

      {page == "home" && (
        <View style={{ justifyContent: "flex-end", flexDirection: "row" }}>
          {auth.currentUser ? (
            <Link to="/account" style={styles.textStyles.navbarText}>
              <Image
                source={require("../assets/Profile Icon.png")}
                style={{ width: 37, height: 37 }}
              ></Image>
            </Link>
          ) : (
            <Link to="/login" style={styles.textStyles.navbarText}>
              <Image
                source={require("../assets/Profile Icon.png")}
                style={{ width: 37, height: 37 }}
              ></Image>
            </Link>
          )}
        </View>
      )}
    </View>
  );
};
