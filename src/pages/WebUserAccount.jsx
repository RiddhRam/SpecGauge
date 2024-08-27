import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import SetTitleAndDescription from "../functions/SetTitleAndDescription";
import RemoveCanonical from "../functions/RemoveCanonical";
import PakoInflate from "../functions/PakoInflate";

import Modal from "react-modal";
Modal.setAppElement("#SpecGauge");

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { signOut, sendPasswordResetEmail } from "firebase/auth";
import { logEvent } from "firebase/analytics";
import { auth, analytics } from "../firebaseConfig";

const compressedBrands = [
  // Cars
  "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",
  // CPUs
  "eJxlUsFOwzAM/ZUo5x1WulG229ZViMOkagMBm3Yo1FIjpUlJUzSG+HfilDiTuFjP79Xv2VGP33xtKlXzJV9tN3zCd/AxQG/3Fjq+PPLd1wUUS51wQNF3mUOrZIrVNlIrB4oEu4UXbrAvX3NWtG9Q11Aje4dlRhaPjYGqNqLrwBDpx29dyYnKh97qltorx5E4JATnGBuy+elnEi97UBbk/9teQCtWysoKNWCG74uMEF7tR1lp9Dv0vTZBKxvhYAnKiqFl91riSrk2wETGZlPbULuIiBVna6CFwODGT9Kayl/ufZ+ja6A2AeyF/ATaoAjgL3w0yoJ3GuS10epCkXTctjrT0Pxq97jimBK1NH5FyKsgwfifACfcw59+AW43r6A=",
  // Graphics Cards
  "eJxtkk1PwzAMhv9K1POQyroP2K2sUHLYVGAbSNMOprW2Slkz0o4L4r+Tru0Sp5yax6/9xna6/fEeFBSZN/PCReQNvFf8OmNZvVV48mZbb4N7YDxOagUylAVLlGR1lEYW8jMX6MQg1YHGgbcmS/jO24+puRDn3Bzb7LksSimQxclaUyIFqLw0nibfMul3S+uMUdfA7ndgtsCLCkV/DxFUwOaoRdV28xyxWMHpkKflzfvCCaxqDubXgMYPtIlUU3ZU1/pRcyjSAx7zsqrPKrWTyTDLDY942J8mxiepUmQj36/tO7z1NaywFMASKFMQtjYx79WkhBlcz6uzyou9xpczZPUPIkUFVvXQt2DkkzttmhIa+ubO1jg8nlChlXPvU2tTYWXQIfspI2IS/JMxbUzayd0mxo3a9nhdRiffuR0QnDjqxDj1XiEgjY4v1G3Geg53/QEdz72erJyIGvUftfsDmxI9dA==",
  // Drones
  "eJxtUl1vmzAU/SsWz9VkQ4Cob7SkDdsyoRh10qo+uImrWQObGROtm/bf5y8CTvZ07zm+99wvP/+J7iThx+g2KkZF2+gm2tOfIx0UVrSPbp+jzUmAqtK8cXbkF1g1HnwhXIC6HQePPzNFL7F3qwqUI2lnVEsxgw1XVPaSDXShHGaCbAWbmdo3nwCmktEhevl7M89QfqyuJ9iREzuAgkkQ68f6O+FKdGDle9gxzmZgQ+MAJeCecbp4/CZENyUmPtSq43OQhkGp4ngi/ECP5wCXFfQCnuIPcFm1JcPADssUvV2iGB+7M2maWAglAG9miWbqMg7o2TNkcSKKgIf6KdC0q8I9kT8mDa0QrHor2neAlbCrudj4FucxNOJbjCC0NoeeyD2BYlg6J0+dTSYCwscp1DFazdo493blNTKXmqQGP6A1+jpJusQU+UDkJVGGrM3S84MvmnnpxPc7ZfpSsW4hmL8mUgp1PXvByRvTH8Cs1rja3tFX0duN7kj3KuyyQy2hKHe3vlQzV7XHM5425dr008Rm8AatDWM7LyUlHZX+Y5V2vCZJwzr799//uVZD21aEgZiTXhHGr4NxndoD4tqtENfuoDi91xIv/wAjsjX8",
];

const comparisonLinks = [
  "/comparison/automobiles",
  "/comparison/cpus",
  "/comparison/graphicsCards",
  "/comparison/drones",
];

const categories = ["Vehicles", "CPUs", "Graphics Cards", "Drones"];

export default function WebUserAccount({ isMobile }) {
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
    if (analytics != null) {
      logEvent(analytics, "Get saved comparisons");
    }
    try {
      let GetSavedComparisons = null;
      await import("../functions/LazyLoadGetFunctions").then((module) => {
        // Update the title
        const getFunctions = module.getFunctions;
        const httpsCallable = module.httpsCallable;

        const functions = getFunctions();
        GetSavedComparisons = httpsCallable(functions, "GetSavedComparisons");
      });

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
    if (analytics != null) {
      logEvent(analytics, "Delete saved comparison");
    }
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
      let DeleteSavedComparisons = null;
      await import("../functions/LazyLoadGetFunctions").then((module) => {
        // Update the title
        const getFunctions = module.getFunctions;
        const httpsCallable = module.httpsCallable;

        const functions = getFunctions();
        DeleteSavedComparisons = httpsCallable(
          functions,
          "DeleteSavedComparisons"
        );
      });

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
    if (analytics != null) {
      logEvent(analytics, "Screen", {
        Screen: "Account",
        Platform: isMobile ? "Mobile" : "Computer",
      });
    }

    SetTitleAndDescription(
      "SpecGauge | Account",
      "Your account details and saved comparisons.",
      window.location.href
    );

    RemoveCanonical();
  }, []);

  const brands = [];

  for (let item in compressedBrands) {
    const brandArray = JSON.parse(PakoInflate(compressedBrands[item]));

    brands.push(brandArray);
  }

  return (
    /* if logged in display user settings */
    <div // Scroll to the top when page loads
      onLoad={() => {
        window.scrollTo(0, 0);
      }}
    >
      {/* navbar */}
      <Navbar isMobile={isMobile} />
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
          }}
        >
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
                setSavedComparisons = categories.map(() => []);
                setSavedProcesses = categories.map(() => []);
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
                if (analytics != null) {
                  logEvent(analytics, "Screen", {
                    Screen: "Saved Comparisons",
                    Platform: isMobile ? "Mobile" : "Computer",
                  });
                }
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
                                    let url = "";

                                    // Lazy import this, becaues it includes pako
                                    await import(
                                      "../functions/BuildURLFriendlyCompare"
                                    ).then((module) => {
                                      // Construct the process array into a string
                                      url = module.default(
                                        savedProcesses[categoryIndex][
                                          comparisonIndex
                                        ],
                                        brands[categoryIndex]
                                      );
                                    });

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
      <Footer isMobile={isMobile}></Footer>
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
    </div>
  );
}
