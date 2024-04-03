import { Pressable, View, Text } from "react-native-web";
import { useNavigate } from "react-router-dom";
import { SGStyles } from "../../styles/styles";
import { useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";

export default function WebHome({ userVal }) {
  // Initialize useNavigate as navigate
  const navigate = useNavigate();

  // Call SGStyles as styles
  const styles = SGStyles();

  const auth = getAuth();

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
      {userVal ? (
        <>
          <Text style={{ color: "#fff" }}>{userVal.email}</Text>
          <Pressable
            onPress={() => {
              SignOutFunc();
            }}
            style={styles.inputStyles.button}
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
            style={styles.inputStyles.button}
          >
            <p>Sign Up or Log In</p>
          </Pressable>
        </>
      )}
    </View>
  );
}
