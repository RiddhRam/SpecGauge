// Bootstrap design
import "bootstrap/dist/css/bootstrap.css";
import WebDefaultPage from "./Web/components/WebDefaultPage";
import WebHome from "./Web/components/WebHome";
import NoPage from "./Web/components/NoPage";
import WebLogIn from "./Web/components/accounts/WebLogIn";
import WebUserAccount from "./Web/components/accounts/WebUserAccount";
import Compare from "./Web/components/compare/Compare";
import PredictionAnalysis from "./Web/components/predict/PredictionAnalysis";
import Information from "./Web/components/Information";

import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Text } from "react-native-web";
import { SGStyles } from "./styles/styles";

import * as amplitude from "@amplitude/analytics-react-native";

// Firebase
import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  initializeAuth,
  onAuthStateChanged,
} from "firebase/auth";
import {
  query,
  where,
  getFirestore,
  collection,
  getDocs,
} from "firebase/firestore";
import { useWindowDimensions } from "react-native";

/*amplitude.init("2f7a0b5502e80160174b1723e01a117d", null, {
  logLevel: amplitude.Types.LogLevel.None,
});*/

const firebaseConfig = {
  apiKey: "AIzaSyA10cNsdHKS-hVwScviUKrmcXbduduTFVA",
  authDomain: "specgauge-6226e.firebaseapp.com",
  projectId: "specgauge-6226e",
  storageBucket: "specgauge-6226e.appspot.com",
  messagingSenderId: "497900705831",
  appId: "1:497900705831:web:632c2bfe74cb3f98ea9602",
  measurementId: "G-HERKE02P50",
};

// Initialize firebase
const app = initializeApp(firebaseConfig);
//connectFunctionsEmulator(functions, "127.0.0.1", 5001);
const db = getFirestore();

const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
});

// This determines how many steps the user has to go through when adding a product
const consoleProcess = ["a brand", "a console"];

// This is used when filtering out items in the selection modal whenever user clicks something
const consoleQueryProcess = ["Brand", "Name"];

// Brands are preloaded
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

