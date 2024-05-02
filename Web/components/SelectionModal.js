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
  // Temporarily hold onto specs
  const [requestedSpecs, setRequestedSpecs] = useState([]);

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
                    // The specs if needed
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
                        setRequestedSpecs(tempSpecArray);
                      } else {
                        // There will be a step 3
                        let Step3Array = [];
                        let Step3Array2 = [];

                        // Go through all items in the tempSpecArray and pass it along to the next step
                        for (const item1 in tempSpecArray) {
                          //
                          let tempStep3Array = [];
                          let tempStep3Array2 = [];
                          for (const item2 in tempSpecArray[item1]) {
                            tempStep3Array.push(tempSpecArray[item1][item2].id);
                            tempStep3Array2.push(
                              tempSpecArray[item1][item2].data
                            );
                          }
                          Step3Array.push(tempStep3Array);
                          Step3Array2.push(tempStep3Array2);
                        }
                        setRequestedStep3(Step3Array);
                        setRequestedSpecs(Step3Array2);
                      }

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
                    // If user doesn't have to select generations
                    if (process.length == 2) {
                      tempDefault = [];
                      for (spec in defaultArray) {
                        newJSON = {};

                        newJSON["Value"] = defaultArray[spec].Value;
                        newJSON["Display"] = defaultArray[spec].Display;
                        newJSON["Category"] = defaultArray[spec].Category;

                        tempDefault.push(newJSON);
                      }

                      for (key in requestedSpecs[index]) {
                        for (let i = 0; i < matchingArray.length; i++) {
                          if (key == matchingArray[i]) {
                            value = requestedSpecs[index][key];
                            if (
                              value != "True" &&
                              value != "False" &&
                              value != "--"
                            ) {
                              tempDefault[i].Value = tempDefault[
                                i
                              ].Value.replace("--", value);
                            } else if (value == "True") {
                              tempDefault[i].Display = true;
                            }

                            break;
                          }
                        }
                      }
                      tempArray = [];

                      for (category in categories[0]) {
                        tempArray.push("");
                      }

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

                      for (let i = 0; i < tempArray.length; i++) {
                        if (tempArray[i] == "") {
                          tempArray[i] = "--";
                        }
                      }
                      await setSpecs((prevSpecs) => [...prevSpecs, tempArray]);

                      setRequestedStep2([]);
                      setRequestedSpecs([]);
                      setProductModalVisible(false);
                      setModalScreen(0);
                    } else {
                      setRequestedStep3(requestedStep3[index]);
                      setRequestedSpecs(requestedSpecs[index]);
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
                  key={item}
                  onPress={async () => {
                    amplitude.track("Request", { item: item, Category: type });
                    setLoading(true);
                    // If user doesn't have to select generations
                    tempDefault = [];
                    for (spec in defaultArray) {
                      newJSON = {};

                      newJSON["Value"] = defaultArray[spec].Value;
                      newJSON["Display"] = defaultArray[spec].Display;
                      newJSON["Category"] = defaultArray[spec].Category;

                      tempDefault.push(newJSON);
                    }

                    for (key in requestedSpecs[index]) {
                      for (let i = 0; i < matchingArray.length; i++) {
                        if (key == matchingArray[i]) {
                          value = requestedSpecs[index][key];
                          if (
                            value != "True" &&
                            value != "False" &&
                            value.indexOf("--") == -1
                          ) {
                            value = value.replace(/Depends/, " Depends");

                            value = value.replace(/;/g, " ");

                            tempDefault[i].Value = tempDefault[i].Value.replace(
                              "--",
                              value
                            );
                            tempDefault[i].Display = true;
                          } else if (value == "True" || value == "Yes") {
                            tempDefault[i].Display = true;
                          }

                          break;
                        }
                      }
                    }
                    tempArray = [];

                    for (category in categories[0]) {
                      tempArray.push("");
                    }

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

                    for (let i = 0; i < tempArray.length; i++) {
                      if (tempArray[i] == "") {
                        tempArray[i] = "--";
                      }
                    }
                    await setSpecs((prevSpecs) => [...prevSpecs, tempArray]);

                    setRequestedStep3([]);
                    setRequestedStep2([]);
                    setRequestedSpecs([]);
                    setProductModalVisible(false);
                    setModalScreen(0);
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
    </Modal>
  );
}
