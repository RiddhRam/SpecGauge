import {
  Modal,
  Pressable,
  View,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native-web";

import { useState } from "react";
import { SGStyles } from "../../styles/styles";

export default function SelectionModal({
  type,
  productModalVisible,
  setProductModalVisible,
  brands,
  cloudFunction,
  process,
  setSpecs,
  matchingArray,
  defaultArray,
  categories,
  amplitude,
}) {
  // Determines what screen user is on
  const [modalScreen, setModalScreen] = useState(0);
  // After brand is selected
  const [requestedStep2, setRequestedStep2] = useState([]);
  const [requestedStep3, setRequestedStep3] = useState([]);

  // For the buffer animation while waiting
  const [loading, setLoading] = useState(false);

  const styles = SGStyles();
  return (
    <Modal
      visible={productModalVisible}
      animationType="slide"
      transparent="true"
    >
      {/* Select a brand, step 1 */}
      {modalScreen == 0 && (
        <View style={styles.containerStyles.modalContainer}>
          <Text style={styles.textStyles.text}>Select {process[0]}</Text>

          {loading == false && (
            <ScrollView style={styles.textStyles.modalText}>
              {brands.map((item) => (
                <Pressable
                  style={({ pressed }) => [
                    { padding: 10, paddingRight: 50, fontSize: 20 },
                    pressed && styles.inputStyles.buttonNoBackgroundClicked,
                  ]}
                  key={item}
                  onPress={async () => {
                    amplitude.track("Request", { Brand: item, Category: type });
                    setLoading(true);
                    // The items for next step
                    const tempArray = [];
                    // Holds the specs and other data
                    const tempSpecArray = [];

                    let result = await cloudFunction(item);

                    if (result.error) {
                      console.log("There was an error");
                      setProductModalVisible(false);
                      Alert("There was an error. Please try again later.");
                    } else {
                      for (key in result) {
                        {
                          /* This is used to display items on the next screen */
                        }
                        tempArray.push(key);
                        {
                          /* These are either the specs, or it keeps getting passed along */
                        }
                        tempSpecArray.push(result[key]);
                      }

                      setRequestedStep2(tempArray);
                      // If user doesn't have to select anything else
                      if (process.length == 2) {
                        setRequestedStep3(tempSpecArray);
                      } else {
                        // There will be a step 3
                        let Step3Array = [];

                        // Go through all items in the tempSpecArray and pass it along to the next step
                        for (let i = 0; i < tempSpecArray.length; i++) {
                          // For each item on the next step
                          let tempStep3Array = [];

                          for (const item in tempSpecArray[i]) {
                            // Add its data in json format
                            newJSON = {};

                            newJSON["id"] = tempSpecArray[i][item].id;
                            newJSON["data"] = tempSpecArray[i][item].data;
                            tempStep3Array.push(newJSON);
                          }
                          Step3Array.push(tempStep3Array);
                        }
                        setRequestedStep3(Step3Array);
                      }

                      // Go to next step
                      setModalScreen(1);
                      setLoading(false);
                    }
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
              setProductModalVisible(false);
              setModalScreen(0);
            }}
            style={({ pressed }) => [
              styles.inputStyles.button,
              pressed && styles.inputStyles.buttonClicked,
            ]}
          >
            <p>Cancel</p>
          </Pressable>
        </View>
      )}

      {/* step 2 */}
      {modalScreen == 1 && (
        <View style={styles.containerStyles.modalContainer}>
          <Text style={styles.textStyles.text}>Select {process[1]}</Text>

          {loading == false && (
            <ScrollView style={styles.textStyles.modalText}>
              {requestedStep2.map((item, index) => (
                <Pressable
                  style={({ pressed }) => [
                    { padding: 10, paddingRight: 50, fontSize: 20 },
                    pressed && styles.inputStyles.buttonNoBackgroundClicked,
                  ]}
                  key={item}
                  onPress={async () => {
                    amplitude.track("Request", { item: item, Category: type });
                    setLoading(true);

                    // If user doesn't have to select anything else
                    if (process.length == 2) {
                      tempDefault = [];
                      // Deep copy defaultArray in tempDefault
                      for (spec in defaultArray) {
                        newJSON = {};

                        newJSON["Value"] = defaultArray[spec].Value;
                        newJSON["Display"] = defaultArray[spec].Display;
                        newJSON["Category"] = defaultArray[spec].Category;

                        tempDefault.push(newJSON);
                      }

                      // Iterate through all specs
                      for (key in requestedStep3[index]) {
                        for (let i = 0; i < matchingArray.length; i++) {
                          // Compare the items in the specs to matchingArray
                          if (key == matchingArray[i]) {
                            // When a match if ound save the value are record it in tempDefault
                            value = requestedStep3[index][key];
                            if (
                              value != "True" &&
                              value != "False" &&
                              value != "--"
                            ) {
                              // This keeps the spec label but adds the value
                              tempDefault[i].Value = tempDefault[
                                i
                              ].Value.replace("--", value);
                            } else if (value == "True" || value == "Yes") {
                              // Boolean values become true
                              tempDefault[i].Display = true;
                            }

                            break;
                          }
                        }
                      }
                      // This is the array that gets added to the specs array
                      tempArray = [];

                      for (category in categories[0]) {
                        tempArray.push("");
                      }

                      // Copy only the values, and add \n to display the next value in this category on the next line
                      // Each cell is just 1 long string
                      // Only if Display is true
                      for (key in tempDefault) {
                        if (tempDefault[key].Display) {
                          for (let j = 0; j < categories[0].length; j++) {
                            if (tempDefault[key].Category == categories[0][j]) {
                              tempArray[j] += tempDefault[key].Value + "\n";
                              break;
                            }
                          }
                        }
                      }

                      // If any are empty then just use '--'
                      for (let i = 0; i < tempArray.length; i++) {
                        if (tempArray[i] == "") {
                          tempArray[i] = "--";
                        }
                      }
                      await setSpecs((prevSpecs) => [...prevSpecs, tempArray]);

                      // Reset everything
                      setRequestedStep2([]);
                      setRequestedStep3([]);
                      setProductModalVisible(false);
                      setModalScreen(0);
                    } else {
                      // If there are more steps than 2, proceed to next screen with the select item in step 2
                      setRequestedStep3(requestedStep3[index]);
                      setModalScreen(2);
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
              setProductModalVisible(false);
              setModalScreen(0);
            }}
            style={({ pressed }) => [
              styles.inputStyles.button,
              pressed && styles.inputStyles.buttonClicked,
            ]}
          >
            <p>Cancel</p>
          </Pressable>
        </View>
      )}

      {/* step 3 */}
      {modalScreen == 2 && (
        <View style={styles.containerStyles.modalContainer}>
          <Text style={styles.textStyles.text}>Select {process[2]}</Text>

          {loading == false && (
            <ScrollView style={styles.textStyles.modalText}>
              {requestedStep3.map((item, index) => (
                <Pressable
                  style={({ pressed }) => [
                    { padding: 10, paddingRight: 50, fontSize: 20 },
                    pressed && styles.inputStyles.buttonNoBackgroundClicked,
                  ]}
                  key={item.id}
                  onPress={async () => {
                    amplitude.track("Request", { item: item, Category: type });
                    setLoading(true);

                    // Deep copy defaultArray into tempDefault
                    tempDefault = [];
                    for (spec in defaultArray) {
                      newJSON = {};

                      newJSON["Value"] = defaultArray[spec].Value;
                      newJSON["Display"] = defaultArray[spec].Display;
                      newJSON["Category"] = defaultArray[spec].Category;

                      tempDefault.push(newJSON);
                    }

                    // Iterate through the specs
                    for (key in requestedStep3[index]["data"]) {
                      for (let i = 0; i < matchingArray.length; i++) {
                        // Compare key string to matchingArray
                        if (key == matchingArray[i]) {
                          value = requestedStep3[index]["data"][key];
                          if (
                            value != "True" &&
                            value != "False" &&
                            value.indexOf("--") == -1
                          ) {
                            // for graphics cards
                            value = value.replace(/Depends/, " Depends");

                            value = value.replace(/;/g, " ");

                            tempDefault[i].Value = tempDefault[i].Value.replace(
                              // add value without removing label
                              "--",
                              value
                            );
                            tempDefault[i].Display = true;
                          } else if (value == "True" || value == "Yes") {
                            // show boolean labels if true
                            tempDefault[i].Display = true;
                          }

                          break;
                        }
                      }
                    }

                    // this array is added to the specs array
                    tempArray = [];

                    for (category in categories[0]) {
                      tempArray.push("");
                    }

                    // copy all values from the Value key in temp Default, only if Display is true
                    for (key in tempDefault) {
                      if (tempDefault[key].Display) {
                        for (let j = 0; j < categories[0].length; j++) {
                          if (tempDefault[key].Category == categories[0][j]) {
                            tempArray[j] += tempDefault[key].Value + "\n";
                            break;
                          }
                        }
                      }
                    }

                    // Replace empty categories with '--'
                    for (let i = 0; i < tempArray.length; i++) {
                      if (tempArray[i] == "") {
                        tempArray[i] = "--";
                      }
                    }
                    await setSpecs((prevSpecs) => [...prevSpecs, tempArray]);

                    // Reset everything
                    setRequestedStep3([]);
                    setRequestedStep2([]);
                    setProductModalVisible(false);
                    setModalScreen(0);
                    setLoading(false);
                  }}
                >
                  <p>{item.id}</p>
                </Pressable>
              ))}
            </ScrollView>
          )}

          {loading == true && <ActivityIndicator></ActivityIndicator>}

          <Pressable
            onPress={() => {
              setProductModalVisible(false);
              setModalScreen(0);
            }}
            style={({ pressed }) => [
              styles.inputStyles.button,
              pressed && styles.inputStyles.buttonClicked,
            ]}
          >
            <p>Cancel</p>
          </Pressable>
        </View>
      )}
    </Modal>
  );
}
