import { Navbar } from "../Navbar";
import { SGStyles } from "../../styles/styles";

import { Pressable, View } from "react-native-web";

export default function WebHome({ userVal }) {
  // Call SGStyles as styles
  const styles = SGStyles();

  return (
    <View style={styles.containerStyles.webContainer}>
      {/* navbar */}
      <Navbar page={"home"} userVal={userVal} />

      {/* main body */}
      <View style={styles.containerStyles.largeContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.inputStyles.button,
            pressed && styles.inputStyles.buttonClicked,
          ]}
        >
          <p>Compare</p>
        </Pressable>
      </View>
    </View>
  );
}
