import { Navbar } from "../Navbar";
import { SGStyles } from "../../styles/styles";

import {
  Modal,
  Pressable,
  View,
  Text,
  ScrollView,
  useColorScheme,
} from "react-native-web";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { Footer } from "../Footer";

const comparisonCategories = [
  "Automobiles",
  "Consoles",
  "Drones",
  "Graphics Cards",
  "CPUs",
];

const predictionCategories = ["Automobiles", "Graphics Cards", "CPUs"];

const comparisonLinks = [
  "/comparison/automobiles",
  "/comparison/consoles",
  "/comparison/drones",
  "/comparison/graphicsCards",
  "/comparison/cpus",
];

const predictionLinks = [
  "/prediction/automobiles",
  "/prediction/graphicsCards",
  "/prediction/cpus",
];

export default function WebHome({ amplitude, isMobile }) {
  {
    /* This is for the modal that determines the comparison type */
  }
  const [compareModalVisible, setCompareModalVisible] = useState(false);
  const [predictModalVisible, setPredictModalVisible] = useState(false);

  const navigate = useNavigate();
  const scheme = useColorScheme();

  {
    /* Records the initial load of the website */
  }
  useEffect(() => {
    amplitude.track("Screen", { Screen: "Home" });
  }, []);

  // Call SGStyles as styles
  const styles = SGStyles();

  return (
    <ScrollView>
      {/* navbar */}
      <Navbar page={"home"} isMobile={isMobile} />

      {/* Main view */}
      <View>
        {/* Selection comparison type, default screen */}
        <View
          style={{
            backgroundColor: scheme === "dark" ? "#171827" : "#fff",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Subtitle */}
          <p
            style={{
              fontSize: isMobile ? 20 : 30,
              marginTop: 40,
              fontDisplay: "swap",
              color: scheme === "dark" ? "#fff" : "#000",
              textAlign: "center",
            }}
          >
            Compare Today. Predict Tomorrow.
          </p>

          {/* Updates */}
          <View
            style={{
              flexDirection: isMobile ? "column" : "row",
              padding: 10,
              width: "100%",
              justifyContent: "center",
              marginTop: 10,
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
              <Text style={styles.textStyles.plainText}>
                • Prediction Analysis AI
              </Text>
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
              <Text style={styles.textStyles.plainText}></Text>
              <Text style={styles.textStyles.plainText}></Text>
            </View>
          </View>

          {/* Navigation */}
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            {/* Prediction */}
            <View style={{ marginTop: 20, width: "100%" }}>
              <p style={styles.textStyles.simpleText}>
                Predict future prices of products
              </p>
              <Pressable
                onPress={() => {
                  setPredictModalVisible(true);
                }}
                style={({ pressed }) => [
                  styles.inputStyles.button,
                  pressed && styles.inputStyles.buttonClicked,
                  { marginTop: 15, marginBottom: 60 },
                ]}
              >
                <p>Price Prediction</p>
              </Pressable>
            </View>
            {/* Compare */}
            <View style={{ width: "100%" }}>
              <p style={styles.textStyles.simpleText}>
                Compare thousands of different products side by side
              </p>
              <Pressable
                onPress={() => {
                  setCompareModalVisible(true);
                }}
                style={({ pressed }) => [
                  styles.inputStyles.button,
                  pressed && styles.inputStyles.buttonClicked,
                  { marginBottom: 60, marginTop: 15 },
                ]}
              >
                <p>Start Comparing</p>
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      {/* Footer */}
      <Footer amplitude={amplitude} isMobile={isMobile} />

      {/* Comparison Category selection modal */}
      <Modal
        visible={compareModalVisible}
        animationType="slide"
        transparent="true"
      >
        <View style={styles.containerStyles.modalContainer}>
          <Text style={styles.textStyles.text}>Select a category</Text>

          <ScrollView style={styles.textStyles.modalText}>
            {comparisonCategories.map((item, index) => (
              <Pressable
                style={({ pressed }) => [
                  { padding: 10, paddingRight: 50, fontSize: 20 },
                  pressed && styles.inputStyles.buttonNoBackgroundClicked,
                ]}
                key={item}
                onPress={() => {
                  amplitude.track("Comparison Screen", {
                    Screen: item,
                    Platform: isMobile ? "Mobile" : "Computer",
                  });
                  {
                    /* It needs to be incremented because index is 0 indexed, but the values in the if statement isn't */
                  }

                  navigate(`${comparisonLinks[index]}`);

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

      {/* Prediction Category selection modal */}
      <Modal
        visible={predictModalVisible}
        animationType="slide"
        transparent="true"
      >
        <View style={styles.containerStyles.modalContainer}>
          <Text style={styles.textStyles.text}>Select a category</Text>

          <ScrollView style={styles.textStyles.modalText}>
            {predictionCategories.map((item, index) => (
              <Pressable
                style={({ pressed }) => [
                  { padding: 10, paddingRight: 50, fontSize: 20 },
                  pressed && styles.inputStyles.buttonNoBackgroundClicked,
                ]}
                key={item}
                onPress={() => {
                  amplitude.track("Prediction Screen", {
                    Screen: item,
                    Platform: isMobile ? "Mobile" : "Computer",
                  });
                  {
                    /* It needs to be incremented because index is 0 indexed, but the values in the if statement isn't */
                  }

                  navigate(`${predictionLinks[index]}`);

                  setPredictModalVisible(false);
                }}
              >
                <p>{item}</p>
              </Pressable>
            ))}
          </ScrollView>

          <Pressable
            onPress={() => {
              setPredictModalVisible(false);
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
