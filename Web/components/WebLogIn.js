import { useState } from "react";
import { Pressable, TextInput } from "react-native-web";
import { useNavigate } from "react-router-dom";
import { SGStyles } from "../../styles/styles";
import WebAccountHandler from "./WebAccountHandler";

export default function WebLogIn() {
  const navigate = useNavigate();
  const styles = SGStyles();
  const [signUp, setSignUp] = useState(true);
  return (
    <div style={styles.containerStyles.largeContainer}>
      <h1 style={styles.textStyles.text}>SpecGauge</h1>
      {signUp ? (
        <>
          <TextInput
            style={styles.inputStyles.textInput}
            placeholder="Email"
          ></TextInput>
          <TextInput
            style={styles.inputStyles.textInput}
            placeholder="Password"
          ></TextInput>
          <TextInput
            style={styles.inputStyles.textInput}
            placeholder="Confirm Password"
          ></TextInput>

          <Pressable
            onPress={() => {
              console.log("Sign Up");
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
        <>
          <TextInput
            style={styles.inputStyles.textInput}
            placeholder="Email"
          ></TextInput>
          <TextInput
            style={styles.inputStyles.textInput}
            placeholder="Password"
          ></TextInput>
          <Pressable
            onPress={() => {
              console.log("Log In");
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
      <Pressable
        onPress={() => {
          navigate("/home");
          {
            /* Send user to the home page */
          }
        }}
        style={({ pressed }) => [
          styles.inputStyles.button,
          pressed && styles.inputStyles.buttonClicked,
        ]}
      >
        <p>Continue without an account</p>
      </Pressable>
      {/* If user doesn't want to use an account, only available if on browser or if they don't want to save comparisons */}
    </div>
  );
}
