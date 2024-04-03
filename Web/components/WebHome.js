import { Pressable, View, Text } from "react-native-web";
import { useNavigate } from "react-router-dom";
import { SGStyles } from "../../styles/styles";
import { getAuth, signOut } from "firebase/auth";

export default function WebHome({ userVal }) {
  // Initialize useNavigate as navigate
  const navigate = useNavigate();

  // Call SGStyles as styles
  const styles = SGStyles();

  /* get auth that was initalized in WebApp.js, this may timeout after a while, 
  if it does then move this inside the log in and sign up func */
  const auth = getAuth();

  // Sign out func
  const SignOutFunc = async () => {
    try {
      const response = await signOut(auth);
    } catch (error) {
      console.log(error.message);
    } finally {
    }
  };

  return (
    <View style={styles.containerStyles.largeContainer}>
      {/* if logged in display email and sign out button, 
      if logged out display Not Logged In and Sign Up or Log In button */}
      {userVal ? (
        <>
          <Text style={{ color: "#fff" }}>{userVal.email}</Text>
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
        </>
      ) : (
        <>
          <Text style={{ color: "#fff" }}>Not signed in </Text>
          <Pressable
            onPress={() => {
              navigate("/login");
              {
                /* Send user to the sign up/log in page*/
              }
            }}
            style={({ pressed }) => [
              styles.inputStyles.button,
              pressed && styles.inputStyles.buttonClicked,
            ]}
          >
            <p>Sign Up or Log In</p>
          </Pressable>
        </>
      )}
    </View>
  );
}
