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
import { Navbar } from "../../Navbar";
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

let startIndex = 24;
let endIndex = 56;

export default function PredictionAnalysis({
  type,
  amplitude,
  isMobile,
  averagePrices,
  brandValues,
  dropdownData,
  minimumPrice,
}) {
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

  const [initialPrice, setInitialPrice] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [brand, setBrand] = useState("");
  const [dropdownFocus, setDropdownFocus] = useState(false);
  const [colorChangeIndex, setColorChangeIndex] = useState(0);

  const [originalPoints, setOriginalPoints] = useState([]);
  const [initalizedAveragePrices, setInitializedAveragePrices] =
    useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState("");

  const [lineValueDataset, setLineValueDataset] = useState([]);
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
    if (price < minimumPrice || isNaN(price)) {
      return `Enter a price of at least ${minimumPrice}`;
    } // If year is too old or new
    else if (year < 2000 || year > 2025 || isNaN(year)) {
      return "Enter a year between 2000 and 2025";
    } else if (brand.length == 0) {
      return "Select a brand";
    }

    // The rate that the price drops
    let rate = null;
    console.log(brandValues);
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
    console.log(rate);
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
    amplitude.track("Update Line Color", { color: newColor });
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
    if (!initalizedAveragePrices) {
      if (averagePrices != null) {
        setOriginalPoints([averagePrices.slice()]);
        setLineValueDataset([
          {
            label: `Average ${type} Price (USD $)`,
            data: averagePrices.slice(startIndex, endIndex),
            borderColor: `rgb(${Math.random() * 255}, ${Math.random() * 255},${
              Math.random() * 255
            })`,
          },
        ]);
      }

      setInitializedAveragePrices(true);
    }
  }, [isMobile, updateGraph]);

  return (
    <ScrollView contentContainerStyle={styles.containerStyles.webContainer}>
      <Navbar page="prediction" isMobile={isMobile}></Navbar>
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
          /* Mobile View */
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
            <View style={{ flex: 0.3, marginTop: 5 }}>
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
                      fontSize: 20,
                      userSelect: "none",
                    },
                  ]}
                >
                  +
                </Text>
              </View>
            </View>
            {/* Bottom Controls */}
            <View style={{ marginTop: 20 }}>
              {/* Initial Price Field */}
              <TextInput
                value={initialPrice}
                style={[
                  styles.inputStyles.predictionTextInput,
                  { fontSize: 16, width: "100%" },
                ]}
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
                style={[
                  styles.inputStyles.predictionTextInput,
                  { fontSize: 16, width: "100%" },
                ]}
                placeholder="Release Year"
                id="releaseYear"
                inputMode="numeric"
                onChange={(text) =>
                  handleNumberInput(text.nativeEvent.text, setReleaseYear)
                }
              ></TextInput>
              {/* Brand drop down */}
              <Dropdown
                style={{ marginTop: 15 }}
                placeholderStyle={[
                  styles.inputStyles.predictionTextInput,
                  { fontSize: 16, width: "100%" },
                ]}
                selectedTextStyle={[
                  styles.inputStyles.predictionTextInput,
                  { fontSize: 16, width: "100%" },
                ]}
                containerStyle={styles.containerStyles.dropdownMenu}
                inputSearchStyle={styles.inputStyles.searchTextInput}
                selectedStyle={styles.containerStyles.dropdownMenu}
                itemContainerStyle={styles.containerStyles.dropdownMenu}
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
                    amplitude.track("Error adding item", { error: result });
                  } else {
                    amplitude.track("Add Prediction Item", {
                      type: type,
                      initialPrice: initialPrice,
                      releaseYear: releaseYear,
                      brand: brand,
                    });
                  }
                }}
                style={({ pressed }) => [
                  styles.inputStyles.button,
                  pressed && styles.inputStyles.buttonClicked,
                  { marginLeft: 0, marginTop: 25, width: "100%" },
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
                  { marginLeft: 0, width: "100%" },
                ]}
              >
                <p>Edit</p>
              </Pressable>
              {/* Add Average Price, only if available */}
              {averagePrices && (
                <Pressable
                  onPress={() => {
                    amplitude.track("Add Average Price", { type: type });
                    while (true) {
                      let matchFound = false;
                      const red = Math.random() * 255;
                      const green = Math.random() * 255;
                      const blue = Math.random() * 255;

                      newBorderColor = `rgb(${red}, ${green}, ${blue})`;

                      for (item in lineValueDataset) {
                        if (
                          newBorderColor == lineValueDataset[item].borderColor
                        ) {
                          matchFound = true;
                          break;
                        }
                      }

                      if (!matchFound) {
                        newLine = {
                          label: `Average ${type} Price (USD $)`,
                          data: averagePrices.slice(),
                          borderColor: newBorderColor,
                        };
                        setOriginalPoints((prevPoints) => [
                          ...prevPoints,
                          averagePrices.slice(),
                        ]);
                        setLineValueDataset((prevLines) => [
                          ...prevLines,
                          newLine,
                        ]);
                        setUpdateGraph(true);

                        break;
                      }
                    }
                  }}
                  style={({ pressed }) => [
                    styles.inputStyles.button,
                    pressed && styles.inputStyles.buttonClicked,
                    { marginLeft: 0, width: "100%" },
                  ]}
                >
                  <p>Add Average {type} Price</p>
                </Pressable>
              )}

              {/* Export CSV */}
              <Pressable
                onPress={() => {
                  // This data will be converted to a csv
                  let exportData = [];
                  amplitude.track("Export CSV");
                  // The first row, and in the first column is the years
                  firstJSON = {};
                  firstJSON["Year"] = "Year";
                  // All the other columns will be the prices in the order they were added, this for loop is to initialize the first row
                  for (let j = 0; j < lineValueDataset.length; j++) {
                    firstJSON[lineValueDataset[j].label] =
                      lineValueDataset[j].label;
                  }
                  // Add the first row
                  exportData.push(firstJSON);
                  // Iterate through all years on the visible graph
                  for (let i = startIndex; i < endIndex; i++) {
                    let newJSON = {};
                    // Year of the current row
                    newJSON["Year"] = 2000 + i;
                    // Iterate through prices of the current index for each item
                    for (let j = 0; j < lineValueDataset.length; j++) {
                      newJSON[lineValueDataset[j].label] = originalPoints[j][i];
                    }
                    // Add this row
                    exportData.push(newJSON);
                  }

                  // Don't know what all this does, don't touch it
                  const csv = exportData
                    .map((row) => {
                      return Object.values(row).toString();
                    })
                    .join("\n");

                  const blob = new Blob([csv], {
                    type: "text/csv;charset=utf-8;",
                  });
                  const link = document.createElement("a");
                  const url = URL.createObjectURL(blob);
                  link.setAttribute("href", url);
                  link.setAttribute("download", "table_data.csv");
                  link.style.visibility = "hidden";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                style={({ pressed }) => [
                  styles.inputStyles.button,
                  pressed && styles.inputStyles.buttonClicked,
                  { marginLeft: 0, width: "100%" },
                ]}
              >
                <p>Export CSV</p>
              </Pressable>
            </View>
          </View>
        ) : (
          /* Computer View */
          <ScrollView horizontal={true}>
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
              {/* Side Controls First Column */}
              <View style={{ marginLeft: 15 }}>
                {/* Zoom slider */}
                <View style={{ width: "98%" }}>
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
                  style={{ marginTop: 15 }}
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
                      amplitude.track("Error adding item", { error: result });
                    } else {
                      amplitude.track("Add Prediction Item", {
                        type: type,
                        initialPrice: initialPrice,
                        releaseYear: releaseYear,
                        brand: brand,
                      });
                    }
                  }}
                  style={({ pressed }) => [
                    styles.inputStyles.button,
                    pressed && styles.inputStyles.buttonClicked,
                    { marginLeft: 0, marginTop: 25 },
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
                    { marginLeft: 0 },
                  ]}
                >
                  <p>Edit</p>
                </Pressable>
              </View>
              {/* Side Controls Second Column */}
              <View style={{ marginTop: 212, marginLeft: 0 }}>
                {/* Add Average Price, only if available */}
                {averagePrices && (
                  <Pressable
                    onPress={() => {
                      amplitude.track("Add Average Price", { type: type });
                      while (true) {
                        let matchFound = false;
                        const red = Math.random() * 255;
                        const green = Math.random() * 255;
                        const blue = Math.random() * 255;

                        newBorderColor = `rgb(${red}, ${green}, ${blue})`;

                        for (item in lineValueDataset) {
                          if (
                            newBorderColor == lineValueDataset[item].borderColor
                          ) {
                            matchFound = true;
                            break;
                          }
                        }

                        if (!matchFound) {
                          newLine = {
                            label: `Average ${type} Price (USD $)`,
                            data: averagePrices.slice(),
                            borderColor: newBorderColor,
                          };
                          setOriginalPoints((prevPoints) => [
                            ...prevPoints,
                            averagePrices.slice(),
                          ]);
                          setLineValueDataset((prevLines) => [
                            ...prevLines,
                            newLine,
                          ]);
                          setUpdateGraph(true);

                          break;
                        }
                      }
                    }}
                    style={({ pressed }) => [
                      styles.inputStyles.button,
                      pressed && styles.inputStyles.buttonClicked,
                      { marginLeft: 0, width: "100%" },
                    ]}
                  >
                    <p>Add Average {type} Price</p>
                  </Pressable>
                )}

                {/* Export CSV */}
                <Pressable
                  onPress={() => {
                    // This data will be converted to a csv
                    let exportData = [];
                    amplitude.track("Export CSV");
                    // The first row, and in the first column is the years
                    firstJSON = {};
                    firstJSON["Year"] = "Year";
                    // All the other columns will be the prices in the order they were added, this for loop is to initialize the first row
                    for (let j = 0; j < lineValueDataset.length; j++) {
                      firstJSON[lineValueDataset[j].label] =
                        lineValueDataset[j].label;
                    }
                    // Add the first row
                    exportData.push(firstJSON);
                    // Iterate through all years on the visible graph
                    for (let i = startIndex; i < endIndex; i++) {
                      let newJSON = {};
                      // Year of the current row
                      newJSON["Year"] = 2000 + i;
                      // Iterate through prices of the current index for each car
                      for (let j = 0; j < lineValueDataset.length; j++) {
                        newJSON[lineValueDataset[j].label] =
                          originalPoints[j][i];
                      }
                      // Add this row
                      exportData.push(newJSON);
                    }

                    // Don't know what all this does, don't touch it
                    const csv = exportData
                      .map((row) => {
                        return Object.values(row).toString();
                      })
                      .join("\n");

                    const blob = new Blob([csv], {
                      type: "text/csv;charset=utf-8;",
                    });
                    const link = document.createElement("a");
                    const url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    // table_data.csv is the name of the file, maybe the name can be changed according to the category
                    link.setAttribute("download", "table_data.csv");
                    link.style.visibility = "hidden";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  style={({ pressed }) => [
                    styles.inputStyles.button,
                    pressed && styles.inputStyles.buttonClicked,
                    { marginLeft: 0, width: "100%" },
                  ]}
                >
                  <p>Export CSV</p>
                </Pressable>
              </View>
            </View>
          </ScrollView>
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
                    amplitude.track("Delete Graph Item", {
                      item: lineValueDataset[index].label,
                    });
                    // Remove this item and set the color change index to 0 to minimize errors
                    newOriginalPoints = originalPoints.filter(
                      (array) => array !== originalPoints[index]
                    );
                    setOriginalPoints(newOriginalPoints);
                    newLineValueDataset = lineValueDataset.filter(
                      (array) => array !== lineValueDataset[index]
                    );
                    setLineValueDataset(newLineValueDataset);

                    setColorChangeIndex(0);
                  }}
                >
                  <Image
                    source={require("../../../assets/Trash Icon.webp")}
                    style={{ width: 20, height: 20 }}
                    alt="Trash Icon for deleting"
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
            <p>Close</p>
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
            <p>Okay</p>
          </Pressable>
        </View>
      </Modal>
    </ScrollView>
  );
}
