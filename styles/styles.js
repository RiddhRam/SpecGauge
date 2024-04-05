import { useState } from "react";
import { StyleSheet, useColorScheme } from "react-native";

export const SGStyles = () => {
  // Get user's color scheme
  const scheme = useColorScheme();
  // Set the app theme
  const [theme, setTheme] = useState(scheme);

  const containerStyles = StyleSheet.create({
    // For Views and divs that take up the entire screen
    largeContainer: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#171827" : "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
    navbarContainer: {
      paddingTop: 10,
      paddingBottom: 10,
      paddingRight: 10,
      backgroundColor: theme === "dark" ? "#030612" : "#ccc",
      fontWeight: "bold",
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
    errorText: {
      color: "#f00",
      fontSize: 15,
      padding: 10,
      textAlign: "center",
    },
    simpleText: {
      color: theme === "dark" ? "#fff" : "#000",
      textAlign: "center",
    },
    navbarText: {
      display: "block",
      textDecorationLine: "none",
      color: theme === "dark" ? "#fff" : "#000",
      paddingTop: 5,
      paddingBottom: 5,
      paddingRight: 20,
      margin: 15,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  const inputStyles = StyleSheet.create({
    // for buttons
    button: {
      backgroundColor: theme === "dark" ? "#3d3d54" : "#c6c6c6",
      color: theme === "dark" ? "#fff" : "#000",
      borderRadius: 8,
      fontSize: 20,
      margin: 10,
      padding: 10,
      height: 50,
      textAlign: "center",
      userSelect: "none",
    },
    // when the button is clicked
    buttonClicked: {
      backgroundColor: theme === "dark" ? "#5d5d74" : "#e6e6e6",
    },
    buttonNoBackground: {
      color: theme === "dark" ? "#fff" : "#000",
      fontSize: 15,
      margin: 10,
      padding: 10,
      height: 50,
      textAlign: "center",
      userSelect: "none",
    },
    buttonNoBackgroundClicked: {
      color: theme === "dark" ? "#5d5d74" : "#e6e6e6",
    },
    // for text inputs
    textInput: {
      borderColor: "#4ca0d7",
      borderWidth: 2,
      borderRadius: 8,
      color: "#999",
      fontSize: 24,
      margin: 10,
      padding: 10,
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
