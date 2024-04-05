import { View, Pressable } from "react-native-web";
import { Navbar } from "../Navbar";
import { SGStyles } from "../../styles/styles";

export default function WebSearch({ userVal }) {
  const styles = SGStyles();
  return (
    <View style={styles.containerStyles.webContainer}>
      <Navbar page={"search"} userVal={userVal}></Navbar>
      <View style={styles.containerStyles.largeContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.inputStyles.button,
            pressed && styles.inputStyles.buttonClicked,
          ]}
        >
          <p>Search</p>
        </Pressable>
      </View>
    </View>
  );
}
