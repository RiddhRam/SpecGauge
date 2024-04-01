import { StatusBar } from "expo-status-bar";

import { Text, View } from "react-native";

import { SGStyles } from "../styles/styles";

export default function MobileApp() {
  const styles = SGStyles();
  return (
    <View style={styles.containerStyles.container}>
      <Text style={styles.textStyles.text}>
        Open up App.js to start working on your app!
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}
