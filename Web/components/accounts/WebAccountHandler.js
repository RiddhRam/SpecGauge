import { SGStyles } from "../../../styles/styles";

import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native-web";
import { useNavigate } from "react-router-dom";

import { useState } from "react";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function WebAccountHandler({ screenType }) {
  // Initialize useNavigate as navigate
  const navigate = useNavigate();

  // Call SGStyles as styles
  const styles = SGStyles();

  const [signUp, setSignUp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [invalidInfo, setInvalidInfo] = useState(false);
  const [invalidReason, setInvalidReason] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /* get auth that was initalized in WebApp.js, this may timeout after a while, 
  if it does then move this inside the log in and sign up func */
  const auth = getAuth();

  // this is executed when user clicks sign up
  const SignUpFunc = async () => {
    // make sure passwords match
    if (confirmPassword !== password) {
      // info invalid
      setInvalidReason("Passwords don't match");
      setInvalidInfo(true);
      return;
    }
    // info is currently valid
    setInvalidInfo(false);
    // start loading animation
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password); // returns a response
      // if it's not a seperate popup window, go to home page
      if (screenType == "tab") {
        navigate("/home");
      }
    } catch (error) {
      if (error.code == "auth/weak-password") {
        setInvalidReason("Try a stronger password (at least 6 characters)");
      } else if (error.code == "auth/invalid-password") {
        // Same reason, different code
        setInvalidReason("Try a stronger password (at least 6 characters)");
      } else if (error.code == "auth/email-already-exists") {
        setInvalidReason("This email already exists. Please log in instead.");
      } else if (error.code == "auth/email-already-in-use") {
        // Same reason, different code
        setInvalidReason("This email already exists. Please log in instead.");
      } else if (error.code == "auth/invalid-email") {
        setInvalidReason("Please enter a valid email.");
      } else if (error.code == "auth/too-many-requests") {
        setInvalidReason(
          "You have sent too many requests, please try again later."
        );
      } else {
        // Other reasons
        setInvalidReason(
          "There was a problem connecting to our server, please try again later or contact us for help."
        );
      }
      // info is invalid
      setInvalidInfo(true);
      console.log(error.message);
    } finally {
      // done loading
      setLoading(false);
    }
  };

  // this is executed when user clicks log in
  const LogInFunc = async () => {
    // info is currently valid
    setInvalidInfo(false);
    // start loading animation
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password); // returns a response

      // if it's not a seperate popup window, go to home page
      if (screenType == "tab") {
        navigate("/home");
      }
    } catch (error) {
      if (error.code == "auth/invalid-password") {
        // Same reason, different code
        setInvalidReason("Try a stronger password (at least 6 characters)");
      } else if (error.code == "auth/invalid-email") {
        setInvalidReason("Please enter a valid email.");
      } else if (error.code == "auth/invalid-credential") {
        setInvalidReason("Incorrect email or password");
      } else if (error.code == "auth/too-many-requests") {
        setInvalidReason(
          "You have sent too many requests, please try again later."
        );
      } else {
        // Other reasons
        setInvalidReason(
          "There was a problem connecting to our server, please try again later or contact us for help."
        );
      }
      // info is invalid
      setInvalidInfo(true);
    } finally {
      // done loading
      setLoading(false);
    }
  };

  return (
    // This is in a seperate component so it can be reused in a mini window too
    <View>
      {/* Title and Logo */}
      <h1 style={styles.textStyles.text}>SpecGauge</h1>

      {signUp ? (
        // Sign Up page
        <>
          <TextInput
            value={email}
            style={styles.inputStyles.textInput}
            placeholder="Email"
            id="email"
            onChange={(text) => setEmail(text.target.value)}
          ></TextInput>
          <TextInput
            secureTextEntry={true}
            value={password}
            style={styles.inputStyles.textInput}
            placeholder="Password"
            id="password"
            onChange={(text) => setPassword(text.target.value)}
          ></TextInput>
          <TextInput
            secureTextEntry={true}
            value={confirmPassword}
            style={styles.inputStyles.textInput}
            placeholder="Confirm Password"
            id="confirmpassword"
            onChange={(text) => setConfirmPassword(text.target.value)}
          ></TextInput>

          {/* display errors that occur */}
          {invalidInfo ? (
            <Text style={styles.textStyles.errorText}>{invalidReason}</Text>
          ) : (
            <></>
          )}

          {/* show buttons or loading animation */}
          {loading ? (
            <>
              <ActivityIndicator size="large"></ActivityIndicator>
            </>
          ) : (
            <>
              <Pressable
                onPress={() => {
                  SignUpFunc();
                }}
                style={({ pressed }) => [
                  styles.inputStyles.button,
                  pressed && styles.inputStyles.buttonClicked,
                  { marginTop: 10 },
                ]}
              >
                <p>Sign Up</p>
              </Pressable>

              <Pressable
                onPress={() => {
                  setSignUp(false);
                }}
                style={({ pressed }) => [
                  styles.inputStyles.button,
                  pressed && styles.inputStyles.buttonClicked,
                ]}
              >
                <p>I already have an account</p>
              </Pressable>
              {/*If user wants to switch to log in */}
            </>
          )}
        </>
      ) : (
        // Log in page
        <>
          <TextInput
            value={email}
            style={styles.inputStyles.textInput}
            placeholder="Email"
            id="email"
            onChange={(text) => setEmail(text.target.value)}
          ></TextInput>
          <TextInput
            secureTextEntry={true}
            value={password}
            style={styles.inputStyles.textInput}
            placeholder="Password"
            id="password"
            onChange={(text) => setPassword(text.target.value)}
          ></TextInput>

          {/* display errors that occur */}
          {invalidInfo ? (
            <Text style={styles.textStyles.errorText}>{invalidReason}</Text>
          ) : (
            <></>
          )}

          {/* show buttons or loading animation */}
          {loading ? (
            <>
              <ActivityIndicator size="large"></ActivityIndicator>
            </>
          ) : (
            <>
              <Pressable
                onPress={() => {
                  LogInFunc();
                }}
                style={({ pressed }) => [
                  styles.inputStyles.button,
                  pressed && styles.inputStyles.buttonClicked,
                ]}
              >
                <p>Log In</p>
              </Pressable>

              <Pressable
                onPress={() => {
                  setSignUp(true);
                }}
                style={({ pressed }) => [
                  styles.inputStyles.button,
                  pressed && styles.inputStyles.buttonClicked,
                ]}
              >
                <p>I don't have an account</p>
              </Pressable>
              {/*If user wants to switch to sign up */}
            </>
          )}
        </>
      )}
    </View>
  );
}
