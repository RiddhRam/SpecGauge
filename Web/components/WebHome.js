import { Navbar } from "../Navbar";
import { SGStyles } from "../../styles/styles";

import { Modal, Pressable, View, Text, ScrollView } from "react-native-web";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Footer } from "../Footer";

const categories = [
  "Automobiles",
  "Consoles",
  "Drones",
  "Graphics Cards",
  "CPUs",
];

const links = [
  "/automobiles",
  "/consoles",
  "/drones",
  "/graphicsCards",
  "/cpus",
];

export default function WebHome({ amplitude, isMobile }) {
  {
    /* This is for the modal that determines the comparison type */
  }
  const [compareModalVisible, setCompareModalVisible] = useState(false);

  const navigate = useNavigate();

  {
    /* Records the initial load of the website */
  }
  useEffect(() => {
    amplitude.track("Screen", { Screen: "Home" });
  }, []);

  // Call SGStyles as styles
  const styles = SGStyles();

  return (
    <ScrollView contentContainerStyle={styles.containerStyles.webContainer}>
      {/* navbar */}
      <Navbar style={{ height: "25%" }} page={"home"} />

      {/* Main view */}
      <View style={{ flexGrow: 1, height: "75%" }}>
        {/* Selection comparison type, default screen */}
        <View style={styles.containerStyles.largeContainer}>
          <View style={{ alignItems: "center" }}>
            {/* Subtitle */}
            <Text
              style={[
                styles.textStyles.simpleText,
                { fontSize: isMobile ? 20 : 30, marginBottom: 10 },
                { marginTop: 30 },
              ]}
            >
              Your comparison tool for vehicles and electronics.
            </Text>

            {/* Compare button */}
            <Pressable
              onPress={() => {
                setCompareModalVisible(true);
              }}
              style={({ pressed }) => [
                styles.inputStyles.button,
                pressed && styles.inputStyles.buttonClicked,
                { marginBottom: 15, marginTop: 25 },
              ]}
            >
              <p>Start Comparing</p>
            </Pressable>

            {/* Updates */}
            <View
              style={{
                flexDirection: isMobile ? "column" : "row",
                padding: 10,
                width: "100%",
                justifyContent: "space-around",
              }}
            >
              {/* Recently added */}
              <View style={[styles.containerStyles.comingSoonContainer]}>
                <Text
                  style={[
                    {
                      fontSize: 25,
                    },
                    styles.textStyles.simpleText,
                  ]}
                >
                  Recently added
                </Text>
                <Text style={styles.textStyles.plainText}>• Improved UI </Text>
                <Text style={styles.textStyles.plainText}>• Pros</Text>
              </View>

              {/* Coming soon */}
              <View style={[styles.containerStyles.comingSoonContainer]}>
                <Text
                  style={[
                    {
                      fontSize: 25,
                    },
                    styles.textStyles.simpleText,
                  ]}
                >
                  Coming Soon
                </Text>
                <Text style={styles.textStyles.plainText}>• Definitions</Text>
                <Text style={styles.textStyles.plainText}>
                  • Phones and Tablets
                </Text>
                <Text style={styles.textStyles.plainText}></Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Footer */}
      <Footer amplitude={amplitude} isMobile={isMobile} />

      {/* Category selection modal */}
      <Modal
        visible={compareModalVisible}
        animationType="slide"
        transparent="true"
      >
        <View style={styles.containerStyles.modalContainer}>
          <Text style={styles.textStyles.text}>Select a category</Text>

          <ScrollView style={styles.textStyles.modalText}>
            {categories.map((item, index) => (
              <Pressable
                style={({ pressed }) => [
                  { padding: 10, paddingRight: 50, fontSize: 20 },
                  pressed && styles.inputStyles.buttonNoBackgroundClicked,
                ]}
                key={item}
                onPress={() => {
                  amplitude.track("Screen", {
                    Screen: item,
                    Platform: isMobile ? "Mobile" : "Computer",
                  });
                  {
                    /* It needs to be incremented because index is 0 indexed, but the values in the if statement isn't */
                  }

                  navigate(`${links[index]}`);

                  setCompareModalVisible(false);
                }}
              >
                <p>{item}</p>
              </Pressable>
            ))}
          </ScrollView>

          <Pressable
            onPress={() => {
              setCompareModalVisible(false);
            }}
            style={({ pressed }) => [
              styles.inputStyles.button,
              pressed && styles.inputStyles.buttonClicked,
            ]}
          >
            <p>Cancel</p>
          </Pressable>
        </View>
      </Modal>
    </ScrollView>
  );
}
