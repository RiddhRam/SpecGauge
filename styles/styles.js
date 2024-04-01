import { useState } from "react";
import { StyleSheet } from "react-native";
import { useColorScheme } from "react-native";

export const SGStyles = () => {
  const [theme, setTheme] = useState(useColorScheme());

  const containerStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme === "dark" ? "#000" : "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
  });

  const textStyles = StyleSheet.create({
    text: {
      color: theme === "dark" ? "#4ca0d7" : "#136aa7",
      fontSize: 40,
    },
  });

  return {
    containerStyles: containerStyles,
    textStyles: textStyles,
    theme: theme,
    setTheme: setTheme,
  };
};
