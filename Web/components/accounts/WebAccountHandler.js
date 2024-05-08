import { SGStyles } from "../../../styles/styles";

import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
  Modal,
} from "react-native-web";
import { useNavigate } from "react-router-dom";

import { useState } from "react";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

export default function WebAccountHandler({ screenType, setModalView }) {
  // Initialize useNavigate as navigate
  const navigate = useNavigate();

  // Call SGStyles as styles
  const styles = SGStyles();

  const [signUp, setSignUp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [invalidInfo, setInvalidInfo] = useState(false);
  const [invalidReason, setInvalidReason] = useState("");

  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [passwordResetEmail, setPasswordResetEmail] = useState("");
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const [passwordResetError, setPasswordResetError] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /* get auth that was initalized in WebApp.js, this may timeout after a while, 
  if it does then move this inside the log in and sign up func */
  const auth = getAuth();

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      setPasswordResetSent(true);
      setPasswordResetError(false);
      setShowPasswordReset(false);
    } catch (error) {
      console.log(error.message);
      setPasswordResetError(true);
      setPasswordResetSent(false);
      setShowPasswordReset(false);
    }
  };

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
      } else {
        setModalView(false);
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
      } else {
        setModalView(false);
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

          {passwordResetError ? (
            <Text style={styles.textStyles.errorText}>
              Error sending request.
            </Text>
          ) : (
            <></>
          )}

          {/* Upon successful password reset link request */}
          {passwordResetSent ? (
            <Text
              style={[styles.textStyles.successText, { textAlign: "center" }]}
            >
              Request sent to your email.
            </Text>
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
              {/* Log in button */}
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

              {/* Forgot password button */}
              <Pressable
                onPress={() => {
                  setShowPasswordReset(true);
                }}
                style={({ pressed }) => [
                  styles.inputStyles.button,
                  pressed && styles.inputStyles.buttonClicked,
                ]}
              >
                <p>Forgot my password</p>
              </Pressable>

              {/* Back to sign up page button */}
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

      {/* Password reset modal */}
      <Modal
        visible={showPasswordReset}
        animationType="slide"
        transparent="true"
      >
        <View style={styles.containerStyles.modalContainer}>
          <Text style={styles.textStyles.text}>Reset your password</Text>
          <TextInput
            value={passwordResetEmail}
            style={styles.inputStyles.textInput}
            placeholder="Email"
            id="resetPasswordEmail"
            onChange={(text) => setPasswordResetEmail(text.target.value)}
          ></TextInput>
          <Pressable
            style={({ pressed }) => [
              styles.inputStyles.button,
              pressed && styles.inputStyles.buttonClicked,
            ]}
            onPress={() => {
              resetPassword(passwordResetEmail);
            }}
          >
            <p>Send Reset Link</p>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.inputStyles.buttonNoBackground,
              pressed && styles.inputStyles.buttonNoBackgroundClicked,
            ]}
            onPress={() => {
              setShowPasswordReset(false);
            }}
          >
            <p>Cancel</p>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}
