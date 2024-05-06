import { SGStyles } from "../../../styles/styles";
import { Navbar } from "../../Navbar";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { View, Pressable, Text } from "react-native-web";

import { getAuth, signOut } from "firebase/auth";

export default function WebUserAccount() {
  // Initialize useNavigate as navigate
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  // Call SGStyles as styles
  const styles = SGStyles();

  /* get auth that was initalized in WebApp.js, this may timeout after a while, 
  if it does then move this inside the log in and sign up func */
  const auth = getAuth();

  // Sign out func
  const SignOutFunc = async () => {
    try {
      navigate("/home");
      await signOut(auth); // returns a response
    } catch (error) {
      console.log(error.message);
    } finally {
    }
  };

  // send user to log in if not logged in
  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
    } else {
      setEmail(auth.currentUser.email);
    }
  });

  return (
    /* if logged in display email and sign out button, 
      if logged out display send user to /login */
    <View style={styles.containerStyles.webContainer}>
      {/* navbar */}
      <Navbar page="account" />

      {/* main body */}
      <View style={styles.containerStyles.largeContainer}>
        <Text style={styles.textStyles.simpleText}>{email}</Text>
        <Pressable
          onPress={() => {
            SignOutFunc();
          }}
          style={({ pressed }) => [
            styles.inputStyles.button,
            pressed && styles.inputStyles.buttonClicked,
          ]}
        >
          <p>Log Out</p>
        </Pressable>
      </View>
    </View>
  );
}
