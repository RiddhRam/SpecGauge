import { SGStyles } from "../../styles/styles";

import { Pressable, Text, View, Image, ScrollView } from "react-native-web";
import { useNavigate } from "react-router-dom";
import { Footer } from "../Footer";

export default function NoPage({ amplitude, isMobile }) {
  // Initialize useNavigate as navigate
  const navigate = useNavigate();

  // Call SGStyles as styles
  const styles = SGStyles();

  return (
    <ScrollView contentContainerStyle={styles.containerStyles.webContainer}>
      <View style={styles.containerStyles.largeContainer}>
        {/* title and logo */}
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
          }}
        >
          <Image
            source={require("../../assets/SpecGauge Logo.svg")}
            style={{ width: 35, height: 35 }}
          ></Image>
          <Text style={[styles.textStyles.text, { display: "block" }]}>
            SpecGauge
          </Text>
        </View>
        <Text style={styles.textStyles.errorText}>
          Error 404: Page not found
        </Text>
        <Pressable
          onPress={() => {
            navigate("/home");
            // send user to home page
          }}
          style={({ pressed }) => [
            styles.inputStyles.button,
            pressed && styles.inputStyles.buttonClicked,
          ]}
        >
          <p>Go to home page</p>
        </Pressable>
      </View>
      <Footer amplitude={amplitude} isMobile={isMobile}></Footer>
    </ScrollView>
  );
}
