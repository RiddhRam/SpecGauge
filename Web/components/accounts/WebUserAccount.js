import { SGStyles } from "../../../styles/styles";
import { Navbar } from "../../Navbar";
import { Footer } from "../../Footer";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  View,
  Pressable,
  Text,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native-web";

import { getAuth, signOut, sendPasswordResetEmail } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import {
  query,
  where,
  getFirestore,
  collection,
  getDocs,
} from "firebase/firestore";

const comparisonLinks = [
  "/comparison/automobiles",
  "/comparison/consoles",
  "/comparison/drones",
  "/comparison/graphicsCards",
  "/comparison/cpus",
];

const categories = [
  "Automobiles",
  "Consoles",
  "Drones",
  "Graphics Cards",
  "CPUs",
];

export default function WebUserAccount({ amplitude, isMobile, defaultArrays }) {
  // Initialize useNavigate as navigate
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  // 0 for "Your Account", 1 for Saved Comparisons, 2 for Comparison Preferences
  const [page, setPage] = useState(0);
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const [passwordResetError, setPasswordResetError] = useState(false);

  const [deletingSavedComparison, setDeletingSavedComparison] = useState(false);
  const [awaitingDeletingSavedComparison, setAwaitingDeletingSavedComparison] =
    useState(false);
  const [
    successfullyDeletedSavedComparison,
    setSuccessfullyDeletedSavedComparison,
  ] = useState(false);
  const [loading, setLoading] = useState(false);

  // This is used when user selects a comparison
  let savedProcesses = [];
  let setSavedProcesses = [];
  // These are displayed to the user
  let savedComparisons = [];
  let setSavedComparisons = [];

  for (item in categories) {
    const [newSavedComparisons, setNewSavedComparisons] = useState([]);
    const [newSavedProcesses, setNewSavedProcesses] = useState([]);

    savedComparisons.push(newSavedComparisons);
    setSavedComparisons.push(setNewSavedComparisons);

    savedProcesses.push(newSavedProcesses);
    setSavedProcesses.push(setNewSavedProcesses);
  }

  // Call SGStyles as styles
  const styles = SGStyles();

  /* get auth that was initalized in WebApp.js, this may timeout after a while, 
  if it does then move this inside the log in and sign up func */
  const auth = getAuth();
  const functions = getFunctions();
  const db = getFirestore();

  const resetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setPasswordResetSent(true);
      setPasswordResetError(false);
    } catch (error) {
      console.log(error.message);
      setPasswordResetError(true);
      setPasswordResetSent(false);
    }
  };

  // Sign out func
  const SignOutFunc = async () => {
    try {
      navigate("/home");
      await signOut(auth); // returns a response
    } catch (error) {
      console.log(error.message);
    }
  };

  // Array with all direct query functions
  const directFuncArray = [
    (queryAutomobilesFunction = async (product) => {
      const colRef = collection(db, "Automobiles");
      const q = await query(
        colRef,
        where("Brand", "==", product[0]),
        where("Model", "==", product[1]),
        where("Year", "==", product[2]),
        where("Trim", "==", product[3])
      );

      const snapshot = await getDocs(q);

      automobilesArray = [];
      snapshot.forEach((doc) => {
        automobilesArray.push(doc.data());
      });

      return automobilesArray;
    }),
    (queryConsolesFunction = async (product) => {
      const colRef = collection(db, "Consoles");
      const q = await query(
        colRef,
        where("Brand", "==", product[0]),
        where("Name", "==", product[1])
      );

      const snapshot = await getDocs(q);

      ConsolesArray = [];
      snapshot.forEach((doc) => {
        ConsolesArray.push(doc.data());
      });

      return ConsolesArray;
    }),
    (queryDronesFunction = async (product) => {
      const colRef = collection(db, "Drones");
      const q = await query(
        colRef,
        where("Brand", "==", product[0]),
        where("Name", "==", product[1])
      );

      const snapshot = await getDocs(q);

      DronesArray = [];
      snapshot.forEach((doc) => {
        DronesArray.push(doc.data());
      });

      return DronesArray;
    }),
    (queryGraphicsCardsFunction = async (product) => {
      const colRef = collection(db, "Graphics Card");
      const q = await query(
        colRef,
        where("Brand", "==", product[0]),
        where("Generation", "==", product[1]),
        where("Card", "==", product[2])
      );

      const snapshot = await getDocs(q);

      graphicsCardsArray = [];
      snapshot.forEach((doc) => {
        graphicsCardsArray.push(doc.data());
      });

      return graphicsCardsArray;
    }),
    (queryCPUsFunction = async (product) => {
      const colRef = collection(db, "CPUs");
      const q = await query(
        colRef,
        where("Brand", "==", product[0]),
        where("Generation", "==", product[1]),
        where("CPU", "==", product[2])
      );

      const snapshot = await getDocs(q);

      CPUsArray = [];
      snapshot.forEach((doc) => {
        CPUsArray.push(doc.data());
      });

      return CPUsArray;
    }),
  ];

  const callSavedComparisonsCloudFunction = async (email) => {
    amplitude.track("Get saved comparisons");
    try {
      const GetSavedComparisons = httpsCallable(
        functions,
        "GetSavedComparisons"
      );
      const result = await GetSavedComparisons(email);
      return result.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const CallDeleteComparisonCloudFunction = async (
    saveComparisonProcess,
    type
  ) => {
    amplitude.track("Delete saved comparison");
    // The processes, which is used to form the name of the comparison to delete
    arrayToSave = [];
    for (item in saveComparisonProcess) {
      arrayToSave.push(saveComparisonProcess[item]);
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
    };

    try {
      const DeleteSavedComparisons = httpsCallable(
        functions,
        "DeleteSavedComparisons"
      );
      const result = await DeleteSavedComparisons(comparison);
      return result.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const callLocalSavedComparisonsFunc = async () => {
    setLoading(true);
    setPage(1);
    const result = await callSavedComparisonsCloudFunction(email);

    for (categoryItem in result) {
      categoryComparisonNames = [];
      categoryComparisonProcesses = [];
      // Generate the name of the comparison to display to the user, also create an array of the processes
      for (comparisonItem in result[categoryItem]) {
        const length = Object.keys(result[categoryItem][comparisonItem]).length;

        comparisonName = "";
        comparisonProcess = [];
        for (processItem in result[categoryItem][comparisonItem]) {
          comparisonName +=
            result[categoryItem][comparisonItem][processItem][0] +
            " " +
            result[categoryItem][comparisonItem][processItem][
              result[categoryItem][comparisonItem][processItem].length - 1
            ];

          if (processItem != length - 1) {
            comparisonName += " vs ";
          }
          comparisonProcess.push(
            result[categoryItem][comparisonItem][processItem]
          );
        }
        categoryComparisonNames.push(comparisonName);
        categoryComparisonProcesses.push(comparisonProcess);
      }

      setSavedComparisons[categoryItem](categoryComparisonNames);
      setSavedProcesses[categoryItem](categoryComparisonProcesses);
    }

    setLoading(false);
  };

  // send user to log in if not logged in
  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
    } else {
      setEmail(auth.currentUser.email);
    }
    amplitude.track("Screen", { Screen: "Log In" });
  });

  return (
    /* if logged in display user settings */
    <ScrollView contentContainerStyle={styles.containerStyles.webContainer}>
      {/* navbar */}
      <Navbar style={{ height: "25%" }} page={"account"} />

      {/* main body */}
      <View style={styles.containerStyles.largeContainer}>
        <ScrollView
          style={{
            flexDirection: "row",
            marginRight: "auto",
          }}
          horizontal={true}
        >
          {/* Sidebar */}
          <View
            style={{
              borderRightWidth: 1,
            }}
          >
            {/* Your Account */}
            {page == 0 ? (
              <Pressable
                onPress={async () => {
                  setPage(0);
                }}
                style={({ pressed }) => [
                  styles.inputStyles.accountButtonSelected,
                  pressed && styles.inputStyles.accountButtonClicked,
                ]}
              >
                <p>Your Account</p>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => {
                  setPage(0);
                  for (item in setSavedComparisons) {
                    setSavedComparisons[item]([]);
                    setSavedProcesses[item]([]);
                  }
                }}
                style={({ pressed }) => [
                  styles.inputStyles.accountButton,
                  pressed && styles.inputStyles.accountButtonClicked,
                ]}
              >
                <p>Your Account</p>
              </Pressable>
            )}
            {/* Saved Comparisons */}
            {page == 1 ? (
              <Pressable
                onPress={() => {
                  setPage(1);
                }}
                style={({ pressed }) => [
                  styles.inputStyles.accountButtonSelected,
                  pressed && styles.inputStyles.accountButtonClicked,
                ]}
              >
                <p>Saved Comparisons</p>
              </Pressable>
            ) : (
              <Pressable
                onPress={async () => {
                  callLocalSavedComparisonsFunc();
                }}
                style={({ pressed }) => [
                  styles.inputStyles.accountButton,
                  pressed && styles.inputStyles.accountButtonClicked,
                ]}
              >
                <p>Saved Comparisons</p>
              </Pressable>
            )}
          </View>

          {/* main view */}
          <View style={{ padding: 10 }}>
            {/* Your Account */}
            {page == 0 && (
              <View>
                <Text style={{ fontSize: 30, color: "#4ca0d7" }}>
                  Your Account
                </Text>
                {/* Show user the account email */}
                <View style={{ paddingTop: 10 }}>
                  <Text style={[styles.textStyles.plainText, { fontSize: 20 }]}>
                    Email
                  </Text>
                  <Text style={styles.textStyles.plainText}>{email}</Text>
                  {passwordResetSent && (
                    <Text
                      style={[
                        styles.textStyles.plainText,
                        styles.textStyles.successText,
                        { paddingTop: 5 },
                      ]}
                    >
                      Request sent to your email.
                    </Text>
                  )}

                  {passwordResetError && (
                    <Text style={[styles.textStyles.errorText]}>
                      Error sending request.
                    </Text>
                  )}
                </View>

                {/* Let user reset password */}
                <Pressable
                  style={({ pressed }) => [
                    styles.inputStyles.button,
                    pressed && styles.inputStyles.buttonClicked,
                    { margin: 0, marginTop: 10 },
                  ]}
                  onPress={() => {
                    resetPassword();
                  }}
                >
                  <p>Reset Password</p>
                </Pressable>

                {/* Let user sign out */}
                <Pressable
                  style={({ pressed }) => [
                    styles.inputStyles.button,
                    pressed && styles.inputStyles.buttonClicked,
                    { margin: 0, marginTop: 10 },
                  ]}
                  onPress={() => {
                    SignOutFunc();
                  }}
                >
                  <p>Log Out</p>
                </Pressable>
              </View>
            )}
            {/* Saved Comparisons */}
            {page == 1 && (
              <ScrollView>
                <Text style={{ fontSize: 30, color: "#4ca0d7" }}>
                  Saved Comparisons
                </Text>
                {loading && <ActivityIndicator></ActivityIndicator>}
                {!loading && (
                  <View style={{ marginRight: 20 }}>
                    {categories.map(
                      (categoryItem, categoryIndex) =>
                        savedComparisons[categoryIndex].length != 0 && (
                          <View
                            key={categoryItem}
                            style={
                              styles.containerStyles.userAccountDetailsSection
                            }
                          >
                            <Text style={styles.textStyles.userAccountDetails}>
                              {categoryItem}
                            </Text>

                            {savedComparisons[categoryIndex].map(
                              (comparisonItem, comparisonIndex) => (
                                <View
                                  key={comparisonItem}
                                  style={{ flexDirection: "row" }}
                                >
                                  {/* Button to select saved comparison */}
                                  <Pressable
                                    style={({ pressed }) => [
                                      styles.inputStyles.buttonNoBackground,
                                      pressed &&
                                        styles.inputStyles
                                          .buttonNoBackgroundClicked,
                                      {
                                        textAlign: "left",
                                        margin: 0,
                                        padding: 0,
                                        height: "auto",
                                        paddingRight: 30,
                                      },
                                    ]}
                                    onPress={async () => {
                                      setLoading(true);

                                      prerequestedSpecs = [];
                                      processArray = [];
                                      prosArray = [];
                                      // Iterate through all processes in the clicked comparison
                                      for (processItem in savedProcesses[
                                        categoryIndex
                                      ][comparisonIndex]) {
                                        // Call the direct function for this category and pass in the process
                                        const result = await directFuncArray[
                                          categoryIndex
                                        ](
                                          savedProcesses[categoryIndex][
                                            comparisonIndex
                                          ][processItem]
                                        );
                                        // There should only be 1 result anyways, but just in case there's several, this will use the first one
                                        prerequestedSpecs.push(result[0]);
                                        processArray.push(
                                          savedProcesses[categoryIndex][
                                            comparisonIndex
                                          ][processItem]
                                        );

                                        tempProsArray = [];

                                        for (
                                          let i = 0;
                                          i <
                                          defaultArrays[categoryIndex].length;
                                          i++
                                        ) {
                                          defaultArrayItem =
                                            defaultArrays[categoryIndex][i];
                                          if (defaultArrayItem.Important) {
                                            newJSON = {};
                                            newJSON["Value"] =
                                              defaultArrayItem.Value;
                                            newJSON["Display"] =
                                              defaultArrayItem.Display;
                                            newJSON["Category"] =
                                              defaultArrayItem.Category;
                                            newJSON["Matching"] =
                                              defaultArrayItem.Matching;
                                            newJSON["Type"] =
                                              defaultArrayItem.Type;
                                            newJSON["Preference"] =
                                              defaultArrayItem.Preference;
                                            newJSON["HigherNumber"] =
                                              defaultArrayItem.HigherNumber;

                                            tempProsArray.push(newJSON);
                                          }
                                        }

                                        // Record Pros to tempProsArray
                                        for (
                                          let j = 0;
                                          j != tempProsArray.length;
                                          j++
                                        ) {
                                          // If not based on user preference, we will deal with user preferences later
                                          if (!tempProsArray[j].Preference) {
                                            proValue =
                                              result[0][
                                                tempProsArray[j].Matching
                                              ];

                                            if (proValue != undefined) {
                                              tempProsArray[j].Value =
                                                result[0][
                                                  tempProsArray[j].Matching
                                                ];
                                            } else {
                                              tempProsArray[j].Value = "--";
                                            }
                                          }
                                        }

                                        prosArray.push(tempProsArray);
                                      }
                                      setLoading(false);

                                      navigate(comparisonLinks[categoryIndex], {
                                        state: {
                                          prerequestedSpecs: prerequestedSpecs,
                                          processArray: processArray,
                                          prosArray: prosArray,
                                        },
                                      });
                                    }}
                                  >
                                    <p>{comparisonItem}</p>
                                  </Pressable>
                                  {/* Button to delete saved comparison */}
                                  <Pressable
                                    style={({ pressed }) => [
                                      styles.inputStyles.redButtonNoBackground,
                                      pressed &&
                                        styles.inputStyles
                                          .redButtonNoBackgroundClicked,
                                    ]}
                                    onPress={async () => {
                                      setAwaitingDeletingSavedComparison(true);
                                      setDeletingSavedComparison(true);

                                      result =
                                        await CallDeleteComparisonCloudFunction(
                                          savedProcesses[categoryIndex][
                                            comparisonIndex
                                          ],
                                          categoryItem
                                        );

                                      if (result == 200) {
                                        setSuccessfullyDeletedSavedComparison(
                                          true
                                        );
                                      }
                                      setAwaitingDeletingSavedComparison(false);
                                    }}
                                  >
                                    <p>Delete</p>
                                  </Pressable>
                                </View>
                              )
                            )}
                          </View>
                        )
                    )}
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </ScrollView>
      </View>

      <Footer amplitude={amplitude} isMobile={isMobile} />

      {/* Show status of deleted comparison */}
      <Modal
        visible={deletingSavedComparison}
        animationType="slide"
        transparent="true"
      >
        <View style={styles.containerStyles.modalContainer}>
          <Text></Text>
          {awaitingDeletingSavedComparison && (
            <ActivityIndicator></ActivityIndicator>
          )}
          {!awaitingDeletingSavedComparison && (
            <View>
              <Text style={styles.textStyles.text}>Save Comparison</Text>
              {successfullyDeletedSavedComparison ? (
                <Text
                  style={[
                    styles.textStyles.successText,
                    { padding: 10, textAlign: "center" },
                  ]}
                >
                  Succesfully deleted this comparison.
                </Text>
              ) : (
                <Text style={styles.textStyles.errorText}>
                  Deleting this comparison was unsuccessful, try again later.
                </Text>
              )}
              <Pressable
                style={({ pressed }) => [
                  styles.inputStyles.button,
                  pressed && styles.inputStyles.buttonClicked,
                ]}
                onPress={async () => {
                  for (item in setSavedComparisons) {
                    setSavedComparisons[item]([]);
                    setSavedProcesses[item]([]);
                  }

                  callLocalSavedComparisonsFunc();
                  setDeletingSavedComparison(false);
                  setSuccessfullyDeletedSavedComparison(false);
                }}
              >
                <p>Okay</p>
              </Pressable>
            </View>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
}