const consoleDefaultArray = [
  {
    Value: "--",
    Display: true,
    Category: "Brand",
    Matching: "Brand",
    Mandatory: false,
    Type: "S",
    Preference: false,
    Important: false,
    HigherNumber: false,
  },
  {
    Value: "--",
    Display: true,
    Category: "Name",
    Matching: "Name",
    Mandatory: false,
    Type: "S",
    Preference: false,
    Important: false,
    HigherNumber: false,
  },
  {
    Value: "Add at least 2 items to view the pros",
    Display: true,
    Category: "Pros",
    Matching: "Pros",
    Mandatory: false,
    Type: "S",
    Preference: false,
    Important: false,
    HigherNumber: false,
  },
  {
    Value: "Clock Speed: --",
    Display: true,
    Category: "CPU",
    Matching: "cpu speed",
    Mandatory: true,
    Type: "S",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Floating-Point Performance: --",
    Display: true,
    Category: "CPU",
    Matching: "floating-point performance",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Capacity: --",
    Display: true,
    Category: "RAM",
    Matching: "ram",
    Mandatory: true,
    Type: "S",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Clock Speed: --",
    Display: true,
    Category: "GPU",
    Matching: "gpu clock speed",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Ray Tracing",
    Display: false,
    Category: "GPU",
    Matching: "supports ray tracing",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "I/O Throughput: --",
    Display: true,
    Category: "Storage",
    Matching: "i/o throughput",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "GDDR Version: --",
    Display: true,
    Category: "GPU",
    Matching: "gddr version",
    Mandatory: true,
    Type: "S",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "NVME SSD",
    Display: false,
    Category: "Storage",
    Matching: "is an nvme ssd",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Bandwidth: --",
    Display: true,
    Category: "RAM",
    Matching: "memory bandwidth",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Accepts External Drive",
    Display: false,
    Category: "Storage",
    Matching: "can connect to an external drive",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Shading Units: --",
    Display: true,
    Category: "GPU",
    Matching: "shading units",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Compute Units: --",
    Display: true,
    Category: "GPU",
    Matching: "number of compute units",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "ROPs: --",
    Display: true,
    Category: "GPU",
    Matching: "render output units (rops)",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Uses Multithreading",
    Display: false,
    Category: "CPU",
    Matching: "uses multithreading",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Refresh Rate: --",
    Display: true,
    Category: "Display",
    Matching: "refresh rate",
    Mandatory: true,
    Type: "S",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "DDR Version: --",
    Display: true,
    Category: "RAM",
    Matching: "ddr memory version",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Clock Speed: --",
    Display: true,
    Category: "RAM",
    Matching: "ram speed",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "--",
    Display: true,
    Category: "Portability",
    Matching: "type",
    Mandatory: true,
    Type: "S",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Max Resolution: --",
    Display: true,
    Category: "Display",
    Matching: "output resolution",
    Mandatory: true,
    Type: "S",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Replaceable Hard Drive",
    Display: false,
    Category: "Storage",
    Matching: "hard drive is replaceable",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Internal Power Supply",
    Display: false,
    Category: "Power",
    Matching: "has an internal power supply",
    Mandatory: false,
    Type: "B",
    Preference: false,
    Important: false,
    HigherNumber: false,
  },
  {
    Value: "Internal Storage",
    Display: false,
    Category: "Storage",
    Matching: "internal storage",
    Mandatory: true,
    Type: "S",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Region Free",
    Display: false,
    Category: "Games",
    Matching: "is region free",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "--",
    Display: true,
    Category: "Height",
    Matching: "thickness",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "--",
    Display: true,
    Category: "Width",
    Matching: "width",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "--",
    Display: true,
    Category: "Length",
    Matching: "height",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "--",
    Display: true,
    Category: "Size",
    Matching: "volume",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Optical Disc Drive",
    Display: false,
    Category: "Ports",
    Matching: "has an optical disc drive",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "--",
    Display: true,
    Category: "Weight",
    Matching: "weight",
    Mandatory: true,
    Type: "S",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Maximum Operating Temperature: --",
    Display: true,
    Category: "Operating Temperature",
    Matching: "maximum operating temperature",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Minimum Operating Temperature: --",
    Display: true,
    Category: "Operating Temperature",
    Matching: "lowest potential operating temperature",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Battery Capacity: --",
    Display: true,
    Category: "Power",
    Matching: "battery power",
    Mandatory: false,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "3.5mm Audio",
    Display: false,
    Category: "Ports",
    Matching: "has a socket for a 3.5 mm audio jack",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Wi-Fi",
    Display: false,
    Category: "Connectivity",
    Matching: "supports wi-fi",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Wi-Fi Version: --",
    Display: true,
    Category: "Connectivity",
    Matching: "wi-fi version",
    Mandatory: true,
    Type: "S",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "DLNA-Certified",
    Display: false,
    Category: "Connectivity",
    Matching: "is dlna-certified",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "USB Ports: --",
    Display: true,
    Category: "Ports",
    Matching: "usb ports",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "HDMI",
    Display: false,
    Category: "Ports",
    Matching: "has an hdmi output",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "HDMI Version: --",
    Display: true,
    Category: "Ports",
    Matching: "hdmi version",
    Mandatory: true,
    Type: "S",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "External Memory Slot",
    Display: false,
    Category: "Storage",
    Matching: "has an external memory slot",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Remote Play",
    Display: false,
    Category: "Connectivity",
    Matching: "supports connectivity between home and portable devices",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "USB Version: --",
    Display: true,
    Category: "Ports",
    Matching: "usb version",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "USB Type-C",
    Display: false,
    Category: "Ports",
    Matching: "has usb type-c",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Cellular Data",
    Display: false,
    Category: "Connectivity",
    Matching: "has a cellular module",
    Mandatory: false,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "NFC",
    Display: false,
    Category: "Connectivity",
    Matching: "has nfc",
    Mandatory: false,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Ethernet Ports: --",
    Display: true,
    Category: "Connectivity",
    Matching: "rj45 ports",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Games (as of last database update): --",
    Display: true,
    Category: "Games",
    Matching: "number of games",
    Mandatory: false,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Exclusive Games (as of last database update): --",
    Display: true,
    Category: "Games",
    Matching: "number of exclusive games",
    Mandatory: false,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Voice Commands",
    Display: false,
    Category: "Audio",
    Matching: "has voice commands",
    Mandatory: false,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Backwards Compatible",
    Display: false,
    Category: "Games",
    Matching: "backwards compatibility",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Play As You Download",
    Display: false,
    Category: "Games",
    Matching: "can play games while they download",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Quick Resume",
    Display: false,
    Category: "Games",
    Matching: "supports quick resume",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Discord",
    Display: false,
    Category: "Audio",
    Matching: "supports discord voice chat",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "3D Audio",
    Display: false,
    Category: "Audio",
    Matching: "supports 3d audio",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Dolby Vision",
    Display: false,
    Category: "Display",
    Matching: "supports dolby vision",
    Mandatory: false,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "VR",
    Display: false,
    Category: "Display",
    Matching: "supports vr",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "4k Blu-ray Drive",
    Display: false,
    Category: "Ports",
    Matching: "has a 4k blu-ray drive",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Sound Output Channel: --",
    Display: true,
    Category: "Audio",
    Matching: "number of channels of sound output",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Optical Tracking",
    Display: false,
    Category: "Controllers",
    Matching: "has optical tracking",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Blu-ray",
    Display: false,
    Category: "Display",
    Matching: "can play blu-ray discs",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "High Scores and Achievements",
    Display: false,
    Category: "Games",
    Matching: "access high scores and achievements",
    Mandatory: false,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "3D",
    Display: false,
    Category: "Display",
    Matching: "supports 3d",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Flash Storage",
    Display: false,
    Category: "Storage",
    Matching: "uses flash storage",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Child Lock",
    Display: false,
    Category: "Games",
    Matching: "has a child lock",
    Mandatory: false,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Maximum Controllers: --",
    Display: true,
    Category: "Controllers",
    Matching: "number of controllers",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Adaptive Triggers",
    Display: false,
    Category: "Controllers",
    Matching: "has adaptive triggers",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Motion-Sensing Compatible",
    Display: false,
    Category: "Controllers",
    Matching: "compatible with a motion-sensing controller(s)",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Supports Wireless Controllers",
    Display: false,
    Category: "Controllers",
    Matching: "has a wireless controller",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Analog Sticks: --",
    Display: true,
    Category: "Controllers",
    Matching: "number of analog sticks",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Integrated Touchpad",
    Display: false,
    Category: "Controllers",
    Matching: "has an integrated touchpad",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Dual Force Feedback",
    Display: true,
    Category: "Audio",
    Matching: "has dual force feedback",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Controller Weight: --",
    Display: true,
    Category: "Controllers",
    Matching: "controller weight",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Buttons: --",
    Display: true,
    Category: "Controllers",
    Matching: "number of buttons",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Maximum External Memory",
    Display: false,
    Category: "Storage",
    Matching: "maximum amount of external memory supported",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
];

// This determines how many rows to show in the table, each item is 1 column, each item within the item is a row.
// To add a product, the specs are added to the '-Specs' array in the corresponding category. '-Specs' array is below
const consoleCategories = [
  [
    "Brand",
    "Name",
    "Pros",
    "CPU",
    "GPU",
    "RAM",
    "Storage",
    "Display",
    "Controllers",
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

const droneProcess = ["a brand", "a drone"];
const droneQueryProcess = ["Brand", "Name"];
const droneBrands = [
  "Autel",
  "DJI",
  "Holy Stone",
  "Parrot",
  "Potensic",
  "Ryze",
  "Snaptain",
];
const droneDefaultArray = [
  {
    Value: "--",
    Display: true,
    Category: "Brand",
    Matching: "Brand",
    Mandatory: false,
    Type: "S",
    Preference: false,
    Important: false,
    HigherNumber: true,
  },
  {
    Value: "--",
    Display: true,
    Category: "Name",
    Matching: "Name",
    Mandatory: false,
    Type: "S",
    Preference: false,
    Important: false,
    HigherNumber: true,
  },
  {
    Value: "Add at least 2 items to view the pros",
    Display: true,
    Category: "Pros",
    Matching: "Pros",
    Mandatory: false,
    Type: "S",
    Preference: false,
    Important: false,
    HigherNumber: false,
  },
  {
    Value: "Weather-Sealed",
    Display: false,
    Category: "Structural Features",
    Matching: "is weather-sealed (splashproof)",
    Mandatory: false,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Dustproof and Water-Resistant",
    Display: false,
    Category: "Structural Features",
    Matching: "is dustproof and water-resistant",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "--",
    Display: true,
    Category: "Size",
    Matching: "volume",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "--",
    Display: true,
    Category: "Weight",
    Matching: "weight",
    Mandatory: true,
    Type: "SU",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Minimum operating temperature: --",
    Display: true,
    Category: "Operating Temperature",
    Matching: "lowest potential operating temperature",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Maximum operating temperature: --",
    Display: true,
    Category: "Operating Temperature",
    Matching: "maximum operating temperature",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "--",
    Display: true,
    Category: "Height",
    Matching: "height",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "--",
    Display: true,
    Category: "Width",
    Matching: "thickness",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "--",
    Display: true,
    Category: "Length",
    Matching: "width",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "--",
    Display: true,
    Category: "Flight Time (1 battery)",
    Matching: "maximum flight time",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "--",
    Display: true,
    Category: "Maximum Flight Distance",
    Matching: "maximum flight distance",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "--",
    Display: true,
    Category: "Top Speed",
    Matching: "maximum flight speed",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Obstacle Detection",
    Display: false,
    Category: "Controls",
    Matching: "obstacle detection",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Intelligent Flight Modes",
    Display: false,
    Category: "Controls",
    Matching: "intelligent flight modes",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Return-to-Home",
    Display: false,
    Category: "Controls",
    Matching: "return to home (rth)",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Megapixels: --",
    Display: true,
    Category: "Camera",
    Matching: "megapixels (main camera)",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Maximum ISO: --",
    Display: true,
    Category: "Camera",
    Matching: "maximum iso",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "RAW Photos",
    Display: false,
    Category: "Camera Features",
    Matching: "shoots raw",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Video Bitrate: --",
    Display: true,
    Category: "Camera",
    Matching: "movie bitrate",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Video Quality: --",
    Display: true,
    Category: "Camera",
    Matching: "video recording (main camera)",
    Mandatory: true,
    Type: "S",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Field of View: --",
    Display: true,
    Category: "Camera",
    Matching: "field of view",
    Mandatory: true,
    Type: "S",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "HDR mode",
    Display: false,
    Category: "Camera Features",
    Matching: "has a built-in hdr mode",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Serial Shot mode",
    Display: false,
    Category: "Camera Features",
    Matching: "has a serial shot mode",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "CMOS Sensor",
    Display: false,
    Category: "Camera",
    Matching: "has a cmos sensor",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Panoramic mode",
    Display: false,
    Category: "Camera Features",
    Matching: "can create panoramas in-camera",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "24p Cinema mode",
    Display: false,
    Category: "Camera Features",
    Matching: "has a 24p cinema mode",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Burst Shot mode: --",
    Display: true,
    Category: "Camera Features",
    Matching: "continuous shooting at high resolution",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "FPV Camera",
    Display: false,
    Category: "Camera",
    Matching: "fpv camera",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Sensor Size: --",
    Display: true,
    Category: "Camera",
    Matching: "sensor size",
    Mandatory: true,
    Type: "S",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Battery Capacity (1 battery): --",
    Display: true,
    Category: "Battery",
    Matching: "battery power",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Charge Time (1 battery): --",
    Display: true,
    Category: "Battery",
    Matching: "charge time",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Removable",
    Display: false,
    Category: "Battery",
    Matching: "has a removable battery",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "External Memory Slot",
    Display: false,
    Category: "Memory and Storage",
    Matching: "has an external memory slot",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "GPS",
    Display: false,
    Category: "Controls",
    Matching: "has gps",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Gyroscope",
    Display: false,
    Category: "Controls",
    Matching: "has a gyroscope",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Internal Storage: --",
    Display: true,
    Category: "Memory and Storage",
    Matching: "internal storage",
    Mandatory: false,
    Type: "S",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Remote Smartphone Control",
    Display: false,
    Category: "Controls",
    Matching: "supports a remote smartphone",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Compass",
    Display: false,
    Category: "Controls",
    Matching: "has a compass",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Accelerometer",
    Display: false,
    Category: "Controls",
    Matching: "has an accelerometer",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Maximum external memory: --",
    Display: true,
    Category: "Memory and Storage",
    Matching: "maximum amount of external memory supported",
    Mandatory: false,
    Type: "S",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Remote Control",
    Display: false,
    Category: "Controls",
    Matching: "has a remote control",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Built-in Display",
    Display: false,
    Category: "Controls",
    Matching: "has a display",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
];
const droneCategories = [
  [
    "Brand",
    "Name",
    "Pros",
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

const graphicsCardsProcess = ["a brand", "a generation", "a graphics card"];
const graphicsCardsQueryProcess = ["Brand", "Generation", "Card"];
const graphicsCardsBrands = ["AMD", "Intel", "NVIDIA"];
const graphicsCardsDefaultArray = [
  {
    Value: "--",
    Display: true,
    Category: "Brand",
    Matching: "Brand",
    Mandatory: false,
    Type: "S",
    Preference: false,
    Important: false,
    HigherNumber: false,
  },
  {
    Value: "--",
    Display: true,
    Category: "Generation",
    Matching: "Generation",
    Mandatory: false,
    Type: "S",
    Preference: false,
    Important: false,
    HigherNumber: false,
  },
  {
    Value: "--",
    Display: true,
    Category: "Card",
    Matching: "Card",
    Mandatory: false,
    Type: "S",
    Preference: false,
    Important: false,
    HigherNumber: false,
  },
  {
    Value: "Add at least 2 items to view the pros",
    Display: true,
    Category: "Pros",
    Matching: "Pros",
    Mandatory: false,
    Type: "S",
    Preference: false,
    Important: false,
    HigherNumber: false,
  },
  {
    Value: "GPU: --",
    Display: true,
    Category: "GPU",
    Matching: "GPU",
    Mandatory: false,
    Type: "S",
    Preference: false,
    Important: false,
    HigherNumber: false,
  },
  {
    Value: "Transistor size: --",
    Display: true,
    Category: "GPU",
    Matching: "Transistor size",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Transistors: --",
    Display: true,
    Category: "GPU",
    Matching: "Transistors",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Transistor Density: --",
    Display: true,
    Category: "GPU",
    Matching: "Transistor Density",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Die Size: --",
    Display: true,
    Category: "GPU",
    Matching: "Die Size",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Release Date: --",
    Display: true,
    Category: "Release Info",
    Matching: "Release Date (Availability)",
    Mandatory: false,
    Type: "S",
    Preference: false,
    Important: false,
    HigherNumber: false,
  },
  {
    Value: "MSRP at launch: --",
    Display: true,
    Category: "Release Info",
    Matching: "MSRP at launch",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "PCI Slot: --",
    Display: true,
    Category: "Board",
    Matching: "PCI Slot",
    Mandatory: true,
    Type: "S",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Shading units: --",
    Display: true,
    Category: "Rendering",
    Matching: "Shading units",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "TMUs: --",
    Display: true,
    Category: "Rendering",
    Matching: "TMUs",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "ROPs: --",
    Display: true,
    Category: "Rendering",
    Matching: "ROPs",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Compute Units: --",
    Display: true,
    Category: "GPU",
    Matching: "Compute Units",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Tensor Cores: --",
    Display: true,
    Category: "Rendering",
    Matching: "Tensor Cores",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "RT Cores: --",
    Display: true,
    Category: "Rendering",
    Matching: "RT Cores",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "L0 Cache: --",
    Display: true,
    Category: "Cache",
    Matching: "L0 Cache",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "L1 Cache: --",
    Display: true,
    Category: "Cache",
    Matching: "L1 Cache",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "L2 Cache: --",
    Display: true,
    Category: "Cache",
    Matching: "L2 Cache",
    Mandatory: true,
    Type: "SU",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "L3 Cache: --",
    Display: true,
    Category: "Cache",
    Matching: "L3 Cache",
    Mandatory: false,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Base Clock: --",
    Display: true,
    Category: "GPU",
    Matching: "Base clock",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Boost Clock: --",
    Display: true,
    Category: "GPU",
    Matching: "Boost clock",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Memory Clock: --",
    Display: true,
    Category: "Memory",
    Matching: "Memory Clock",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Memory Size and Type: --",
    Display: true,
    Category: "Memory",
    Matching: "Memory Size and Type",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Memory Bus: --",
    Display: true,
    Category: "Memory",
    Matching: "Memory Bus",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Memory Bandwidth: --",
    Display: true,
    Category: "Memory",
    Matching: "Memory Bandwidth",
    Mandatory: true,
    Type: "SU",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Outputs: --",
    Display: true,
    Category: "Board",
    Matching: "Outputs",
    Mandatory: false,
    Type: "N",
    Preference: false,
    Important: false,
    HigherNumber: false,
  },
  {
    Value: "Length: --",
    Display: true,
    Category: "Board",
    Matching: "Length",
    Mandatory: false,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Width: --",
    Display: true,
    Category: "Board",
    Matching: "Width",
    Mandatory: false,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Height: --",
    Display: true,
    Category: "Board",
    Matching: "Height",
    Mandatory: false,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "TDP: --",
    Display: true,
    Category: "Board",
    Matching: "TDP",
    Mandatory: false,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Pixel Rate: --",
    Display: true,
    Category: "Performance",
    Matching: "Pixel Rate",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Texture Rate: --",
    Display: true,
    Category: "Performance",
    Matching: "Texture Rate",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "FP32 TeraFlops: --",
    Display: true,
    Category: "Performance",
    Matching: "FP32 TeraFlops",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
];
const graphicsCardsCategories = [
  [
    "Brand",
    "Generation",
    "Card",
    "Pros",
    "GPU",
    "Memory",
    "Cache",
    "Release Info",
    "Board",
    "Rendering",
    "Performance",
  ],
];

const CPUsProcess = ["a brand", "a generation", "a processor"];
const CPUsQueryProcess = ["Brand", "Generation", "CPU"];
const CPUsBrands = ["AMD", "Intel"];
const CPUsDefaultArray = [
  {
    Value: "--",
    Display: true,
    Category: "Brand",
    Matching: "Brand",
    Mandatory: false,
    Type: "S",
    Preference: false,
    Important: false,
    HigherNumber: true,
  },
  {
    Value: "--",
    Display: true,
    Category: "Generation",
    Matching: "Generation",
    Mandatory: false,
    Type: "S",
    Preference: false,
    Important: false,
    HigherNumber: true,
  },
  {
    Value: "CPU: --",
    Display: true,
    Category: "CPU",
    Matching: "CPU",
    Mandatory: false,
    Type: "S",
    Preference: false,
    Important: false,
    HigherNumber: true,
  },
  {
    Value: "Add at least 2 items to view the pros",
    Display: true,
    Category: "Pros",
    Matching: "Pros",
    Mandatory: false,
    Type: "S",
    Preference: false,
    Important: false,
    HigherNumber: false,
  },
  {
    Value: "Socket: --",
    Display: true,
    Category: "Platform",
    Matching: "Socket",
    Mandatory: false,
    Type: "S",
    Preference: false,
    Important: false,
    HigherNumber: true,
  },
  {
    Value: "Process Size: --",
    Display: true,
    Category: "Architecture",
    Matching: "Process Size",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Transistors: --",
    Display: true,
    Category: "Architecture",
    Matching: "Transistors",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Die Size: --",
    Display: true,
    Category: "Architecture",
    Matching: "Die Size",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "I/O Process Size: --",
    Display: true,
    Category: "Architecture",
    Matching: "I/O Process Size",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "I/O Transistors: --",
    Display: true,
    Category: "Architecture",
    Matching: "I/O Transistors",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "I/O Die Size: --",
    Display: true,
    Category: "Architecture",
    Matching: "I/O Die Size",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "tCaseMax: --",
    Display: true,
    Category: "Thermal",
    Matching: "tCaseMax",
    Mandatory: true,
    Type: "S",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "tJMax: --",
    Display: true,
    Category: "Thermal",
    Matching: "tJMax",
    Mandatory: true,
    Type: "S",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Market: --",
    Display: true,
    Category: "Platform",
    Matching: "Market",
    Mandatory: false,
    Type: "S",
    Preference: true,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Release Date: --",
    Display: true,
    Category: "Platform",
    Matching: "Release Date",
    Mandatory: false,
    Type: "S",
    Preference: false,
    Important: false,
    HigherNumber: false,
  },
  {
    Value: "# of Cores: --",
    Display: true,
    Category: "CPU",
    Matching: "# of Cores",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "# of Threads: --",
    Display: true,
    Category: "CPU",
    Matching: "# of Threads",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Hybrid Cores: --",
    Display: false,
    Category: "CPU",
    Matching: "Hybrid Cores",
    Mandatory: false,
    Type: "S",
    Preference: false,
    Important: false,
    HigherNumber: false,
  },
  {
    Value: "LP E-Cores: --",
    Display: false,
    Category: "CPU",
    Matching: "LP E-Cores",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "SMP # CPUs: --",
    Display: true,
    Category: "CPU",
    Matching: "SMP # CPUs",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Integrated Graphics: --",
    Display: true,
    Category: "Sub-Processors",
    Matching: "Integrated Graphics",
    Mandatory: false,
    Type: "S",
    Preference: false,
    Important: false,
    HigherNumber: false,
  },
  {
    Value: "Frequency: --",
    Display: true,
    Category: "Clock",
    Matching: "Frequency",
    Mandatory: true,
    Type: "SU",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Turbo Clock: --",
    Display: true,
    Category: "Clock",
    Matching: "Turbo Clock",
    Mandatory: true,
    Type: "S",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Base Clock: --",
    Display: true,
    Category: "Clock",
    Matching: "Base Clock",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "E-Core Frequency: --",
    Display: false,
    Category: "CPU",
    Matching: "E-Core Frequency",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "LP E-Core Boost: --",
    Display: false,
    Category: "CPU",
    Matching: "LP E-Core Boost",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Multiplier: --",
    Display: true,
    Category: "Clock",
    Matching: "Multiplier",
    Mandatory: true,
    Type: "S",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Overclockable",
    Display: false,
    Category: "Clock",
    Matching: "Multiplier Unlocked",
    Mandatory: true,
    Type: "B",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "NPU: --",
    Display: true,
    Category: "Sub-Processors",
    Matching: "AI Boost NPU",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "TDP: --",
    Display: true,
    Category: "Thermal",
    Matching: "TDP",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Maximum Power: --",
    Display: true,
    Category: "Power",
    Matching: "Maximum Power",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Memory Support: --",
    Display: true,
    Category: "Memory",
    Matching: "Memory Support",
    Mandatory: true,
    Type: "S",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Rated Speed: --",
    Display: false,
    Category: "Memory",
    Matching: "Rated Speed",
    Mandatory: false,
    Type: "N",
    Preference: false,
    Important: false,
    HigherNumber: false,
  },
  {
    Value: "DDR1 Speed: --",
    Display: false,
    Category: "Memory",
    Matching: "DDR1 Speed",
    Mandatory: false,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "DDR2 Speed: --",
    Display: false,
    Category: "Memory",
    Matching: "DDR2 Speed",
    Mandatory: false,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "DDR3 Speed: --",
    Display: false,
    Category: "Memory",
    Matching: "DDR3 Speed",
    Mandatory: false,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "DDR4 Speed: --",
    Display: false,
    Category: "Memory",
    Matching: "DDR4 Speed",
    Mandatory: false,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "DDR5 Speed: --",
    Display: false,
    Category: "Memory",
    Matching: "DDR5 Speed",
    Mandatory: false,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "LPDDR1 Speed: --",
    Display: false,
    Category: "Memory",
    Matching: "LPDDR1 Speed",
    Mandatory: false,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "LPDDR2 Speed: --",
    Display: false,
    Category: "Memory",
    Matching: "LPDDR2 Speed",
    Mandatory: false,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "LPDDR3 Speed: --",
    Display: false,
    Category: "Memory",
    Matching: "LPDDR3 Speed",
    Mandatory: false,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "LPDDR4 Speed: --",
    Display: false,
    Category: "Memory",
    Matching: "LPDDR4 Speed",
    Mandatory: false,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "LPDDR4X Speed: --",
    Display: false,
    Category: "Memory",
    Matching: "LPDDR4X Speed",
    Mandatory: false,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "LPDDR5 Speed: --",
    Display: false,
    Category: "Memory",
    Matching: "LPDDR5 Speed",
    Mandatory: false,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "LPDDR5X Speed: --",
    Display: false,
    Category: "Memory",
    Matching: "LPDDR5x Speed",
    Mandatory: false,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Max Memory: --",
    Display: true,
    Category: "Memory",
    Matching: "Max. Memory",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Memory Bus: --",
    Display: true,
    Category: "Memory",
    Matching: "Memory Bus",
    Mandatory: true,
    Type: "S",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "ECC Memory",
    Display: false,
    Category: "Memory",
    Matching: "ECC Memory",
    Mandatory: true,
    Type: "S",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "PCI-Express: --",
    Display: true,
    Category: "PCI",
    Matching: "PCI-Express",
    Mandatory: true,
    Type: "S",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Secondary PCIe: --",
    Display: true,
    Category: "PCI",
    Matching: "Secondary PCIe",
    Mandatory: true,
    Type: "S",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Tertiary PCIe: --",
    Display: true,
    Category: "PCI",
    Matching: "Tertiary PCIe",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Cache L1: --",
    Display: true,
    Category: "Cache",
    Matching: "Cache L1",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Cache L2: --",
    Display: true,
    Category: "Cache",
    Matching: "Cache L2",
    Mandatory: true,
    Type: "SU",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Cache L3: --",
    Display: true,
    Category: "Cache",
    Matching: "Cache L3",
    Mandatory: false,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "E-Core L1: --",
    Display: true,
    Category: "Cache",
    Matching: "E-Core L1",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "E-Core L2: --",
    Display: true,
    Category: "Cache",
    Matching: "E-Core L2",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "MSRP: --",
    Display: true,
    Category: "Platform",
    Matching: "Launch Price",
    Mandatory: true,
    Type: "S",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Motherboards: --",
    Display: true,
    Category: "Platform",
    Matching: "Chipsets",
    Mandatory: false,
    Type: "N",
    Preference: false,
    Important: false,
    HigherNumber: true,
  },
  {
    Value: "PL1: --",
    Display: true,
    Category: "Power",
    Matching: "PL1",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "PL2: --",
    Display: true,
    Category: "Power",
    Matching: "PL2",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "FP32: --",
    Display: true,
    Category: "Performance",
    Matching: "FP32",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Bundled Cooler: --",
    Display: true,
    Category: "Thermal",
    Matching: "Bundled Cooler",
    Mandatory: true,
    Type: "S",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
];
const CPUsCategories = [
  [
    "Brand",
    "Generation",
    "CPU",
    "Pros",
    "Clock",
    "Architecture",
    "Thermal",
    "Platform",
    "Sub-Processors",
    "Power",
    "Memory",
    "PCI",
    "Cache",
    "Performance",
  ],
];

const carsProcess = ["a brand", "a model", "a year", "a trim"];
const carsQueryProcess = ["Brand", "Model", "Year", "Trim"];
const carsBrands = [
  "Acura",
  "Alfa Romeo",
  "Aston Martin",
  "Audi",
  "Bentley",
  "BMW",
  "Bugatti",
  "Buick",
  "BYD",
  "Cadillac",
  "Chevrolet",
  "Chrysler",
  "Citroen",
  "Daewoo",
  "Dodge",
  "Ferrari",
  "Fiat",
  "Fisker",
  "Ford",
  "Genesis",
  "GMC",
  "Hennessey",
  "Honda",
  "Hummer",
  "Hyundai",
  "INEOS",
  "Infiniti",
  "Isuzu",
  "Jaguar",
  "Jeep",
  "Karma",
  "Kia",
  "Koenigsegg",
  "KTM",
  "Lamborghini",
  "Land Rover",
  "Lexus",
  "Lincoln",
  "Lotus",
  "Lucid",
  "Maserati",
  "Maybach",
  "Mazda",
  "McLaren",
  "Mercedes-Benz",
  "Mercury",
  "Mini",
  "Mitsubishi",
  "Nissan",
  "Oldsmobile",
  "Opel",
  "Pagani",
  "Panoz",
  "Peugeot",
  "Plymouth",
  "Polestar",
  "Pontiac",
  "Porsche",
  "RAM",
  "Renault",
  "Rimac",
  "Rivian",
  "Rolls-Royce",
  "Saab",
  "Saturn",
  "Scion",
  "Smart",
  "Spyker",
  "Subaru",
  "Suzuki",
  "Tata",
  "Tesla",
  "Toyota",
  "VinFast",
  "Volkswagen",
  "Volvo",
  "Xiaomi",
];
const carsDefaultArray = [
  {
    Value: "--",
    Display: true,
    Category: "Brand",
    Matching: "Brand",
    Mandatory: false,
    Type: "S",
    Preference: false,
    Important: false,
    HigherNumber: true,
  },
  {
    Value: "--",
    Display: true,
    Category: "Model",
    Matching: "Model",
    Mandatory: false,
    Type: "S",
    Preference: false,
    Important: false,
    HigherNumber: true,
  },
  {
    Value: "--",
    Display: true,
    Category: "Year",
    Matching: "Year",
    Mandatory: false,
    Type: "S",
    Preference: false,
    Important: false,
    HigherNumber: true,
  },
  {
    Value: "--",
    Display: true,
    Category: "Trim",
    Matching: "Trim",
    Mandatory: false,
    Type: "S",
    Preference: false,
    Important: false,
    HigherNumber: true,
  },
  {
    Value: "Add at least 2 items to view the pros",
    Display: true,
    Category: "Pros",
    Matching: "Pros",
    Mandatory: false,
    Type: "S",
    Preference: false,
    Important: false,
    HigherNumber: false,
  },
  {
    Value: "Body Type: --",
    Display: true,
    Category: "Body",
    Matching: "Body Type",
    Mandatory: false,
    Type: "S",
    Preference: true,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Powertrain: --",
    Display: true,
    Category: "Motor",
    Matching: "Powertrain",
    Mandatory: false,
    Type: "S",
    Preference: true,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Drivetrain: --",
    Display: true,
    Category: "Motor",
    Matching: "Drivetrain",
    Mandatory: false,
    Type: "S",
    Preference: true,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Seats: --",
    Display: true,
    Category: "Design",
    Matching: "Seats",
    Mandatory: true,
    Type: "N",
    Preference: true,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Doors: --",
    Display: true,
    Category: "Design",
    Matching: "Doors",
    Mandatory: true,
    Type: "N",
    Preference: true,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Fuel Consumption (City): --",
    Display: false,
    Category: "Fuel/Battery",
    Matching: "Fuel Consumption (City)",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Fuel Consumption (Highway): --",
    Display: false,
    Category: "Fuel/Battery",
    Matching: "Fuel Consumption (Highway)",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Fuel Consumption (Combined): --",
    Display: false,
    Category: "Fuel/Battery",
    Matching: "Fuel Consumption (Combined)",
    Mandatory: false,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Fuel Type: --",
    Display: true,
    Category: "Fuel/Battery",
    Matching: "Fuel Type",
    Mandatory: false,
    Type: "S",
    Preference: true,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Power: --",
    Display: true,
    Category: "Motor",
    Matching: "Power",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Torque: --",
    Display: true,
    Category: "Motor",
    Matching: "Torque",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Valvetrain: --",
    Display: false,
    Category: "Motor",
    Matching: "Valvetrain",
    Mandatory: false,
    Type: "S",
    Preference: true,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Valves: --",
    Display: false,
    Category: "Motor",
    Matching: "Valves",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Cylinders: --",
    Display: false,
    Category: "Motor",
    Matching: "Cylinders",
    Mandatory: true,
    Type: "S",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Engine aspiration: --",
    Display: false,
    Category: "Motor",
    Matching: "Engine aspiration",
    Mandatory: false,
    Type: "S",
    Preference: true,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Curb Weight: --",
    Display: true,
    Category: "Body",
    Matching: "Curb Weight",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Length: --",
    Display: true,
    Category: "Body",
    Matching: "Length",
    Mandatory: false,
    Type: "N",
    Preference: true,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Width: --",
    Display: true,
    Category: "Body",
    Matching: "Width",
    Mandatory: false,
    Type: "N",
    Preference: true,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Height: --",
    Display: true,
    Category: "Body",
    Matching: "Height",
    Mandatory: false,
    Type: "N",
    Preference: true,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Wheelbase: --",
    Display: true,
    Category: "Body",
    Matching: "Wheelbase",
    Mandatory: false,
    Type: "N",
    Preference: true,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Tire Size: --",
    Display: true,
    Category: "Design",
    Matching: "Tire Size",
    Mandatory: false,
    Type: "N",
    Preference: false,
    Important: false,
    HigherNumber: true,
  },
  {
    Value: "Rim Size: --",
    Display: true,
    Category: "Design",
    Matching: "Rim size",
    Mandatory: false,
    Type: "N",
    Preference: false,
    Important: false,
    HigherNumber: true,
  },
  {
    Value: "Gears: --",
    Display: true,
    Category: "Motor",
    Matching: "Gears",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Transmission: --",
    Display: true,
    Category: "Motor",
    Matching: "Transmission",
    Mandatory: false,
    Type: "S",
    Preference: true,
    Important: true,
    HigherNumber: false,
  },
  {
    Value: "Battery Capacity: --",
    Display: false,
    Category: "Fuel/Battery",
    Matching: "Battery Capacity",
    Mandatory: true,
    Type: "N",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
  {
    Value: "Electric Range: --",
    Display: false,
    Category: "Fuel/Battery",
    Matching: "Electric Range",
    Mandatory: true,
    Type: "S",
    Preference: false,
    Important: true,
    HigherNumber: true,
  },
];
const carsCategories = [
  [
    "Brand",
    "Model",
    "Year",
    "Trim",
    "Pros",
    "Body",
    "Motor",
    "Design",
    "Fuel/Battery",
  ],
];

const fast = -0.14;
const normal = -0.11;
const reliable = -0.05;
const expensiveSport = -0.04;
const superCar = -0.03;

const automobilesAveragePrices = [
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  24596.49306,
  24568.04833,
  24499.73456,
  23629.92042,
  26551.32829,
  35249.10294,
  34998.1869,
  31601.678,
  29804.43696,
  28069.02268,
  26335.33643,
  26434.31044,
  26533.18701,
  26631.96533,
  26730.64605,
  26829.22803,
  26927.71208,
  27026.09842,
  27124.38395,
  27222.57373,
  27320.66564,
  27706.09402,
  28091.13666,
  28475.79633,
  28860.07368,
  29243.96935,
  29627.4796,
  30010.60948,
  30393.35726,
  30775.72255,
  31157.70719,
  31539.31261,
  31920.53863,
  32301.38433,
  32681.85482,
  33061.94786,
  32613.79568,
  32166.10259,
  31718.85731,
];
const automobilesDropdownData = [
  { label: "Acura", value: "Acura" },
  { label: "Alfa Romeo", value: "Alfa Romeo" },
  { label: "Aston Martin", value: "Aston Martin" },
  { label: "Audi", value: "Audi" },
  { label: "Bentley", value: "Bentley" },
  { label: "BMW", value: "BMW" },
  { label: "Bugatti", value: "Bugatti" },
  { label: "Buick", value: "Buick" },
  { label: "BYD", value: "BYD" },
  { label: "Cadillac", value: "Cadillac" },
  { label: "Chevrolet", value: "Chevrolet" },
  { label: "Chrysler", value: "Chrysler" },
  { label: "Citroen", value: "Citroen" },
  { label: "Daewoo", value: "Daewoo" },
  { label: "Dodge", value: "Dodge" },
  { label: "Ferrari", value: "Ferrari" },
  { label: "Fiat", value: "Fiat" },
  { label: "Fisker", value: "Fisker" },
  { label: "Ford", value: "Ford" },
  { label: "Genesis", value: "Genesis" },
  { label: "GMC", value: "GMC" },
  { label: "Hennessey", value: "Hennessey" },
  { label: "Honda", value: "Honda" },
  { label: "Hummer", value: "Hummer" },
  { label: "Hyundai", value: "Hyundai" },
  { label: "INEOS", value: "INEOS" },
  { label: "Infiniti", value: "Infiniti" },
  { label: "Isuzu", value: "Isuzu" },
  { label: "Jaguar", value: "Jaguar" },
  { label: "Jeep", value: "Jeep" },
  { label: "Karma", value: "Karma" },
  { label: "Kia", value: "Kia" },
  { label: "Koenigsegg", value: "Koenigsegg" },
  { label: "KTM", value: "KTM" },
  { label: "Lamborghini", value: "Lamborghini" },
  { label: "Land Rover", value: "Land Rover" },
  { label: "Lexus", value: "Lexus" },
  { label: "Lincoln", value: "Lincoln" },
  { label: "Lotus", value: "Lotus" },
  { label: "Lucid", value: "Lucid" },
  { label: "Maserati", value: "Maserati" },
  { label: "Maybach", value: "Maybach" },
  { label: "Mazda", value: "Mazda" },
  { label: "McLaren", value: "McLaren" },
  { label: "Mercedes-Benz", value: "Mercedes-Benz" },
  { label: "Mercury", value: "Mercury" },
  { label: "Mini", value: "Mini" },
  { label: "Mitsubishi", value: "Mitsubishi" },
  { label: "Nissan", value: "Nissan" },
  { label: "Oldsmobile", value: "Oldsmobile" },
  { label: "Opel", value: "Opel" },
  { label: "Pagani", value: "Pagani" },
  { label: "Panoz", value: "Panoz" },
  { label: "Peugeot", value: "Peugeot" },
  { label: "Plymouth", value: "Plymouth" },
  { label: "Polestar", value: "Polestar" },
  { label: "Pontiac", value: "Pontiac" },
  { label: "Porsche", value: "Porsche" },
  { label: "RAM", value: "RAM" },
  { label: "Renault", value: "Renault" },
  { label: "Rimac", value: "Rimac" },
  { label: "Rivian", value: "Rivian" },
  { label: "Rolls-Royce", value: "Rolls-Royce" },
  { label: "Saab", value: "Saab" },
  { label: "Saturn", value: "Saturn" },
  { label: "Scion", value: "Scion" },
  { label: "Smart", value: "Smart" },
  { label: "Spyker", value: "Spyker" },
  { label: "Subaru", value: "Subaru" },
  { label: "Suzuki", value: "Suzuki" },
  { label: "Tata", value: "Tata" },
  { label: "Tesla", value: "Tesla" },
  { label: "Toyota", value: "Toyota" },
  { label: "VinFast", value: "VinFast" },
  { label: "Volkswagen", value: "Volkswagen" },
  { label: "Volvo", value: "Volvo" },
  { label: "Xiaomi", value: "Xiaomi" },
];

const automobilesBrandValues = [
  { label: "Acura", value: reliable },
  { label: "Alfa Romeo", value: normal },
  { label: "Aston Martin", value: expensiveSport },
  { label: "Audi", value: normal },
  { label: "Bentley", value: expensiveSport },
  { label: "BMW", value: normal },
  { label: "Bugatti", value: superCar },
  { label: "Buick", value: normal },
  { label: "BYD", value: normal },
  { label: "Cadillac", value: normal },
  { label: "Chevrolet", value: fast },
  { label: "Chrysler", value: normal },
  { label: "Citroen", value: fast },
  { label: "Daewoo", value: normal },
  { label: "Dodge", value: normal },
  { label: "Ferrari", value: superCar },
  { label: "Fiat", value: fast },
  { label: "Fisker", value: fast },
  { label: "Ford", value: normal },
  { label: "Genesis", value: normal },
  { label: "GMC", value: normal },
  { label: "Hennessey", value: superCar },
  { label: "Honda", value: reliable },
  { label: "Hummer", value: fast },
  { label: "Hyundai", value: normal },
  { label: "INEOS", value: fast },
  { label: "Infiniti", value: normal },
  { label: "Isuzu", value: normal },
  { label: "Jaguar", value: expensiveSport },
  { label: "Jeep", value: normal },
  { label: "Karma", value: normal },
  { label: "Kia", value: normal },
  { label: "Koenigsegg", value: superCar },
  { label: "KTM", value: expensiveSport },
  { label: "Lamborghini", value: expensiveSport },
  { label: "Land Rover", value: normal },
  { label: "Lexus", value: reliable },
  { label: "Lincoln", value: normal },
  { label: "Lotus", value: normal },
  { label: "Lucid", value: normal },
  { label: "Maserati", value: expensiveSport },
  { label: "Maybach", value: superCar },
  { label: "Mazda", value: reliable },
  { label: "McLaren", value: expensiveSport },
  { label: "Mercedes-Benz", value: normal },
  { label: "Mercury", value: normal },
  { label: "Mini", value: normal },
  { label: "Mitsubishi", value: reliable },
  { label: "Nissan", value: reliable },
  { label: "Oldsmobile", value: normal },
  { label: "Opel", value: normal },
  { label: "Pagani", value: superCar },
  { label: "Panoz", value: normal },
  { label: "Peugeot", value: normal },
  { label: "Plymouth", value: normal },
  { label: "Polestar", value: normal },
  { label: "Pontiac", value: normal },
  { label: "Porsche", value: normal },
  { label: "RAM", value: normal },
  { label: "Renault", value: normal },
  { label: "Rimac", value: superCar },
  { label: "Rivian", value: normal },
  { label: "Rolls-Royce", value: expensiveSport },
  { label: "Saab", value: normal },
  { label: "Saturn", value: normal },
  { label: "Scion", value: normal },
  { label: "Smart", value: fast },
  { label: "Spyker", value: normal },
  { label: "Subaru", value: reliable },
  { label: "Suzuki", value: normal },
  { label: "Tata", value: normal },
  { label: "Tesla", value: normal },
  { label: "Toyota", value: reliable },
  { label: "VinFast", value: fast },
  { label: "Volkswagen", value: normal },
  { label: "Volvo", value: reliable },
  { label: "Xiaomi", value: fast },
];

const graphicsCardsDropdownData = [
  { label: "AMD", value: "AMD" },
  { label: "Intel", value: "Intel" },
  { label: "NVIDIA", value: "NVIDIA" },
];

const graphicsCardsBrandValues = [
  { label: "AMD", value: fast },
  { label: "Intel", value: fast },
  { label: "NVIDIA", value: normal },
];

const processorsDropdownData = [
  { label: "AMD", value: "AMD" },
  { label: "Intel", value: "Intel" },
];

const processorsBrandValues = [
  { label: "AMD", value: normal },
  { label: "Intel", value: normal },
];

export default function App() {
  // userVal of firebase
  const [userVal, setUserVal] = useState(false);
  const styles = SGStyles();

  // Determines the height of the rows
  let dronesHeight = [];
  let dronesSetHeight = [];

  // They are initalized as 52, which is also the minimum size, setHeight is used to change the height at the corresponding index in the height array
  for (i = 0; i < droneCategories[0].length; i++) {
    const [height, setHeight] = useState(52);
    dronesHeight.push(height);
    dronesSetHeight.push(setHeight);
  }

  let consolesHeight = [];
  let consolesSetHeight = [];

  for (i = 0; i < consoleCategories[0].length; i++) {
    const [height, setHeight] = useState(52);
    consolesHeight.push(height);
    consolesSetHeight.push(setHeight);
  }

  let graphicsCardsHeight = [];
  let graphicsCardsSetHeight = [];

  for (i = 0; i < graphicsCardsCategories[0].length; i++) {
    const [height, setHeight] = useState(52);
    graphicsCardsHeight.push(height);
    graphicsCardsSetHeight.push(setHeight);
  }

  let CPUsHeight = [];
  let CPUsSetHeight = [];

  for (i = 0; i < CPUsCategories[0].length; i++) {
    const [height, setHeight] = useState(52);
    CPUsHeight.push(height);
    CPUsSetHeight.push(setHeight);
  }

  let carsHeight = [];
  let carsSetHeight = [];

  for (i = 0; i < CPUsCategories[0].length; i++) {
    const [height, setHeight] = useState(52);
    carsHeight.push(height);
    carsSetHeight.push(setHeight);
  }

  const queryDronesFunction = async (product) => {
    const colRef = collection(db, "Drones");
    const q = await query(colRef, where("Brand", "==", product));

    const snapshot = await getDocs(q);

    dronesArray = [];
    snapshot.forEach((doc) => {
      dronesArray.push(doc.data());
    });

    return dronesArray;
  };

  const queryConsolesFunction = async (product) => {
    const colRef = collection(db, "Consoles");
    const q = await query(colRef, where("Brand", "==", product));

    const snapshot = await getDocs(q);

    ConsolesArray = [];
    snapshot.forEach((doc) => {
      ConsolesArray.push(doc.data());
    });

    return ConsolesArray;
  };

  const queryGraphicsCardsFunction = async (product) => {
    const colRef = collection(db, "Graphics Cards");
    const q = await query(colRef, where("Brand", "==", product));

    const snapshot = await getDocs(q);

    GraphicsCardsArray = [];
    snapshot.forEach((doc) => {
      GraphicsCardsArray.push(doc.data());
    });

    return GraphicsCardsArray;
  };

  const queryCPUsFunction = async (product) => {
    const colRef = collection(db, "CPUs");
    const q = await query(colRef, where("Brand", "==", product));

    const snapshot = await getDocs(q);

    CPUsArray = [];
    snapshot.forEach((doc) => {
      CPUsArray.push(doc.data());
    });

    return CPUsArray;
  };

  const queryAutomobilesFunction = async (product) => {
    const colRef = collection(db, "Automobiles");
    const q = await query(colRef, where("Brand", "==", product));

    const snapshot = await getDocs(q);

    automobilesArray = [];
    snapshot.forEach((doc) => {
      automobilesArray.push(doc.data());
    });

    return automobilesArray;
  };

  // The specs that are to be shown, initalized with the categories array
  const [consoleSpecs, setConsoleSpecs] = useState(consoleCategories);
  const [droneSpecs, setDroneSpecs] = useState(droneCategories);
  const [graphicsCardsSpecs, setGraphicsCardsSpecs] = useState(
    graphicsCardsCategories
  );
  const [CPUsSpecs, setCPUsSpecs] = useState(CPUsCategories);
  const [carsSpecs, setCarsSpecs] = useState(carsCategories);

  const window = useWindowDimensions();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // listen for changes (sign in, sign out)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // update userVal upon any change
      setUserVal(user);
    });

    if (window.width <= 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }

    return () => {
      unsubscribe();
    };
  });

  return (
    <BrowserRouter>
      <Routes>
        {/* in case user goes to specgauge.com, instead of specgauge.com/home */}
        <Route path="/" element={<WebDefaultPage></WebDefaultPage>}></Route>
        {/* the home page */}
        <Route
          index
          path="/home"
          element={
            <WebHome amplitude={amplitude} isMobile={isMobile}></WebHome>
          }
        ></Route>
        {/* the automobiles comparison page */}
        <Route
          path="comparison/automobiles"
          element={
            <Compare
              type={"Automobiles"}
              Brands={carsBrands}
              Process={carsProcess}
              QueryProcess={carsQueryProcess}
              QueryFunction={queryAutomobilesFunction}
              DefaultArray={carsDefaultArray}
              Categories={carsCategories}
              Specs={carsSpecs}
              setSpecs={setCarsSpecs}
              Height={carsHeight}
              SetHeight={carsSetHeight}
              amplitude={amplitude}
              isMobile={isMobile}
              prosIndex={4}
            ></Compare>
          }
        ></Route>
        {/* the consoles comparison page */}
        <Route
          path="comparison/consoles"
          element={
            <Compare
              type={"Consoles"}
              Brands={consoleBrands}
              Process={consoleProcess}
              QueryProcess={consoleQueryProcess}
              QueryFunction={queryConsolesFunction}
              DefaultArray={consoleDefaultArray}
              Categories={consoleCategories}
              Specs={consoleSpecs}
              setSpecs={setConsoleSpecs}
              Height={consolesHeight}
              SetHeight={consolesSetHeight}
              amplitude={amplitude}
              isMobile={isMobile}
              prosIndex={2}
            ></Compare>
          }
        ></Route>
        {/* the drones comparison page */}
        <Route
          path="comparison/drones"
          element={
            <Compare
              type={"Drones"}
              Brands={droneBrands}
              Process={droneProcess}
              QueryProcess={droneQueryProcess}
              QueryFunction={queryDronesFunction}
              DefaultArray={droneDefaultArray}
              Categories={droneCategories}
              Specs={droneSpecs}
              setSpecs={setDroneSpecs}
              Height={dronesHeight}
              SetHeight={dronesSetHeight}
              amplitude={amplitude}
              isMobile={isMobile}
              prosIndex={2}
            ></Compare>
          }
        ></Route>
        {/* the graphics cards comparison page */}
        <Route
          path="comparison/graphicsCards"
          element={
            <Compare
              type={"Graphics Cards"}
              Brands={graphicsCardsBrands}
              Process={graphicsCardsProcess}
              QueryProcess={graphicsCardsQueryProcess}
              QueryFunction={queryGraphicsCardsFunction}
              DefaultArray={graphicsCardsDefaultArray}
              Categories={graphicsCardsCategories}
              Specs={graphicsCardsSpecs}
              setSpecs={setGraphicsCardsSpecs}
              Height={graphicsCardsHeight}
              SetHeight={graphicsCardsSetHeight}
              amplitude={amplitude}
              isMobile={isMobile}
              prosIndex={3}
            ></Compare>
          }
        ></Route>
        {/* the cpus comparison page */}
        <Route
          path="comparison/cpus"
          element={
            <Compare
              type={"CPUs"}
              Brands={CPUsBrands}
              Process={CPUsProcess}
              QueryProcess={CPUsQueryProcess}
              QueryFunction={queryCPUsFunction}
              DefaultArray={CPUsDefaultArray}
              Categories={CPUsCategories}
              Specs={CPUsSpecs}
              setSpecs={setCPUsSpecs}
              Height={CPUsHeight}
              SetHeight={CPUsSetHeight}
              amplitude={amplitude}
              isMobile={isMobile}
              prosIndex={3}
            ></Compare>
          }
        ></Route>
        {/* the login/signup page */}
        <Route
          path="login"
          element={
            <WebLogIn amplitude={amplitude} isMobile={isMobile}></WebLogIn>
          }
        ></Route>
        {/* User's account page */}
        <Route
          path="account"
          element={
            <WebUserAccount
              amplitude={amplitude}
              isMobile={isMobile}
              defaultArrays={[
                carsDefaultArray,
                consoleDefaultArray,
                droneDefaultArray,
                graphicsCardsDefaultArray,
                CPUsDefaultArray,
              ]}
            ></WebUserAccount>
          }
        ></Route>
        {/* the automobiles prediction page */}
        <Route
          path="prediction/automobiles"
          element={
            <PredictionAnalysis
              type={"Automobiles"}
              amplitude={amplitude}
              isMobile={isMobile}
              averagePrices={automobilesAveragePrices}
              brandValues={automobilesBrandValues}
              dropdownData={automobilesDropdownData}
              minimumPrice={7500}
            ></PredictionAnalysis>
          }
        ></Route>
        {/* the graphicsCards prediction page */}
        <Route
          path="prediction/graphicsCards"
          element={
            <PredictionAnalysis
              type={"Graphics Cards"}
              amplitude={amplitude}
              isMobile={isMobile}
              averagePrices={null}
              brandValues={graphicsCardsBrandValues}
              dropdownData={graphicsCardsDropdownData}
              minimumPrice={200}
            ></PredictionAnalysis>
          }
        ></Route>
        {/* the cpus prediction page */}
        <Route
          path="prediction/cpus"
          element={
            <PredictionAnalysis
              type={"Processors"}
              amplitude={amplitude}
              isMobile={isMobile}
              averagePrices={null}
              brandValues={processorsBrandValues}
              dropdownData={processorsDropdownData}
              minimumPrice={150}
            ></PredictionAnalysis>
          }
        ></Route>
        {/* the about us page */}
        <Route
          path="aboutus"
          element={
            <Information
              amplitude={amplitude}
              isMobile={isMobile}
              title={"About Us"}
              text={
                /* prettier-ignore */
                <Text>

<Text style={styles.textStyles.infoText}>Welcome to SpecGauge – your ultimate sidekick for tech and car comparisons!</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>

<Text style={styles.textStyles.infoText}>We get it. Making the right choice in a world full of options can be overwhelming. Whether you’re picking out your next car, drone, gaming console, GPU, or CPU, we've got your back. Our mission? To help you make informed decisions with ease and confidence. </Text>

<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoSubtitle}>What We Do:</Text>

<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>

<Text style={[styles.textStyles.infoText, { fontWeight: 'bold' }]}>• Compare Products Side by Side: </Text><Text style={styles.textStyles.infoText}>Check out detailed comparisons of the latest and greatest cars, drones, consoles, GPUs, and CPUs. No more guessing games – see how your top picks stack up against each other in real-time.</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={[styles.textStyles.infoText, { fontWeight: 'bold' }]}>• Predict Future Prices: </Text><Text style={styles.textStyles.infoText}>Wondering how much that new tech or car will cost down the road? Our unique prediction feature lets you forecast prices all the way to 2055. Yep, you read that right. Get ahead of the game and plan your purchases like a pro.</Text>

<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoSubtitle}>Why SpecGauge?</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>

<Text style={styles.textStyles.infoText}>We blend cutting-edge data analysis with a user-friendly interface to bring you accurate, reliable, and easy-to-understand insights. Our team is passionate about technology and cars, and we’re here to share that passion with you.</Text>

<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoText}>Whether you're a tech geek, a car enthusiast, or just someone looking to get the best bang for your buck, SpecGauge is designed with you in mind. We're all about making complex information simple and accessible.</Text>

<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoText}>So, dive in, explore, and let us help you find the perfect match for your needs. With SpecGauge, you're not just making a choice; you're making the right choice.</Text>

<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoText}>Thanks for stopping by. Let's navigate the future together!</Text>
                </Text>
              }
            ></Information>
          }
        ></Route>
        {/* the terms of service page */}
        <Route
          path="termsofservice"
          element={
            <Information
              amplitude={amplitude}
              isMobile={isMobile}
              title={"Terms of Service"}
              text={
                /* prettier-ignore */
                <Text>
<Text style={styles.textStyles.infoText}>Welcome to SpecGauge! These Terms of Service ("Terms") outline the rules and regulations for using our website.</Text>

<Text style={styles.textStyles.infoText}>By accessing this website, we assume you accept these Terms in full. Do not continue to use SpecGauge if you do not agree to all of the Terms stated on this page.</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoSubtitle}>1. Use of the Website</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={[styles.textStyles.infoText, { fontWeight: 'bold' }]}>1.1. </Text><Text style={styles.textStyles.infoText}>You agree to use SpecGauge only for lawful purposes and in a way that does not infringe on the rights of others or restrict or inhibit anyone else’s use and enjoyment of the website.</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={[styles.textStyles.infoText, { fontWeight: 'bold' }]}>1.2. </Text><Text style={styles.textStyles.infoText}>We reserve the right to modify or discontinue, temporarily or permanently, the website (or any part of it) with or without notice.</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoSubtitle}>2. Predictions and Accuracy</Text>

<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={[styles.textStyles.infoText, { fontWeight: 'bold' }]}>2.1. </Text><Text style={styles.textStyles.infoText}>SpecGauge provides future price predictions for products. These predictions are based on historical data and trends and are intended for informational purposes only. We do not guarantee the accuracy or reliability of these predictions.</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoSubtitle}>3. Intellectual Property</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>


<Text style={[styles.textStyles.infoText, { fontWeight: 'bold' }]}>3.1. </Text><Text style={styles.textStyles.infoText}>The content on SpecGauge, including text, graphics, logos, images, and software, is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, display, perform, or otherwise use any part of SpecGauge without our prior written consent.</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoSubtitle}>4. Privacy</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>

