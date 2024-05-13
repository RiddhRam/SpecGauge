import {
  Modal,
  Pressable,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native-web";

import { useState } from "react";
import { SGStyles } from "../../../styles/styles";

export default function SelectionModalCars({
  type,
  productModalVisible,
  setProductModalVisible,
  brands,
  queryFunction,
  queryProcess,
  process,
  setSpecs,
  matchingArray,
  defaultArray,
  categories,
  amplitude,
}) {
  const [step, setStep] = useState(0);
  const [requestedSpecs, setRequestedSpecs] = useState([]);
  const [selectionOptions, setSelectionOptions] = useState(brands);

  const [loading, setLoading] = useState(false);

  const styles = SGStyles();

  return (
    <Modal
      visible={productModalVisible}
      animationType="slide"
      transparent="true"
    >
      {/* Brands */}
      <View style={styles.containerStyles.modalContainer}>
        <Text style={styles.textStyles.text}>Select {process[step]}</Text>

        {loading == false && (
          <ScrollView style={styles.textStyles.modalText}>
            {selectionOptions.map((item, index) => (
              <Pressable
                style={({ pressed }) => [
                  { padding: 10, paddingRight: 50, fontSize: 20 },
                  pressed && styles.inputStyles.buttonNoBackgroundClicked,
                ]}
                key={item}
                onPress={async () => {
                  // Start the spec loading process
                  setLoading(true);
                  // For next step
                  const tempArray = [];
                  const nextSelection = [];
                  nextStep = step + 1;

                  // If we haven't queried the products yet, then query it
                  result = [];
                  if (step == 0) {
                    amplitude.track("Request", { Brand: item, Category: type });
                    result = await queryFunction(item);
                  } else {
                    // If we have queried them, then just pick off from the last step
                    result = requestedSpecs;
                  }

                  // Iterate through all result keys
                  for (resultKey in result) {
                    currentResult = result[resultKey];
                    // Check for a match between the clicked value and the key value of the key that matches the current process in queryProcess
                    if (
                      selectionOptions[index] ==
                      currentResult[queryProcess[step]]
                    ) {
                      tempArray.push(currentResult);

                      // Check for duplicates
                      duplicate = false;
                      for (selectionIndex in nextSelection) {
                        if (
                          currentResult[queryProcess[nextStep]] ==
                          nextSelection[selectionIndex]
                        ) {
                          duplicate = true;
                          break;
                        }
                      }
                      // If no duplicates then add it to the array that we will use for the next selection screen
                      if (!duplicate) {
                        nextSelection.push(
                          currentResult[queryProcess[nextStep]]
                        );
                      }
                    }
                  }

                  // If its not the last step
                  if (nextStep != queryProcess.length) {
                    // Increment the step, and filter out the requestedSpecs with the above array, also change the selection options
                    setStep(nextStep);
                    setSelectionOptions(nextSelection.sort());
                    setRequestedSpecs(tempArray);
                  } else {
                    // If its the last step
                    let tempDefaultArray = [];

                    // Deep Copy defaultArray into tempDefaultArray then we will use tempDefaultArray from here on
                    for (let i = 0; i < defaultArray.length; i++) {
                      newJSON = {};
                      newJSON["Value"] = defaultArray[i].Value;
                      newJSON["Display"] = defaultArray[i].Display;
                      newJSON["Category"] = defaultArray[i].Category;
                      tempDefaultArray.push(newJSON);
                    }

                    // Iterate through all specs in the only item in the array
                    for (key in tempArray[0]) {
                      for (let i = 0; i < matchingArray.length; i++) {
                        // Compare the items in the specs to matchingArray
                        if (key == matchingArray[i]) {
                          // When a match if ound save the value are record it in tempDefault
                          value = tempArray[0][key];
                          if (
                            value != "True" &&
                            value != "False" &&
                            value != "--" &&
                            value != "----" // have to add this since some values accidentally got saved as "----"
                          ) {
                            // This keeps the spec label but adds the value
                            tempDefaultArray[i].Value = tempDefaultArray[
                              i
                            ].Value.replace("--", value);
                            tempDefaultArray[i].Display = true;
                          } else if (value == "True" || value == "Yes") {
                            // Boolean values become true
                            tempDefaultArray[i].Display = true;
                          }

                          break;
                        }
                      }
                    }

                    // This is the array that gets added to the specs array
                    tempSpecsArray = [];

                    for (category in categories[0]) {
                      tempSpecsArray.push("");
                    }

                    // Copy only the values, and add \n to display the next value in this category on the next line
                    // Each cell is just 1 long string
                    // Only if Display is true
                    for (key in tempDefaultArray) {
                      if (tempDefaultArray[key].Display) {
                        for (let i = 0; i < categories[0].length; i++) {
                          if (
                            tempDefaultArray[key].Category == categories[0][i]
                          ) {
                            tempSpecsArray[i] +=
                              tempDefaultArray[key].Value + "\n";
                            break;
                          }
                        }
                      }
                    }

                    // If any are empty then just use '--'
                    for (let i = 0; i < tempSpecsArray.length; i++) {
                      if (tempSpecsArray[i] == "") {
                        tempSpecsArray[i] = "--";
                      }
                    }

                    // Add the new specs
                    await setSpecs((prevSpecs) => [
                      ...prevSpecs,
                      tempSpecsArray,
                    ]);

                    // Reset the modal
                    setProductModalVisible(false);
                    setStep(0);
                    setSelectionOptions(brands);
                    setRequestedSpecs([]);
                  }

                  setLoading(false);
                }}
              >
                <p>{item}</p>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {loading == true && <ActivityIndicator></ActivityIndicator>}

        <Pressable
          onPress={() => {
            // Reset the modal
            setProductModalVisible(false);
            setSelectionOptions(brands);
            setRequestedSpecs([]);
            setStep(0);
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
  );
}
