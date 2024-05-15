import {
  Pressable,
  View,
  Text,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native-web";
import { SGStyles } from "../../../styles/styles";
import SelectionModal from "./SelectionModal";
import WebAccountHandler from "../accounts/WebAccountHandler";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";

export default function Compare({
  type,
  Brands,
  Process,
  QueryProcess,
  QueryFunction,
  MatchingArray,
  DefaultArray,
  Categories,
  Specs,
  setSpecs,
  Height,
  SetHeight,
  amplitude,
}) {
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [savingComparison, setSavingComparison] = useState(false);
  const [successfullySavedComparison, setSuccessfullySavedComparison] =
    useState(false);
  const [awaitingSavingComparison, setAwaitingSavingComparison] =
    useState(false);
  const [saveComparisonProcesses, setSaveComparisonProcesses] = useState([]);
  const styles = SGStyles();
  const navigate = useNavigate();
  const { state } = useLocation();
  // Used for checking if user can use logged in features like saved comparison or preferences
  const auth = getAuth();
  const functions = getFunctions();

  useEffect(() => {
    try {
      const { prerequestedSpecs, processArray } = state;

      {
        /* Set the process array directly */
      }
      setSaveComparisonProcesses(processArray);

      {
        /* For specs, we need to organize them into their categories since a similar function to the onein SelectionModal.js */
      }

      const tempArray = [];
      tempArray.push(Categories[0]);
      // Iterate through all requested specs
      for (specsIndex in prerequestedSpecs) {
        let tempDefaultArray = [];

        // Deep Copy DefaultArray into tempDefaultArray then we will use tempDefaultArray from here on
        for (let i = 0; i < DefaultArray.length; i++) {
          newJSON = {};
          newJSON["Value"] = DefaultArray[i].Value;
          newJSON["Display"] = DefaultArray[i].Display;
          newJSON["Category"] = DefaultArray[i].Category;
          tempDefaultArray.push(newJSON);
        }

        // Iterate through each key in a particular product
        for (key in prerequestedSpecs[specsIndex]) {
          for (let i = 0; i < MatchingArray.length; i++) {
            // Compare the items in the specs to matchingArray
            if (key == MatchingArray[i]) {
              // When a match if ound save the value are record it in tempDefault
              value = prerequestedSpecs[specsIndex][key];
              if (
                value != "True" &&
                value != "False" &&
                value != "--" &&
                value != "----" // have to add this since some values accidentally got saved as "----"
              ) {
                // This keeps the spec label but adds the value
                tempDefaultArray[i].Value = tempDefaultArray[i].Value.replace(
                  "--",
                  value
                );
                tempDefaultArray[i].Display = true;
              } else if (value == "True" || value == "Yes") {
                // Boolean values become true
                tempDefaultArray[i].Display = true;
              }

              break;
            }
          }
        }

        // This is the array that set as the specs array
        tempSpecsArray = [];

        for (category in Categories[0]) {
          tempSpecsArray.push("");
        }

        // Copy only the values, and add \n to display the next value in this category on the next line
        // Each cell is just 1 long string
        // Only if Display is true
        for (key in tempDefaultArray) {
          if (tempDefaultArray[key].Display) {
            for (let i = 0; i < Categories[0].length; i++) {
              if (tempDefaultArray[key].Category == Categories[0][i]) {
                tempSpecsArray[i] += tempDefaultArray[key].Value + "\n";
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
        tempArray.push(tempSpecsArray);
      }
      setSpecs(tempArray);
    } catch {}
  }, [state]);

  const CallSaveComparisonCloudFunction = async () => {
    // The processes that get saved
    arrayToSave = [];
    for (item in saveComparisonProcesses) {
      arrayToSave.push(saveComparisonProcesses[item]);
    }

    // The names of the products which will be in alphabetical order so user can't save multiple of the same comparison
    let names = [];

    for (item1 in arrayToSave) {
      let name = "";

      for (item2 in arrayToSave[item1]) {
        name += arrayToSave[item1][item2];
      }
      names.push(name);
    }
    names.sort();

    // The sum of all names in alphabetical order
    let comparisonName = "";
    for (item in names) {
      comparisonName += names[item];
    }

    // Pass this JSON to the cloud
    comparison = {
      email: auth.currentUser.email,
      type: type,
      name: comparisonName,
      processes: arrayToSave,
    };

    try {
      const WriteSavedComparisons = httpsCallable(
        functions,
        "WriteSavedComparisons"
      );
      const result = await WriteSavedComparisons(comparison);
      return result.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  return (
    <ScrollView style={styles.containerStyles.comparisonScreenContainer}>
      <Text style={[styles.textStyles.text, { fontSize: 25 }]}>
        {type} Comparison
      </Text>

      {/* Top buttons */}
      <View
        style={{ marginRight: "auto", flexDirection: "row", flexWrap: "wrap" }}
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

        {/* Add a new product */}
        <Pressable
          onPress={async () => {
            amplitude.track("Add Item");
            {
              /* Show product selection modal */
            }
            setProductModalVisible(true);
          }}
          style={({ pressed }) => [
            styles.inputStyles.button,
            pressed && styles.inputStyles.buttonClicked,
          ]}
        >
          <p>Add</p>
        </Pressable>

        {/* Save comparison */}
        <Pressable
          onPress={async () => {
            amplitude.track("Save Comparison", {
              Category: type,
            });

            if (auth.currentUser != null) {
              setAwaitingSavingComparison(true);
              setSavingComparison(true);
              const result = await CallSaveComparisonCloudFunction();
              if (result == 200) {
                setSuccessfullySavedComparison(true);
              }
              setAwaitingSavingComparison(false);
            } else {
              setAccountModalVisible(true);
            }
          }}
          style={({ pressed }) => [
            styles.inputStyles.button,
            pressed && styles.inputStyles.buttonClicked,
          ]}
        >
          <p>Save Comparison</p>
        </Pressable>

        {/* Reset specs to just the categories and processes to empty array */}
        <Pressable
          onPress={async () => {
            amplitude.track("Reset", {
              Category: type,
            });

            setSpecs(Categories);
            setSaveComparisonProcesses([]);

            for (let i = 0; i < SetHeight.length; i++) {
              SetHeight[i](39);
            }
          }}
          style={({ pressed }) => [
            styles.inputStyles.resetButton,
            pressed && styles.inputStyles.resetButtonClicked,
          ]}
        >
          <p>Reset</p>
        </Pressable>
      </View>

      {/* Table */}
      <ScrollView
        horizontal={true}
        style={styles.containerStyles.comparisonScreenContainer}
      >
        {/* For each item in spec, show a column */}
        {Specs.map((item, index1) => (
          <View
            key={item + index1}
            style={[styles.containerStyles.comparisonColumns]}
          >
            {/* If it's not the first column (the category labels), then show a remove button */}
            {index1 != 0 && (
              <Pressable
                style={({ pressed }) => [
                  styles.inputStyles.removeButton,
                  pressed && styles.inputStyles.removeButtonClicked,
                ]}
                onPress={async () => {
                  amplitude.track("Remove", {
                    Removed: Specs[index1],
                    Category: type,
                  });
                  {
                    /* Remove item */
                  }
                  newSpecsArray = Specs.filter(
                    (subArray) => Specs[index1] !== subArray
                  );
                  await setSpecs(newSpecsArray);

                  newComparisonProcessArray = saveComparisonProcesses.filter(
                    // not 0 indexed so have to subtract 1
                    (subArray) =>
                      saveComparisonProcesses[index1 - 1] !== subArray
                  );
                  setSaveComparisonProcesses(newComparisonProcessArray);

                  {
                    /* Specs won't be updated yet even though we used setSpecs, so the length is still 2 */
                  }
                  {
                    /* If the length is 2 then 1 is removed, then there is 1 item left, which is the category labels */
                  }
                  {
                    /* Category labels default height is 39 */
                  }
                  if (Specs.length == 2) {
                    for (let i = 0; i < SetHeight.length; i++) {
                      SetHeight[i](39);
                    }
                  } else {
                    {
                      /* Calculate new height if 1 or more specs are left */
                    }
                    for (let i = 1; i < Specs.length; i++) {
                      /* We loop through each column*/
                      for (let j = 0; j < Specs[i].length; j++) {
                        /* We loop through row in each column */
                        let counter = 0;
                        let position = 0;
                        while (true) {
                          {
                            /* Height is determined by (number of '\n' - 1) * 17 + 39 */
                            /* We count the number of \n in each column */
                          }
                          position = Specs[i][j].indexOf("\n", position);
                          if (position == -1) {
                            break;
                          }
                          counter++;
                          position += 1;
                        }
                        {
                          /* Since an item was removed, the height can only be the same or smaller */
                          /* We check if old height is greater then new height, then change it, or else leave it  */
                        }
                        for (let k = 0; k < Height.length; k++) {
                          const newHeight = (counter - 1) * 17 + 39;
                          if (Height[k] > newHeight) {
                            SetHeight[k](newHeight);
                          }
                        }
                      }
                    }
                  }
                }}
              >
                <p>Remove</p>
              </Pressable>
            )}

            <View
              style={index1 == 0 ? { marginTop: 100 } : { marginTop: 26.5 }}
            >
              {item.map((spec, index2) => (
                /* We loop through each row in each column */
                <Text
                  key={spec + index2}
                  /* the category labels have a special blue background so they have a different style, specCategoryText */
                  style={[
                    { height: Height[index2] },
                    index1 == 0
                      ? styles.textStyles.specCategoryText
                      : styles.textStyles.comparisonText,
                  ]}
                  onLayout={async () => {
                    let counter = 0;
                    let position = 0;

                    while (true) {
                      {
                        /* Height is determined by (number of '\n' - 1) * 17 + 39 */
                        /* We count the number of \n in each column */
                      }
                      position = spec.indexOf("\n", position);
                      if (position == -1) {
                        break;
                      }
                      counter++;
                      position += 1;
                    }

                    {
                      /* Since an item was added, the height can only be the same or larger */
                      /* We check if old height is less then new height, then change it, or else leave it  */
                    }
                    const newHeight = (counter - 1) * 17 + 39;
                    if (Height[index2] < newHeight) {
                      SetHeight[index2](newHeight);
                    }
                  }}
                >
                  {spec}
                </Text>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Shows up if user needs to be logged in to complete action */}
      <Modal
        visible={accountModalVisible}
        animationType="slide"
        transparent="true"
      >
        <View style={styles.containerStyles.modalContainer}>
          <WebAccountHandler
            screenType={"modal"}
            setModalView={setAccountModalVisible}
          ></WebAccountHandler>
          <Pressable
            style={({ pressed }) => [
              styles.inputStyles.buttonNoBackground,
              pressed && styles.inputStyles.buttonNoBackgroundClicked,
            ]}
            onPress={() => {
              setAccountModalVisible(false);
            }}
          >
            <p>Cancel</p>
          </Pressable>
        </View>
      </Modal>

      {/* Display status of saving comparison */}
      <Modal
        visible={savingComparison}
        animationType="slide"
        transparent="true"
      >
        <View style={styles.containerStyles.modalContainer}>
          <Text></Text>
          {awaitingSavingComparison && <ActivityIndicator></ActivityIndicator>}
          {!awaitingSavingComparison && (
            <View>
              <Text style={styles.textStyles.text}>Save Comparison</Text>
              {successfullySavedComparison ? (
                <Text
                  style={[
                    styles.textStyles.successText,
                    { padding: 10, textAlign: "center" },
                  ]}
                >
                  Succesfully saved this comparison.
                </Text>
              ) : (
                <Text style={styles.textStyles.errorText}>
                  Saving this comparison was unsuccessful, try again later.
                </Text>
              )}
              <Pressable
                style={({ pressed }) => [
                  styles.inputStyles.button,
                  pressed && styles.inputStyles.buttonClicked,
                ]}
                onPress={() => {
                  setSavingComparison(false);
                  setSuccessfullySavedComparison(false);
                }}
              >
                <p>Okay</p>
              </Pressable>
            </View>
          )}
        </View>
      </Modal>

      {/* Shows up when user is selecting a new product */}
      <SelectionModal
        type={type}
        productModalVisible={productModalVisible}
        setProductModalVisible={setProductModalVisible}
        brands={Brands}
        queryFunction={QueryFunction}
        queryProcess={QueryProcess}
        process={Process}
        setSpecs={setSpecs}
        matchingArray={MatchingArray}
        defaultArray={DefaultArray}
        categories={Categories}
        setSaveComparisonProcesses={setSaveComparisonProcesses}
        amplitude={amplitude}
      ></SelectionModal>
    </ScrollView>
  );
}