<Text style={[styles.textStyles.infoText, { fontWeight: 'bold' }]}>4.1. </Text><Text style={styles.textStyles.infoText}>Your privacy is important to us. Please refer to our Privacy Policy to understand how we collect, use, and disclose information about you.</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoSubtitle}>5. Limitation of Liability</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>

<Text style={[styles.textStyles.infoText, { fontWeight: 'bold' }]}>5.1. </Text><Text style={styles.textStyles.infoText}>To the extent permitted by law, SpecGauge and its affiliates shall not be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in any way connected with your use of this website.</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoSubtitle}>6. Governing Law</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>

<Text style={[styles.textStyles.infoText, { fontWeight: 'bold' }]}>6.1. </Text><Text style={styles.textStyles.infoText}>These Terms shall be governed by and construed in accordance with the laws of Canada, without regard to its conflict of law provisions.</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoSubtitle}>7. Changes to the Terms</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>

<Text style={[styles.textStyles.infoText, { fontWeight: 'bold' }]}>7.1. </Text><Text style={styles.textStyles.infoText}>We reserve the right to revise these Terms at any time without prior notice. By using SpecGauge after any such changes, you agree to be bound by the revised Terms.</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoText}>If you have any questions or concerns about these Terms of Service, please contact us at specgauge@gmail.com.</Text>
              </Text>
              }
            ></Information>
          }
        ></Route>
        {/* the about us page */}
        <Route
          path="privacypolicy"
          element={
            <Information
              amplitude={amplitude}
              isMobile={isMobile}
              title={"Privacy Policy"}
              text={
                /* prettier-ignore */
                <Text>

<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoText}>We collect user activity data through Amplitude to understand how our app is used and improve it for you. This data helps us tweak features and make your experience better. The data is not linked to you or your email. We do not store any of your usage data on our servers. We don't sell this info to third parties — your privacy is our priority.</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoText}>When users create accounts using their email and password, we collect and store this information securely. It's used solely for account management purposes, like resetting passwords or sending important updates related to their account.</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>
<Text style={styles.textStyles.infoText}>{"\n"}</Text>

<Text style={styles.textStyles.infoText}>If you have any questions or concerns about our Privacy Policy, please contact us at specgauge@gmail.com.</Text>

                </Text>
              }
            ></Information>
          }
        ></Route>
        {/* the robots.txt page */}

        {/* any other page, error 404 */}
        <Route
          path="*"
          element={<NoPage amplitude={amplitude} isMobile={isMobile}></NoPage>}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}
