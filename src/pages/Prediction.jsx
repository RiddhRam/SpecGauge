import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import SetTitleAndDescription from "../functions/SetTitleAndDescription";

import { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";

const LineImport = lazy(() => import("../components/LineImport"));
const SliderImport = lazy(() => import("../components/SliderImport"));
// neccessary to lazy import
import "rc-slider/assets/index.css";

import { logEvent } from "firebase/analytics";
import { analytics } from "../firebaseConfig";

import SetCanonical from "../functions/SetCanonical";
const PredictionAddLineModal = lazy(() =>
  import("../components/PredictionAddLineModal")
);
const PredictionEditModal = lazy(() =>
  import("../components/PredictionEditModal")
);
const SimpleSuccessModal = lazy(() =>
  import("../components/SimpleSuccessModal")
);

const years = [
  2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012,
  2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025,
  2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038,
  2039, 2040, 2041, 2042, 2043, 2044,
];

let startIndex = 24;
let endIndex = 45;

export default function Prediction({
  type,
  isMobile,
  minimumPrice,
  description,
  predictionLink,
  minimumAdjuster,
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
  const [productPrice, setProductPrice] = useState("");
  const [releaseYear, setReleaseYear] = useState("");

  // The orignal reference array of all the lines currently selected by the user
  const [originalPoints, setOriginalPoints] = useState([]);

  const [averagePrices, setAveragePrices] = useState(null);
  const [brandValues, setBrandValues] = useState(null);
  // Unchanged rate adjustments
  const [additionalOptions, setAdditionalOptions] = useState(null);

  // For the modals
  const [showAddLineModal, setShowAddLineModal] = useState(false);
  const [brand, setBrand] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [colorChangeIndex, setColorChangeIndex] = useState(0);
  const [error, setError] = useState("");
  const [rateAdjustments, setRateAdjustments] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [beginLoadingPresets, setBeginLoadingPresets] = useState(false);
  const [createdChart, setCreatedChart] = useState(false);
  const [needToCreateChart, setNeedToCreateChart] = useState(true);

  // This is used in case the user uses navigation buttons to switch types, in which case, the values of the old graph type need to be reset
  const [firstLoad, setFirstLoad] = useState(true);

  const [lineValueDataset, setLineValueDataset] = useState([]);
  const lineOptions = {
    aspectRatio: isMobile ? 1.4 : 2,
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
        ticks: {
          font: {
            size: 10,
          },
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
        ticks: {
          font: {
            size: 10,
          },
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

  const addToGraph = async (
    priceString,
    yearString,
    productBrand,
    localRateAdjustments
  ) => {
    let price = parseFloat(priceString);
    const year = parseFloat(yearString);

    // If price is not at least 7500
    if (price < minimumPrice || isNaN(price)) {
      return `Enter a price of at least ${minimumPrice}`;
    } // If year is too old or new
    else if (year < 2000 || year > 2025 || isNaN(year)) {
      return "Enter a year between 2000 and 2025";
    } else if (productBrand.length == 0) {
      return "Select a brand";
    }

    // This gets appended to lineValuesDataset to display
    let prices = [];
    // This is used for the seed, and it's used to determine the margin that the next price should differ by
    let lastPrice = price;

    let originalPrice = null;

    const maxRate = 0.08;

    // Start at 2000 for readability, each i value is an x value on the graph (years)
    for (let i = 2000; i < 2045; i++) {
      // The rate that the price drops
      let rate = 0;

      let currentBrandValues = brandValues;
      if (!brandValues) {
        if (type == "Vehicles") {
          await import("../data/carsPredictData").then((module) => {
            currentBrandValues = module.carsBrandValues;
          });
        } else if (type == "CPUs") {
          await import("../data/CPUsPredictData").then((module) => {
            currentBrandValues = module.processorsBrandValues;
          });
        } else {
          await import("../data/graphicsCardsPredictData").then((module) => {
            currentBrandValues = module.graphicsCardsBrandValues;
          });
        }
      }

      let brandDivisions = [];

      // Iterate through the brandValues array and find the rate for this brand
      for (let item in currentBrandValues) {
        if (productBrand == currentBrandValues[item].label) {
          brandDivisions = currentBrandValues[item].value;
          // Iterate through price divisions
          for (let divisionItem in brandDivisions) {
            // Get the current limit
            const priceDivisionLimit = brandDivisions[divisionItem][0];

            // If the MSRP is greater than or equal to the limit, then use that rate, and check the next division
            if (price >= priceDivisionLimit) {
              rate = brandDivisions[divisionItem][1];
            } else {
              // If MSRP is too low, then go to next iteration
              continue;
            }
          }

          break;
        }
      }

      // For each year it was released, calculate the price for that year

      // Get the rng value
      const seed = `${price}${productBrand}${year}${lastPrice}${localRateAdjustments}`;
      let rng = null;
      await import("../functions/SeedrandomImport").then((module) => {
        rng = module.default(seed);
      });

      // first parameter is name of option
      // second parameter is default value
      // third parameter is starting year, value lower than 2000 means to add that many years to vehicle production year
      // fourth parameter is rate change after the third parameter year
      // fifth parameter is whether or not the rate grows as time goes on, it's multiplied by each year

      // If this comparison type has rate adjustments
      if (localRateAdjustments.length > 0) {
        // Iterate through rate adjustments
        // Iterate through these to get the settings
        for (let item in localRateAdjustments) {
          // localRateAdjustments = rate adjustments for this product
          // rateAdjustments = rate adjustments from the modal

          // If this rate adjustment was enabled, keep going, else continue to next iteration
          if (localRateAdjustments[item][1] == false) {
            continue;
          }

          // If third parameter is lower than 2000
          if (localRateAdjustments[item][2] < 2000) {
            // Add that many years to vehicle production year
            const beginningYear = year + localRateAdjustments[item][2];

            // if current is higher than the beginning year (third parameter)
            if (i >= beginningYear) {
              // Deep copy
              let thisAdjustment = structuredClone(localRateAdjustments[item]);

              // If this adjustment grows as time goes on
              if (thisAdjustment[4]) {
                thisAdjustment[3] *= i - beginningYear;
              }

              rate += thisAdjustment[3];

              // Brind rate down if needed
              if (rate > maxRate) {
                rate = 0.06 + 0.02 * rng;
              }
            }
            continue;
          }
          // If third parameter is 2000 or higher
          // if current is higher than the beginning year (third parameter)
          if (i >= localRateAdjustments[item][2]) {
            // Adjust the rate by adding the rate adjustment
            rate += localRateAdjustments[item][3];
          }
        }
      }

      // If vehicle wasn't manufactured yet, then don't display price for that year
      if (i < year) {
        prices.push(null);
        continue;
      }

      if (rate > maxRate) {
        // if greater than the max rate, then multiply rng by a factor of 0.2 to get a new random rate
        rate = 0.06 + 0.02 * rng;
      }

      let xAdjustment = 0;

      if (rate < -0.14) {
        xAdjustment = 3.8;
      }

      // Get the new price
      let newCalculatedPrice =
        price * Math.E ** ((rate + rng * 0.008) * (i - year + xAdjustment));
      // Difference between price of last iteration and this one
      let difference = newCalculatedPrice - lastPrice;

      // If this is the first value then initialize the original price
      if (i == year) {
        originalPrice = newCalculatedPrice;
        prices.push(originalPrice);
        continue;
      }

      // If rate is depreciating, but value grew higher, then reduce the difference to 5% and make it negative
      if (rate < 0 && difference > 0) {
        difference *= -0.05;
      }

      // If not the first value
      // If last price wasn't an increase
      else {
        // If difference is greater than an 70% of the last price
        if (difference * -1 > lastPrice * 0.7 && rate < 0) {
          // Reduce difference to rng
          // Prevents sharp increases
          difference = lastPrice * rng * 0.08 * -1;
        } // If new price is a decrease from last price
        else if (difference < 0) {
          // If the absolute value of the decrease is more than 68% of the last price
          if (difference * -1 > lastPrice * 0.68) {
            // Cut the difference in half
            // Prevents sharp drops
            difference = difference * 0.25;
          }
        }
      }

      if (rate > 0) {
        difference = lastPrice * rate;
      }

      /* If new price is signifcantly larger than original price, maybe because rate was too high, bring it down to within 10% of the original price */
      if (difference + lastPrice > originalPrice * 2.6) {
        // The price will hover around here
        difference = originalPrice * 0.08 * rng * (rng > 0.5 ? 1 : -1);
      }

      let highestRate = 0;
      for (let division in brandDivisions) {
        if (brandDivisions[division][1] > highestRate) {
          highestRate = brandDivisions[division][1];
        }
      }

      // Price shouldn't go too far under 20% + rate of original price
      if (difference + lastPrice < (0.2 + highestRate) * originalPrice) {
        difference = minimumAdjuster * -0.1 * rng;
      }

      // Price shouldn't go too far under $5
      if (difference + lastPrice < 5) {
        difference = minimumAdjuster * 0.1 * rng;
      }

      difference = Math.round(difference);
      prices.push(lastPrice + difference);
      lastPrice = lastPrice + difference;
    }

    while (true) {
      let matchFound = false;
      let newBorderColor = "#fff";

      const colourRequest = await newColour();

      matchFound = colourRequest.matchFound;
      newBorderColor = colourRequest.newBorderColor;

      // If match, go to next iteration
      if (matchFound) {
        continue;
      }

      const newLine = {
        label: `$${price} ${year} ${productBrand}`,
        data: prices,
        borderColor: newBorderColor,
        process: [priceString, yearString, productBrand],
        adjustments: localRateAdjustments,
      };
      setOriginalPoints((prevPoints) => [...prevPoints, prices]);
      setLineValueDataset((prevLines) => [...prevLines, newLine]);
      setUpdateGraph(true);

      break;
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
      lineNames.push(newLineValueDataset[item].label);
    }

    setLineValueDataset(newLineValueDataset);

    if (newLineValueDataset.length > 0) {
      import("../functions/BuildTitlePredict").then((module) => {
        // Update the title
        const newTitle = module.default(lineNames);
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

  const updateName = (newName, nameIndex) => {
    const newDataset = [];
    for (let item in lineValueDataset) {
      let newItem = JSON.parse(JSON.stringify(lineValueDataset[item]));
      newDataset.push(newItem);
    }

    newDataset[nameIndex].label = newName;
    setLineValueDataset(newDataset);
  };

  const loadPresets = async (presetURL) => {
    let tempBrandValues = null;
    let tempRateAdjustments = null;

    await createChart();

    if (type == "Vehicles") {
      await import("../data/carsPredictData").then((module) => {
        tempBrandValues = module.carsBrandValues;
        tempRateAdjustments = module.carsAdditionalOptions;
      });
    } else if (type == "CPUs") {
      await import("../data/CPUsPredictData").then((module) => {
        tempBrandValues = module.processorsBrandValues;
      });
    } else {
      await import("../data/graphicsCardsPredictData").then((module) => {
        tempBrandValues = module.graphicsCardsBrandValues;
      });
    }

    const brands = [];

    for (let item in tempBrandValues) {
      brands.push(tempBrandValues[item].label);
    }

    let processes = [];
    let allRateAdjustments = [];

    // Lazy import this, becaues it includes pako
    await import("../functions/DeconstructURLFriendlyPredict").then(
      (module) => {
        // Deconstruct the string into a process array
        const result = module.default(presetURL, brands, tempRateAdjustments);
        processes = result.processes;
        allRateAdjustments = result.allRateAdjustments;
      }
    );

    for (let item in processes) {
      const processItem = processes[item];
      if (processItem[0] != "Average") {
        setNeedToCreateChart(true);
        createChart();
        await addToGraph(
          processItem[0],
          processItem[1],
          processItem[2],
          allRateAdjustments[item]
        );
      } else {
        await addAveragePrice();
      }
    }

    if (analytics != null) {
      logEvent(analytics, "Load Comparison Presets", {
        Processes: processes,
        Type: type,
      });
    }

    setBrandValues(tempBrandValues);
    setRateAdjustments(tempRateAdjustments);
  };

  // This is only done when loading presets, otherwise it's done in the button itself
  const addAveragePrice = async () => {
    while (true) {
      let matchFound = false;
      let newBorderColor = "#fff";

      const colourRequest = await newColour();

      matchFound = colourRequest.matchFound;
      newBorderColor = colourRequest.newBorderColor;

      if (!matchFound) {
        let currentAveragePrices = null;

        if (type == "Vehicles") {
          await import("../data/carsPredictData").then((module) => {
            currentAveragePrices = module.carsAveragePrices;
          });
        } else if (type == "CPUs") {
          await import("../data/CPUsPredictData").then((module) => {
            currentAveragePrices = null;
          });
        } else {
          await import("../data/graphicsCardsPredictData").then((module) => {
            currentAveragePrices = null;
          });
        }

        const newLine = {
          label: `Average ${type} Price (USD $)`,
          data: currentAveragePrices,
          borderColor: newBorderColor,
          process: "Average",
        };
        setOriginalPoints((prevPoints) => [
          ...prevPoints,
          currentAveragePrices,
        ]);
        setLineValueDataset((prevLines) => [...prevLines, newLine]);
        setUpdateGraph(true);

        break;
      }
    }
  };

  const createChart = async () => {
    if (!createdChart && needToCreateChart) {
      await import("../functions/ChartImport").then(async (module) => {
        module.ChartJS.register(
          module.CategoryScale,
          module.LinearScale,
          module.PointElement,
          module.LineElement,
          module.Title,
          module.Tooltip,
          module.Legend
        );

        setCreatedChart(true);
      });
    }

    setNeedToCreateChart(false);
  };

  const exportCSV = async () => {
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
      firstJSON[lineValueDataset[j].label] = lineValueDataset[j].label;
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
    // This doesn't change the name for some reason
    link.setAttribute("download", "table_data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // This is only called from the modal
  const modalAddToGraph = async (
    priceString,
    yearString,
    brand,
    localRateAdjustments
  ) => {
    setNeedToCreateChart(true);
    createChart();
    const result = await addToGraph(
      priceString,
      yearString,
      brand,
      localRateAdjustments
    );
    if (result != 0) {
      setError(result);
      if (analytics != null) {
        logEvent(analytics, "Error adding item", {
          Error: result,
        });
      }
    } else {
      if (analytics != null) {
        logEvent(analytics, "Add Prediction Item", {
          Type: type,
          ProductPrice: productPrice,
          ReleaseYear: releaseYear,
          Brand: brand,
          Added: productPrice + " " + releaseYear + " " + brand,
        });
      }
    }

    return result;
  };

  const newColour = async () => {
    let matchFound = false;

    // Convert background page color into RGB
    const backgroundColor = "#1e2033";
    const baseRgb = [
      parseInt(backgroundColor.substring(1, 3), 16),
      parseInt(backgroundColor.substring(3, 5), 16),
      parseInt(backgroundColor.substring(5, 7), 16),
    ];

    // Minimum distance of the new colour from the page colour
    const minDistance = 200;

    let red, green, blue, colorRgb, distance;

    do {
      red = Math.random() * 255;
      green = Math.random() * 255;
      blue = Math.random() * 255;
      colorRgb = [red, green, blue];
      distance = Math.sqrt(
        Math.pow(colorRgb[0] - baseRgb[0], 2) +
          Math.pow(colorRgb[1] - baseRgb[1], 2) +
          Math.pow(colorRgb[2] - baseRgb[2], 2)
      );
    } while (distance < minDistance);

    // Create a colour
    const newBorderColor = `rgb(${red}, ${green}, ${blue})`;

    // Make sure no repeat colours
    for (let item in lineValueDataset) {
      if (newBorderColor == lineValueDataset[item].borderColor) {
        matchFound = true;
        break;
      }
    }

    return { matchFound, newBorderColor };
  };

  useEffect(() => {
    SetTitleAndDescription(
      `Predict Future ${type} Prices`,
      description,
      window.location.href
    );

    if (!firstLoad) {
      // Have to manually reset, in case user uses navigation buttons to switch to another prediction page
      setBrand("");
      setColorChangeIndex(0);
      setOriginalPoints([]);
      setProductPrice("");
      setReleaseYear("");
      setScrollLimit(24);
      setPosition(24);
      setYearsCount(22);
      setDisplayYears(years.slice(24, 45));
      startIndex = 24;
      endIndex = 45;
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

    if (type == "Vehicles") {
      import("../data/carsPredictData").then((module) => {
        setAveragePrices(module.carsAveragePrices);
        setBrandValues(module.carsBrandValues);
        // Have to copy additional options or this or we get duplicates
        setAdditionalOptions(
          module.carsAdditionalOptions.map((i) => ({ ...i }))
        );
        setRateAdjustments(module.carsAdditionalOptions.map((i) => ({ ...i })));
      });
    } else if (type == "CPUs") {
      import("../data/CPUsPredictData").then((module) => {
        setAveragePrices(null);
        setBrandValues(module.processorsBrandValues);
        setAdditionalOptions(null);
        setRateAdjustments(null);
      });
    } else {
      import("../data/graphicsCardsPredictData").then((module) => {
        setAveragePrices(null);
        setBrandValues(module.graphicsCardsBrandValues);
        setAdditionalOptions(null);
        setRateAdjustments(null);
      });
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
        lineNames.push(lineValueDataset[item].label);
        newItem.data = originalPoints[item].slice(startIndex, endIndex);
        newDataset.push(newItem);
      }
      setLineValueDataset(newDataset);
      if (newDataset.length > 0) {
        import("../functions/BuildTitlePredict").then((module) => {
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
  }, [updateGraph]);

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
              const localAdjustments = [];

              for (let item in lineValueDataset) {
                const lineProcess = lineValueDataset[item].process;
                const lineAdjustment = lineValueDataset[item].adjustments;

                processes.push(lineProcess);
                localAdjustments.push(lineAdjustment);
              }

              const brands = [];

              for (let item in brandValues) {
                brands.push(brandValues[item].label);
              }

              // Lazy import this, becaues it includes pako
              await import("../functions/BuildURLFriendlyPredict").then(
                (module) => {
                  // Construct the process array into a string
                  presetsURL = module.default(
                    processes,
                    localAdjustments,
                    brands,
                    rateAdjustments
                  );
                }
              );

              const shareURL = predictionLink + presetsURL;

              // Copy to user's clipboard
              await import("../functions/copyToClipboard").then((module) => {
                // Construct the process array into a string
                module.default(shareURL);
              });

              if (analytics != null) {
                logEvent(analytics, "Share Comparison", { Type: type });
              }

              // Tell user copying to clipboard was successful
              setCopiedLink(true);
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
            {lineValueDataset.length == 0 ? (
              <h3 className="SimpleText">
                Add A {type.slice(0, -1)} To Get Started{" "}
              </h3>
            ) : (
              <>
                <Suspense
                  fallback={
                    <div
                      className="ActivityIndicator"
                      style={{ margin: "50px auto" }}
                    ></div>
                  }
                >
                  <LineImport
                    options={lineOptions}
                    data={lineData}
                    style={{ minHeight: "200px", padding: "0 6px" }}
                  />
                </Suspense>
                {/* Sliders */}
                <div
                  className="ScrollViewY"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "0 35px",
                    justifyContent: "center",
                  }}
                >
                  {/* Scroll Slider */}
                  <p
                    style={{ marginRight: 10, userSelect: "none" }}
                    className="PlainText"
                  >
                    Scroll
                  </p>
                  <Suspense
                    fallback={
                      <div
                        style={{ backgroundColor: "#4ca0d7", height: 10 }}
                      ></div>
                    }
                  >
                    <SliderImport
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
                  </Suspense>
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
                    <Suspense
                      fallback={
                        <div
                          style={{
                            backgroundColor: "lightblue",
                            height: 4,
                            width: "100%",
                          }}
                        ></div>
                      }
                    >
                      <SliderImport
                        value={yearsCount}
                        onChange={OnZoomChangeTrigger}
                        step={1}
                        min={22}
                        max={41}
                        trackStyle={{ backgroundColor: "#4ca0d7" }}
                        railStyle={{ backgroundColor: "lightblue" }}
                      />
                    </Suspense>
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
                </div>
              </>
            )}

            {/* Bottom Controls */}
            <div
              className="ScrollViewY"
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "0 35px",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(2, 1fr)`,
                  gridTemplateRows: `65px 65px 65px 65px`,
                  rowGap: "6px",
                  columnGap: "20px",
                }}
              >
                {/* Add */}
                <button
                  onClick={async () => {
                    setShowAddLineModal(true);
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
                    onClick={async () => {
                      setNeedToCreateChart(true);
                      createChart();
                      if (analytics != null) {
                        logEvent(analytics, "Add Average Price", {
                          Type: type,
                        });
                      }
                      while (true) {
                        let matchFound = false;
                        let newBorderColor = "#fff";

                        const colourRequest = await newColour();

                        matchFound = colourRequest.matchFound;
                        newBorderColor = colourRequest.newBorderColor;

                        if (!matchFound) {
                          const newLine = {
                            label: `Average ${type} Price (USD $)`,
                            data: averagePrices.slice(),
                            borderColor: newBorderColor,
                            process: "Average",
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
                  /* Empty Cell */ <></>
                )}

                {/* Export CSV */}
                <button
                  onClick={() => {
                    exportCSV();
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
            <div
              style={{
                minWidth: "736px",
                width: "65%",
              }}
            >
              {/* Graph */}
              {lineValueDataset.length == 0 ? (
                <h2 className="SimpleText" style={{ marginTop: "60px" }}>
                  Add A {type.slice(0, -1)} To Get Started
                </h2>
              ) : (
                <div style={{ marginLeft: 10 }}>
                  <Suspense
                    fallback={
                      <div
                        className="ActivityIndicator"
                        style={{ margin: "50px auto" }}
                      ></div>
                    }
                  >
                    <LineImport options={lineOptions} data={lineData} />
                  </Suspense>
                  {/* Scroll */}
                  <>
                    <p
                      style={{
                        userSelect: "none",
                      }}
                      className="PlainText"
                    >
                      Scroll
                    </p>
                    <Suspense
                      fallback={
                        <div
                          style={{ backgroundColor: "#4ca0d7", height: 10 }}
                        ></div>
                      }
                    >
                      <SliderImport
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
                    </Suspense>
                  </>
                </div>
              )}
            </div>
            {/* Side Controls */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `150px`,
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
              {lineValueDataset.length == 0 ? (
                <div></div>
              ) : (
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
                  <Suspense
                    fallback={
                      <div
                        style={{
                          backgroundColor: "lightblue",
                          height: 4,
                          width: 95,
                        }}
                      ></div>
                    }
                  >
                    <SliderImport
                      value={yearsCount}
                      onChange={OnZoomChangeTrigger}
                      step={1}
                      min={22}
                      max={41}
                      trackStyle={{ backgroundColor: "#4ca0d7" }}
                      railStyle={{ backgroundColor: "lightblue" }}
                    />
                  </Suspense>
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
              )}

              {/* Add */}
              <button
                onClick={async () => {
                  setShowAddLineModal(true);
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

              {/* Add Average Price, only if available */}
              {averagePrices ? (
                <button
                  onClick={async () => {
                    setNeedToCreateChart(true);
                    createChart();
                    if (analytics != null) {
                      logEvent(analytics, "Add Average Price", { Type: type });
                    }
                    while (true) {
                      let matchFound = false;
                      let newBorderColor = "#fff";

                      const colourRequest = await newColour();

                      matchFound = colourRequest.matchFound;
                      newBorderColor = colourRequest.newBorderColor;

                      if (!matchFound) {
                        const newLine = {
                          label: `Average ${type} Price (USD $)`,
                          data: averagePrices.slice(),
                          borderColor: newBorderColor,
                          process: "Average",
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
                  style={{ width: "130%" }}
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
                /* Empty Cell */ <></>
              )}

              {/* Export CSV */}
              <button
                onClick={() => {
                  exportCSV();
                }}
                className="NormalButton"
                style={{ width: "130%" }}
              >
                <p>Export CSV</p>
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer isMobile={isMobile}></Footer>

      {/* Add Line Modal */}
      {showAddLineModal ? (
        <Suspense
          fallback={
            <div className="ActivityIndicator" style={{ margin: "50px" }}></div>
          }
        >
          <PredictionAddLineModal
            brandValues={brandValues}
            setShowAddLineModal={setShowAddLineModal}
            setBrand={setBrand}
            showAddLineModal={showAddLineModal}
            handleNumberInput={handleNumberInput}
            releaseYear={releaseYear}
            setReleaseYear={setReleaseYear}
            productPrice={productPrice}
            setProductPrice={setProductPrice}
            modalAddToGraph={modalAddToGraph}
            brand={brand}
            error={error}
            type={type}
            rateAdjustments={rateAdjustments}
            minimumPrice={minimumPrice}
            setRateAdjustments={setRateAdjustments}
            isMobile={isMobile}
            analytics={analytics}
            additionalOptions={additionalOptions}
          ></PredictionAddLineModal>
        </Suspense>
      ) : (
        <></>
      )}

      {/* Edit Modal */}
      {showEditModal ? (
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
            showEditModal={showEditModal}
            updateName={updateName}
          />
        </Suspense>
      ) : (
        <></>
      )}

      {/* Shows up when user clicks the share button */}
      {copiedLink ? (
        <Suspense
          fallback={
            <div className="ActivityIndicator" style={{ margin: "50px" }}></div>
          }
        >
          <SimpleSuccessModal
            title={"Share Comparison"}
            message={"Successfully copied link to your clipboard"}
            setModalVisible={setCopiedLink}
            modalVisible={copiedLink}
          ></SimpleSuccessModal>
        </Suspense>
      ) : (
        <></>
      )}
    </div>
  );
}
