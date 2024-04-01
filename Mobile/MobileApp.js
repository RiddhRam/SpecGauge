import { StatusBar } from "expo-status-bar";

import { Text, View, useColorScheme } from "react-native";

import { SGStyles } from "../styles/styles";

export default function MobileApp() {
  /* This needs to be redeclared here so that in styles.js 
  it realizes it's a mobile app and it should look for the proper scheme
  for mobile devices, not browsers */
  const scheme = useColorScheme();

  // Call SGStyles function as styles
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
