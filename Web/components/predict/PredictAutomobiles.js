import {
  Text,
  ScrollView,
  View,
  Pressable,
  TextInput,
  Modal,
  Image,
} from "react-native-web";
import { SGStyles } from "../../../styles/styles";
import { Footer } from "../../Footer";
import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { ChromePicker } from "react-color";

import { Line } from "react-chartjs-2";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Dropdown } from "react-native-element-dropdown";
import seedrandom from "seedrandom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const years = [
  2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012,
  2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025,
  2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038,
  2039, 2040, 2041, 2042, 2043, 2044, 2045, 2046, 2047, 2048, 2049, 2050, 2051,
  2052, 2053, 2054, 2055,
];

const averageCarPrices = [
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

let startIndex = 24;
let endIndex = 56;

const fast = -0.14;
const normal = -0.11;
const reliable = -0.05;
const expensiveSport = -0.04;
const superCar = -0.03;

const dropdownData = [
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

const brandValues = [
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

export default function PredictAutomobiles({ type, amplitude, isMobile }) {
  styles = SGStyles();
  const navigate = useNavigate();
  // Years being displayed
  const [displayYears, setDisplayYears] = useState(
    years.slice(startIndex, endIndex)
  );
  // Determines number of years to display, 22 for 22 years, anything over that is 22 - excess = number of years
  const [yearsCount, setYearsCount] = useState(22);

  // If this changes to true, useEffect will rerender the graph points
  const [updateGraph, setUpdateGraph] = useState(false);

  // Scroll position
  const [position, setPosition] = useState(24);
  // Maximum scroll length according to current zoom level
  const [scrollLimit, setScrollLimit] = useState(24);

  const displayAverageCarPrices = averageCarPrices.slice(startIndex, endIndex);

  const [initialPrice, setInitialPrice] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [brand, setBrand] = useState("");
  const [dropdownFocus, setDropdownFocus] = useState(false);
  const [colorChangeIndex, setColorChangeIndex] = useState(0);

  const [originalPoints, setOriginalPoints] = useState([averageCarPrices]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState("");

  const [lineValueDataset, setLineValueDataset] = useState([
    {
      label: "Average Car Price (USD $)",
      data: displayAverageCarPrices,
      borderColor: `rgb(${Math.random() * 255}, ${Math.random() * 255},${
        Math.random() * 255
      })`,
    },
  ]);
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Year", // Label for the x-axis
          color: "#4ca0d7",
        },
        grid: {
          display: false, // Hide y-axis grid lines
        },
      },
      y: {
        title: {
          display: true,
          text: "Price", // Label for the y-axis
          color: "#4ca0d7",
        },
        grid: {
          display: false, // Hide y-axis grid lines
        },
      },
    },
  };
  const lineData = {
    labels: displayYears,
    datasets: lineValueDataset,
  };

  const OnScrollChangeTrigger = (value) => {
    const difference = value - startIndex;
    startIndex += difference;
    endIndex += difference;

    setPosition(value);
    setDisplayYears(years.slice(startIndex, endIndex));
    // Update the points being displayed
    newDataset = [];
    for (item in lineValueDataset) {
      let newItem = lineValueDataset[item];
      newItem.data = originalPoints[item].slice(startIndex, endIndex);
      newDataset.push(newItem);
    }
    setLineValueDataset(newDataset);
  };

  const OnZoomChangeTrigger = (value) => {
    // Difference of years
    const difference = yearsCount - value;
    // We move the last number if position isn't at the end
    if (position == scrollLimit && difference > 0) {
      startIndex -= difference;
      setPosition(scrollLimit - difference);
    } else {
      endIndex += difference;
    }

    setScrollLimit(scrollLimit - difference);

    // Update the number of years being displayed
    setYearsCount(value);
    // Update the years being displayed
    setDisplayYears(years.slice(startIndex, endIndex));
    // Update the points being displayed
    newDataset = [];
    for (item in lineValueDataset) {
      let newItem = JSON.parse(JSON.stringify(lineValueDataset[item]));
      newItem.data = originalPoints[item].slice(startIndex, endIndex);
      newDataset.push(newItem);
    }
    setLineValueDataset(newDataset);
  };

  const handleNumberInput = (text, setValue) => {
    if (/^\d*$/.test(text)) {
      // Regex to check if the input is only digits
      setValue(text);
    }
  };

  function addToGraph(priceString, yearString, brand) {
    const price = parseFloat(priceString);
    const year = parseInt(yearString);

    // If price is not at least 7500
    if (price < 7500 || isNaN(price)) {
      return "Enter a price of at least $7500";
    } // If year is too old or new
    else if (year < 2000 || year > 2025 || isNaN(year)) {
      return "Enter a year between 2000 and 2025";
    } else if (brand.length == 0) {
      return "Select a brand";
    }

    // The rate that the price drops
    let rate = null;
    // Iterate through the brandValues array and find the rate for this brand
    for (item in brandValues) {
      if (brand == brandValues[item].label) {
        rate = brandValues[item].value;
        break;
      }
    }
    // This gets appended to lineValuesDataset to display
    let prices = [];
    // This is used for the seed
    let lastPrice = price;
    // Start at 2000 for readability, each i value is an x value on the graph (years)
    for (let i = 2000; i < 2056; i++) {
      // If vehicle wasn't manufactured yet, then don't display price for that year
      if (i < year) {
        prices.push(null);
      } // For each year it was released, calculate the price for that year
      else {
        const seed = `${price}${brand}${year}${lastPrice}`;
        const rng = seedrandom(seed);
        const newCalculatedPrice =
          price * Math.E ** ((rate + rng() * 0.02) * (i - year));
        let newRandomPrice = rng() * 0.1 * lastPrice + newCalculatedPrice;
        if (newRandomPrice > lastPrice) {
          newRandomPrice =
            newRandomPrice - newCalculatedPrice - newCalculatedPrice * -1;
        }
        prices.push(newRandomPrice);
        lastPrice = newRandomPrice;
      }
    }

    while (true) {
      let matchFound = false;
      const red = Math.random() * 255;
      const green = Math.random() * 255;
      const blue = Math.random() * 255;

      newBorderColor = `rgb(${red}, ${green}, ${blue})`;

      for (item in lineValueDataset) {
        if (newBorderColor == lineValueDataset[item].borderColor) {
          matchFound = true;
          break;
        }
      }

      if (!matchFound) {
        newLine = {
          label: `$${price} ${year} ${brand}`,
          data: prices,
          borderColor: newBorderColor,
        };
        setOriginalPoints((prevPoints) => [...prevPoints, prices]);
        setLineValueDataset((prevLines) => [...prevLines, newLine]);
        setUpdateGraph(true);

        break;
      }
    }
    return 0;
  }

  const updateColor = (newColor) => {
    // Update the points being displayed
    newDataset = [];
    for (item in lineValueDataset) {
      let newItem = JSON.parse(JSON.stringify(lineValueDataset[item]));
      newDataset.push(newItem);
    }
    newDataset[colorChangeIndex].borderColor = newColor.hex;
    setLineValueDataset(newDataset);
  };

  useEffect(() => {
    if (updateGraph) {
      setUpdateGraph(false);
      // Update the points being displayed
      newDataset = [];
      for (item in lineValueDataset) {
        let newItem = JSON.parse(JSON.stringify(lineValueDataset[item]));
        newItem.data = originalPoints[item].slice(startIndex, endIndex);
        newDataset.push(newItem);
      }
      setLineValueDataset(newDataset);
    }
  }, [isMobile, updateGraph]);

  return (
    <ScrollView contentContainerStyle={styles.containerStyles.webContainer}>
      {/* Main Body */}
      <View style={styles.containerStyles.comparisonScreenContainer}>
        <Text style={[styles.textStyles.text, { fontSize: 25 }]}>
          {type} Prediction
        </Text>
        {/* Top Buttons */}
        <View
          style={{
            marginRight: "auto",
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {/* Back to home */}
          <Pressable
            onPress={() => {
              {
                /* Set page to home */
              }
              navigate("/home");
            }}
            style={({ pressed }) => [
              styles.inputStyles.button,
              pressed && styles.inputStyles.buttonClicked,
            ]}
          >
            <p>{"< Go Back"}</p>
          </Pressable>
        </View>

        {/* Main Content */}
        {isMobile ? (
          <View>
            {/* Graph */}
            <Line options={lineOptions} data={lineData} />
            {/* Scroll */}
            <View style={{ flexDirection: "row" }}>
              <Text
                style={[
                  styles.textStyles.plainText,
                  { marginRight: 10, userSelect: "none" },
                ]}
              >
                Scroll
              </Text>
              <Slider
                value={position}
                onChange={OnScrollChangeTrigger}
                step={1}
                min={0}
                max={scrollLimit}
                trackStyle={{ backgroundColor: "#4ca0d7", height: 10 }}
                railStyle={{ backgroundColor: "lightblue", height: 10 }}
                handleStyle={{
                  marginLeft: 0,
                  marginTop: -2,
                }}
              />
            </View>
            {/* Zoom slider */}
            <View style={{ flex: 0.3 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={[
                    styles.textStyles.plainText,
                    { marginRight: 10, userSelect: "none" },
                  ]}
                >
                  Zoom
                </Text>
                <Text
                  style={[
                    styles.textStyles.plainText,
                    { marginRight: 10, fontSize: 20, userSelect: "none" },
                  ]}
                >
                  -
                </Text>
                <Slider
                  value={yearsCount}
                  onChange={OnZoomChangeTrigger}
                  step={1}
                  min={22}
                  max={44}
                  trackStyle={{ backgroundColor: "#4ca0d7" }}
                  railStyle={{ backgroundColor: "lightblue" }}
                />
                <Text
                  style={[
                    styles.textStyles.plainText,
                    {
                      marginLeft: 10,
                      marginTop: 10,
                      fontSize: 20,
                      userSelect: "none",
                    },
                  ]}
                >
                  +
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={{ flexDirection: "row" }}>
            {/* Graph and Scroll slider */}
            <View style={{ width: "55%" }}>
              {/* Graph */}
              <Line options={lineOptions} data={lineData} />
              {/* Scroll */}
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={[
                    styles.textStyles.plainText,
                    { marginRight: 10, userSelect: "none" },
                  ]}
                >
                  Scroll
                </Text>
                <Slider
                  value={position}
                  onChange={OnScrollChangeTrigger}
                  step={1}
                  min={0}
                  max={scrollLimit}
                  trackStyle={{ backgroundColor: "#4ca0d7", height: 10 }}
                  railStyle={{ backgroundColor: "lightblue", height: 10 }}
                  handleStyle={{
                    marginLeft: 0,
                    marginTop: -2,
                  }}
                />
              </View>
            </View>
            {/* Side Controls */}
            <View style={{ flex: 1, marginLeft: 15 }}>
              {/* Zoom slider */}
              <View style={{ width: "30%" }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text
                    style={[
                      styles.textStyles.plainText,
                      { marginRight: 10, userSelect: "none" },
                    ]}
                  >
                    Zoom
                  </Text>
                  <Text
                    style={[
                      styles.textStyles.plainText,
                      { marginRight: 10, fontSize: 20, userSelect: "none" },
                    ]}
                  >
                    -
                  </Text>
                  <Slider
                    value={yearsCount}
                    onChange={OnZoomChangeTrigger}
                    step={1}
                    min={22}
                    max={44}
                    trackStyle={{ backgroundColor: "#4ca0d7" }}
                    railStyle={{ backgroundColor: "lightblue" }}
                  />
                  <Text
                    style={[
                      styles.textStyles.plainText,
                      { marginLeft: 15, fontSize: 20, userSelect: "none" },
                    ]}
                  >
                    +
                  </Text>
                </View>
              </View>
              {/* Initial Price Field */}
              <TextInput
                value={initialPrice}
                style={styles.inputStyles.predictionTextInput}
                placeholder="Initial New Price"
                id="initialPrice"
                inputMode="numeric"
                onChange={(text) =>
                  handleNumberInput(text.nativeEvent.text, setInitialPrice)
                }
              ></TextInput>

              {/* Release Year Field */}
              <TextInput
                value={releaseYear}
                style={styles.inputStyles.predictionTextInput}
                placeholder="Release Year"
                id="releaseYear"
                inputMode="numeric"
                onChange={(text) =>
                  handleNumberInput(text.nativeEvent.text, setReleaseYear)
                }
              ></TextInput>

              {/* Brand drop down */}
              <Dropdown
                style={{ marginTop: 15, width: "50%" }}
                placeholderStyle={styles.inputStyles.predictionTextInput}
                selectedTextStyle={styles.inputStyles.predictionTextInput}
                containerStyle={styles.containerStyles.dropdownMenu}
                inputSearchStyle={styles.inputStyles.searchTextInput}
                selectedStyle={styles.containerStyles.dropdownMenu}
                itemContainerStyle={styles.containerStyles.dropdownMenuItem}
                itemTextStyle={{ color: "#4ca0d7" }}
                data={dropdownData}
                search
                labelField="label"
                valueField="value"
                placeholder={
                  !dropdownFocus ? "Select a brand" : "Select a brand"
                }
                searchPlaceholder="Search"
                value={brand}
                onFocus={() => setDropdownFocus(true)}
                onBlur={() => setDropdownFocus(false)}
                onChange={(item) => {
                  setBrand(item.value);
                  setDropdownFocus(false);
                }}
              />

              {/* Add */}
              <Pressable
                onPress={() => {
                  const result = addToGraph(initialPrice, releaseYear, brand);
                  if (result != 0) {
                    setError(result);
                    setShowErrorModal(true);
                  }
                }}
                style={({ pressed }) => [
                  styles.inputStyles.button,
                  pressed && styles.inputStyles.buttonClicked,
                  { width: "50%", marginLeft: 0, marginTop: 25 },
                ]}
              >
                <p>Add</p>
              </Pressable>

              {/* Edit */}
              <Pressable
                onPress={() => {
                  setShowEditModal(true);
                }}
                style={({ pressed }) => [
                  styles.inputStyles.button,
                  pressed && styles.inputStyles.buttonClicked,
                  { width: "50%", marginLeft: 0 },
                ]}
              >
                <p>Edit</p>
              </Pressable>
            </View>
          </View>
        )}
      </View>

      <Footer amplitude={amplitude} isMobile={isMobile} />

      {/* Edit Modal */}
      <Modal visible={showEditModal} animationType="slide" transparent="true">
        <View style={styles.containerStyles.modalContainer}>
          <Text style={styles.textStyles.text}>Edit Graph</Text>
          <ScrollView style={styles.textStyles.modalText}>
            {lineValueDataset.map((item, index) => (
              <View
                key={index}
                style={{
                  borderWidth: 3,
                  borderColor: item.borderColor,
                  padding: 15,
                  marginVertical: 15,
                  marginHorizontal: 5,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {/* Label name */}
                <Text
                  style={[
                    styles.textStyles.plainText,
                    { fontSize: 20, marginRight: 5 },
                  ]}
                >
                  {item.label}
                </Text>

                {/* Change color */}
                {colorChangeIndex == index ? (
                  // Color picker
                  <ChromePicker
                    color={item.borderColor}
                    onChange={updateColor}
                  ></ChromePicker>
                ) : (
                  // Enable Color Picker
                  <Pressable
                    style={{
                      width: 20,
                      height: 20,
                      backgroundColor: item.borderColor,
                    }}
                    onPress={() => {
                      setColorChangeIndex(index);
                    }}
                  ></Pressable>
                )}

                {/* Delete Button */}
                <Pressable
                  style={{ marginLeft: 10 }}
                  onPress={() => {
                    newOriginalPoints = originalPoints.filter(
                      (array) => array !== originalPoints[index]
                    );
                    setOriginalPoints(newOriginalPoints);
                    newLineValueDataset = lineValueDataset.filter(
                      (array) => array !== lineValueDataset[index]
                    );
                    setLineValueDataset(newLineValueDataset);

                    console.log(newLineValueDataset);
                    console.log(newOriginalPoints);

                    setColorChangeIndex(0);
                  }}
                >
                  <Image
                    source={require("../../../assets/Trash Icon.png")}
                    style={{ width: 20, height: 20 }}
                  ></Image>
                </Pressable>
              </View>
            ))}
          </ScrollView>
          {/* Cancel button */}
          <Pressable
            onPress={() => {
              // Hide the modal
              setShowEditModal(false);
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
      {/* Error Modal */}
      <Modal visible={showErrorModal} animationType="slide" transparent="true">
        <View style={styles.containerStyles.modalContainer}>
          <Text style={styles.textStyles.text}>Error</Text>
          <Text style={styles.textStyles.errorText}>{error}</Text>
          {/* Cancel button */}
          <Pressable
            onPress={() => {
              // Hide the modal
              setShowErrorModal(false);
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
