import { useState } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { Dimensions } from "react-native-web";

var { width, height } = Dimensions.get("window");

export const SGStyles = () => {
  // Get user's color scheme
  const scheme = useColorScheme();
  // Set the app theme
  const [theme, setTheme] = useState(scheme);

  const containerStyles = StyleSheet.create({
    // For Views and divs that take up the entire screen
    largeContainer: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#191b2a" : "#fff",
      justifyContent: "center",
      alignItems: "center",
      alignContent: "center",
    },
  });

  const textStyles = StyleSheet.create({
    // For regular text
    text: {
      color: theme === "dark" ? "#4ca0d7" : "#136aa7",
      fontSize: 40,
      padding: 10,
      textAlign: "center",
    },
  });

  const inputStyles = StyleSheet.create({
    // for buttons
    button: {
      backgroundColor: theme === "dark" ? "#3d3d54" : "#c6c6c6",
      color: theme === "dark" ? "#fff" : "#000",
      borderRadius: 8,
      fontSize: 20,
      marginLeft: width / 2 - width * 0.2,
      marginBottom: 10,
      padding: 10,
      height: 50,
      width: "40%",
      textAlign: "center",
      display: "block",
      userSelect: "none",
    },
    // when the button is clicked
    buttonClicked: {
      backgroundColor: theme === "dark" ? "#5d5d74" : "#e6e6e6",
    },
    // for text inputs
    textInput: {
      borderColor: "#4ca0d7",
      borderWidth: 2,
      borderRadius: 8,
      color: "#999",
      fontSize: 24,
      marginLeft: width / 2 - width * 0.2,
      marginBottom: 10,
      padding: 10,
      width: "40%",
      display: "block",
      userSelect: "none",
      outlineStyle: "none",
    },
  });

  return {
    containerStyles: containerStyles,
    textStyles: textStyles,
    inputStyles: inputStyles,
    // return these so components can set and access the app theme
    theme: theme,
    setTheme: setTheme,
  };
};
