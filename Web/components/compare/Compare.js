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
import { Footer } from "../../Footer";

export default function Compare({
  type,
  Brands,
  Process,
  QueryProcess,
  QueryFunction,
  DefaultArray,
  Categories,
  Specs,
  setSpecs,
  Height,
  SetHeight,
  amplitude,
  isMobile,
  prosIndex,
}) {
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [savingComparison, setSavingComparison] = useState(false);
  const [successfullySavedComparison, setSuccessfullySavedComparison] =
    useState(false);
  const [awaitingSavingComparison, setAwaitingSavingComparison] =
    useState(false);
  const [saveComparisonProcesses, setSaveComparisonProcesses] = useState([]);
  const [pros, setPros] = useState([]);
  const [displayPros, setDisplayPros] = useState([]);
  const styles = SGStyles();
  const navigate = useNavigate();
  const { state } = useLocation();
  // Used for checking if user can use logged in features like saved comparison or preferences
  const auth = getAuth();
  const functions = getFunctions();

  // This returns an array that is just the base of the pros string array, It's just empty categories with \n
  const defaultProCategories = () => {
    prosCategoriesTemp = [];

    // The pros will be organized to their respective categories
    for (item in Categories[0]) {
      prosCategoriesTemp.push(`${Categories[0][item]} \n`);
    }

    return prosCategoriesTemp;
  };

  useEffect(() => {
    try {
      const { prerequestedSpecs, processArray, prosArray } = state;

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
          for (let i = 0; i < DefaultArray.length; i++) {
            // Compare the items in the specs to the Matching key of the DefaultArray items
            if (key == DefaultArray[i].Matching) {
              // When a match if ound save the value are record it in tempDefault
              value = prerequestedSpecs[specsIndex][key];
              if (
                value != "True" &&
                value != "False" &&
                value != "No" &&
                value != "Yes" &&
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
      setPros(prosArray);
    } catch {}
  }, [state]);

  useEffect(() => {
    // If at least 2 products
    if (pros.length >= 2) {
      // This array keeps track of the pros for each product
      productPros = [];
      for (item in pros) {
        productPros.push(defaultProCategories());
      }

      referencePros = [];
      for (item in DefaultArray) {
        if (DefaultArray[item].Important) {
          referencePros.push(DefaultArray[item].Value);
        }
      }

      // Iterate through each Important spec
      for (item in pros[0]) {
        // If spec is a boolean type
        if (pros[0][item].Type == "B") {
          // Keeps track of first occurence of true value, and counts occurences
          let tracker = { firstIndex: null, count: 0 };
          // Iterate through all products and check this spec to find all true values
          for (item1 in pros) {
            if (
              pros[item1][item].Value == "True" ||
              pros[item1][item].Value == "Yes"
            ) {
              // Track first occurence
              if (tracker.count == 0) {
                tracker.firstIndex = item1;
              }
              tracker.count++;
            }
          }
          // If only 1 occurence
          if (tracker.count == 1) {
            // Iterate through DefaultArray to find the Value, since for some reason, Value got changed to "True" and "False" in the pros array
            for (item1 in DefaultArray) {
              if (pros[0][item].Matching == DefaultArray[item1].Matching) {
                categoryIndex = 0;

                for (item2 in Categories[0]) {
                  if (pros[0][item].Category == Categories[0][item2]) {
                    categoryIndex = item2;
                    break;
                  }
                }
                // Add value to that products pros
                productPros[tracker.firstIndex][categoryIndex] +=
                  DefaultArray[item1].Value + "\n";
                break;
              }
            }
          }
        }
        // If spec is a number type
        else if (pros[0][item].Type == "N") {
          // Keeps track of each number for this spec
          let tracker = {
            HigherNumber: pros[0][item].HigherNumber,
            values: [],
          };
          // Iterate through all products and check this spec to find values
          for (item1 in pros) {
            // The value
            newNumber = pros[item1][item].Value;
            // If a string with units after a space, split and get first item
            try {
              newNumber = newNumber.split(" ")[0];
              // Remove commas and spaces
              newNumber = newNumber.replace(",", "");
              newNumber = newNumber.replace(" ", "");
            } catch {}
            // Convert strings to numbers
            try {
              newNumber = Number(newNumber);
            } catch {}

            tracker.values.push(newNumber);
          }

          // The value to save
          totalBestValue = NaN;
          // Track the latest value that caused a change, if NaN, then 2 duplicates were found
          lastBestValue = NaN;
          // The index of the product
          bestIndex = NaN;
          // Iterate through all values that were saved for this spec
          for (item1 in tracker.values) {
            // Save for readability
            itemValue = tracker.values[item1];
            if (!isNaN(itemValue)) {
              // Higher number is better
              if (tracker.HigherNumber == true) {
                if (isNaN(totalBestValue)) {
                  // Initialize the first value
                  totalBestValue = itemValue;
                  lastBestValue = totalBestValue;
                  bestIndex = 0;
                } else if (totalBestValue < itemValue) {
                  // If new value is better, make a new array and set them to totalBestValue, lastBestValue and bestIndex
                  totalBestValue = itemValue;
                  lastBestValue = itemValue;
                  bestIndex = item1;
                } else if (totalBestValue == itemValue) {
                  // If duplicate, then record that to lastBestValue but don't change totalBestValue so we know what the highest value was
                  lastBestValue = NaN;
                  bestIndex = NaN;
                }
              }
              // Lower number is better
              else if (tracker.HigherNumber == false) {
                if (isNaN(totalBestValue)) {
                  // Initialize the first value
                  totalBestValue = itemValue;
                  lastBestValue = totalBestValue;
                  bestIndex = 0;
                } else if (totalBestValue > itemValue) {
                  // If new value is better, make a new array and set them to totalBestValue, lastBestValue and bestIndex
                  totalBestValue = itemValue;
                  lastBestValue = itemValue;
                  bestIndex = item1;
                } else if (totalBestValue == itemValue) {
                  // If duplicate, then record that to lastBestValue but don't change totalBestValue so we know what the highest value was
                  lastBestValue = NaN;
                  bestIndex = NaN;
                }
              }
            }
          }

          if (!isNaN(lastBestValue) && !isNaN(lastBestValue)) {
            pro = pros[bestIndex][item];
            for (item1 in Categories[0]) {
              if (pro.Category == Categories[0][item1] && pro.Value != "--") {
                productPros[bestIndex][item1] += `${referencePros[item].replace(
                  "--",
                  pro.Value
                )} \n`;
                break;
              }
            }
          }
        }
      }

      setDisplayPros(productPros);
    } else {
      setDisplayPros(["Add at least 2 items to view the pros"]);
    }
  }, [pros]);

  useEffect(() => {
    if (displayPros.length >= 2) {
      newSpecsArray = [];
      // Deep copy Specs into newSpecsArray
      for (item in Specs) {
        newSpecsArray.push(Specs[item]);
      }
      defaultProCategoriesValue = defaultProCategories();
      for (let i = 0; i < newSpecsArray.length - 1; i++) {
        newPros = "";

        for (item in defaultProCategoriesValue) {
          // Make sure the category isn't empty, or else don't add it
          if (!(defaultProCategoriesValue[item] == displayPros[i][item])) {
            // The pros of this category returned from the selection modal
            originalPros = displayPros[i][item] + "\n";

            // Replace the category with the uppercase version, this makes it more readable for the user
            newPros += originalPros.replace(
              defaultProCategoriesValue[item],
              defaultProCategoriesValue[item].toUpperCase()
            );
          }
        }
        if (newPros.length == 0) {
          newPros = "--";
        }
        newSpecsArray[i + 1][prosIndex] = newPros;
      }
      setSpecs(newSpecsArray);
    } else if (Specs.length == 2) {
      newSpecsArray = [];
      // Deep copy Specs into newSpecsArray
      for (item in Specs) {
        newSpecsArray.push(Specs[item]);
      }

      newSpecsArray[1][prosIndex] = "Add at least 2 items to view the pros";

      setSpecs(newSpecsArray);
      SetHeight[prosIndex](52);
    }
  }, [displayPros]);

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
    <ScrollView contentContainerStyle={styles.containerStyles.webContainer}>
      {/* Main Body */}
      <View style={styles.containerStyles.comparisonScreenContainer}>
        <Text style={[styles.textStyles.text, { fontSize: 25 }]}>
          {type} Comparison
        </Text>

        {/* Top buttons */}
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

              setSpecs(Categories);
              setSaveComparisonProcesses([]);
              setPros([]);
              setDisplayPros([]);

              for (item in SetHeight) {
                SetHeight[item](52);
              }
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
              setPros([]);

              for (let i = 0; i < SetHeight.length; i++) {
                SetHeight[i](52);
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

        {Specs.length == 1 && (
          <Text style={[styles.textStyles.simpleText, { fontSize: 20 }]}>
            Click the "Add" button to get started
          </Text>
        )}

        {/* Table */}
        <ScrollView
          horizontal={true}
          style={styles.containerStyles.comparisonScreenTable}
        >
          {/* For each item in spec, show a column */}
          {Specs.map((item, index1) => (
            <View key={item + index1}>
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

                    // index1 isn't zero indexed
                    newPros = pros.filter(
                      (subArray) => pros[index1 - 1] !== subArray
                    );
                    setPros(newPros);

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
                      /* Category labels default height is 52 */
                    }
                    if (Specs.length == 2) {
                      for (let i = 0; i < SetHeight.length; i++) {
                        SetHeight[i](52);
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
                              /* Height is determined by (number of '\n' - 1) * 17 + 52 */
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
                            const newHeight = (counter - 1) * 17 + 52;
                            if (newHeight >= 52) {
                              if (Height[k] > newHeight && newHeight >= 52) {
                                SetHeight[k](newHeight);
                              }
                            } else {
                              SetHeight[k](52);
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
                style={
                  index1 == 0
                    ? Specs.length != 1
                      ? { marginTop: 73.5, width: 120 }
                      : { marginTop: 50, width: 120 }
                    : { marginTop: 0 }
                }
              >
                {item.map((spec, index2) => (
                  /* We loop through each row in each column */

                  <View key={spec + index2}>
                    {index2 != prosIndex ? (
                      <Text
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
                              /* Height is determined by (number of '\n' - 1) * 17 + 52 */
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
                          const newHeight = (counter - 1) * 17 + 52;
                          if (Height[index2] < newHeight) {
                            SetHeight[index2](newHeight);
                          }
                        }}
                      >
                        {spec}
                      </Text>
                    ) : (
                      <ScrollView>
                        <Text
                          /* the category labels have a special blue background so they have a different style, specCategoryText */
                          style={[
                            { height: Height[index2] },
                            index1 != 0
                              ? styles.textStyles.comparisonText
                              : index2 == prosIndex
                              ? styles.textStyles.proText
                              : styles.textStyles.specCategoryText,
                          ]}
                          onLayout={async () => {
                            SetHeight[prosIndex](78);
                          }}
                        >
                          {spec}
                        </Text>
                      </ScrollView>
                    )}
                  </View>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <Footer amplitude={amplitude} isMobile={isMobile} />

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
        defaultArray={DefaultArray}
        categories={Categories}
        setSaveComparisonProcesses={setSaveComparisonProcesses}
        setPros={setPros}
        amplitude={amplitude}
      ></SelectionModal>
    </ScrollView>
  );
}
