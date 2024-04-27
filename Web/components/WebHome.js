import { Navbar } from "../Navbar";
import { SGStyles } from "../../styles/styles";

import { Modal, Pressable, View, Text, ScrollView } from "react-native-web";
import { useState } from "react";

import { httpsCallable } from "firebase/functions";

import Compare from "./compare/Compare";

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
  ["AMD", "Intel", "NVIDIA"],
  ["AMD", "Intel"],
];

const droneBrands = [
  "Autel",
  "DJI",
  "Holy Stone",
  "Parrot",
  "Potensic",
  "Ryze",
  "Snaptain",
];

const droneProcess = ["a brand", "a drone"];

const droneMatchingArray = [
  "Brand",
  "Name",
  "is weather-sealed (splashproof)",
  "is dustproof and water-resistant",
  "volume",
  "weight",
  "lowest potential operating temperature",
  "maximum operating temperature",
  "height",
  "thickness",
  "width",
  "maximum flight time",
  "maximum flight distance",
  "maximum flight speed",
  "obstacle detection",
  "intelligent flight modes",
  "return to home (rth)",
  "megapixels (main camera)",
  "maximum iso",
  "shoots raw",
  "movie bitrate",
  "video recording (main camera)",
  "field of view",
  "has a built-in hdr mode",
  "has a serial shot mode",
  "has a cmos sensor",
  "can create panoramas in-camera",
  "has a 24p cinema mode",
  "continuous shooting at high resolution",
  "fpv camera",
  "sensor size",
  "battery power",
  "charge time",
  "has a removable battery",
  "has an external memory slot",
  "has gps",
  "has a gyroscope",
  "internal storage",
  "supports a remote smartphone",
  "has a compass",
  "has an accelerometer",
  "maximum amount of external memory supported",
  "has a remote control",
  "has a display",
];

const droneDefaultArray = [
  { Value: "--", Display: true, Category: "Brand" }, // Brand
  { Value: "--", Display: true, Category: "Name" }, // Name
  { Value: "Weather-Sealed", Display: false, Category: "Structural Features" },
  {
    Value: "Dustproof and Water-Resistant",
    Display: false,
    Category: "Structural Features",
  },
  { Value: "--", Display: true, Category: "Size" }, // Volume
  { Value: "--", Display: true, Category: "Weight" }, // Weight
  {
    Value: "Minimum operating temperature: --",
    Display: true,
    Category: "Operating Temperature",
  },
  {
    Value: "Maximum operating temperature: --",
    Display: true,
    Category: "Operating Temperature",
  },
  { Value: "--", Display: true, Category: "Height" }, // Height
  { Value: "--", Display: true, Category: "Width" }, // Width (thickness)
  { Value: "--", Display: true, Category: "Length" }, // Length (width)
  { Value: "--", Display: true, Category: "Flight Time (1 battery)" }, // Flight Time (1 battery)
  { Value: "--", Display: true, Category: "Maximum Flight Distance" }, // Maximum Flight Distance
  { Value: "--", Display: true, Category: "Top Speed" }, // Top Speed
  { Value: "Obstacle Detection", Display: false, Category: "Controls" },
  { Value: "Intelligent Flight Modes", Display: false, Category: "Controls" },
  { Value: "Return-to-Home", Display: false, Category: "Controls" },
  { Value: "Megapixels: --", Display: true, Category: "Camera" },
  { Value: "Maximum ISO: --", Display: true, Category: "Camera" },
  { Value: "RAW Photos", Display: false, Category: "Camera Features" },
  { Value: "Video Bitrate: --", Display: true, Category: "Camera" },
  { Value: "Video Quality: --", Display: true, Category: "Camera" },
  { Value: "Field of View: --", Display: true, Category: "Camera" },
  { Value: "HDR mode", Display: false, Category: "Camera Features" },
  { Value: "Serial Shot mode", Display: false, Category: "Camera Features" },
  { Value: "CMOS Sensor", Display: false, Category: "Camera" },
  { Value: "Panoramic mode", Display: false, Category: "Camera Features" },
  { Value: "24p Cinema mode", Display: false, Category: "Camera Features" },
  { Value: "Burst Shot mode", Display: true, Category: "Camera Features" },
  { Value: "FPV Camera", Display: false, Category: "Camera" },
  { Value: "Sensor Size: --", Display: true, Category: "Camera" },
  {
    Value: "Battery Capacity (1 battery): --",
    Display: true,
    Category: "Battery",
  },
  { Value: "Charge Time (1 battery): --", Display: true, Category: "Battery" },
  { Value: "Removable", Display: false, Category: "Battery" },
  {
    Value: "External Memory Slot",
    Display: false,
    Category: "Memory and Storage",
  },
  { Value: "GPS", Display: false, Category: "Controls" },
  { Value: "Gyroscope", Display: false, Category: "Controls" },
  {
    Value: "Internal Storage: --",
    Display: true,
    Category: "Memory and Storage",
  },
  { Value: "Remote Smartphone Control", Display: false, Category: "Controls" },
  { Value: "Compass", Display: false, Category: "Controls" },
  { Value: "Accelerometer", Display: false, Category: "Controls" },
  {
    Value: "Maximum external memory: --",
    Display: true,
    Category: "Memory and Storage",
  },
  { Value: "Remote Control", Display: false, Category: "Controls" },
  { Value: "Built-in Display", Display: false, Category: "Controls" },
];

const droneCategories = [
  [
    "Brand",
    "Name",
    "Weight",
    "Operating Temperature",
    "Size",
    "Height",
    "Width",
    "Length",
    "Flight Time (1 battery)",
    "Maximum Flight Distance",
    "Top Speed",
    "Structural Features",
    "Camera",
    "Camera Features",
    "Battery",
    "Memory and Storage",
    "Controls",
  ],
];

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

  let dronesHeight = [];
  let dronesSetHeight = [];

  for (i = 0; i < droneCategories[0].length; i++) {
    const [height, setHeight] = useState(39);
    dronesHeight.push(height);
    dronesSetHeight.push(setHeight);
  }

  const callDroneCloudFunction = async (product) => {
    try {
      const GetDrones = httpsCallable(functions, "GetDrones");
      const result = await GetDrones(product);
      return result.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const [droneSpecs, setDroneSpecs] = useState(droneCategories);

  // Call SGStyles as styles
  const styles = SGStyles();

  return (
    <View style={styles.containerStyles.webContainer}>
      {/* navbar */}
      <Navbar page={"home"} userVal={userVal} />

      {/* main body */}

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
                          pressed &&
                            styles.inputStyles.buttonNoBackgroundClicked,
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
          <Compare
            type={"Drones"}
            setCategory={setCategory}
            Brands={droneBrands}
            Process={droneProcess}
            MatchingArray={droneMatchingArray}
            DefaultArray={droneDefaultArray}
            Categories={droneCategories}
            Specs={droneSpecs}
            setSpecs={setDroneSpecs}
            Height={dronesHeight}
            SetHeight={dronesSetHeight}
            CloudFunction={callDroneCloudFunction}
          ></Compare>
        )}
      </ScrollView>
    </View>
  );
}
