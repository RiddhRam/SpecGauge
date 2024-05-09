import { Navbar } from "../Navbar";
import { SGStyles } from "../../styles/styles";

import { Modal, Pressable, View, Text, ScrollView } from "react-native-web";
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

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Selection comparison type, default screen */}
        <View style={styles.containerStyles.largeContainer}>
          <View
            style={[
              styles.containerStyles.comingSoonContainer,
              { marginBottom: 30 },
            ]}
          >
            <Text
              style={[
                {
                  fontSize: 30,
                },
                styles.textStyles.simpleText,
              ]}
            >
              Coming Soon
            </Text>
            <Text style={styles.textStyles.simpleText}>Pros and Cons</Text>
            <Text style={styles.textStyles.simpleText}>Saved Comparisons</Text>
            <Text style={styles.textStyles.simpleText}>Accounts</Text>
          </View>

          <View>
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
        </View>
      </ScrollView>
    </View>
  );
}
