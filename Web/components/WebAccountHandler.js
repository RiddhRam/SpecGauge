import { Pressable, TextInput, View } from "react-native-web";
import { SGStyles } from "../../styles/styles";
import { useState } from "react";

export default function WebAccountHandler() {
  const styles = SGStyles();
  const [signUp, setSignUp] = useState(true);
  return (
    // This is in a seperate component so it can be reused in a mini window too
    <View>
      {/* Title and Logo */}
      <h1 style={styles.textStyles.text}>SpecGauge</h1>

      {signUp ? (
        // Sign Up page
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
        // Log in page
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
    </View>
  );
}
