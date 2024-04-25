import { Navbar } from "../Navbar";
import { SGStyles } from "../../styles/styles";

import {
  Modal,
  Pressable,
  View,
  Text,
  ScrollView,
  useWindowDimensions,
} from "react-native-web";
import { useState } from "react";

import { httpsCallable } from "firebase/functions";

const categories = [
  "Automobiles",
  "Phones",
  "Consoles",
  "Drones",
  "Graphics Cards",
  "Processors",
];

const processes = [
  ["a brand", "a model", "a trim", "a year"],
  ["a brand", "a phone"],
  ["a brand", "a console"],
  ["a brand", "a drone"],
  ["a brand", "a generation", "a graphics card"],
  ["a brand", "a generation", "a processor"],
];

const brands = [
  ["Audi", "Dodge", "Ford"],
  ["Apple", "Samsung"],
  [
    "Microsoft",
    "Nintendo",
    "Sony",
    "Abxylute",
    "Alienware",
    "Analogue",
    "Anbernic",
    "Aokzoe",
    "ASUS",
    "Atari",
    "Aya",
    "Ayn",
    "GPD",
    "KTPocket",
    "Lenovo",
    "Logitech",
    "MSI",
    "Onexplayer",
    "Powerkiddy",
    "Retroid",
    "Terrans",
    "Valve",
  ],
  ["Autel", "DJI", "Holy Stone", "Parrot", "Potensic", "Ryze", "Snaptain"],
  ["AMD", "Intel", "NVIDIA"],
  ["AMD", "Intel"],
];

let products = ["Add"];

const droneSpecs = ["Brand", "Drone", "Spec1", "Spec2", "Spec3", "Spec4"];

export default function WebHome({ userVal, functions }) {
  {
    /* This is for the modal that determines the comparison type */
  }
  const [compareModalVisible, setCompareModalVisible] = useState(false);
  {
    /* Determines what comparison screen to show */
  }
  const [category, setCategory] = useState(4);

  {
    /* Determines which part of product selection the modal is on */
  }
  const [modalScreen, setModalScreen] = useState(0);

  // Call SGStyles as styles
  const styles = SGStyles();

  const { height, width } = useWindowDimensions();

  const callDroneCloudFunction = async (product) => {
    try {
      const GetDrones = httpsCallable(functions, "GetDrones");
      const result = await GetDrones(product);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.containerStyles.webContainer}>
      {/* navbar */}
      <Navbar page={"home"} userVal={userVal} />

      {/* main body */}

      {/* Selection comparison type, default screen */}
      {category == 0 && (
        <View style={styles.containerStyles.largeContainer}>
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
                        {
                          /* It needs to be incremented because index is 0 indexed, but the values in the if statement isn't */
                        }
                        setCategory(index + 1);
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
                    setModalScreen(0);
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
      )}

      {/* Compare Drones screen */}
      {category == 4 && (
        <View style={styles.containerStyles.comparisonScreenContainer}>
          <Text style={[styles.textStyles.text, { fontSize: 25 }]}>
            Drones Comparison
          </Text>

          <View style={{ marginRight: "auto" }}>
            <Pressable
              onPress={() => {
                setCategory(0);
              }}
              style={({ pressed }) => [
                styles.inputStyles.button,
                pressed && styles.inputStyles.buttonClicked,
              ]}
            >
              <p>{"< Go Back"}</p>
            </Pressable>
          </View>

          <ScrollView></ScrollView>
        </View>
      )}
    </View>
  );
}
