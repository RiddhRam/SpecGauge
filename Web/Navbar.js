import { SGStyles } from "../styles/styles";

import { Link } from "react-router-dom";
import { Image, Text, View } from "react-native-web";

import { getAuth } from "firebase/auth";

import { A } from "@expo/html-elements";

export const Navbar = ({ page, isMobile }) => {
  // initialize SGStyles as styles
  const styles = SGStyles();

  const auth = getAuth();
  const currentDomain = window.location.origin;

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
            source={require("../assets/SpecGauge SEO Logo.webp")}
            style={
              isMobile ? { width: 25, height: 25 } : { width: 35, height: 35 }
            }
            alt={"SpecGauge Logo"}
          ></Image>
          <Text style={styles.textStyles.titleText}>SpecGauge</Text>
        </View>
      </Link>
      {/* The links */}
      {/* If currently on the page of one of the links, that link is highlighted */}
      {(page == "login" || page == "account") && (
        <View style={{ justifyContent: "flex-start" }}>
          <Link to="/home" style={styles.textStyles.navbarText}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../assets/Home Icon.webp")}
                style={
                  isMobile
                    ? { width: 25, height: 27 }
                    : { width: 35, height: 37 }
                }
                alt="Home Icon"
              ></Image>
              <Text style={styles.textStyles.navbarText}>Home</Text>
            </View>
          </Link>
        </View>
      )}

      {page == "home" && (
        <View
          style={{
            justifyContent: "flex-end",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {auth.currentUser ? (
            <>
              <A href={`${currentDomain}/account`} target="_self">
                <Image
                  source={require("../assets/Profile Icon.webp")}
                  style={
                    isMobile
                      ? { width: 27, height: 27 }
                      : { width: 37, height: 37 }
                  }
                  alt="Profile Icon"
                ></Image>
              </A>
              <A
                href={`${currentDomain}/account`}
                target="_self"
                style={{ alignContent: "center", marginLeft: 0 }}
              >
                <Text style={styles.textStyles.navbarText}>My Account</Text>
              </A>
            </>
          ) : (
            <>
              <A href={`${currentDomain}/login`} target="_self">
                <Image
                  source={require("../assets/Profile Icon.webp")}
                  style={
                    isMobile
                      ? { width: 27, height: 27 }
                      : { width: 37, height: 37 }
                  }
                  alt="Profile Icon"
                ></Image>
              </A>
              <A
                href={`${currentDomain}/login`}
                target="_self"
                style={{ alignContent: "center", marginLeft: 0 }}
              >
                <Text style={styles.textStyles.navbarText}>Log In</Text>
              </A>
            </>
          )}
        </View>
      )}
    </View>
  );
};
