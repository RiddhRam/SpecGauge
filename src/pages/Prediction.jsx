import { Navbar } from "../components/Navbar";
import SetTitleAndDescription from "../functions/SetTitleAndDescription";

import { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";

import Modal from "react-modal";

Modal.setAppElement("#SpecGauge");

import { Line } from "react-chartjs-2";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

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

import { logEvent } from "firebase/analytics";
import { analytics } from "../firebaseConfig";

import SetCanonical from "../functions/SetCanonical";
const PredictionBrandSelectionModal = lazy(() =>
  import("../components/PredictionBrandSelectionModal")
);
const PredictionEditModal = lazy(() =>
  import("../components/PredictionEditModal")
);
const PredictionOptionsModal = lazy(() =>
  import("../components/PredictionOptionsModal")
);
const SimpleSuccessModal = lazy(() =>
  import("../components/SimpleSuccessModal")
);
const SimpleErrorModal = lazy(() => import("../components/SimpleErrorModal"));

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

export default function Prediction({
  type,
  isMobile,
  averagePrices,
  brandValues,
  minimumPrice,
  description,
  predictionLink,
  additionalOptions,
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

  // For the input fields
  const [initialPrice, setInitialPrice] = useState("");
  const [releaseYear, setReleaseYear] = useState("");

  // The orignal reference array of all the lines currently selected by the user
  const [originalPoints, setOriginalPoints] = useState([]);
  const [initalizedAveragePrices, setInitializedAveragePrices] =
    useState(false);

  // For the modals
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [brand, setBrand] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [colorChangeIndex, setColorChangeIndex] = useState(0);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [error, setError] = useState("");
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [rateAdjustments, setRateAdjustments] = useState(additionalOptions);
  const [copiedLink, setCopiedLink] = useState(false);
  const [beginLoadingPresets, setBeginLoadingPresets] = useState(false);

  // For the search input
  const [searchString, setSearchString] = useState("");
  const [noResultsFound, setNoResultsFound] = useState(false);

  // This is used in case the user uses navigation buttons to switch types, in which case, the values of the old graph type need to be reset
  const [firstLoad, setFirstLoad] = useState(true);

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

  const addToGraph = async (priceString, yearString, brand) => {
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

    // This gets appended to lineValuesDataset to display
    let prices = [];
    // This is used for the seed, and it's used to determine the margin that the next price should differ by
    let lastPrice = price;

    let originalPrice = null;

    // Dtermines whether or not the last price was an increase from the second last price
    let lastPriceIncreased = false;

    // Start at 2000 for readability, each i value is an x value on the graph (years)
    for (let i = 2000; i < 2056; i++) {
      // The rate that the price drops
      let rate = null;
      // Iterate through the brandValues array and find the rate for this brand
      for (let item in brandValues) {
        if (brand == brandValues[item].label) {
          rate = brandValues[item].value;
          break;
        }
      }
      // first parameter is name of option
      // second parameter is default value
      // third parameter is starting year, value lower than 2000 means to add that many years to vehicle production year
      // fourth parameter is rate change after the third parameter year, 100 means the opposite of vehicle's original rate of change
      // If this comparison type has rate adjustments
      if (rateAdjustments) {
        // Iterate through rate adjustments
        for (let item in rateAdjustments) {
          // If this rate adjustment was enabled
          if (rateAdjustments[item][1] == false) {
            continue;
          }

          // If third parameter is lower than 2000
          if (rateAdjustments[item][2] < 2000) {
            // Add that many years to vehicle production year
            const beginningYear = year + rateAdjustments[item][2];

            // if current is higher than the beginning year (third parameter)
            if (i >= beginningYear) {
              if (rateAdjustments[item][3] > 100) {
                rate = rateAdjustments[item][3];
              }
            }
            continue;
          }
          // If third parameter is 2000 or higher
          // if current is higher than the beginning year (third parameter)
          if (i >= rateAdjustments[item][2]) {
            // Adjust the rate by adding the rate adjustment
            rate += rateAdjustments[item][3];
          }
        }
      }

      // Maximum rate increase is 0.03
      if (rate > 0.03) {
        rate = 0.03;
      }

      // If vehicle wasn't manufactured yet, then don't display price for that year
      if (i < year) {
        prices.push(null);
        continue;
      }
      // If rate is depreciating, follow these rules
      // For each year it was released, calculate the price for that year
      // Get the rng() value
      const seed = `${price}${brand}${year}${lastPrice}${rateAdjustments}`;
      let rng = null;
      await import("../functions/SeedrandomImport").then((module) => {
        rng = module.default(seed);
      });

      // Get the new price
      let newCalculatedPrice =
        price * Math.E ** ((rate + rng() * 0.02) * (i - year));
      // Difference between price of last iteration and this one
      let difference = newCalculatedPrice - lastPrice;

      // If this is the first value then initialize the original price
      if (i == year) {
        originalPrice = newCalculatedPrice;
        prices.push(originalPrice);
        continue;
      }

      // If not the first value
      // If last price was greater than 1.5x the original value, and last price wasn't an increase
      if (lastPrice > originalPrice * 1.5 && !lastPriceIncreased) {
        // The price will hover around twice it's original value
        difference = lastPrice * rng() * -0.04;
        lastPriceIncreased = false;
      }
      // If last price wasn't an increase
      else if (!lastPriceIncreased) {
        // If difference between new and last price is greater than an 8% of the original price
        if (difference > lastPrice * 0.08) {
          // Reduce difference to rng
          // Prevents sharp increases
          difference = lastPrice * rng() * 0.045;
          lastPriceIncreased = false;
        } // If new price is a decrease from last price
        else if (difference < 0) {
          // If the absolute value of the decrease is more than 8% of the original price
          if (difference * -1 > originalPrice * 0.08) {
            // Cut the difference in half
            // Prevents sharp drops
            difference = difference * 0.25;
          }
          lastPriceIncreased = false;
        } else {
          // Difference isn't too large, but the price stayed the same or increased by a small amount
          lastPriceIncreased = false;
        }
      }
      // If last price was an increase
      else {
        // Difference is reduced to 2% from the last price if rate isn't positive
        if (rate < 0 && difference > lastPrice * 0.06) {
          /*difference = lastPrice * rng() * -0.06;
          lastPriceIncreased = false;*/
          rate *= -1;
        }
      }

      /* If difference is signifcantly larger than original price, maybe because rate was too high, bring it down to within 10% of the original price */

      if (difference + lastPrice > originalPrice * 2.1) {
        difference = originalPrice * 0.1 * rng();
      }
      prices.push(lastPrice + difference);
      lastPrice = lastPrice + difference;
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
  };

  const removeGraph = (datasetIndex) => {
    if (analytics != null) {
      logEvent(analytics, "Delete Graph Item", {
        Item: lineValueDataset[datasetIndex].label,
      });
    }

    // Remove this item and set the color change index to 0 to minimize errors
    const newOriginalPoints = originalPoints.filter(
      (array) => array !== originalPoints[datasetIndex]
    );

    setOriginalPoints(newOriginalPoints);

    const newLineValueDataset = lineValueDataset.filter(
      (array) => array !== lineValueDataset[datasetIndex]
    );

    const lineNames = [];

    for (let item in newLineValueDataset) {
      // Have to split it up so it works with BuildTitle, or else it puts each character in its own space
      lineNames.push(newLineValueDataset[item].label.split());
    }

    setLineValueDataset(newLineValueDataset);

    if (newLineValueDataset.length > 0) {
      import("../functions/BuildTitle").then((module) => {
        // Update the title
        const newTitle = module.default(lineNames, "Predict:");
        SetTitleAndDescription(newTitle, description, window.location.href);
      });
    } else {
      SetTitleAndDescription(
        `Predict Future ${type} Prices`,
        description,
        window.location.href
      );
    }

    setColorChangeIndex(0);
  };

  const updateColor = (newColor) => {
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

  const checkNoResults = (text) => {
    let matchFound = false;
    for (let item in brandValues) {
      if (brandValues[item].label.toUpperCase().includes(text.toUpperCase())) {
        matchFound = true;
        break;
      }
    }

    if (matchFound) {
      setNoResultsFound(false);
    } else {
      setNoResultsFound(true);
    }
    setSearchString(text);
  };

  const loadPresets = async (presetURL) => {
    const brands = [];

    for (let item in brandValues) {
      brands.push(brandValues[item].label);
    }

    let processes = [];

    // Lazy import this, becaues it includes pako
    await import("../functions/DeconstructURLFriendlyPredict").then(
      (module) => {
        // Deconstruct the string into a process array
        processes = module.default(presetURL, brands);
      }
    );

    for (let item in processes) {
      const processItem = processes[item];
      if (processItem[0] != "Average") {
        addToGraph(processItem[0], processItem[1], processItem[2]);
      } else {
        addAveragePrice();
      }
    }

    if (analytics != null) {
      logEvent(analytics, "Load Comparison Presets", {
        Processes: processes,
        Type: type,
      });
    }
  };

  const addAveragePrice = () => {
    while (true) {
      let matchFound = false;
      const red = Math.random() * 255;
      const green = Math.random() * 255;
      const blue = Math.random() * 255;

      let newBorderColor = `rgb(${red}, ${green}, ${blue})`;

      for (let item in lineValueDataset) {
        if (newBorderColor == lineValueDataset[item].borderColor) {
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
        setLineValueDataset((prevLines) => [...prevLines, newLine]);
        setUpdateGraph(true);

        break;
      }
    }
  };

  useEffect(() => {
    SetTitleAndDescription(
      `Predict Future ${type} Prices`,
      description,
      window.location.href
    );

    setRateAdjustments(additionalOptions);

    if (!firstLoad) {
      // Have to manually reset, in case user uses navigation buttons to switch to another prediction page
      setBrand("");
      setColorChangeIndex(0);
      setOriginalPoints([]);
      setInitialPrice("");
      setReleaseYear("");
      setScrollLimit(24);
      setPosition(24);
      setYearsCount(22);
      setDisplayYears(years.slice(24, 56));
      startIndex = 24;
      endIndex = 56;
      setInitializedAveragePrices(false);
      setLineValueDataset([]);
      setUpdateGraph(true);
    }
    setFirstLoad(false);

    SetCanonical(predictionLink);

    // URL of the page
    const fullURL = window.location.href;

    // Index of the prefix (/prediction/type/)
    const linkStartIndex = fullURL.indexOf(predictionLink);

    // The presets
    const presetsURL = fullURL.substring(
      linkStartIndex + predictionLink.length
    );

    if (presetsURL.length > 1) {
      setBeginLoadingPresets(true);
    }
  }, [type]);

  useEffect(() => {
    if (updateGraph) {
      setUpdateGraph(false);
      // Update the points being displayed
      const newDataset = [];
      // This is just for the page title, it runs everytime user scrolls or zooms, not just when an item is added
      const lineNames = [];
      for (let item in lineValueDataset) {
        let newItem = JSON.parse(JSON.stringify(lineValueDataset[item]));
        // Have to split it so it works with BuildTitle, or else it puts each character in its own space
        lineNames.push(lineValueDataset[item].label.split());
        newItem.data = originalPoints[item].slice(startIndex, endIndex);
        newDataset.push(newItem);
      }
      setLineValueDataset(newDataset);
      if (newDataset.length > 0) {
        import("../functions/BuildTitle").then((module) => {
          // Update the title
          const newTitle = module.default(lineNames, "Predict:");
          SetTitleAndDescription(newTitle, description, window.location.href);
        });
      } else {
        SetTitleAndDescription(
          `Predict Future ${type} Prices`,
          description,
          window.location.href
        );
      }
    }
    // Make sure there's no presets
    // URL of the page
    const fullURL = window.location.href;
    // Index of the prefix (/prediction/type/)
    const linkStartIndex = fullURL.indexOf(predictionLink);
    // The presets
    const presetsURL = fullURL.substring(
      linkStartIndex + predictionLink.length
    );

    // If we haven't initialized average prices yet, and no presets in the url
    if (!initalizedAveragePrices && presetsURL.length == 0) {
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
    if (analytics != null) {
      logEvent(analytics, "Screen", {
        Screen: type,
        Platform: isMobile ? "Mobile" : "Computer",
        Tool: "Prediction",
      });
    }
  }, []);

  useEffect(() => {
    if (beginLoadingPresets) {
      // URL of the page
      const fullURL = window.location.href;

      // Index of the prefix (/comparison/type/)
      const startIndex = fullURL.indexOf(predictionLink);
      // The presets
      const presetsURL = fullURL.substring(startIndex + predictionLink.length);

      loadPresets(presetsURL);
      setBeginLoadingPresets(false);
    }
  }, [beginLoadingPresets]);

  return (
    <div // Scroll to the top when page loads
      onLoad={() => {
        window.scrollTo(0, 0);
      }}
    >
      <Navbar isMobile={isMobile}></Navbar>

      {/* Main Body */}
      <div className="PredictionContainer">
        <p style={{ fontSize: 20 }} className="HeaderText">
          {type} Price Prediction
        </p>
        {/* Top Buttons */}
        <div
          style={{
            marginLeft: "20px",
            marginRight: "auto",
            marginBottom: "30px",
            display: "grid",
            gridTemplateColumns: `repeat(2, 1fr)`,
            gridTemplateRows: `47px`,
            columnGap: "5px",
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
            style={{ fontSize: isMobile ? "13px" : "16px" }}
          >
            <p>{"< Go Back"}</p>
          </button>

          {/* Share comparison */}
          <button
            onClick={async () => {
              let presetsURL = "";

              const processes = [];

              for (let item in lineValueDataset) {
                const str = lineValueDataset[item].label;

                // Find the index of the first space
                const firstSpaceIndex = str.indexOf(" ");

                // Find the index of the second space
                let secondSpaceIndex = str.indexOf(" ", firstSpaceIndex + 1);

                // If there's no second space, use the length of the string
                if (secondSpaceIndex === -1) {
                  secondSpaceIndex = str.length;
                }

                // Split the string
                const priceAndYear = str.substring(0, secondSpaceIndex);
                const brand = str.substring(secondSpaceIndex).trim(); // Trim leading spaces from the second part

                const process = ["", "", ""];
                const splitPriceAndYear = priceAndYear.split(" ");

                process[0] = splitPriceAndYear[0];
                process[1] = splitPriceAndYear[1];
                process[2] = brand;

                if (process[0] == "Average") {
                  process[1] = "Average";
                  process[2] = "Average";
                }

                processes.push(process);
              }

              const brands = [];

              for (let item in brandValues) {
                brands.push(brandValues[item].label);
              }

              // Lazy import this, becaues it includes pako
              await import("../functions/BuildURLFriendlyPredict").then(
                (module) => {
                  // Construct the process array into a string
                  presetsURL = module.default(processes, brands);
                }
              );

              const shareURL = predictionLink + presetsURL;

              // Copy to user's clipboard
              await import("../functions/copyToClipboard").then((module) => {
                // Construct the process array into a string
                module.default(shareURL);
              });

              // Tell user copying to clipboard was successful
              setCopiedLink(true);

              if (analytics != null) {
                logEvent(analytics, "Share Comparison", { Type: type });
              }
            }}
            className="ShareTopButton"
            style={{ fontSize: isMobile ? "13px" : "16px" }}
          >
            <p>Share</p>
          </button>
        </div>

        {/* Main Content */}
        {isMobile ? (
          /* Mobile view */
          <>
            {/* Graph */}
            <Line
              options={lineOptions}
              data={lineData}
              style={{ minHeight: "200px", padding: "0 6px" }}
            />

            <div
              className="ScrollViewY"
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "0 35px",
                justifyContent: "center",
              }}
            >
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
                  columnGap: "20px",
                }}
              >
                {/* Release Year Field */}
                <input
                  type="number"
                  value={releaseYear}
                  className="TextInput"
                  placeholder="Release Year"
                  onChange={(event) =>
                    handleNumberInput(event.target.value, setReleaseYear)
                  }
                  style={{
                    width: "calc(100% - 24px)",
                    padding: "20px 0 20px 20px",
                    fontSize: "15px",
                  }}
                ></input>

                {/* Initial Price Field */}
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "10px",
                      top: "45%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                      color: "#fff",
                    }}
                  >
                    $
                  </span>
                  <input
                    type="number"
                    value={initialPrice}
                    className="TextInput"
                    placeholder="Initial New Price"
                    onChange={(event) =>
                      handleNumberInput(event.target.value, setInitialPrice)
                    }
                    style={{
                      width: "calc(100% - 24px)",
                      padding: "20px 0 20px 20px",
                      fontSize: "15px",
                    }}
                  ></input>
                </div>

                {/* Select Brand */}
                <button
                  onClick={() => {
                    setShowBrandModal(true);
                  }}
                  style={{ width: "100%" }}
                  className="SelectABrandButton"
                >
                  <p>
                    {brand.length == 0
                      ? "Select a brand"
                      : `Brand Selected: ${brand}`}
                  </p>
                </button>

                {/* Additional Options, only if available */}
                {additionalOptions ? (
                  <button
                    onClick={() => {
                      if (analytics != null) {
                        logEvent(analytics, `Select Additional Options`, {
                          Type: type,
                        });
                      }
                      setShowOptionsModal(true);
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
                      Options
                    </p>
                  </button>
                ) : (
                  /* Empty Cell */ <div></div>
                )}

                {/* Add */}
                <button
                  onClick={async () => {
                    const result = await addToGraph(
                      initialPrice,
                      releaseYear,
                      brand
                    );
                    if (result != 0) {
                      setError(result);
                      setShowErrorModal(true);
                      if (analytics != null) {
                        logEvent(analytics, "Error adding item", {
                          Error: result,
                        });
                      }
                    } else {
                      if (analytics != null) {
                        logEvent(analytics, "Add Prediction Item", {
                          Type: type,
                          InitialPrice: initialPrice,
                          ReleaseYear: releaseYear,
                          Brand: brand,
                        });
                      }
                    }
                  }}
                  className="NormalButton"
                  style={{ width: "100%" }}
                >
                  <p>Add</p>
                </button>

                {/* Edit */}
                <button
                  onClick={() => {
                    setShowEditModal(true);
                  }}
                  className="NormalButton"
                  style={{ width: "100%" }}
                >
                  <p>Edit</p>
                </button>

                {/* Add Average Price, only if available */}
                {averagePrices ? (
                  <button
                    onClick={() => {
                      if (analytics != null) {
                        logEvent(analytics, "Add Average Price", {
                          Type: type,
                        });
                      }
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
                      width: "100%",
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
                    if (analytics != null) {
                      logEvent(analytics, "Export CSV");
                    }
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
                    link.setAttribute("download", "table_data.csv");
                    link.style.visibility = "hidden";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  style={{ width: "100%" }}
                  className="NormalButton"
                >
                  <p>Export CSV</p>
                </button>
              </div>
            </div>
          </>
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
            <div style={{ minWidth: "736px", width: "65%" }}>
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
              {/* Column 1 */}
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

              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "47%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    color: "#fff",
                  }}
                >
                  $
                </span>
                <input
                  type="number"
                  value={initialPrice}
                  className="TextInput"
                  placeholder="Initial New Price"
                  onChange={(event) =>
                    handleNumberInput(event.target.value, setInitialPrice)
                  }
                  style={{
                    fontSize: 16,
                    width: "100%",
                    paddingLeft: "21px", // Add left padding to make room for the prefix
                  }}
                />
              </div>

              {/* Select Brand */}
              <button
                onClick={() => {
                  setShowBrandModal(true);
                }}
                style={{ width: "130%" }}
                className="SelectABrandButton"
              >
                <p>
                  {brand.length == 0
                    ? "Select a brand"
                    : `Brand Selected: ${brand}`}
                </p>
              </button>

              {/* Add */}
              <button
                onClick={async () => {
                  const result = await addToGraph(
                    initialPrice,
                    releaseYear,
                    brand
                  );
                  if (result != 0) {
                    setError(result);
                    setShowErrorModal(true);
                    if (analytics != null) {
                      logEvent(analytics, "Error adding item", {
                        Error: result,
                      });
                    }
                  } else {
                    if (analytics != null) {
                      logEvent(analytics, "Add Prediction Item", {
                        Type: type,
                        InitialPrice: initialPrice,
                        ReleaseYear: releaseYear,
                        Brand: brand,
                      });
                    }
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

              {/* Column 2 */}
              {/* Empty cell */}
              <div></div>

              {/* Empty cell */}
              <div></div>

              {/* Empty cell */}
              <div></div>

              {/* Additional Options, only if available */}
              {additionalOptions ? (
                <button
                  onClick={() => {
                    if (analytics != null) {
                      logEvent(analytics, `Select Additional Options`, {
                        Type: type,
                      });
                    }
                    setShowOptionsModal(true);
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
                    Options
                  </p>
                </button>
              ) : (
                /* Empty Cell */ <div></div>
              )}

              {/* Add Average Price, only if available */}
              {averagePrices ? (
                <button
                  onClick={() => {
                    if (analytics != null) {
                      logEvent(analytics, "Add Average Price", { Type: type });
                    }
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
                  if (analytics != null) {
                    logEvent(analytics, "Export CSV");
                  }
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
        <Suspense
          fallback={
            <div className="ActivityIndicator" style={{ margin: "50px" }}></div>
          }
        >
          <PredictionBrandSelectionModal
            checkNoResults={checkNoResults}
            searchString={searchString}
            brandValues={brandValues}
            noResultsFound={noResultsFound}
            setShowBrandModal={setShowBrandModal}
            type={type}
            setBrand={setBrand}
            setSearchString={setSearchString}
          ></PredictionBrandSelectionModal>
        </Suspense>
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
        <Suspense
          fallback={
            <div className="ActivityIndicator" style={{ margin: "50px" }}></div>
          }
        >
          <PredictionEditModal
            lineValueDataset={lineValueDataset}
            colorChangeIndex={colorChangeIndex}
            updateColor={updateColor}
            setColorChangeIndex={setColorChangeIndex}
            removeGraph={removeGraph}
            setShowEditModal={setShowEditModal}
            isMobile={isMobile}
          />
        </Suspense>
      </Modal>

      {/* Options Modal */}
      <Modal
        isOpen={showOptionsModal}
        contentLabel="Select Options"
        className={"ModalContainer"}
        overlayClassName={"ModalOverlay"}
        style={{
          overlay: {
            zIndex: 3,
          },
        }}
      >
        <Suspense
          fallback={
            <div className="ActivityIndicator" style={{ margin: "50px" }}></div>
          }
        >
          <PredictionOptionsModal
            setShowOptionsModal={setShowOptionsModal}
            setRateAdjustments={setRateAdjustments}
            rateAdjustments={rateAdjustments}
            isMobile={isMobile}
            type={type}
            analytics={analytics}
          />
        </Suspense>
      </Modal>

      {/* Shows up when user clicks the share button */}
      <Modal
        isOpen={copiedLink}
        contentLabel="Copied link to clipboard"
        className={"ModalContainer"}
        overlayClassName={"ModalOverlay"}
        style={{
          overlay: {
            zIndex: 3,
          },
        }}
      >
        <Suspense
          fallback={
            <div className="ActivityIndicator" style={{ margin: "50px" }}></div>
          }
        >
          <SimpleSuccessModal
            title={"Share Comparison"}
            message={"Successfully copied link to your clipboard"}
            setModalVisible={setCopiedLink}
          ></SimpleSuccessModal>
        </Suspense>
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
        <Suspense
          fallback={
            <div className="ActivityIndicator" style={{ margin: "50px" }}></div>
          }
        >
          <SimpleErrorModal
            message={error}
            setModalVisible={setShowErrorModal}
          ></SimpleErrorModal>
        </Suspense>
      </Modal>
    </div>
  );
}
