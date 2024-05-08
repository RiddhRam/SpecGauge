import { SGStyles } from "../../../styles/styles";
import { Navbar } from "../../Navbar";

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

export default function WebUserAccount({ amplitude }) {
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

  const categories = [
    "Automobiles",
    "Consoles",
    "Drones",
    "Graphics Cards",
    "CPUs",
  ];

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

  const [loading, setLoading] = useState(false);

  // Call SGStyles as styles
  const styles = SGStyles();

  /* get auth that was initalized in WebApp.js, this may timeout after a while, 
  if it does then move this inside the log in and sign up func */
  const auth = getAuth();
  const functions = getFunctions();

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
      processes: arrayToSave,
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

  const callLocalSavedComparisonsFunc = async () => {
    setLoading(true);
    setPage(1);
    const result = await callSavedComparisonsCloudFunction(email);

    // For every returned comparison
    for (const resultItem in result) {
      // Save the data
      const comparison = result[resultItem][0].data;

      count = 0;
      for (dataItem in comparison) {
        if (dataItem != "type") {
          count++;
        }
      }

      // Iterate through the categories array above
      for (const categoryItem in categories) {
        // If the saved comparison type matches this category
        if (comparison.type == categories[categoryItem]) {
          let displayName = [];
          // Record a new comparison
          let newComparisonProcess = [];
          for (dataItem in comparison) {
            if (dataItem != "type") {
              newComparisonProcess.push(comparison[dataItem]);
            }
          }
          for (const comparisonItem in newComparisonProcess) {
            displayName.push(
              newComparisonProcess[comparisonItem][0] +
                " " +
                newComparisonProcess[comparisonItem][
                  newComparisonProcess[comparisonItem].length - 1
                ]
            );
            if (comparisonItem != newComparisonProcess.length - 1) {
              displayName[comparisonItem] += " vs ";
            }
          }
          // Update savedProcesses
          setSavedProcesses[categoryItem]((prevProcessArray) => [
            ...prevProcessArray,
            newComparisonProcess,
          ]);

          // Update savedComparisons
          setSavedComparisons[categoryItem]((prevComparisonArray) => [
            ...prevComparisonArray,
            displayName,
          ]);
        }
      }
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
  });

  return (
    /* if logged in display email and sign out button, 
      if logged out display send user to /login */
    <View style={styles.containerStyles.webContainer}>
      {/* navbar */}
      <Navbar page="account" />

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
            {/* Comparison Preferences */}
            {page == 2 ? (
              <Pressable
                onPress={async () => {
                  setLoading(true);
                  setPage(2);
                }}
                style={({ pressed }) => [
                  styles.inputStyles.accountButtonSelected,
                  pressed && styles.inputStyles.accountButtonClicked,
                ]}
              >
                <p>Comparison Preferences</p>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => {
                  setPage(2);
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
                <p>Comparison Preferences</p>
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
                                    onPress={() => {
                                      console.log(
                                        savedProcesses[categoryIndex][
                                          comparisonIndex
                                        ]
                                      );
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
                                          categories[categoryIndex]
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
            {page == 2 && (
              <View>
                <Text style={{ fontSize: 30, color: "#4ca0d7" }}>
                  Comparison Preferences
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>

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
              {deletingSavedComparison ? (
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
    </View>
  );
}
