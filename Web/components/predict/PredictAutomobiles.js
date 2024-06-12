import { Text, ScrollView, View, Pressable } from "react-native-web";
import { SGStyles } from "../../../styles/styles";
import { Footer } from "../../Footer";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

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
  plugins,
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

export default function PredictAutomobiles({ type, amplitude, isMobile }) {
  styles = SGStyles();
  const navigate = useNavigate();
  // Years being displayed
  const [displayYears, setDisplayYears] = useState(
    years.slice(startIndex, endIndex)
  );
  // Determines number of years to display, 22 for 22 years, anything over that is 22 - excess = number of years
  const [yearsCount, setYearsCount] = useState(22);

  // Scroll position
  const [position, setPosition] = useState(24);
  // Maximum scroll length according to current zoom level
  const [scrollLimit, setScrollLimit] = useState(24);

  const [displayAverageCarPrices, setDisplayAverageCarPrices] = useState(
    averageCarPrices.slice(startIndex, endIndex)
  );

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
          text: "Average Car Price (USD)", // Label for the y-axis
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
    datasets: [
      {
        label: "Average Car Price",
        data: displayAverageCarPrices,
        borderColor: "rgb(75, 192, 192)",
      },
      {
        label: "Toyota",
        data: [null, 30000, 30000, 30000],
        borderColor: "rgb(192, 19, 12)",
      },
    ],
  };

  const OnScrollChangeTrigger = (value) => {
    const difference = value - startIndex;
    startIndex += difference;
    endIndex += difference;

    setPosition(value);
    setDisplayYears(years.slice(startIndex, endIndex));
    setDisplayAverageCarPrices(averageCarPrices.slice(startIndex, endIndex));
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
    setDisplayAverageCarPrices(averageCarPrices.slice(startIndex, endIndex));
  };

  return (
    <ScrollView contentContainerStyle={styles.containerStyles.webContainer}>
      {/* Main Body */}
      <View style={styles.containerStyles.comparisonScreenContainer}>
        <Text style={[styles.textStyles.text, { fontSize: 25 }]}>
          {type} Prediction
        </Text>
        {/* Top Fields */}
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

          <Pressable
            onPress={() => {
              //console.log("Testing AI");
            }}
            style={({ pressed }) => [
              styles.inputStyles.button,
              pressed && styles.inputStyles.buttonClicked,
            ]}
          >
            <p>Add</p>
          </Pressable>

          <Pressable
            onPress={() => {
              console.log("Testing AI");
            }}
            style={({ pressed }) => [
              styles.inputStyles.button,
              pressed && styles.inputStyles.buttonClicked,
            ]}
          >
            <p>Test AI</p>
          </Pressable>
        </View>
        <Line options={lineOptions} data={lineData}></Line>
        {/* Sliders */}
        <View>
          {/* Scroll */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
            }}
          >
            <Text style={[styles.textStyles.plainText, { marginRight: 10 }]}>
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
          {/* Zoom */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
            }}
          >
            <Text style={[styles.textStyles.plainText, { marginRight: 10 }]}>
              Zoom
            </Text>
            <Text
              style={[
                styles.textStyles.plainText,
                { marginRight: 10, fontSize: 20 },
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
                { marginLeft: 15, fontSize: 20 },
              ]}
            >
              +
            </Text>
          </View>
        </View>
      </View>

      <Footer amplitude={amplitude} isMobile={isMobile} />
    </ScrollView>
  );
}
