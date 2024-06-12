import { Text, ScrollView, View, Pressable } from "react-native-web";
import { SGStyles } from "../../../styles/styles";
import { Footer } from "../../Footer";

import { useNavigate } from "react-router-dom";

import { Line } from "react-chartjs-2";
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

export default function PredictAutomobiles({ type, amplitude, isMobile }) {
  styles = SGStyles();
  const navigate = useNavigate();

  const lineOptions = {};
  const lineData = {
    labels: ["2024", "2025", "2026", "2027", "2028", "2029"],
    datasets: [
      {
        label: "Average Car Price",
        data: [
          31601.678, 29804.43696, 28069.02268, 26335.33643, 26434.31044,
          26533.18701,
        ],
        borderColor: "rgb(75, 192, 192)",
      },
    ],
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
      </View>

      <Footer amplitude={amplitude} isMobile={isMobile} />
    </ScrollView>
  );
}
