import { Navbar } from "../Navbar";
import { SGStyles } from "../../styles/styles";

import { View, Pressable } from "react-native-web";

export default function WebSearch({ userVal }) {
  const styles = SGStyles();
  return (
    <View style={styles.containerStyles.webContainer}>
      {/* navbar */}
      <Navbar page={"search"} userVal={userVal} />

      {/* main body */}
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
