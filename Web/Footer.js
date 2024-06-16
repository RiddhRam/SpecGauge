import { SGStyles } from "../styles/styles";
import { Image, Text, View, Pressable } from "react-native-web";

export const Footer = ({ amplitude, isMobile }) => {
  // initialize SGStyles as styles
  const styles = SGStyles();

  return (
    <View
      style={[
        {
          marginTop: 10,
          paddingVertical: 10,
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "flex-start",
        },
        styles.containerStyles.reverseBackground,
      ]}
    >
      {/* Social Media */}
      <View style={{ alignItems: "center" }}>
        <Text
          style={[
            { fontSize: isMobile ? 20 : 30 },
            styles.textStyles.reversePlainText,
            { userSelect: "none" },
          ]}
        >
          Social Media
        </Text>
        <View>
          {/* Instagram */}
          <Pressable
            onPress={() => {
              window.open(
                "https://www.instagram.com/specgauge",
                "_blank",
                "noopener,noreferrer"
              );
              amplitude.track("Instagram");
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              userSelect: "none",
            }}
          >
            <Image
              source={require("../assets/instagram icon.webp")}
              style={{ width: 35, height: 35 }}
              alt="Instagram Logo"
            ></Image>
            <Text
              style={[styles.textStyles.reversePlainText, { fontSize: 12 }]}
            >
              SpecGauge
            </Text>
          </Pressable>
          {/* TikTok */}
          <Pressable
            onPress={() => {
              window.open(
                "https://www.tiktok.com/@specgauge_official",
                "_blank",
                "noopener,noreferrer"
              );
              amplitude.track("TikTok");
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              userSelect: "none",
            }}
          >
            <Image
              source={require("../assets/tiktok icon.webp")}
              style={{ width: 35, height: 35 }}
              alt="TikTok Logo"
            ></Image>
            <Text
              style={[styles.textStyles.reversePlainText, { fontSize: 12 }]}
            >
              SpecGauge_Official
            </Text>
          </Pressable>
          {/* X */}
          <Pressable
            onPress={() => {
              window.open(
                "https://twitter.com/SpecGauge",
                "_blank",
                "noopener,noreferrer"
              );
              amplitude.track("X");
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              userSelect: "none",
            }}
          >
            <Image
              source={require("../assets/x icon.webp")}
              style={{ width: 35, height: 35 }}
              alt="X Logo"
            ></Image>
            <Text
              style={[styles.textStyles.reversePlainText, { fontSize: 12 }]}
            >
              SpecGauge
            </Text>
          </Pressable>
        </View>
      </View>
      {/* Contact Us */}
      <View style={{ alignItems: "center" }}>
        <Text
          style={[
            styles.textStyles.reversePlainText,
            { fontSize: isMobile ? 20 : 30 },
            { userSelect: "none" },
          ]}
        >
          Contact Us
        </Text>

        {/* Have to add this padding to account for the empty space in the png files that mess up the spacing */}
        <View
          style={[{ paddingVertical: 6 }, isMobile ? { fontSize: 13 } : {}]}
        >
          <a
            href="mailto:specgauge@gmail.com?subject=Hello&body=I%20wanted%20to%20reach%20out%20because..."
            style={styles.textStyles.reversePlainText}
          >
            Email: specgauge@gmail.com
          </a>
        </View>
      </View>
    </View>
  );
};
