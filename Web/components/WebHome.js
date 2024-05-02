import { Navbar } from "../Navbar";
import { SGStyles } from "../../styles/styles";

import { Modal, Pressable, View, Text, ScrollView } from "react-native-web";
import { useEffect, useState } from "react";

import { httpsCallable } from "firebase/functions";

import Compare from "./compare/Compare";
import CompareCars from "./compare/CompareCars";

const categories = [
  "Automobiles",
  "Consoles",
  "Drones",
  "Graphics Cards",
  "Processors",
];

const processes = [["a brand", "a phone"]];

const brands = [["Apple", "Samsung"]];

// Brands are preloaded
const droneBrands = [
  "Autel",
  "DJI",
  "Holy Stone",
  "Parrot",
  "Potensic",
  "Ryze",
  "Snaptain",
];

// This determines how many steps the user has to go through when adding a product
const droneProcess = ["a brand", "a drone"];

// This is an array of items whose string matches the keys of the JSON that is returned from apis
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

// The values in this array are in the corresponding spot according to the above array
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

// This determines how many rows to show in the table, each item is 1 column, each item within the item is a row.
// To add a product, the specs are added to the '-Specs' array in the corresponding category. '-Specs' array is below
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

const graphicsCardsProcess = ["a brand", "a generation", "a graphics card"];

const graphicsCardsBrands = ["AMD", "Intel", "NVIDIA"];

const graphicsCardsMatchingArray = [
  "Brand",
  "Generation",
  "Card",
  "GPU",
  "Transistor size",
  "Transistors",
  "Transistor Density",
  "Die Size",
  "Release Date (Availability)",
  "MSRP at launch",
  "PCI Slot",
  "Shading units",
  "TMUs",
  "ROPs",
  "Compute Units",
  "Tensor Cores",
  "RT Cores",
  "L0 Cache",
  "L1 Cache",
  "L2 Cache",
  "L3 Cache",
  "Base clock",
  "Boost clock",
  "Memory Clock",
  "Memory Size and Type",
  "Memory Bus",
  "Memory Bandwidth",
  "Outputs",
  "Length",
  "Width",
  "Height",
  "TDP",
  "Pixel Rate",
  "Texture Rate",
  "FP32 TeraFlops",
];

const graphicsCardsDefaultArray = [
  { Value: "--", Display: true, Category: "Brand" }, // Brand
  { Value: "--", Display: true, Category: "Generation" }, // Generation
  { Value: "--", Display: true, Category: "Card" }, // Card
  { Value: "GPU: --", Display: true, Category: "GPU" },
  { Value: "Transistor size: --", Display: true, Category: "GPU" },
  { Value: "Transistors: --", Display: true, Category: "GPU" },
  { Value: "Transistor Density: --", Display: true, Category: "GPU" },
  { Value: "Die Size: --", Display: true, Category: "GPU" },
  { Value: "Release Date: --", Display: true, Category: "Release Info" },
  { Value: "MSRP at launch: --", Display: true, Category: "Release Info" },
  { Value: "PCI Slot: --", Display: true, Category: "Board" },
  { Value: "Shading units: --", Display: true, Category: "Rendering" },
  { Value: "TMUs: --", Display: true, Category: "Rendering" },
  { Value: "ROPs: --", Display: true, Category: "Rendering" },
  { Value: "Compute Units: --", Display: true, Category: "GPU" },
  { Value: "Tensor Cores: --", Display: true, Category: "Rendering" },
  { Value: "RT Cores: --", Display: true, Category: "Rendering" },
  { Value: "L0 Cache: --", Display: true, Category: "Cache" },
  { Value: "L1 Cache: --", Display: true, Category: "Cache" },
  { Value: "L2 Cache: --", Display: true, Category: "Cache" },
  { Value: "L3 Cache: --", Display: true, Category: "Cache" },
  { Value: "Base Clock: --", Display: true, Category: "GPU" },
  { Value: "Boost Clock: --", Display: true, Category: "GPU" },
  { Value: "Memory Clock: --", Display: true, Category: "Memory" },
  { Value: "Memory Size and Type: --", Display: true, Category: "Memory" },
  { Value: "Memory Bus: --", Display: true, Category: "Memory" },
  { Value: "Memory Bandwidth: --", Display: true, Category: "Memory" },
  { Value: "Outputs: --", Display: true, Category: "Board" },
  { Value: "Length: --", Display: true, Category: "Board" },
  { Value: "Width: --", Display: true, Category: "Board" },
  { Value: "Height: --", Display: true, Category: "Board" },
  { Value: "TDP: --", Display: true, Category: "Board" },
  { Value: "Pixel Rate: --", Display: true, Category: "Performance" },
  { Value: "Texture Rate: --", Display: true, Category: "Performance" },
  { Value: "FP32 TeraFlops: --", Display: true, Category: "Performance" },
];

