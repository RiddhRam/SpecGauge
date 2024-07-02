import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import SetTitleAndDescription from "../functions/SetTitleAndDescription";

import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { HexColorPicker } from "react-colorful";

import Modal from "react-modal";

Modal.setAppElement("#SpecGauge");

import { Line } from "react-chartjs-2";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
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
  minimumPrice,
}) {
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
  const [colorChangeIndex, setColorChangeIndex] = useState(0);

  const [originalPoints, setOriginalPoints] = useState([]);
  const [initalizedAveragePrices, setInitializedAveragePrices] =
    useState(false);

  const [showBrandModal, setShowBrandModal] = useState(false);
  const [brand, setBrand] = useState("");
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
    const newDataset = [];
    for (let item in lineValueDataset) {
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
    const newDataset = [];
    for (let item in lineValueDataset) {
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
    const year = parseFloat(yearString);

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

    // Iterate through the brandValues array and find the rate for this brand
    for (let item in brandValues) {
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
            newRandomPrice - newCalculatedPrice - (newCalculatedPrice / 2) * -1;
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

      const newBorderColor = `rgb(${red}, ${green}, ${blue})`;

      for (let item in lineValueDataset) {
        if (newBorderColor == lineValueDataset[item].borderColor) {
          matchFound = true;
          break;
        }
      }

      if (!matchFound) {
        const newLine = {
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
    const newDataset = [];
    for (let item in lineValueDataset) {
      let newItem = JSON.parse(JSON.stringify(lineValueDataset[item]));
      newDataset.push(newItem);
    }
    // Original colour is a rgb, if edited it becomes a hex
    newDataset[colorChangeIndex].borderColor = newColor;
    setLineValueDataset(newDataset);
  };

  useEffect(() => {
    if (updateGraph) {
      setUpdateGraph(false);
      // Update the points being displayed
      const newDataset = [];
      for (let item in lineValueDataset) {
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

  useEffect(() => {
    amplitude.track("Prediction Screen", {
      Screen: type,
      Platform: isMobile ? "Mobile" : "Computer",
    });
    SetTitleAndDescription(
      `Predict ${type} Prices`,
      `View future prices of ${type} over time`
    );
  }, []);

  return (
    <>
      <Navbar page="prediction" isMobile={isMobile}></Navbar>
      {/* Main Body */}
      <div className="PredictionContainer">
        <p style={{ fontSize: 25 }} className="HeaderText">
          {type} Prediction
        </p>
        {/* Top Buttons */}
        <div
          style={{
            marginLeft: "40px",
            marginRight: "auto",
            marginBottom: "30px",
          }}
        >
          {/* Back to home */}
          <button
            onClick={() => {
              {
                /* Set page to home */
              }
              navigate("/home");
            }}
            className="NormalButton"
            style={{ height: "47px", padding: "0 5px", paddingBottom: "5px" }}
          >
            <p>{"< Go Back"}</p>
          </button>
        </div>

        {/* Main Content */}
        {isMobile ? (
          /* Mobile view */
          <div
            className="ScrollViewY"
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "10px 18px",
              justifyContent: "center",
            }}
          >
            {/* Graph */}
            <Line options={lineOptions} data={lineData} />
            {/* Scroll */}
            <p
              style={{ marginRight: 10, userSelect: "none" }}
              className="PlainText"
            >
              Scroll
            </p>
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
            {/* Zoom slider */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <p
                style={{ marginRight: 10, userSelect: "none" }}
                className="PlainText"
              >
                Zoom
              </p>
              <p
                style={{
                  marginRight: 15,
                  fontSize: 20,
                  userSelect: "none",
                }}
                className="PlainText"
              >
                -
              </p>
              <Slider
                value={yearsCount}
                onChange={OnZoomChangeTrigger}
                step={1}
                min={22}
                max={44}
                trackStyle={{ backgroundColor: "#4ca0d7" }}
                railStyle={{ backgroundColor: "lightblue" }}
              />
              <p
                style={{
                  marginLeft: 10,
                  fontSize: 20,
                  userSelect: "none",
                }}
                className="PlainText"
              >
                +
              </p>
            </div>
            {/* Bottom Controls */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(2, 1fr)`,
                gridTemplateRows: `65px 65px 65px 65px`,
                rowGap: "6px",
                columnGap: "10px",
                minWidth: "350px",
              }}
            >
              {/* Initial Price Field */}
              <input
                type="number"
                value={initialPrice}
                className="TextInput"
                placeholder="Initial New Price"
                onChange={(event) =>
                  handleNumberInput(event.target.value, setInitialPrice)
                }
                style={{ fontSize: 13, width: "73%" }}
              ></input>

              {/* Release Year Field */}
              <input
                type="number"
                value={releaseYear}
                className="TextInput"
                placeholder="Release Year"
                onChange={(event) =>
                  handleNumberInput(event.target.value, setReleaseYear)
                }
                style={{ fontSize: 13, width: "73%" }}
              ></input>

              {/* Select Brand */}
              <button
                onClick={() => {
                  setShowBrandModal(true);
                }}
                style={{ width: "90%", fontSize: 13 }}
                className="NormalButton"
              >
                <p>
                  {brand.length == 0
                    ? "Select a brand"
                    : `Brand Selected: ${brand}`}
                </p>
              </button>

              {/* Add */}
              <button
                onClick={() => {
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
                className="NormalButton"
                style={{ width: "90%", fontSize: 13 }}
              >
                <p>Add</p>
              </button>

              {/* Edit */}
              <button
                onClick={() => {
                  setShowEditModal(true);
                }}
                className="NormalButton"
                style={{ width: "90%", fontSize: 13 }}
              >
                <p>Edit</p>
              </button>

              {/* Add Average Price, only if available */}
              {averagePrices ? (
                <button
                  onClick={() => {
                    amplitude.track("Add Average Price", { type: type });
                    while (true) {
                      let matchFound = false;
                      const red = Math.random() * 255;
                      const green = Math.random() * 255;
                      const blue = Math.random() * 255;

                      let newBorderColor = `rgb(${red}, ${green}, ${blue})`;

                      for (let item in lineValueDataset) {
                        if (
                          newBorderColor == lineValueDataset[item].borderColor
                        ) {
                          matchFound = true;
                          break;
                        }
                      }

                      if (!matchFound) {
                        const newLine = {
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
                  style={{
                    width: "90%",
                    display: "flex",
                    alignItems: "center",
                    fontSize: 13,
                    justifyContent: "center",
                  }}
                  className="NormalButton"
                >
                  <p style={{ textAlign: "center" }}>Add Average Price</p>
                </button>
              ) : (
                /* Empty Cell */ <div></div>
              )}

              {/* Export CSV */}
              <button
                onClick={() => {
                  // This data will be converted to a csv
                  let exportData = [];
                  amplitude.track("Export CSV");
                  // The first row, and in the first column is the years
                  let firstJSON = {};
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
                style={{ marginLeft: 0, width: "90%", fontSize: 13 }}
                className="NormalButton"
              >
                <p>Export CSV</p>
              </button>
            </div>
          </div>
        ) : (
          /* Computer view */
          <div
            className="ScrollViewX"
            style={{
              display: "flex",
              flexDirection: "row",
              marginLeft: "20px",
              paddingBottom: "10px",
              paddingRight: "10px",
            }}
          >
            {/* Graph and Scroll slider */}
            <div style={{ minWidth: "736px" }}>
              {/* Graph */}
              <Line options={lineOptions} data={lineData} />
              {/* Scroll */}
              <p
                style={{ marginRight: 10, userSelect: "none" }}
                className="PlainText"
              >
                Scroll
              </p>
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
            </div>
            {/* Side Controls */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `150px 100px`,
                gridTemplateRows: `65px 65px 65px 65px 65px 65px`,
                gridAutoFlow: "column",
                marginLeft: "30px",
                marginTop: "-10px",
                rowGap: "6px",
                columnGap: "60px",
              }}
            >
              {/* Zoom slider */}
              <div
                style={{
                  width: "126%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <p
                  style={{ marginRight: 10, userSelect: "none" }}
                  className="PlainText"
                >
                  Zoom
                </p>
                <p
                  style={{
                    marginRight: 15,
                    fontSize: 20,
                    userSelect: "none",
                  }}
                  className="PlainText"
                >
                  -
                </p>
                <Slider
                  value={yearsCount}
                  onChange={OnZoomChangeTrigger}
                  step={1}
                  min={22}
                  max={44}
                  trackStyle={{ backgroundColor: "#4ca0d7" }}
                  railStyle={{ backgroundColor: "lightblue" }}
                />
                <p
                  style={{
                    marginLeft: 10,
                    fontSize: 20,
                    userSelect: "none",
                  }}
                  className="PlainText"
                >
                  +
                </p>
              </div>

              {/* Initial Price Field */}
              <input
                type="number"
                value={initialPrice}
                className="TextInput"
                placeholder="Initial New Price"
                onChange={(event) =>
                  handleNumberInput(event.target.value, setInitialPrice)
                }
                style={{ fontSize: 16, width: "100%" }}
              ></input>

              {/* Release Year Field */}
              <input
                type="number"
                value={releaseYear}
                className="TextInput"
                placeholder="Release Year"
                onChange={(event) =>
                  handleNumberInput(event.target.value, setReleaseYear)
                }
                style={{ fontSize: 16, width: "100%" }}
              ></input>

              {/* Select Brand */}
              <button
                onClick={() => {
                  setShowBrandModal(true);
                }}
                style={{ width: "130%" }}
                className="NormalButton"
              >
                <p>
                  {brand.length == 0
                    ? "Select a brand"
                    : `Brand Selected: ${brand}`}
                </p>
              </button>

              {/* Add */}
              <button
                onClick={() => {
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
                className="NormalButton"
                style={{ width: "130%" }}
              >
                <p>Add</p>
              </button>

              {/* Edit */}
              <button
                onClick={() => {
                  setShowEditModal(true);
                }}
                className="NormalButton"
                style={{ width: "130%" }}
              >
                <p>Edit</p>
              </button>

              {/* Empty cell */}
              <div></div>

              {/* Empty cell */}
              <div></div>

              {/* Empty cell */}
              <div></div>

              {/* Empty cell */}
              <div></div>

              {/* Add Average Price, only if available */}
              {averagePrices ? (
                <button
                  onClick={() => {
                    amplitude.track("Add Average Price", { type: type });
                    while (true) {
                      let matchFound = false;
                      const red = Math.random() * 255;
                      const green = Math.random() * 255;
                      const blue = Math.random() * 255;

                      let newBorderColor = `rgb(${red}, ${green}, ${blue})`;

                      for (let item in lineValueDataset) {
                        if (
                          newBorderColor == lineValueDataset[item].borderColor
                        ) {
                          matchFound = true;
                          break;
                        }
                      }

                      if (!matchFound) {
                        const newLine = {
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
                  style={{ padding: "0 2px" }}
                  className="NormalButton"
                >
                  <p
                    style={{
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    Add Average Price
                  </p>
                </button>
              ) : (
                /* Empty Cell */ <div></div>
              )}

              {/* Export CSV */}
              <button
                onClick={() => {
                  // This data will be converted to a csv
                  let exportData = [];
                  amplitude.track("Export CSV");
                  // The first row, and in the first column is the years
                  let firstJSON = {};
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
                  // table_data.csv is the name of the file, maybe the name can be changed according to the category
                  link.setAttribute("download", "table_data.csv");
                  link.style.visibility = "hidden";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="NormalButton"
                style={{
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <p>Export CSV</p>
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer amplitude={amplitude} isMobile={isMobile} />

      {/* Brand Modal */}
      <Modal
        isOpen={showBrandModal}
        contentLabel="Select a brand"
        className={"ModalContainer"}
        overlayClassName={"ModalOverlay"}
        // Have to set modals on this screen to zIndex 3, because the handle for the rc-slider is also on zIndex 3, so it will show through the modal
        style={{
          overlay: {
            zIndex: 3,
          },
        }}
      >
        <p className="HeaderText">Select a brand</p>
        <div className="ModalButtonSection">
          {brandValues.map((item, index) => (
            <div key={index}>
              {/* Brand button */}
              <button
                className="NormalButtonNoBackground"
                style={{ padding: "15px 8px" }}
                onClick={() => {
                  setBrand(item.label);
                  setShowBrandModal(false);
                }}
              >
                {item.label}
              </button>
            </div>
          ))}
        </div>
        {/* Cancel button */}
        <button
          onClick={() => {
            // Hide the modal
            setShowBrandModal(false);
          }}
          className="NormalButton"
        >
          <p>Cancel</p>
        </button>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        contentLabel="Edit Graph Lines"
        className={"ModalContainer"}
        overlayClassName={"ModalOverlay"}
        style={{
          overlay: {
            zIndex: 3,
          },
        }}
      >
        <p className="HeaderText">Edit Graph</p>
        <div className="ModalButtonSection" style={{ width: "70%" }}>
          {lineValueDataset.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                borderStyle: "solid",
                borderWidth: 3,
                borderColor: item.borderColor,
                padding: "15px 7px",
                margin: "5px 0",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {/* Label name */}
              <p style={{ fontSize: 20, marginRight: 5 }} className="PlainText">
                {item.label}
              </p>

              {/* Change color */}
              {colorChangeIndex == index ? (
                // Color picker
                <HexColorPicker
                  color={item.borderColor}
                  onChange={updateColor}
                ></HexColorPicker>
              ) : (
                // Enable Color Picker
                <button
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: item.borderColor,
                    marginLeft: 15,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setColorChangeIndex(index);
                  }}
                ></button>
              )}

              {/* Delete Button */}
              <button
                className="DangerButtonNoBackground"
                style={{
                  marginLeft: 10,
                }}
                onClick={async () => {
                  amplitude.track("Delete Graph Item", {
                    item: lineValueDataset[index].label,
                  });
                  // Remove this item and set the color change index to 0 to minimize errors
                  const newOriginalPoints = originalPoints.filter(
                    (array) => array !== originalPoints[index]
                  );
                  setOriginalPoints(newOriginalPoints);
                  const newLineValueDataset = lineValueDataset.filter(
                    (array) => array !== lineValueDataset[index]
                  );
                  setLineValueDataset(newLineValueDataset);

                  setColorChangeIndex(0);
                }}
              >
                <p>Delete</p>
              </button>
            </div>
          ))}
        </div>
        {/* Close button */}
        <button
          onClick={() => {
            // Hide the modal
            setShowEditModal(false);
          }}
          className="NormalButton"
        >
          <p>Close</p>
        </button>
      </Modal>

      {/* Error Modal */}
      <Modal
        isOpen={showErrorModal}
        contentLabel="Error adding this line"
        className={"ModalContainer"}
        overlayClassName={"ModalOverlay"}
        style={{
          overlay: {
            zIndex: 3,
          },
        }}
      >
        <p className="HeaderText">Error</p>
        <p className="ErrorText">{error}</p>
        {/* Okay button */}
        <button
          onClick={() => {
            // Hide the modal
            setShowErrorModal(false);
          }}
          className="NormalButton"
        >
          <p>Okay</p>
        </button>
      </Modal>
    </>
  );
}
