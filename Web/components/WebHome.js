import { Pressable } from "react-native-web";
import { useNavigate } from "react-router-dom";
import { SGStyles } from "../../styles/styles";

export default function WebHome() {
  const navigate = useNavigate();
  const styles = SGStyles();
  return (
    <div style={styles.containerStyles.largeContainer}>
      <Pressable
        onPress={() => {
          navigate("/login");
          {
            /* Send user to the sign up/log in page*/
          }
        }}
        style={styles.inputStyles.button}
      >
        <p>Sign Up or Log In</p>
      </Pressable>
    </div>
  );
}
