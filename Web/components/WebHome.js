import { Navbar } from "../Navbar";
import { SGStyles } from "../../styles/styles";

import {
  Modal,
  Pressable,
  View,
  Text,
  ScrollView,
  Image,
  Linking,
} from "react-native-web";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

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

export default function WebHome({ amplitude }) {
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
    <View style={styles.containerStyles.webContainer}>
      {/* navbar */}
      <Navbar page={"home"} />

      {/* main body */}

      {/* Main view */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Selection comparison type, default screen */}
        <View style={styles.containerStyles.largeContainer}>
          <View style={{ alignItems: "center" }}>
            {/* Subtitle */}
            <Text
              style={[
                styles.textStyles.simpleText,
                { fontSize: 30, marginBottom: 60 },
              ]}
            >
              Your comparison tool for vehicles and electronics.
            </Text>
            {/* Updates */}
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                marginBottom: 30,
                padding: 50,
                width: "100%",
                justifyContent: "space-around",
              }}
            >
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
                <Text style={styles.textStyles.plainText}>• Pros and Cons</Text>
                <Text style={styles.textStyles.plainText}>
                  • Phones and Tablets
                </Text>
                <Text style={styles.textStyles.plainText}></Text>
              </View>

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
                <Text style={styles.textStyles.plainText}>• Accounts</Text>
                <Text style={styles.textStyles.plainText}>• Automobiles</Text>
                <Text style={styles.textStyles.plainText}>
                  • Saved Comparisons
                </Text>
              </View>
            </View>
            {/* Compare button */}
            <Pressable
              onPress={() => {
                setCompareModalVisible(true);
              }}
              style={({ pressed }) => [
                styles.inputStyles.button,
                pressed && styles.inputStyles.buttonClicked,
              ]}
            >
              <p>Compare</p>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View
        style={[
          { marginTop: 20, alignItems: "center", paddingVertical: 10 },
          styles.containerStyles.reverseBackground,
        ]}
      >
        <Text style={[{ fontSize: 20 }, styles.textStyles.reversePlainText]}>
          Social Media
        </Text>
        <View style={{ flexDirection: "row" }}>
          {/* Instagram */}
          <Pressable
            onPress={() => {
              Linking.openURL("https://www.instagram.com/specgauge").catch(
                (err) => console.error("Couldn't load page", err)
              );
            }}
          >
            <Image
              source={require("../../assets/instagram icon.png")}
              style={{ width: 35, height: 35 }}
            ></Image>
          </Pressable>
          {/* TikTok */}
          <Pressable
            onPress={() => {
              Linking.openURL(
                "https://www.tiktok.com/@specgauge_official"
              ).catch((err) => console.error("Couldn't load page", err));
            }}
          >
            <Image
              source={require("../../assets/tiktok icon.png")}
              style={{ width: 35, height: 35 }}
            ></Image>
          </Pressable>
          {/* X */}
          <Pressable
            onPress={() => {
              Linking.openURL("https://twitter.com/SpecGauge").catch((err) =>
                console.error("Couldn't load page", err)
              );
            }}
          >
            <Image
              source={require("../../assets/x icon.png")}
              style={{ width: 35, height: 35 }}
            ></Image>
          </Pressable>
        </View>
        <Text style={[{ fontSize: 20 }, styles.textStyles.reversePlainText]}>
          Contact Us
        </Text>
        <Text style={styles.textStyles.reversePlainText}>
          Email: specgauge@gmail.com
        </Text>
      </View>
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
                  amplitude.track("Screen", { Screen: item });
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
    </View>
  );
}
