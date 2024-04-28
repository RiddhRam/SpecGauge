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
  ["a brand", "a generation", "a graphics card"],
  ["a brand", "a generation", "a processor"],
];

const brands = [
  ["Audi", "Dodge", "Ford"],
  ["Apple", "Samsung"],
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

const consoleBrands = [
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
];

const consoleProcess = ["a brand", "a console"];

const consoleMatchingArray = [
  "Brand",
  "Name",
  "cpu speed",
  "floating-point performance",
  "ram",
  "gpu clock speed",
  "supports ray tracing",
  "i/o throughput",
  "gddr version",
  "is an nvme ssd",
  "memory bandwidth",
  "can connect to an external drive",
  "shading units",
  "number of compute units",
  "render output units (rops)",
  "uses multithreading",
  "refresh rate",
  "ddr memory version",
  "ram speed",
  "type",
  "output resolution",
  "hard drive is replaceable",
  "has an internal power supply",
  "internal storage",
  "is region free",
  "thickness",
  "width",
  "height",
  "volume",
  "has an optical disc drive",
  "weight",
  "maximum operating temperature",
  "lowest potential operating temperature",
  "battery power",
  "has a socket for a 3.5 mm audio jack",
  "supports wi-fi",
  "wi-fi version",
  "is dlna-certified",
  "usb ports",
  "has an hdmi output",
  "hdmi version",
  "has an external memory slot",
  "supports connectivity between home and portable devices",
  "usb version",
  "has usb type-c",
  "has a cellular module",
  "has nfc",
  "rj45 ports",
  "number of games",
  "number of exclusive games",
  "has voice commands",
  "backwards compatibility",
  "can play games while they download",
  "supports quick resume",
  "supports discord voice chat",
  "supports 3d audio",
  "supports dolby vision",
  "supports vr",
  "has a 4k blu-ray drive",
  "number of channels of sound output",
  "has optical tracking",
  "can play blu-ray discs",
  "access high scores and achievements",
  "supports 3d",
  "uses flash storage",
  "has a child lock",
  "number of controllers",
  "has adaptive triggers",
  "compatible with a motion-sensing controller(s)",
  "has a wireless controller",
  "number of analog sticks",
  "has an integrated touchpad",
  "has dual force feedback",
  "controller weight",
  "number of buttons",
  "maximum amount of external memory supported",
];

const consoleDefaultArray = [
  { Value: "--", Display: true, Category: "Brand" }, // Brand
  { Value: "--", Display: true, Category: "Name" }, // Name
  { Value: "Clock Speed: --", Display: true, Category: "CPU" },
  { Value: "Floating-Point Performance: --", Display: true, Category: "CPU" },
  { Value: "Capacity: --", Display: true, Category: "RAM" },
  { Value: "Clock Speed: --", Display: true, Category: "GPU" },
  { Value: "Ray Tracing", Display: false, Category: "GPU" },
  { Value: "I/O Throughput: --", Display: true, Category: "Storage" },
  { Value: "GDDR Version: --", Display: true, Category: "GPU" },
  { Value: "NVME SSD", Display: false, Category: "Storage" },
  { Value: "Bandwidth: --", Display: true, Category: "RAM" },
  { Value: "Accepts External Drive", Display: false, Category: "Storage" },
  { Value: "Shading Units: --", Display: true, Category: "GPU" },
  { Value: "Compute Units: --", Display: true, Category: "GPU" },
  { Value: "ROPs: --", Display: true, Category: "GPU" },
  { Value: "Uses Multithreading", Display: false, Category: "CPU" },
  { Value: "Refresh Rate: --", Display: true, Category: "Display" },
  { Value: "DDR Version: --", Display: true, Category: "RAM" },
  { Value: "Clock Speed: --", Display: true, Category: "RAM" },
  { Value: "--", Display: true, Category: "Portability" }, // Portability
  { Value: "Max Resolution: --", Display: true, Category: "Display" },
  { Value: "Replaceable Hard Drive", Display: false, Category: "Storage" },
  { Value: "Internal Power Supply", Display: false, Category: "Power" },
  { Value: "Internal Storage", Display: false, Category: "Storage" },
  { Value: "Region Free", Display: false, Category: "Games" },
  { Value: "--", Display: true, Category: "Height" }, // thickness
  { Value: "--", Display: true, Category: "Width" }, // width
  { Value: "--", Display: true, Category: "Length" }, // height
  { Value: "--", Display: true, Category: "Size" }, // volume
  { Value: "Optical Disc Drive", Display: false, Category: "Ports" },
  { Value: "--", Display: true, Category: "Weight" }, // weight
  {
    Value: "Maximum Operating Temperature: --",
    Display: true,
    Category: "Operating Temperature",
  },
  {
    Value: "Minimum Operating Temperature: --",
    Display: true,
    Category: "Operating Temperature",
  },
  { Value: "Battery Capacity: --", Display: true, Category: "Power" },
  { Value: "3.5mm Audio", Display: false, Category: "Ports" },
  { Value: "Wi-Fi", Display: false, Category: "Connectivity" },
  { Value: "Wi-Fi Version: --", Display: true, Category: "Connectivity" },
  { Value: "DLNA-Certified", Display: false, Category: "Connectivity" },
  { Value: "USB Ports: --", Display: true, Category: "Ports" },
  { Value: "HDMI", Display: false, Category: "Ports" },
  { Value: "HDMI Version: --", Display: true, Category: "Ports" },
  { Value: "External Memory Slot", Display: false, Category: "Storage" },
  { Value: "Remote Play", Display: false, Category: "Connectivity" },
  { Value: "USB Version: --", Display: true, Category: "Ports" },
  { Value: "USB Type-C", Display: false, Category: "Ports" },
  { Value: "Cellular Data", Display: false, Category: "Connectivity" },
  { Value: "NFC", Display: false, Category: "Connectivity" },
  { Value: "RJ45 Ports: --", Display: true, Category: "Connectivity" },
  {
    Value: "Games (as of last database update): --",
    Display: true,
    Category: "Games",
  },
  {
    Value: "Exclusive Games (as of last database update): --",
    Display: true,
    Category: "Games",
  },
  { Value: "Voice Commands", Display: false, Category: "Audio" },
  { Value: "Backwards Compatible", Display: false, Category: "Games" },
  { Value: "Play As You Download", Display: false, Category: "Games" },
  { Value: "Quick Resume", Display: false, Category: "Games" },
  { Value: "Discord", Display: false, Category: "Audio" },
  { Value: "3D Audio", Display: false, Category: "Audio" },
  { Value: "Dolby Vision", Display: false, Category: "Display" },
  { Value: "VR", Display: false, Category: "Display" },
  { Value: "4k Blu-ray Drive", Display: false, Category: "Ports" },
  { Value: "Sound Output Channels: --", Display: true, Category: "Audio" },
  { Value: "Optical Tracking", Display: false, Category: "Controllers" },
  { Value: "Blu-ray", Display: false, Category: "Display" },
  { Value: "High Scores and Achievements", Display: false, Category: "Games" },
  { Value: "3D", Display: false, Category: "Display" },
  { Value: "Flash Storage", Display: false, Category: "Storage" },
  { Value: "Child Lock", Display: false, Category: "Games" },
  { Value: "Controllers: --", Display: true, Category: "Controllers" },
  { Value: "Adaptive Triggers", Display: false, Category: "Controllers" },
  {
    Value: "Motion-Sensing Compatible",
    Display: false,
    Category: "Controllers",
  },
  { Value: "Wireless Controller", Display: false, Category: "Controllers" },
  { Value: "Analog Sticks: --", Display: true, Category: "Controllers" },
  { Value: "Integrated Touchpad", Display: false, Category: "Controllers" },
  { Value: "Dual Force Feedback", Display: true, Category: "Audio" },
  { Value: "Controller Weight: --", Display: true, Category: "Controllers" },
  { Value: "Buttons: --", Display: true, Category: "Controllers" },
  { Value: "Maximum External Memory", Display: false, Category: "Storage" },
];

const consoleCategories = [
  [
    "Brand",
    "Name",
    "CPU",
    "GPU",
    "RAM",
    "Storage",
    "Display",
    "Height",
    "Width",
    "Length",
    "Size",
    "Weight",
    "Operating Temperature",
    "Ports",
    "Games",
    "Connectivity",
    "Audio",
    "Power",
    "Portability",
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
  const [category, setCategory] = useState(3);

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

  let consolesHeight = [];
  let consolesSetHeight = [];

  for (i = 0; i < consoleCategories[0].length; i++) {
    const [height, setHeight] = useState(39);
    consolesHeight.push(height);
    consolesSetHeight.push(setHeight);
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

  const callConsoleCloudFunction = async (product) => {
    try {
      const GetConsoles = httpsCallable(functions, "GetConsoles");
      const result = await GetConsoles(product);
      return result.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const [droneSpecs, setDroneSpecs] = useState(droneCategories);
  const [consoleSpecs, setConsoleSpecs] = useState(consoleCategories);

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

        {/* Compare Consoles screen */}
        {category == 3 && (
          <Compare
            type={"Consoles"}
            setCategory={setCategory}
            Brands={consoleBrands}
            Process={consoleProcess}
            MatchingArray={consoleMatchingArray}
            DefaultArray={consoleDefaultArray}
            Categories={consoleCategories}
            Specs={consoleSpecs}
            setSpecs={setConsoleSpecs}
            Height={consolesHeight}
            SetHeight={consolesSetHeight}
            CloudFunction={callConsoleCloudFunction}
          ></Compare>
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
