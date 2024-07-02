import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

import SelectionModal from "../components/SelectionModal";
import WebAccountHandler from "../components/WebAccountHandler";
import SetTitleAndDescription from "../functions/SetTitleAndDescription";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

Modal.setAppElement("#SpecGauge");

import { getAuth } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import BuildURLFriendly from "../functions/BuildURLFriendly";
import DeconstructURLFriendly from "../functions/DeconstructURLFriendly";
import GetProsAndSpecs from "../functions/GetProsAndSpecs";
import BuildTitle from "../functions/BuildTitle";

export default function Compare({
  type,
  Brands,
  Process,
  QueryProcess,
  QueryFunction,
  DirectQueryFunction,
  DefaultArray,
  Categories,
  amplitude,
  isMobile,
  prosIndex,
  comparisonLink,
}) {
  const [productModalVisible, setProductModalVisible] = useState(false);
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [savingComparison, setSavingComparison] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const [awaitingSavingComparison, setAwaitingSavingComparison] =
    useState(false);
  const [successfullySavedComparison, setSuccessfullySavedComparison] =
    useState(false);
  const [saveComparisonProcesses, setSaveComparisonProcesses] = useState([]);

  const [products, setProducts] = useState([]);
  const [pros, setPros] = useState([]);
  const [displayPros, setDisplayPros] = useState([]);

  const navigate = useNavigate();

  // Used for checking if user can use logged in features like saved comparison or preferences
  const auth = getAuth();
  const functions = getFunctions();

  // This returns an array that is just the base of the pros string array, It's just empty categories with \n
  const defaultProCategories = () => {
    const prosCategoriesTemp = [];

    // The pros will be organized to their respective categories
    for (let i = 0; i < Categories.length; i++) {
      prosCategoriesTemp.push(`${Categories[i]["Category"].toUpperCase()} \n`);
    }

    return prosCategoriesTemp;
  };

  // For SetTitleAndDescription
  const defaultTitle = `Compare ${type}`;
  const description = `Compare ${type} side by side. View pros of each product and research reliable information.`;

  useEffect(() => {
    // If at least 2 products
    if (pros.length >= 2) {
      // This array keeps track of the pros for each product
      const productPros = [];
      for (let item in pros) {
        productPros.push(defaultProCategories().slice());
      }

      // This is used to set the values of the pros. It's the base unedited version of each spec
      const referencePros = [];
      for (let item in DefaultArray) {
        if (DefaultArray[item].Important) {
          referencePros.push(DefaultArray[item].Value);
        }
      }

      // Iterate through each Important spec
      for (let item in pros[0]) {
        // If spec is a boolean type
        if (pros[0][item].Type == "B") {
          // Keeps track of first occurence of true value, and counts occurences
          // It's not actually the firstIndex if count is greater than 1
          let tracker = { firstIndex: null, count: 0 };
          // Iterate through all products and check this spec to find all true values
          for (let item1 in pros) {
            if (
              pros[item1][item].Value == "True" ||
              pros[item1][item].Value == "Yes"
            ) {
              // It's not actually the firstIndex if count is greater than 1
              tracker.firstIndex = item1;

              tracker.count++;
            }
          }
          // If only 1 occurence
          if (tracker.count == 1) {
            // Iterate through DefaultArray to find the Value, since for some reason, Value got changed to "True" and "False" in the pros array
            for (let matchingItem in DefaultArray) {
              // If the spec matches
              if (
                pros[0][item].Matching == DefaultArray[matchingItem].Matching
              ) {
                // Find the category index
                for (let categoryItem in Categories) {
                  if (
                    pros[0][item].Category == Categories[categoryItem].Category
                  ) {
                    // Add value to that products pros at this particular category
                    productPros[tracker.firstIndex][categoryItem] +=
                      DefaultArray[matchingItem].Value + "\n";
                    break;
                  }
                }

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
          for (let item1 in pros) {
            // The value
            let newNumber = pros[item1][item].Value;
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
          let totalBestValue = NaN;
          // Track the latest value that caused a change, if NaN, then 2 duplicates were found
          let lastBestValue = NaN;
          // The index of the product
          let bestIndex = NaN;
          // Iterate through all values that were saved for this spec

          for (let trackerItem in tracker.values) {
            // Save for readability
            const itemValue = tracker.values[trackerItem];
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
                  bestIndex = trackerItem;
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
                  bestIndex = trackerItem;
                } else if (totalBestValue == itemValue) {
                  // If duplicate, then record that to lastBestValue but don't change totalBestValue so we know what the highest value was
                  lastBestValue = NaN;
                  bestIndex = NaN;
                }
              }
            }
          }

          if (!isNaN(lastBestValue) && !isNaN(totalBestValue)) {
            const pro = pros[bestIndex][item];

            for (let categoryItem in Categories) {
              if (
                pro.Category == Categories[categoryItem].Category &&
                pro.Value != "--"
              ) {
                productPros[bestIndex][categoryItem] += `${referencePros[
                  item
                ].replace("--", pro.Value)} \n`;
                break;
              }
            }
          }
        }
      }

      const tempOriginalDefaultPros = defaultProCategories();
      const newDisplayPros = [];
      for (let productIndex in productPros) {
        let tempProductPros = "";

        for (let categoryIndex in tempOriginalDefaultPros) {
          if (
            productPros[productIndex][categoryIndex] !=
            tempOriginalDefaultPros[categoryIndex]
          ) {
            tempProductPros += productPros[productIndex][categoryIndex];
            tempProductPros += "\n";
          }
        }
        newDisplayPros.push(tempProductPros);
      }
      setDisplayPros(newDisplayPros);
    } else {
      setDisplayPros(["Add at least 2 items to view the pros"]);
    }

    if (pros.length == 0) {
      SetTitleAndDescription(defaultTitle, description);
    } else {
      // Update the title
      const newTitle = BuildTitle(saveComparisonProcesses, "Compare:");
      SetTitleAndDescription(newTitle, description);
    }
  }, [pros]);

  // Load presets from the link
  const loadPresets = async (presetURL) => {
    // Deconstruct the string into a process array
    const processes = DeconstructURLFriendly(presetURL);

    setSaveComparisonProcesses(processes);

    for (let processItem in processes) {
      // Directly get the product
      const result = await DirectQueryFunction(processes[processItem]);

      let parameterArray = [];

      // Deep Copy DefaultArray into parameterArray then we will use parameterArray from here on
      for (let i = 0; i < DefaultArray.length; i++) {
        const defaultArrayItem = DefaultArray[i];

        let newJSON = {};
        newJSON["Value"] = defaultArrayItem.Value;
        newJSON["Display"] = defaultArrayItem.Display;
        newJSON["Category"] = defaultArrayItem.Category;
        newJSON["Matching"] = defaultArrayItem.Matching;
        newJSON["Mandatory"] = defaultArrayItem.Mandatory;
        newJSON["Type"] = defaultArrayItem.Type;
        newJSON["Preference"] = defaultArrayItem.Preference;
        newJSON["Important"] = defaultArrayItem.Important;
        newJSON["HigherNumber"] = defaultArrayItem.HigherNumber;
        parameterArray.push(newJSON);
      }

      // returns [tempProsArray, tempNewProduct]
      // prettier-ignore
      const prosAndSpecs = GetProsAndSpecs(parameterArray, result, Categories);

      // prettier-ignore
      setPros((prevPros) => [...prevPros, prosAndSpecs[0]]);
      setProducts((prevProducts) => [...prevProducts, prosAndSpecs[1]]);
    }
  };

  useEffect(() => {
    amplitude.track("Comparison Screen", {
      Screen: type,
      Platform: isMobile ? "Mobile" : "Computer",
    });

    // URL of the page
    const fullURL = window.location.href;

    // Index of the prefix (/comparison/type/)
    const startIndex = fullURL.indexOf(comparisonLink);
    // The presets
    const presetsURL = fullURL.substring(startIndex + comparisonLink.length);

    // If greater than one, then there are presets
    if (presetsURL.length > 1) {
      loadPresets(presetsURL);
    } else {
      SetTitleAndDescription(defaultTitle, description);
    }
  }, []);

  const CallSaveComparisonCloudFunction = async () => {
    // The processes that get saved
    const arrayToSave = [];
    for (let item in saveComparisonProcesses) {
      arrayToSave.push(saveComparisonProcesses[item]);
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
      return error;
    }
  };

  const copyURLToClipboard = async (shareURL) => {
    // Create a temporary textarea element
    const textarea = document.createElement("textarea");
    textarea.value = shareURL;
    textarea.setAttribute("readonly", ""); // Prevent mobile devices from popping up the keyboard
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px"; // Move the textarea off-screen
    document.body.appendChild(textarea);

    // Select and copy the URL from the textarea
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length); // For mobile devices
    document.execCommand("copy");

    // Clean up: remove the textarea from the DOM
    document.body.removeChild(textarea);
  };

  return (
    <>
      <Navbar page="compare" isMobile={isMobile}></Navbar>
      {/* Main Body */}
      <div className="LargeContainer">
        <p style={{ fontSize: 25 }} className="HeaderText">
          {type} Comparison
        </p>

        {/* Top buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
            borderBottom: "1px solid darkGrey",
          }}
        >
          {/* Back to home */}
          <button
            onClick={() => {
              {
                /* Set page to home */
              }
              navigate("/home");

              setProducts([]);
              setSaveComparisonProcesses([]);
              setPros([]);
              setDisplayPros([]);
            }}
            className="CompareTopButton"
            style={
              isMobile
                ? { minWidth: "15%", fontSize: "12px", padding: "7px 15px" }
                : {}
            }
          >
            <p>{"< Back"}</p>
          </button>

          {/* Add a new product */}
          <button
            onClick={async () => {
              amplitude.track("Add Item");
              {
                /* Show product selection modal */
              }
              setProductModalVisible(true);
            }}
            className="CompareTopButton"
            style={
              isMobile
                ? { minWidth: "15%", fontSize: "12px", padding: "7px 15px" }
                : {}
            }
          >
            <p>Add</p>
          </button>

          {/* Save comparison */}
          <button
            onClick={async () => {
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
            className="CompareTopButton"
            style={
              isMobile
                ? { minWidth: "15%", fontSize: "12px", padding: "7px 15px" }
                : {}
            }
          >
            <p>Save</p>
          </button>

          {/* Share comparison */}
          <button
            onClick={async () => {
              const presetsURL = BuildURLFriendly(saveComparisonProcesses);

              // The full URL
              const shareURL = comparisonLink + presetsURL;

              // Copy to user's clipboard
              copyURLToClipboard(shareURL);
              // Tell user copying to clipboard was successful
              setCopiedLink(true);
              amplitude.track("Share", { type: type });
            }}
            className="CompareTopButton"
            style={
              isMobile
                ? {
                    minWidth: "10%",
                    fontSize: "12px",
                    paddingTop: "7px",
                    paddingBottom: "7px",
                    backgroundColor: "#169928",
                  }
                : { backgroundColor: "#169928" }
            }
          >
            <p>Share</p>
          </button>

          {/* Reset specs to just the categories and processes to empty array */}
          <button
            onClick={async () => {
              amplitude.track("Reset", {
                Category: type,
              });

              setProducts([]);
              setSaveComparisonProcesses([]);
              setPros([]);
              setDisplayPros([]);
            }}
            className="DangerButton"
            style={
              isMobile
                ? {
                    minWidth: "10%",
                    fontSize: "12px",
                    paddingTop: "7px",
                    paddingBottom: "7px",
                    marginLeft: "5px",
                    paddingRight: "16px",
                  }
                : { marginLeft: "5px" }
            }
          >
            <p>Reset</p>
          </button>
        </div>

        {/* For each product, show a column */}
        {/* For each category, show a row */}
        {products.length == 0 ? (
          <div style={{ height: "400px" }}>
            <h2 className="SimpleText">Click "Add" to get started</h2>
          </div>
        ) : (
          <div
            className="ComparisonTable"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${products.length}, ${
                isMobile ? "150px" : "250px"
              })`,
              gridTemplateRows: `repeat(${Categories.length}, auto)`,
              gridAutoFlow: "column",
            }}
          >
            {/* Create a div for each category in each product, but don't create a div for each product */}
            {/* This way, it won't put everything on the first row */}
            {products.flatMap((product, productIndex) =>
              product.map((category, categoryIndex) =>
                categoryIndex != prosIndex ? (
                  // If not the pros index
                  categoryIndex != 0 ? (
                    // If not the first row
                    <div
                      key={`${productIndex}-${categoryIndex}`}
                      className="ComparisonCell"
                    >
                      <p
                        className="ComparisonRowName"
                        style={{ fontSize: isMobile ? "13px" : "15px" }}
                      >
                        {category.Category}
                      </p>

                      <div
                        className="ComparisonRowValue"
                        style={{ fontSize: isMobile ? "13px" : "15px" }}
                      >
                        {[]
                          .concat(category.Values)
                          .map((rowValue, rowIndex) => (
                            <p key={rowIndex}>{rowValue}</p>
                          ))}
                      </div>
                    </div>
                  ) : (
                    // If it is the first row
                    <div key={`${productIndex}-${categoryIndex}`}>
                      <button
                        className="DangerButton"
                        style={{ width: "100%" }}
                        onClick={() => {
                          // Remove from the products array
                          const newSpecsArray = products.filter(
                            (subArray) => products[productIndex] !== subArray
                          );
                          setProducts(newSpecsArray);

                          const newComparisonProcessArray =
                            saveComparisonProcesses.filter(
                              (subArray) =>
                                saveComparisonProcesses[productIndex] !==
                                subArray
                            );
                          setSaveComparisonProcesses(newComparisonProcessArray);

                          // Remove from the pros array
                          const newPros = pros.filter(
                            (subArray) => pros[productIndex] !== subArray
                          );
                          setPros(newPros);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )
                ) : (
                  // If it is the pro index
                  <div
                    key={`${productIndex}-${categoryIndex}`}
                    className="ProCell"
                  >
                    <p
                      className="ComparisonRowName"
                      style={{ fontSize: isMobile ? "13px" : "15px" }}
                    >
                      Pros
                    </p>

                    <div
                      className="ComparisonRowValue"
                      style={{ fontSize: isMobile ? "13px" : "15px" }}
                    >
                      {[].concat(category.Values).map((rowValue, rowIndex) => (
                        <p key={rowIndex}>{displayPros[productIndex]}</p>
                      ))}
                    </div>
                  </div>
                )
              )
            )}
          </div>
        )}
      </div>

      <Footer amplitude={amplitude} isMobile={isMobile} />

      {/* Shows up if user needs to be logged in to complete action */}
      <Modal
        isOpen={accountModalVisible}
        contentLabel="Account Sign Up or Log In"
        className={"ModalContainer"}
        overlayClassName={"ModalOverlay"}
      >
        <WebAccountHandler
          screenType={"modal"}
          setModaldiv={setAccountModalVisible}
        ></WebAccountHandler>
        <button
          className="NormalButtonNoBackground"
          onClick={() => {
            setAccountModalVisible(false);
          }}
        >
          <p>Cancel</p>
        </button>
      </Modal>

      {/* Display status of saving comparison */}
      <Modal
        isOpen={savingComparison}
        contentLabel="Saving comparison"
        className={"ModalContainer"}
        overlayClassName={"ModalOverlay"}
      >
        <p className="HeaderText">Save Comparison</p>
        {awaitingSavingComparison ? (
          <div
            className="ActivityIndicator"
            style={{ marginTop: 30, marginBottom: 30 }}
          ></div>
        ) : (
          <div
            className="ModalButtonSection"
            style={{ marginBottom: 30, display: "flex", alignItems: "center" }}
          >
            {successfullySavedComparison ? (
              <p className="SuccessText">Succesfully saved this comparison.</p>
            ) : (
              <p className="ErrorText">
                Saving this comparison was unsuccessful, try again later.
              </p>
            )}
            {/* Okay Button */}
            <button
              className="NormalButton"
              onClick={() => {
                setSavingComparison(false);
              }}
              style={{ width: "50%" }}
            >
              Okay
            </button>
          </div>
        )}
      </Modal>

      {/* Shows up when user is selecting a new product */}
      <Modal
        isOpen={productModalVisible}
        contentLabel="Select a product to compare"
        className={"ModalContainer"}
        overlayClassName={"ModalOverlay"}
      >
        <SelectionModal
          type={type}
          setProductModalVisible={setProductModalVisible}
          brands={Brands}
          queryFunction={QueryFunction}
          queryProcess={QueryProcess}
          process={Process}
          defaultArray={DefaultArray}
          categories={Categories}
          setPros={setPros}
          setProducts={setProducts}
          setSaveComparisonProcesses={setSaveComparisonProcesses}
          amplitude={amplitude}
        ></SelectionModal>
      </Modal>

      {/* Shows up when user clicks the share button */}
      <Modal
        isOpen={copiedLink}
        contentLabel="Copied link to clipboard"
        className={"ModalContainer"}
        overlayClassName={"ModalOverlay"}
      >
        <p className="HeaderText">Share Comparison</p>
        <div
          className="ModalButtonSection"
          style={{ marginBottom: 30, display: "flex", alignItems: "center" }}
        >
          <p className="SuccessText">
            Successfully copied link to your clipboard
          </p>
        </div>

        <button
          className="NormalButtonNoBackground"
          onClick={() => {
            setCopiedLink(false);
          }}
        >
          <p>Ok</p>
        </button>
      </Modal>
    </>
  );
}
