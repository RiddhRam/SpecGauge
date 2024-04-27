import {
  Modal,
  Pressable,
  View,
  Text,
  ScrollView,
  Alert,
} from "react-native-web";

import { useState } from "react";
import { SGStyles } from "../../styles/styles";

export default function SelectionModal({
  productModalVisible,
  setProductModalVisible,
  brands,
  cloudFunction,
  process,
  setSpecs,
  matchingArray,
  defaultArray,
  categories,
}) {
  const [modalScreen, setModalScreen] = useState(0);
  const [requestedStep1, setRequestedStep1] = useState([]);
  const [requestedStep2, setRequestedStep2] = useState([]);
  const [requestedSpecs, setRequestedSpecs] = useState([]);

  const styles = SGStyles();
  return (
    <Modal
      visible={productModalVisible}
      animationType="slide"
      transparent="true"
    >
      {modalScreen == 0 && (
        <View style={styles.containerStyles.modalContainer}>
          <Text style={styles.textStyles.text}>Select {process[0]}</Text>

          <ScrollView style={styles.textStyles.modalText}>
            {brands.map((item) => (
              <Pressable
                style={({ pressed }) => [
                  { padding: 10, paddingRight: 50, fontSize: 20 },
                  pressed && styles.inputStyles.buttonNoBackgroundClicked,
                ]}
                key={item}
                onPress={async () => {
                  // For next step
                  const tempArray = [];
                  // The specs if needed
                  const tempSpecArray = [];

                  result = await cloudFunction(item);

                  if (result.error) {
                    console.log("There was an error");
                    setProductModalVisible(false);
                    Alert("There was an error. Please try again later.");
                  } else {
                    for (key in result) {
                      tempArray.push(key);
                      tempSpecArray.push(result[key]);
                    }

                    await setRequestedStep1(tempArray);
                    // If user doesn't have to select generations
                    if (process.length == 2) {
                      await setRequestedSpecs(tempSpecArray);
                    }
                    setModalScreen(1);
                    console.log(defaultArray);
                  }
                }}
              >
                <p>{item}</p>
              </Pressable>
            ))}
          </ScrollView>

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

          <ScrollView style={styles.textStyles.modalText}>
            {requestedStep1.map((item, index) => (
              <Pressable
                style={({ pressed }) => [
                  { padding: 10, paddingRight: 50, fontSize: 20 },
                  pressed && styles.inputStyles.buttonNoBackgroundClicked,
                ]}
                key={item}
                onPress={async () => {
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
                            tempDefault[i].Value = tempDefault[i].Value.replace(
                              "--",
                              requestedSpecs[index][key]
                            );
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
                    await setRequestedStep1([]);
                    await setRequestedSpecs([]);
                    setProductModalVisible(false);
                    setModalScreen(0);
                  }
                }}
              >
                <p>{item}</p>
              </Pressable>
            ))}
          </ScrollView>

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
