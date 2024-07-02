import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import BuildURLFriendly from "../functions/BuildURLFriendly";
import SetTitleAndDescription from "../functions/SetTitleAndDescription";
import Modal from "react-modal";

Modal.setAppElement("#SpecGauge");

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAuth, signOut, sendPasswordResetEmail } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";

const comparisonLinks = [
  "/comparison/automobiles",
  "/comparison/consoles",
  "/comparison/cpus",
  "/comparison/graphicsCards",
  "/comparison/drones",
];

const categories = [
  "Automobiles",
  "Consoles",
  "CPUs",
  "Graphics Cards",
  "Drones",
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

  for (let i = 0; i != categories.length; i++) {
    const [newSavedComparisons, setNewSavedComparisons] = useState([]);
    const [newSavedProcesses, setNewSavedProcesses] = useState([]);

    savedComparisons.push(newSavedComparisons);
    setSavedComparisons.push(setNewSavedComparisons);

    savedProcesses.push(newSavedProcesses);
    setSavedProcesses.push(setNewSavedProcesses);
  }

  /* get auth that was initalized in WebApp.js, this may timeout after a while, 
  if it does then move this inside the log in and sign up func */
  const auth = getAuth();
  const functions = getFunctions();

  const resetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setPasswordResetSent(true);
      setPasswordResetError(false);
    } catch (error) {
      setPasswordResetError(true);
      setPasswordResetSent(false);
    }
  };

  // Sign out func
  const SignOutFunc = async () => {
    try {
      navigate("/home");
      await signOut(auth); // returns a response
    } catch (error) {}
  };

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
      return error;
    }
  };

  const CallDeleteComparisonCloudFunction = async (
    saveComparisonProcess,
    type
  ) => {
    amplitude.track("Delete saved comparison");
    // The processes, which is used to form the name of the comparison to delete
    const arrayToSave = [];
    for (let item in saveComparisonProcess) {
      arrayToSave.push(saveComparisonProcess[item]);
    }

    // The names of the products which will be in alphabetical order so user can't save multiple of the same comparison
    let names = [];

    for (let item1 in arrayToSave) {
      let name = "";

      for (let item2 in arrayToSave[item1]) {
        name += arrayToSave[item1][item2];
      }
      names.push(name);
    }
    names.sort();

    // The sum of all names in alphabetical order
    let comparisonName = "";
    for (let item in names) {
      comparisonName += names[item];
    }

    // Pass this JSON to the cloud
    const comparison = {
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
      return error;
    }
  };

  const callLocalSavedComparisonsFunc = async () => {
    setLoading(true);
    setPage(1);
    const result = await callSavedComparisonsCloudFunction(email);

    for (
      let categoryIndex = 0;
      categoryIndex != result.length;
      categoryIndex++
    ) {
      const categoryComparisonNames = [];
      const categoryComparisonProcesses = [];
      // Generate the name of the comparison to display to the user, also create an array of the processes

      Object.keys(result[categoryIndex]).forEach((comparisonIndex) => {
        const length = Object.keys(
          result[categoryIndex][comparisonIndex]
        ).length;

        let comparisonName = "";
        let comparisonProcess = [];

        Object.keys(result[categoryIndex][comparisonIndex]).forEach(
          (processIndex) => {
            comparisonName +=
              result[categoryIndex][comparisonIndex][processIndex][0] +
              " " +
              result[categoryIndex][comparisonIndex][processIndex][
                result[categoryIndex][comparisonIndex][processIndex].length - 1
              ];

            if (processIndex != length - 1) {
              comparisonName += " vs ";
            }
            comparisonProcess.push(
              result[categoryIndex][comparisonIndex][processIndex]
            );
          }
        );

        categoryComparisonNames.push(comparisonName);
        categoryComparisonProcesses.push(comparisonProcess);
      });

      setSavedComparisons[categoryIndex](categoryComparisonNames);
      setSavedProcesses[categoryIndex](categoryComparisonProcesses);
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

  useEffect(() => {
    amplitude.track("Screen", {
      Screen: "My Account",
    });

    SetTitleAndDescription(
      "SpecGauge | My Account",
      "Your account details and saved comparisons."
    );
  }, []);

  return (
    /* if logged in display user settings */
    <>
      {/* navbar */}
      <Navbar page={"account"} isMobile={isMobile} />
      {/* main body */}
      <div
        className={isMobile ? "UserAccountScreenMobile" : "UserAccountScreen"}
      >
        {/* Sidebar */}
        <div
          style={{
            borderRight: "2px solid #000",
            paddingRight: 20,
            display: "grid",
            gridTemplateColumns: `150px`,
            gridTemplateRows: `65px 65px`,
            rowGap: "6px",
            columnGap: "10px",
          }}
        >
          {/* Neccessary to put these as grids */}
          {/* Your Account */}
          {page == 0 ? (
            <button
              onClick={async () => {
                setPage(0);
              }}
              className="AccountButtonSelected"
              style={{ width: "100%", alignItems: "center", padding: 0 }}
            >
              <p>Your Account</p>
            </button>
          ) : (
            <button
              onClick={() => {
                setPage(0);
                setSavedComparisons(categories.map(() => []));
                setSavedProcesses(categories.map(() => []));
              }}
              className="AccountButton"
              style={{ width: "100%", alignItems: "center", padding: 0 }}
            >
              <p>Your Account</p>
            </button>
          )}
          {/* Saved Comparisons */}
          {page == 1 ? (
            <button
              onClick={() => {
                setPage(1);
              }}
              className="AccountButtonSelected"
              style={{ width: "100%", alignItems: "center", padding: 0 }}
            >
              <p>Saved Comparisons</p>
            </button>
          ) : (
            <button
              onClick={async () => {
                callLocalSavedComparisonsFunc();
                amplitude.track("Screen", {
                  Screen: "Saved Comparisons",
                });
              }}
              className="AccountButton"
              style={{ width: "100%", alignItems: "center", padding: 0 }}
            >
              <p>Saved Comparisons</p>
            </button>
          )}
        </div>

        {/* main view */}
        <div
          style={{ paddingLeft: 20, display: "flex", flexDirection: "column" }}
        >
          {/* Your Account */}
          {page == 0 && (
            <>
              <p className="UserAccountDetailsHeader">Your Account</p>
              {/* Show user the account email */}
              <div style={{ paddingTop: 10 }}>
                <p style={{ fontSize: 20 }} className="PlainText">
                  Email
                </p>
                <p className="PlainText">{email}</p>
                {passwordResetSent && (
                  <p className="SuccessText">Request sent to your email.</p>
                )}

                {passwordResetError && (
                  <p className="ErrorText">Error sending request.</p>
                )}
              </div>

              {/* Let user reset password */}
              <button
                className="NormalButton"
                style={{ margin: 0, marginTop: 10 }}
                onClick={() => {
                  resetPassword();
                }}
              >
                <p>Reset Password</p>
              </button>

              {/* Let user sign out */}
              <button
                className="NormalButton"
                style={{ margin: 0, marginTop: 20 }}
                onClick={() => {
                  SignOutFunc();
                }}
              >
                <p>Log Out</p>
              </button>
            </>
          )}
          {/* Saved Comparisons */}
          {page == 1 && (
            <>
              <p className="UserAccountDetailsHeader">Saved Comparisons</p>
              {loading ? (
                <div className="ActivityIndicator"></div>
              ) : (
                <div style={{ marginRight: 20 }}>
                  {categories.map(
                    (categoryItem, categoryIndex) =>
                      savedComparisons[categoryIndex].length != 0 && (
                        <div
                          className="UserAccountDetailsSection"
                          key={categoryItem}
                        >
                          <p
                            className="UserAccountDetails"
                            style={{ paddingTop: 40, fontSize: 20 }}
                          >
                            {categoryItem}
                          </p>

                          {savedComparisons[categoryIndex].map(
                            (comparisonItem, comparisonIndex) => (
                              <div
                                key={comparisonItem}
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                }}
                              >
                                {/* Button to select saved comparison */}
                                <button
                                  className="NormalButtonNoBackground"
                                  style={{
                                    textAlign: "left",
                                    display: "block",
                                  }}
                                  onClick={async () => {
                                    const url = BuildURLFriendly(
                                      savedProcesses[categoryIndex][
                                        comparisonIndex
                                      ]
                                    );

                                    navigate(
                                      comparisonLinks[categoryIndex] + "/" + url
                                    );
                                  }}
                                >
                                  <p>{comparisonItem}</p>
                                </button>
                                {/* Button to delete saved comparison */}
                                <button
                                  className="DangerButtonNoBackground"
                                  onClick={async () => {
                                    setAwaitingDeletingSavedComparison(true);
                                    setDeletingSavedComparison(true);

                                    const result =
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
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      )
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <Footer amplitude={amplitude} isMobile={isMobile} />
      {/* Show status of deleted comparison */}
      <Modal
        isOpen={deletingSavedComparison}
        contentLabel="Deleting saved comparison"
        className={"ModalContainer"}
        overlayClassName={"ModalOverlay"}
      >
        <p className="HeaderText">Delete Comparison</p>
        {awaitingDeletingSavedComparison ? (
          <div
            className="ActivityIndicator"
            style={{ marginTop: 30, marginBottom: 30 }}
          ></div>
        ) : (
          <div className="ModalButtonSection" style={{ marginBottom: 30 }}>
            {successfullyDeletedSavedComparison ? (
              <p className="SuccessText">
                Succesfully deleted this comparison.
              </p>
            ) : (
              <p className="ErrorText">
                Deleting this comparison was unsuccessful, try again later.
              </p>
            )}
            <button
              className="NormalButton"
              style={{ margin: "auto" }}
              onClick={async () => {
                for (let item in setSavedComparisons) {
                  setSavedComparisons[item]([]);
                  setSavedProcesses[item]([]);
                }

                callLocalSavedComparisonsFunc();
                setDeletingSavedComparison(false);
                setSuccessfullyDeletedSavedComparison(false);
              }}
            >
              <p>Okay</p>
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}
