import { Pressable, View } from "react-native-web";
import { useNavigate, useLocation } from "react-router-dom";
import { SGStyles } from "../../styles/styles";
import WebAccountHandler from "./WebAccountHandler";

export default function WebLogIn() {
  // Initialize useLocation as location
  const location = useLocation();

  // Initialize useNavigate as navigate
  const navigate = useNavigate();

  // Call SGStyles as styles
  const styles = SGStyles();

  return (
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
  );
}
