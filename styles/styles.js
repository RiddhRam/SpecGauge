import { useState } from "react";
import { StyleSheet, useColorScheme } from "react-native";

export const SGStyles = () => {
  // Get user's color scheme
  const scheme = useColorScheme();
  // Set the app theme
  const [theme, setTheme] = useState(scheme);

  const containerStyles = StyleSheet.create({
    // For the whole web screen
    webContainer: {
      height: "123%",
      width: "100%",
    },
    // For the web navbar
    navbarContainer: {
      backgroundColor: "#030612",
      fontWeight: "bold",
      padding: 15,
    },
    // For Views and divs that take up the main part of the screen
    largeContainer: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#171827" : "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
    modalContainer: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#030612" : "#fff",
      borderColor: "#000",
      borderWidth: 2,
      borderRadius: 8,
      marginTop: 200,
      marginHorizontal: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    comparisonScreenContainer: {
      flexGrow: 1,
      backgroundColor: theme === "dark" ? "#171827" : "#fff",
      padding: 20,
    },
    comingSoonContainer: {
      backgroundColor: theme === "dark" ? "#030612" : "#fff",
      borderColor: "#000",
      borderWidth: 2,
      borderRadius: 8,
      padding: 20,
      margin: 20,
    },
    userAccountDetailsSection: {
      paddingVertical: 10,
      marginVertical: 5,
      borderRadius: 10,
      backgroundColor: theme === "dark" ? "#000" : "#e6e6e6",
      padding: 5,
    },
    reverseBackground: {
      backgroundColor: theme === "dark" ? "#fff" : "#000",
    },
  });

  const textStyles = StyleSheet.create({
    // For regular text
    text: {
      color: "#4ca0d7",
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
      textDecorationLine: "none",
      color: "#fff",
      padding: 15,
    },
    navbarTextSelected: {
      textDecorationLine: "none",
      color: "#000",
      padding: 15,
      backgroundColor: theme === "dark" ? "grey" : "#aaa",
      borderRadius: 10,
    },
    modalText: {
      color: theme === "dark" ? "#fff" : "#000",
      textAlign: "left",
    },
    plainText: {
      color: theme === "dark" ? "#fff" : "#000",
    },
    reversePlainText: {
      color: theme === "dark" ? "#000" : "#fff",
    },
    comparisonText: {
      color: theme === "dark" ? "#fff" : "#000",
      textAlign: "center",
      padding: 10,
      borderWidth: 1,
    },
    specCategoryText: {
      backgroundColor: "#4ca0d7",
      color: theme === "dark" ? "#fff" : "#000",
      textAlign: "center",
      padding: 10,
      borderWidth: 1,
    },
    userAccountDetails: {
      color: "#3b85ae",
      fontSize: 20,
    },
    successText: {
      color: "#03fc13",
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
      userSelect: "none",
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
      userSelect: "none",
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
    removeButton: {
      backgroundColor: theme === "dark" ? "#8c0a0a" : "#cf413a",
      color: theme === "dark" ? "#fff" : "#000",
      borderRadius: 8,
      fontSize: 15,
      margin: 10,
      paddingTop: 15,
      textAlign: "center",
      userSelect: "none",
    },
    // when the button is clicked
    removeButtonClicked: {
      backgroundColor: theme === "dark" ? "#690505" : "#b53731",
      userSelect: "none",
    },
    accountButton: {
      backgroundColor: theme === "dark" ? "#171827" : "#fff",
      color: theme === "dark" ? "#fff" : "#000",
      borderRadius: 8,
      fontSize: 20,
      margin: 10,
      padding: 10,
      height: 50,
      userSelect: "none",
    },
    accountButtonClicked: {
      backgroundColor: theme === "dark" ? "#5d5d74" : "#e6e6e6",
      userSelect: "none",
    },
    accountButtonSelected: {
      backgroundColor: theme === "dark" ? "#3d3d54" : "#c6c6c6",
      color: theme === "dark" ? "#fff" : "#000",
      borderRadius: 8,
      fontSize: 20,
      margin: 10,
      padding: 10,
      height: 50,
      userSelect: "none",
    },
    redButtonNoBackground: {
      color: theme === "dark" ? "#8c0a0a" : "#cf413a",
      fontSize: 15,
      textAlign: "center",
      userSelect: "none",
    },
    redButtonNoBackgroundClicked: {
      color: theme === "dark" ? "#690505" : "#8f2a25",
      userSelect: "none",
    },
    resetButton: {
      backgroundColor: theme === "dark" ? "#8c0a0a" : "#cf413a",
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
    resetButtonClicked: {
      backgroundColor: theme === "dark" ? "#690505" : "#b53731",
      userSelect: "none",
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