const graphicsCardsCategories = [
  [
    "Brand",
    "Generation",
    "Card",
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

const CPUsBrands = ["AMD", "Intel"];

const CPUsMatchingArray = [
  "Brand",
  "Generation",
  "CPU",
  "Socket",
  "Process Size",
  "Transistors",
  "Die Size",
  "I/O Process Size",
  "I/O Transistors",
  "I/O Die Size",
  "tCaseMax",
  "tJMax",
  "Market",
  "Release Date",
  "# of Cores",
  "# of Threads",
  "Hybrid Cores",
  "LP E-Cores",
  "SMP # CPUs",
  "Integrated Graphics",
  "Frequency",
  "Turbo Clock",
  "Base Clock",
  "E-Core Frequency",
  "LP E-Core Boost",
  "Multiplier",
  "Multiplier Unlocked",
  "AI Boost NPU",
  "TDP",
  "Maximum Power",
  "Memory Support",
  "Rated Speed",
  "DDR1 Speed",
  "DDR2 Speed",
  "DDR3 Speed",
  "DDR4 Speed",
  "DDR5 Speed",
  "LPDDR1 Speed",
  "LPDDR2 Speed",
  "LPDDR3 Speed",
  "LPDDR4 Speed",
  "LPDDR4X Speed",
  "LPDDR5 Speed",
  "LPDDR5x Speed",
  "Max. Memory",
  "Memory Bus",
  "ECC Memory",
  "PCI-Express",
  "Secondary PCIe",
  "Tertiary PCIe",
  "Cache L1",
  "Cache L2",
  "Cache L3",
  "E-Core L1",
  "E-Core L2",
  "Launch Price",
  "Chipsets",
  "PL1",
  "PL2",
  "FP32",
  "Bundled Cooler",
];

const CPUsDefaultArray = [
  { Value: "--", Display: true, Category: "Brand" }, // Brand
  { Value: "--", Display: true, Category: "Generation" }, // Generation
  { Value: "CPU: --", Display: true, Category: "CPU" },
  { Value: "Socket: --", Display: true, Category: "Platform" },
  { Value: "Process Size: --", Display: true, Category: "Architecture" },
  { Value: "Transistors: --", Display: true, Category: "Architecture" },
  { Value: "Die Size: --", Display: true, Category: "Architecture" },
  { Value: "I/O Process Size: --", Display: true, Category: "Architecture" },
  { Value: "I/O Transistors: --", Display: true, Category: "Architecture" },
  { Value: "I/O Die Size: --", Display: true, Category: "Architecture" },
  { Value: "tCaseMax: --", Display: true, Category: "Thermal" },
  { Value: "tJMax: --", Display: true, Category: "Thermal" },
  { Value: "Market: --", Display: true, Category: "Platform" },
  { Value: "Release Date: --", Display: true, Category: "Platform" },
  { Value: "# of Cores: --", Display: true, Category: "CPU" },
  { Value: "# of Threads: --", Display: true, Category: "CPU" },
  { Value: "Hybrid Cores: --", Display: true, Category: "CPU" },
  { Value: "LP E-Cores: --", Display: true, Category: "CPU" },
  { Value: "SMP # CPUs: --", Display: true, Category: "CPU" },
  {
    Value: "Integrated Graphics: --",
    Display: true,
    Category: "Sub-Processors",
  },
  { Value: "Frequency: --", Display: true, Category: "Clock" },
  { Value: "Turbo Clock: --", Display: true, Category: "Clock" },
  { Value: "Base Clock: --", Display: true, Category: "Clock" },
  { Value: "E-Core Frequency: --", Display: true, Category: "CPU" },
  { Value: "LP E-Core Boost: --", Display: true, Category: "CPU" },
  { Value: "Multiplier: --", Display: true, Category: "Clock" },
  { Value: "Overclockable", Display: false, Category: "Clock" },
  { Value: "NPU: --", Display: true, Category: "Sub-Processors" },
  { Value: "TDP: --", Display: true, Category: "Thermal" },
  { Value: "Maximum Power: --", Display: true, Category: "Power" },
  { Value: "Memory Support: --", Display: true, Category: "Memory" },
  { Value: "Rated Speed: --", Display: false, Category: "Memory" },
  { Value: "DDR1 Speed: --", Display: false, Category: "Memory" },
  { Value: "DDR2 Speed: --", Display: false, Category: "Memory" },
  { Value: "DDR3 Speed: --", Display: false, Category: "Memory" },
  { Value: "DDR4 Speed: --", Display: false, Category: "Memory" },
  { Value: "DDR5 Speed: --", Display: false, Category: "Memory" },
  { Value: "LPDDR1 Speed: --", Display: false, Category: "Memory" },
  { Value: "LPDDR2 Speed: --", Display: false, Category: "Memory" },
  { Value: "LPDDR3 Speed: --", Display: false, Category: "Memory" },
  { Value: "LPDDR4 Speed: --", Display: false, Category: "Memory" },
  { Value: "LPDDR4X Speed: --", Display: false, Category: "Memory" },
  { Value: "LPDDR5 Speed: --", Display: false, Category: "Memory" },
  { Value: "LPDDR5X Speed: --", Display: false, Category: "Memory" },
  { Value: "Max Memory: --", Display: true, Category: "Memory" },
  { Value: "Memory Bus: --", Display: true, Category: "Memory" },
  { Value: "ECC Memory", Display: false, Category: "Memory" },
  { Value: "PCI-Express: --", Display: true, Category: "PCI" },
  { Value: "Secondary PCIe: --", Display: true, Category: "PCI" },
  { Value: "Tertiary PCIe: --", Display: true, Category: "PCI" },
  { Value: "Cache L1: --", Display: true, Category: "Cache" },
  { Value: "Cache L2: --", Display: true, Category: "Cache" },
  { Value: "Cache L3: --", Display: true, Category: "Cache" },
  { Value: "E-Core L1: --", Display: true, Category: "Cache" },
  { Value: "E-Core L2: --", Display: true, Category: "Cache" },
  { Value: "MSRP: --", Display: true, Category: "Platform" },
  { Value: "Motherboards: --", Display: true, Category: "Platform" },
  { Value: "PL1: --", Display: true, Category: "Power" },
  { Value: "PL2: --", Display: true, Category: "Power" },
  { Value: "FP32: --", Display: true, Category: "Performance" },
  { Value: "Bundled Cooler: --", Display: true, Category: "Thermal" },
];

const CPUsCategories = [
  [
    "Brand",
    "Generation",
    "CPU",
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

const carsProcesses = ["a brand", "a model", "a year", "a trim"];

const carsBrands = [
  "AM General",
  "Acura",
  "Alfa Romeo",
  "Aston Martin",
  "Audi",
  "BMW",
  "Bentley",
  "Bugatti",
  "Buick",
  "Cadillac",
  "Chevrolet",
  "Chrysler",
  "Daewoo",
  "Dodge",
  "Eagle",
  "FIAT",
  "Ferrari",
  "Fisker",
  "Ford",
  "GMC",
  "Genesis",
  "Geo",
  "HUMMER",
  "Honda",
  "Hyundai",
  "INFINITI",
  "Isuzu",
  "Jaguar",
  "Jeep",
  "Karma",
  "Kia",
  "Lamborghini",
  "Land Rover",
  "Lexus",
  "Lincoln",
  "Lotus",
  "Lucid",
  "MINI",
  "Maserati",
  "Maybach",
  "Mazda",
  "McLaren",
  "Mercedes-Benz",
  "Mercury",
  "Mitsubishi",
  "Nissan",
  "Oldsmobile",
  "Panoz",
  "Plymouth",
  "Polestar",
  "Pontiac",
  "Porsche",
  "Ram",
  "Rivian",
  "Rolls-Royce",
  "Saab",
  "Saturn",
  "Scion",
  "smart",
  "Spyker",
  "Subaru",
  "Suzuki",
  "Tesla",
  "Toyota",
  "VinFast",
  "Volkswagen",
  "Volvo",
];

const carsMatchingArray = [
  "engine_type",
  "cylinders",
  "size",
  "horsepower_hp",
  "horsepower_rpm",
  "torque_ft_lbs",
  "torque_rpm",
  "valves",
  "valve_timing",
  "cam_type",
  "drive_type",
  "transmission",
  "make_model_trim_interior_colors",
  "make_model_trim_exterior_colors",
  "fuel_type",
  "fuel_tank_capacity",
  "epa_city_mpg",
  "epa_highway_mpg",
  "combined_mpg",
  "range_city",
  "range_highway",
  "battery_capacity_electric",
  "epa_time_to_charge_hr_240v_electric",
  "epa_kwh_100_mi_electric",
  "range_electric",
  "epa_city_mpg_electric",
  "epa_highway_mpg_electric",
  "epa_combined_mpg_electric",
  "type",
  "doors",
  "seats",
  "length",
  "width",
  "height",
  "wheel_base",
  "front_track",
  "rear_track",
  "ground_clearance",
  "cargo_capacity",
  "max_cargo_capacity",
  "curb_weight",
  "gross_weight",
  "max_payload",
  "max_towing_capacity",
];

const carsDefaultArray = [
  { Value: "--", Display: true, Category: "Brand" }, // Brand
  { Value: "--", Display: true, Category: "Model" }, // Model
  { Value: "--", Display: true, Category: "Year" }, // Year
  { Value: "--", Display: true, Category: "Trim" }, // Trim
  { Value: "--", Display: true, Category: "MSRP" }, // MSRP
  { Value: "Motor Type: --", Display: true, Category: "Motor" },
  { Value: "Cylinders: --", Display: false, Category: "Motor" },
  { Value: "Displacement: --L", Display: false, Category: "Motor" },
  { Value: "Horsepower: -- hp", Display: true, Category: "Motor" },
  { Value: "Horsepower Optimal RPM: -- RPM", Display: true, Category: "Motor" },
  { Value: "Torque: -- ft-lbs", Display: true, Category: "Motor" },
  { Value: "Torque Optimal RPM: -- RPM", Display: true, Category: "Motor" },
  { Value: "Valves: --", Display: false, Category: "Motor" },
  { Value: "Valves Timing: --", Display: false, Category: "Motor" },
  { Value: "Camshaft: --", Display: false, Category: "Motor" },
  { Value: "Drivetrain: --", Display: true, Category: "Motor" },
  { Value: "Transmission: --", Display: true, Category: "Motor" },
  { Value: "Interior Colors: --", Display: true, Category: "Design" },
  { Value: "Exterior Colors: --", Display: true, Category: "Design" },
  { Value: "Fuel Type: --", Display: false, Category: "Fuel/Battery" },
  {
    Value: "Fuel Tank Capacity: -- gal",
    Display: false,
    Category: "Fuel/Battery",
  },
  { Value: "City MPG: --", Display: false, Category: "Fuel/Battery" },
  { Value: "Highway MPG: --", Display: false, Category: "Fuel/Battery" },
  { Value: "Combined MPG: --", Display: false, Category: "Fuel/Battery" },
  { Value: "City Range (miles): --", Display: false, Category: "Fuel/Battery" },
  {
    Value: "Highway Range (miles): --",
    Display: false,
    Category: "Fuel/Battery",
  },
  { Value: "Battery Capacity: --", Display: false, Category: "Fuel/Battery" },
  {
    Value: "Time to Charge with 240V: -- hours",
    Display: false,
    Category: "Fuel/Battery",
  },
  { Value: "kWh/100mi: --", Display: false, Category: "Fuel/Battery" },
  {
    Value: "Electric Range (miles): --",
    Display: false,
    Category: "Fuel/Battery",
  },
  {
    Value: "City MPG (Equivalent): --",
    Display: false,
    Category: "Fuel/Battery",
  },
  {
    Value: "Highway MPG (Equivalent): --",
    Display: false,
    Category: "Fuel/Battery",
  },
  {
    Value: "Combined MPG (Equivalent): --",
    Display: false,
    Category: "Fuel/Battery",
  },
  { Value: "Type: --", Display: true, Category: "Body" },
  { Value: "Doors: --", Display: true, Category: "Body" },
  { Value: "Seats: --", Display: true, Category: "Body" },
  { Value: "Length: -- in", Display: true, Category: "Body" },
  { Value: "Width: -- in", Display: true, Category: "Body" },
  { Value: "Height: -- in", Display: true, Category: "Body" },
  { Value: "Wheelbase: -- in", Display: true, Category: "Body" },
  { Value: "Front Track: -- in", Display: true, Category: "Body" },
  { Value: "Rear Track: -- in", Display: true, Category: "Body" },
  { Value: "Ground Clearance: -- in", Display: true, Category: "Utility" },
  { Value: "Cargo Capacity: -- cu.ft.", Display: true, Category: "Utility" },
  { Value: "Cargo Capacity: -- cu. ft.", Display: false, Category: "Utility" },
  { Value: "Curb Weight: -- lbs", Display: true, Category: "Utility" },
  { Value: "Gross Weight: -- lbs", Display: true, Category: "Utility" },
  { Value: "Payload Capacity: -- lbs", Display: true, Category: "Utility" },
  { Value: "Tow Capacity: -- lbs", Display: true, Category: "Utility" },
];

const carsCategories = [
  [
    "Brand",
    "Model",
    "Year",
    "Trim",
    "MSRP",
    "Motor",
    "Design",
    "Fuel/Battery",
    "Body",
    "Utility",
  ],
];

export default function WebHome({ userVal, functions, amplitude }) {
  {
    /* This is for the modal that determines the comparison type */
  }
  const [compareModalVisible, setCompareModalVisible] = useState(false);
  {
    /* Determines what comparison screen to show */
  }
  const [category, setCategory] = useState(0);

  {
    /* Determines which part of product selection the modal is on */
  }

  {
    /* Records the initial load of the website */
  }
  useEffect(() => {
    amplitude.track("Screen", { Screen: "Home" });
  }, []);

  // Determines the height of the rows
  let dronesHeight = [];
  let dronesSetHeight = [];

  // They are initalized as 39, which is also the minimum size, setHeight is used to change the height at the corresponding index in the height array
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

  let graphicsCardsHeight = [];
  let graphicsCardsSetHeight = [];

  for (i = 0; i < graphicsCardsCategories[0].length; i++) {
    const [height, setHeight] = useState(39);
    graphicsCardsHeight.push(height);
    graphicsCardsSetHeight.push(setHeight);
  }

  let CPUsHeight = [];
  let CPUsSetHeight = [];

  for (i = 0; i < CPUsCategories[0].length; i++) {
    const [height, setHeight] = useState(39);
    CPUsHeight.push(height);
    CPUsSetHeight.push(setHeight);
  }

  let carsHeight = [];
  let carsSetHeight = [];

  for (i = 0; i < CPUsCategories[0].length; i++) {
    const [height, setHeight] = useState(39);
    carsHeight.push(height);
    carsSetHeight.push(setHeight);
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

  const callGraphicsCardsCloudFunction = async (product) => {
    try {
      const GetGraphicsCards = httpsCallable(functions, "GetGraphicsCards");
      const result = await GetGraphicsCards(product);
      return result.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const callCPUsCloudFunction = async (product) => {
    try {
      const GetCPUs = httpsCallable(functions, "GetCPUs");
      const result = await GetCPUs(product);
      return result.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  // Car needs 4 since it's not in my database
  const callCarModelsCloudFunction = async (product) => {
    try {
      const GetCarModels = httpsCallable(functions, "GetCarModels");
      const result = await GetCarModels(product);
      return result.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const callGetCarYearsCloudFunction = async (product) => {
    try {
      const GetCarYears = httpsCallable(functions, "GetCarYears");
      const result = await GetCarYears(product);
      return result.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const callGetCarTrimsCloudFunction = async (product) => {
    try {
      const GetCarTrims = httpsCallable(functions, "GetCarTrims");
      const result = await GetCarTrims(product);
      return result.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const callGetCarTrimViewCloudFunction = async (product) => {
    try {
      const GetCarTrimView = httpsCallable(functions, "GetCarTrimView");
      const result = await GetCarTrimView(product);
      return result.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  // The specs that are to be shown, initalized with the categories array
  const [droneSpecs, setDroneSpecs] = useState(droneCategories);
  const [consoleSpecs, setConsoleSpecs] = useState(consoleCategories);
  const [graphicsCardsSpecs, setGraphicsCardsSpecs] = useState(
    graphicsCardsCategories
  );
  const [CPUsSpecs, setCPUsSpecs] = useState(CPUsCategories);
  const [carsSpecs, setCarsSpecs] = useState(carsCategories);

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
              <Text style={styles.textStyles.simpleText}>
                Saved Comparisons
              </Text>
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
                          pressed &&
                            styles.inputStyles.buttonNoBackgroundClicked,
                        ]}
                        key={item}
                        onPress={() => {
                          amplitude.track("Screen", { Screen: item });
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

        {/* Compare Automobiles screen */}
        {category == 1 && (
          <CompareCars
            type={"Automobiles"}
            setCategory={setCategory}
            Brands={carsBrands}
            Process={carsProcesses}
            MatchingArray={carsMatchingArray}
            DefaultArray={carsDefaultArray}
            Categories={carsCategories}
            Specs={carsSpecs}
            setSpecs={setCarsSpecs}
            Height={carsHeight}
            SetHeight={carsSetHeight}
            CloudFunctionModels={callCarModelsCloudFunction}
            CloudFunctionYears={callGetCarYearsCloudFunction}
            CloudFunctionTrims={callGetCarTrimsCloudFunction}
            CloudFunctionTrimView={callGetCarTrimViewCloudFunction}
            amplitude={amplitude}
          ></CompareCars>
        )}

        {/* Compare Consoles screen */}
        {category == 2 && (
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
            amplitude={amplitude}
          ></Compare>
        )}

        {/* Compare Drones screen */}
        {category == 3 && (
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
            amplitude={amplitude}
          ></Compare>
        )}

        {/* Compare Graphics Cards screen */}
        {category == 4 && (
          <Compare
            type={"Graphics Cards"}
            setCategory={setCategory}
            Brands={graphicsCardsBrands}
            Process={graphicsCardsProcess}
            MatchingArray={graphicsCardsMatchingArray}
            DefaultArray={graphicsCardsDefaultArray}
            Categories={graphicsCardsCategories}
            Specs={graphicsCardsSpecs}
            setSpecs={setGraphicsCardsSpecs}
            Height={graphicsCardsHeight}
            SetHeight={graphicsCardsSetHeight}
            CloudFunction={callGraphicsCardsCloudFunction}
            amplitude={amplitude}
          ></Compare>
        )}

        {/* Compare Processors screen */}
        {category == 5 && (
          <Compare
            type={"CPUs"}
            setCategory={setCategory}
            Brands={CPUsBrands}
            Process={CPUsProcess}
            MatchingArray={CPUsMatchingArray}
            DefaultArray={CPUsDefaultArray}
            Categories={CPUsCategories}
            Specs={CPUsSpecs}
            setSpecs={setCPUsSpecs}
            Height={CPUsHeight}
            SetHeight={CPUsSetHeight}
            CloudFunction={callCPUsCloudFunction}
            amplitude={amplitude}
          ></Compare>
        )}
      </ScrollView>
    </View>
  );
}
