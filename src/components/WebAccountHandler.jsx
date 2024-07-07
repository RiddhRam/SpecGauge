import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import Modal from "react-modal";
Modal.setAppElement("#SpecGauge");

import SpecGaugeLogo from "../assets/SpecGauge SEO Logo.webp";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";

export default function WebAccountHandler({
  screenType,
  setModalView,
  isMobile,
}) {
  // Initialize useNavigate as navigate
  const navigate = useNavigate();

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
  const functions = getFunctions();

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      setPasswordResetSent(true);
      setPasswordResetError(false);
      setShowPasswordReset(false);
    } catch (error) {
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
      try {
        const InitializeAccount = httpsCallable(functions, "InitializeAccount");
        const result = await InitializeAccount(email); // returns a response
      } catch (error) {}
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
    <>
      {screenType == "modal" && (
        /* The title and logo */
        <Link
          style={{
            textDecorationLine: "none",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            height: "10vh",
          }}
        >
          <img
            src={SpecGaugeLogo}
            alt="SpecGauge Logo"
            style={{
              imageRendering: "crisp-edges",
              objectFit: "contain",
              width: isMobile ? "30px" : "50px",
            }}
          ></img>
          <p
            style={{
              color: "#4ca0d7",
              fontSize: isMobile ? 25 : 40,
              padding: 10,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            SpecGauge
          </p>
        </Link>
      )}

      {signUp ? (
        // Sign Up page
        <div className="WebAccountHandlerInputSection">
          <input
            type="text"
            value={email}
            className="TextInput"
            placeholder="Email"
            id="email"
            onChange={(text) => setEmail(text.target.value)}
            style={{ marginTop: 30 }}
          ></input>
          <input
            type="password"
            value={password}
            className="TextInput"
            placeholder="Password"
            id="password"
            onChange={(text) => setPassword(text.target.value)}
            style={{ marginTop: 20 }}
          ></input>
          <input
            type="password"
            value={confirmPassword}
            className="TextInput"
            placeholder="Confirm Password"
            id="confirmpassword"
            onChange={(text) => setConfirmPassword(text.target.value)}
            style={{ marginTop: 20 }}
          ></input>

          {/* display errors that occur */}
          {invalidInfo ? <p className="ErrorText">{invalidReason}</p> : <></>}

          {/* show buttons or loading animation */}
          {loading ? (
            <div className="ActivityIndicator" style={{ marginTop: 20 }}></div>
          ) : (
            <>
              <button
                onClick={() => {
                  SignUpFunc();
                }}
                className="NormalButton"
                style={{ width: "100%", marginTop: 20 }}
              >
                <p>Sign Up</p>
              </button>

              <button
                onClick={() => {
                  setSignUp(false);
                }}
                className="NormalButton"
                style={{ width: "100%", marginTop: 20 }}
              >
                <p>I already have an account</p>
              </button>
              {/*If user wants to switch to log in */}
            </>
          )}
        </div>
      ) : (
        // Log in page
        <div className="WebAccountHandlerInputSection">
          <input
            type="text"
            value={email}
            className="TextInput"
            placeholder="Email"
            id="email"
            onChange={(text) => setEmail(text.target.value)}
            style={{ marginTop: 30 }}
          ></input>
          <input
            type="password"
            value={password}
            className="TextInput"
            placeholder="Password"
            id="password"
            onChange={(text) => setPassword(text.target.value)}
            style={{ marginTop: 20 }}
          ></input>

          {/* display errors that occur */}
          {invalidInfo ? <p className="ErrorText">{invalidReason}</p> : <></>}

          {passwordResetError ? (
            <p className="ErrorText">Error sending request.</p>
          ) : (
            <></>
          )}

          {/* Upon successful password reset link request */}
          {passwordResetSent ? (
            <p className="SuccessText">Request sent to your email.</p>
          ) : (
            <></>
          )}

          {/* show buttons or loading animation */}
          {loading ? (
            <div className="ActivityIndicator" style={{ marginTop: 20 }}></div>
          ) : (
            <>
              {/* Log in button */}
              <button
                onClick={() => {
                  LogInFunc();
                }}
                className="NormalButton"
                style={{ width: "100%", marginTop: 20 }}
              >
                <p>Log In</p>
              </button>

              {/* Forgot password button */}
              <button
                onClick={() => {
                  setShowPasswordReset(true);
                }}
                className="NormalButton"
                style={{ width: "100%", marginTop: 20 }}
              >
                <p>Forgot my password</p>
              </button>

              {/* Back to sign up page button */}
              <button
                onClick={() => {
                  setSignUp(true);
                }}
                className="NormalButton"
                style={{ width: "100%", marginTop: 20 }}
              >
                <p>I don't have an account</p>
              </button>
              {/*If user wants to switch to sign up */}
            </>
          )}
        </div>
      )}

      {/* Password reset modal */}
      <Modal
        isOpen={showPasswordReset}
        contentLabel="Reset your password"
        className={"ModalContainer"}
        overlayClassName={"ModalOverlay"}
      >
        <p className="HeaderText">Reset your password</p>

        <input
          value={passwordResetEmail}
          className="TextInput"
          placeholder="Email"
          id="resetPasswordEmail"
          style={{
            display: "block",
            margin: "0 auto",
          }}
          onChange={(text) => setPasswordResetEmail(text.target.value)}
        ></input>
        <div style={{ margin: 10 }}></div>
        <button
          className="NormalButton"
          onClick={() => {
            resetPassword(passwordResetEmail);
          }}
          style={{
            display: "block",
            margin: "0 auto",
          }}
        >
          <p>Send Reset Link</p>
        </button>
        <button
          className="DangerButton"
          onClick={() => {
            setShowPasswordReset(false);
          }}
          style={{ marginTop: 20 }}
        >
          <p>Cancel</p>
        </button>
      </Modal>
    </>
  );
}
