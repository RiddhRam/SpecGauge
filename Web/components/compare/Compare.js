import {
  Pressable,
  View,
  Text,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native-web";
import { SGStyles } from "../../../styles/styles";
import { v4 as uuidv4 } from "uuid";
import SelectionModal from "../SelectionModal";
import WebAccountHandler from "../accounts/WebAccountHandler";

import { useState } from "react";
import { getAuth } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";

export default function Compare({
  type,
  setCategory,
  Brands,
  Process,
  MatchingArray,
  DefaultArray,
  Categories,
  Specs,
  setSpecs,
  Height,
  SetHeight,
  CloudFunction,
  amplitude,
}) {
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [notLoggedInVisible, setNotLoggedInVisible] = useState(false);
  const [savingComparison, setSavingComparison] = useState(false);
  const [successfullySavedComparison, setSuccessfullySavedComparison] =
    useState(false);
  const [awaitingSavingComparison, setAwaitingSavingComparison] =
    useState(false);
  // Every item excluding the first item is used when save comparisons
  // It is the path to follow in Firestore to get the product's specs
  const [saveComparisonProcess, setSaveComparisonProcess] = useState([Process]);
  const auth = getAuth();
  const functions = getFunctions();
  const styles = SGStyles();

  const CallSaveComparisonCloudFunction = async () => {
    // The processes that get saved
    arrayToSave = [];
    for (item in saveComparisonProcess) {
      if (item != 0) {
        arrayToSave.push(saveComparisonProcess[item]);
      }
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
    <View style={styles.containerStyles.comparisonScreenContainer}>
      <Text style={[styles.textStyles.text, { fontSize: 25 }]}>
        {type} Comparison
      </Text>

      <View style={{ marginRight: "auto", flexDirection: "row" }}>
        {/* Go Back button */}
        <Pressable
          onPress={() => {
            amplitude.track("Go Back");
            {
              /* Set page to home */
            }
            setCategory(0);

            {
              /* Reset row heights and remove all specs */
            }
            for (let i = 0; i < SetHeight.length; i++) {
              SetHeight[i](39);
            }
            setSpecs(Categories);
          }}
          style={({ pressed }) => [
            styles.inputStyles.button,
            pressed && styles.inputStyles.buttonClicked,
            // Reduce padding on the left so Save Comparison button can fit on mobile screen
            { paddingLeft: 5 },
          ]}
        >
          <p>{"< Go Back"}</p>
        </Pressable>

        {/* Add Item button */}
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

        {/* Save Comparison button */}
        <Pressable
          onPress={async () => {
            amplitude.track("Save comparison");
            {
              /* Show product selection modal */
            }
            if (auth.currentUser != null) {
              setAwaitingSavingComparison(true);
              setSavingComparison(true);
              const result = await CallSaveComparisonCloudFunction();
              if (result == 200) {
                setSuccessfullySavedComparison(true);
              }
              setAwaitingSavingComparison(false);
            } else {
              setNotLoggedInVisible(true);
            }
          }}
          style={({ pressed }) => [
            styles.inputStyles.button,
            pressed && styles.inputStyles.buttonClicked,
          ]}
        >
          <p>Save comparison</p>
        </Pressable>
      </View>

      {/* The table with the specs */}
      <ScrollView
        horizontal={true}
        style={styles.containerStyles.comparisonScreenContainer}
      >
        {/* For each item in spec, show a column */}
        {Specs.map((item, index1) => (
          <View
            key={uuidv4() + item}
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

                  // Remove from the saveComparisonProcess
                  newProcessArray = saveComparisonProcess.filter(
                    (subArray) => saveComparisonProcess[index1] !== subArray
                  );
                  setSaveComparisonProcess(newProcessArray);

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
                  key={uuidv4() + spec}
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
        visible={notLoggedInVisible}
        animationType="slide"
        transparent="true"
      >
        <View style={styles.containerStyles.modalContainer}>
          <WebAccountHandler
            screenType={"modal"}
            setModalView={setNotLoggedInVisible}
          ></WebAccountHandler>
          <Pressable
            style={({ pressed }) => [
              styles.inputStyles.buttonNoBackground,
              pressed && styles.inputStyles.buttonNoBackgroundClicked,
            ]}
            onPress={() => {
              setNotLoggedInVisible(false);
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

      {/* The product selection modal */}
      <SelectionModal
        type={type}
        productModalVisible={productModalVisible}
        setProductModalVisible={setProductModalVisible}
        brands={Brands}
        cloudFunction={CloudFunction}
        process={Process}
        setSpecs={setSpecs}
        matchingArray={MatchingArray}
        defaultArray={DefaultArray}
        categories={Categories}
        amplitude={amplitude}
        setSaveComparisonProcess={setSaveComparisonProcess}
      ></SelectionModal>
    </View>
  );
}
