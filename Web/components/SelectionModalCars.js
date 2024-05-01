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

export default function SelectionModalCars({
  type,
  productModalVisible,
  setProductModalVisible,
  brands,
  cloudFunctionModels,
  cloudFunctionYears,
  cloudFunctionTrims,
  cloudFunctionTrimView,
  process,
  setSpecs,
  matchingArray,
  defaultArray,
  categories,
  amplitude,
}) {
  const [modalScreen, setModalScreen] = useState(0);
  const [requestedStep1, setRequestedStep1] = useState([]);
  const [requestedStep2, setRequestedStep2] = useState([]);
  const [requestedStep3, setRequestedStep3] = useState([]);
  const [requestedSpecs, setRequestedSpecs] = useState([]);

  const [loading, setLoading] = useState(false);

  const styles = SGStyles();

  let tempDefaultArray = [];

  // Deep Copy
  for (let i = 5; i < defaultArray.length; i++) {
    newJSON = {};
    newJSON["Value"] = defaultArray[i].Value;
    newJSON["Display"] = defaultArray[i].Display;
    newJSON["Category"] = defaultArray[i].Category;
    tempDefaultArray.push(newJSON);
  }

  function iterateJSON(jsonData) {
    for (const key in jsonData) {
      if (jsonData.hasOwnProperty(key)) {
        for (let i = 0; i < matchingArray.length; i++) {
          if (matchingArray[i] == key) {
            if (jsonData[key] != null) {
              tempDefaultArray[i].Value = tempDefaultArray[i].Value.replace(
                "--",
                jsonData[key]
              );
              tempDefaultArray[i].Display = true;
            }
            break;
          }
        }

        // If the value is another object or array, recursively call iterateJSON
        if (typeof jsonData[key] === "object" && jsonData[key] !== null) {
          iterateJSON(jsonData[key]);
        }
      }
    }
    if (tempDefaultArray[39].Display) {
      tempDefaultArray[38].Display = false;
    }

    if (tempDefaultArray[0].Value.indexOf("gas") != -1) {
      iceIndex = [1, 2, 7, 8, 9, 14, 15, 16, 17, 18, 19, 20];

      for (item in iceIndex) {
        tempDefaultArray[item].Display = true;
      }
    } else if (tempDefaultArray[0].Value.indexOf("electric") != -1) {
      evIndex = [14, 21, 22, 23, 24, 25, 26, 27];
      for (item in evIndex) {
        tempDefaultArray[evIndex[item]].Display = true;
      }
    }
    let type = tempDefaultArray[0].Value.slice(11, tempDefaultArray.length - 1);
    tempDefaultArray[0].Value = tempDefaultArray[0].Value.replace(
      type,
      type.toUpperCase()
    );
    return tempDefaultArray;
  }

  return (
    <Modal
      visible={productModalVisible}
      animationType="slide"
      transparent="true"
    >
      {/* Brands */}
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
                    // For next step
                    const tempArray = [];

                    result = await cloudFunctionModels(item);

                    if (result.error) {
                      console.log("There was an error");
                      setProductModalVisible(false);
                      Alert("There was an error. Please try again later.");
                    } else {
                      for (key in result) {
                        tempArray.push(result[key]);
                      }

                      setRequestedStep1(tempArray);
                      setRequestedSpecs([
                        { Value: item, Display: true, Category: "Brand" },
                      ]);

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

      {/* Models */}
      {modalScreen == 1 && (
        <View style={styles.containerStyles.modalContainer}>
          <Text style={styles.textStyles.text}>Select {process[1]}</Text>

          {loading == false && (
            <ScrollView style={styles.textStyles.modalText}>
              {requestedStep1.map((item, index) => (
                <Pressable
                  style={({ pressed }) => [
                    { padding: 10, paddingRight: 50, fontSize: 20 },
                    pressed && styles.inputStyles.buttonNoBackgroundClicked,
                  ]}
                  key={index}
                  onPress={async () => {
                    amplitude.track("Request", {
                      item: item.name,
                      Category: type,
                    });
                    setLoading(true);
                    result = await cloudFunctionYears({
                      make: `${requestedSpecs[0].Value}`,
                      model: `${item.name}`,
                    });
                    setRequestedStep2(result);
                    setRequestedSpecs((prevSpecs) => [
                      ...prevSpecs,
                      { Value: item.name, Display: true, Category: "Model" },
                    ]);
                    setModalScreen(2);
                    setLoading(false);
                  }}
                >
                  <p>{item.name}</p>
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

      {/* Years */}
      {modalScreen == 2 && (
        <View style={styles.containerStyles.modalContainer}>
          <Text style={styles.textStyles.text}>Select {process[2]}</Text>

          {loading == false && (
            <ScrollView style={styles.textStyles.modalText}>
              {requestedStep2.map((item, index) => (
                <Pressable
                  style={({ pressed }) => [
                    { padding: 10, paddingRight: 50, fontSize: 20 },
                    pressed && styles.inputStyles.buttonNoBackgroundClicked,
                  ]}
                  key={index}
                  onPress={async () => {
                    amplitude.track("Request", { item: item, Category: type });
                    setLoading(true);
                    const result = await cloudFunctionTrims({
                      make: `${requestedSpecs[0].Value}`,
                      model: `${requestedSpecs[1].Value}`,
                      year: `${item}`,
                    });
                    setRequestedSpecs((prevSpecs) => [
                      ...prevSpecs,
                      { Value: item, Display: true, Category: "Year" },
                    ]);

                    setRequestedStep3(result);
                    setModalScreen(3);
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

      {/* Trim View */}
      {modalScreen == 3 && (
        <View style={styles.containerStyles.modalContainer}>
          <Text style={styles.textStyles.text}>Select {process[3]}</Text>

          {loading == false && (
            <ScrollView style={styles.textStyles.modalText}>
              {requestedStep3.map((item, index) => (
                <Pressable
                  style={({ pressed }) => [
                    { padding: 10, paddingRight: 50, fontSize: 20 },
                    pressed && styles.inputStyles.buttonNoBackgroundClicked,
                  ]}
                  key={index}
                  onPress={async () => {
                    amplitude.track("Request", {
                      item: item.description,
                      Category: type,
                    });
                    setLoading(true);
                    newArray = [];

                    newArray.push({
                      Value: item.description,
                      Display: true,
                      Category: "Trim",
                    });

                    const result = await cloudFunctionTrimView(item.id);

                    newArray.push({
                      Value: "$" + result.msrp,
                      Display: true,
                      Category: "MSRP",
                    });

                    matchedArray = iterateJSON(result);

                    tempDefaultArray = [];

                    let count = 0;

                    interiorColours = "Interior Colors: \n";

                    for (
                      let i = 0;
                      i < result.make_model_trim_interior_colors.length;
                      i++
                    ) {
                      if (
                        i !=
                        result.make_model_trim_interior_colors.length - 1
                      ) {
                        if (count != 1) {
                          interiorColours +=
                            result.make_model_trim_interior_colors[i].name +
                            "; ";
                          count++;
                        } else {
                          interiorColours +=
                            result.make_model_trim_interior_colors[i].name +
                            ";\n";
                          count = 0;
                        }
                      } else {
                        interiorColours +=
                          result.make_model_trim_interior_colors[i].name + "\n";
                      }
                    }

                    count = 0;

                    exteriorColours = "Exterior Colors: \n";

                    for (
                      let i = 0;
                      i < result.make_model_trim_exterior_colors.length;
                      i++
                    ) {
                      if (
                        i !=
                        result.make_model_trim_exterior_colors.length - 1
                      ) {
                        if (count != 1) {
                          exteriorColours +=
                            result.make_model_trim_exterior_colors[i].name +
                            "; ";
                          count++;
                        } else {
                          exteriorColours +=
                            result.make_model_trim_exterior_colors[i].name +
                            ";\n";
                          count = 0;
                        }
                      } else {
                        exteriorColours +=
                          result.make_model_trim_exterior_colors[i].name;
                      }
                    }

                    cityRange = matchedArray[19].Value.slice(
                      0,
                      matchedArray[19].Value.length - 1
                    );
                    highwayRange = matchedArray[20].Value.slice(
                      0,
                      matchedArray[20].Value.length - 1
                    );

                    matchedArray[12].Value = interiorColours;
                    matchedArray[13].Value = exteriorColours;

                    matchedArray[19].Value = cityRange;
                    matchedArray[20].Value = highwayRange;

                    for (item in matchedArray) {
                      newArray.push(matchedArray[item]);
                    }

                    oldArray = [];
                    for (item in requestedSpecs) {
                      oldArray.push(requestedSpecs[item]);
                    }

                    combinedArray = oldArray.concat(newArray);

                    tempArray = [];

                    for (category in categories[0]) {
                      tempArray.push("");
                    }

                    for (item in combinedArray) {
                      if (combinedArray[item].Display) {
                        for (let i = 0; i < tempArray.length; i++) {
                          if (
                            combinedArray[item].Category == categories[0][i]
                          ) {
                            tempArray[i] += combinedArray[item].Value + "\n";
                            break;
                          }
                        }
                      }
                    }

                    setSpecs((prevSpecs) => [...prevSpecs, tempArray]);

                    setProductModalVisible(false);
                    setRequestedStep1([]);
                    setRequestedStep2([]);
                    setRequestedStep3([]);
                    setRequestedSpecs([]);
                    setModalScreen(0);
                    setLoading(false);
                  }}
                >
                  <p>{item.description}</p>
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
