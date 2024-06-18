import { SGStyles } from "../../styles/styles";

import { Text, View, ScrollView } from "react-native-web";
import { Footer } from "../Footer";
import { Navbar } from "../Navbar";
import { useEffect } from "react";

export default function Information({ amplitude, isMobile, title, text }) {
  // Call SGStyles as styles
  const styles = SGStyles();

  useEffect(() => {
    amplitude.track("Screen", { Screen: title });
  }, []);
  return (
    <ScrollView contentContainerStyle={styles.containerStyles.webContainer}>
      <Navbar page="aboutus" isMobile={isMobile}></Navbar>
      <View
        style={[
          styles.containerStyles.largeContainer,
          { alignItems: "flex-start", paddingLeft: 20, paddingBottom: 40 },
        ]}
      >
        {/* title and logo */}

        <Text
          style={[
            styles.textStyles.text,
            { paddingLeft: 0, fontWeight: "bold" },
          ]}
        >
          {title}
        </Text>
        <Text style={styles.textStyles.plainText}>{text}</Text>
      </View>
      <Footer amplitude={amplitude} isMobile={isMobile}></Footer>
    </ScrollView>
  );
}
