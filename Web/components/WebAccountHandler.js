import { Pressable, Text, TextInput, View } from "react-native-web";
import { useNavigate } from "react-router-dom";
import { SGStyles } from "../../styles/styles";
import { useState } from "react";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
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

  const auth = getAuth();

  const SignUpFunc = async () => {
    if (confirmPassword !== password) {
      setInvalidReason("Passwords don't match");
      setInvalidInfo(true);
      return;
    }
    setInvalidInfo(false);
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
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
      setInvalidInfo(true);
    } finally {
      setLoading(false);
    }
  };

  const LogInFunc = async () => {
    setInvalidInfo(false);
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);

      if (screenType == "tab") {
        navigate("/home");
      }
    } catch (error) {
      console.log(error.code);

      if (error.code == "auth/invalid-password") {
        // Same reason, different code
        setInvalidReason("Try a stronger password (at least 6 characters)");
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
      setInvalidInfo(true);
    } finally {
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

          {invalidInfo ? (
            <Text style={styles.textStyles.errorText}>{invalidReason}</Text>
          ) : (
            <></>
          )}

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
    </View>
  );
}
