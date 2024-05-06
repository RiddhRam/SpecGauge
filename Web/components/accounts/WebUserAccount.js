import { SGStyles } from "../../../styles/styles";
import { Navbar } from "../../Navbar";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { View, Pressable, Text, ScrollView } from "react-native-web";

import { getAuth, signOut, sendPasswordResetEmail } from "firebase/auth";

export default function WebUserAccount() {
  // Initialize useNavigate as navigate
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  // 0 for "Your Account", 1 for Saved Comparisons, 2 for Comparison Preferences
  const [page, setPage] = useState(0);
  const [passwordResetSent, setPasswordResetSent] = useState(false);

  // Call SGStyles as styles
  const styles = SGStyles();

  /* get auth that was initalized in WebApp.js, this may timeout after a while, 
  if it does then move this inside the log in and sign up func */
  const auth = getAuth();

  const resetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setPasswordResetSent(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  // Sign out func
  const SignOutFunc = async () => {
    try {
      navigate("/home");
      await signOut(auth); // returns a response
    } catch (error) {
      console.log(error.message);
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
        <ScrollView
          style={{
            flexDirection: "row",
            height: "100%",
            marginRight: "auto",
          }}
          horizontal={true}
        >
          {/* Sidebar */}
          <View
            style={{
              borderRightWidth: 1,
            }}
          >
            {page == 0 ? (
              <Pressable
                onPress={() => {
                  setPage(0);
                }}
                style={({ pressed }) => [
                  styles.inputStyles.accountButtonSelected,
                  pressed && styles.inputStyles.accountButtonClicked,
                ]}
              >
                <p>Your Account</p>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => {
                  setPage(0);
                }}
                style={({ pressed }) => [
                  styles.inputStyles.accountButton,
                  pressed && styles.inputStyles.accountButtonClicked,
                ]}
              >
                <p>Your Account</p>
              </Pressable>
            )}

            {page == 1 ? (
              <Pressable
                onPress={() => {
                  setPage(1);
                }}
                style={({ pressed }) => [
                  styles.inputStyles.accountButtonSelected,
                  pressed && styles.inputStyles.accountButtonClicked,
                ]}
              >
                <p>Saved Comparisons</p>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => {
                  setPage(1);
                }}
                style={({ pressed }) => [
                  styles.inputStyles.accountButton,
                  pressed && styles.inputStyles.accountButtonClicked,
                ]}
              >
                <p>Saved Comparisons</p>
              </Pressable>
            )}

            {page == 2 ? (
              <Pressable
                onPress={() => {
                  setPage(2);
                }}
                style={({ pressed }) => [
                  styles.inputStyles.accountButtonSelected,
                  pressed && styles.inputStyles.accountButtonClicked,
                ]}
              >
                <p>Comparison Preferences</p>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => {
                  setPage(2);
                }}
                style={({ pressed }) => [
                  styles.inputStyles.accountButton,
                  pressed && styles.inputStyles.accountButtonClicked,
                ]}
              >
                <p>Comparison Preferences</p>
              </Pressable>
            )}
          </View>

          {/* main view */}
          <View style={{ padding: 10 }}>
            {page == 0 && (
              <View>
                <Text style={{ fontSize: 30, color: "#4ca0d7" }}>
                  Your Account
                </Text>
                {/* Show user the account email */}
                <View style={{ paddingTop: 10 }}>
                  <Text style={[styles.textStyles.plainText, { fontSize: 20 }]}>
                    Email
                  </Text>
                  <Text style={styles.textStyles.plainText}>{email}</Text>
                  {passwordResetSent && (
                    <Text
                      style={[
                        styles.textStyles.plainText,
                        { color: "#03fc13", paddingTop: 5 },
                      ]}
                    >
                      Request sent to your email.
                    </Text>
                  )}
                </View>

                {/* Let user reset password */}
                <Pressable
                  style={({ pressed }) => [
                    styles.inputStyles.button,
                    pressed && styles.inputStyles.buttonClicked,
                    { margin: 0, marginTop: 10 },
                  ]}
                  onPress={() => {
                    resetPassword();
                  }}
                >
                  <p>Reset Password</p>
                </Pressable>

                {/* Let user sign out */}
                <Pressable
                  style={({ pressed }) => [
                    styles.inputStyles.button,
                    pressed && styles.inputStyles.buttonClicked,
                    { margin: 0, marginTop: 10 },
                  ]}
                  onPress={() => {
                    SignOutFunc();
                  }}
                >
                  <p>Log Out</p>
                </Pressable>
              </View>
            )}
            {page == 1 && (
              <View>
                <Text style={{ fontSize: 30, color: "#4ca0d7" }}>
                  Saved Comparisons
                </Text>
              </View>
            )}
            {page == 2 && (
              <View>
                <Text style={{ fontSize: 30, color: "#4ca0d7" }}>
                  Comparison Preferences
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/*}
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
        </Pressable>*/}
      </View>
    </View>
  );
}
