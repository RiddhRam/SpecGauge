import { useState } from "react";
import { StyleSheet } from "react-native";
import { useColorScheme } from "react-native";

export const SGStyles = () => {
  // Get user's color scheme
  const scheme = useColorScheme();
  // Set the app theme
  const [theme, setTheme] = useState(scheme);

  const containerStyles = StyleSheet.create({
    // For Views and divs that take up the entire screen
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#000" : "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
  });

  const textStyles = StyleSheet.create({
    // For regular text
    text: {
      color: theme === "dark" ? "#4ca0d7" : "#136aa7",
      fontSize: 40,
      padding: 10,
    },
  });

  return {
    containerStyles: containerStyles,
    textStyles: textStyles,
    // return these so components can set and access the app theme
    theme: theme,
    setTheme: setTheme,
  };
};
