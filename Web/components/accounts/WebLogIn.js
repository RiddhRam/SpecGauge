import { Navbar } from "../../Navbar";
import { SGStyles } from "../../../styles/styles";
import { Footer } from "../../Footer";
import WebAccountHandler from "./WebAccountHandler";

import { Pressable, View, ScrollView } from "react-native-web";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { getAuth } from "firebase/auth";

export default function WebLogIn({ amplitude, isMobile }) {
  // Initialize useNavigate as navigate
  const navigate = useNavigate();

  // Call SGStyles as styles
  const styles = SGStyles();

  const auth = getAuth();

  // send user to log in if not logged in
  useEffect(() => {
    if (auth.currentUser) {
      navigate("/account");
    }
    amplitude.track("Screen", { Screen: "Log In" });
  });

  return (
    <ScrollView contentContainerStyle={styles.containerStyles.webContainer}>
      {/* navbar */}
      <Navbar style={{ height: "25%" }} page={"login"} />

      {/* main body */}
      <View style={styles.containerStyles.largeContainer}>
        {/* This is in a seperate component so it can be reused in a mini window too */}
        <WebAccountHandler screenType={"tab"}></WebAccountHandler>
        <Pressable
          onPress={() => {
            navigate("/home");
            {
              /* Send user to the home page */
            }
          }}
          style={({ pressed }) => [
            styles.inputStyles.buttonNoBackground,
            pressed && styles.inputStyles.buttonNoBackgroundClicked,
          ]}
        >
          <p>Continue without an account</p>
        </Pressable>
        {/* If user doesn't want to use an account, only available if on browser or if they don't want to save comparisons */}
      </View>

      <Footer amplitude={amplitude} isMobile={isMobile} />
    </ScrollView>
  );
}
