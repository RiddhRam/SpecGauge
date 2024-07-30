import { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";

import { Navbar } from "../components/Navbar";
import SetTitleAndDescription from "../functions/SetTitleAndDescription";

const SelectionModal = lazy(() => import("../components/SelectionModal"));
const WebAccountHandler = lazy(() => import("../components/WebAccountHandler"));

import { logEvent } from "firebase/analytics";
import { httpsCallable } from "firebase/functions";
import { auth, analytics, functions } from "../firebaseConfig";
import SetCanonical from "../functions/SetCanonical";

Modal.setAppElement("#SpecGauge");

export default function Compare({
  type,
  isMobile,
  QueryFunction,
  DirectQueryFunction,
  comparisonLink,
  description,
  defaultTitle,
}) {
  // Initialized in useEffect
  const [Process, setProcess] = useState(null);
  const [QueryProcess, setQueryProcess] = useState(null);
  const [Categories, setCategories] = useState(null);
  const [Brands, setBrands] = useState(null);
  const [DefaultArray, setDefaultArray] = useState(null);

  const [productModalVisible, setProductModalVisible] = useState(false);
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [savingComparison, setSavingComparison] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const [beginLoadingPresets, setBeginLoadingPresets] = useState(false);

  const [awaitingSavingComparison, setAwaitingSavingComparison] =
    useState(false);
  const [successfullySavedComparison, setSuccessfullySavedComparison] =
    useState(false);
  const [saveComparisonProcesses, setSaveComparisonProcesses] = useState([]);

  const [products, setProducts] = useState([]);
  const [pros, setPros] = useState([]);
  const [displayPros, setDisplayPros] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    updateTypeData();
    if (analytics != null) {
      logEvent(analytics, "Screen", {
        Screen: type,
        Platform: isMobile ? "Mobile" : "Computer",
        Tool: "Comparison",
      });
    }
  }, []);

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
      SetTitleAndDescription(defaultTitle, description, window.location.href);
    } else {
      import("../functions/BuildTitle").then((module) => {
        // Update the title
        const newTitle = module.default(saveComparisonProcesses, "Compare:");
        SetTitleAndDescription(newTitle, description, window.location.href);
      });
    }
  }, [pros]);

  useEffect(() => {
    updateTypeData();
    // URL of the page
    const fullURL = window.location.href;

    // Index of the prefix (/comparison/type/)
    const startIndex = fullURL.indexOf(comparisonLink);

    // The presets
    const presetsURL = fullURL.substring(startIndex + comparisonLink.length);

    // Have to manually reset, in case user uses navigation buttons to switch to another compare page
    setProducts([]);
    setSaveComparisonProcesses([]);
    setPros([]);
    setDisplayPros([]);

    SetCanonical(comparisonLink);

    // If greater than one, then there are presets
    if (presetsURL.length > 1) {
      setBeginLoadingPresets(true);
    } else {
      SetTitleAndDescription(defaultTitle, description, window.location.href);
    }
  }, [type]);

  useEffect(() => {
    if (beginLoadingPresets && QueryProcess) {
      // URL of the page
      const fullURL = window.location.href;

      // Index of the prefix (/comparison/type/)
      const startIndex = fullURL.indexOf(comparisonLink);
      // The presets
      const presetsURL = fullURL.substring(startIndex + comparisonLink.length);

      loadPresets(presetsURL);
      setBeginLoadingPresets(false);
    }
  }, [beginLoadingPresets, QueryProcess]);

  const updateTypeData = async () => {
    // LAZY IMPORT INCEPTION
    // Import PakoInflate, then import type data
    import("../functions/PakoInflate").then((module) => {
      const PakoInflate = module.default;
      if (type == "Vehicles") {
        import("../data/carsData").then((module) => {
          const typeDataFunc = module.carsData;

          const typeData = typeDataFunc();

          setProcess(typeData[0]);
          setQueryProcess(typeData[1]);
          // Decompressed (inflated) String Values into JSON values
          setBrands(JSON.parse(PakoInflate(typeData[2])));
          setDefaultArray(JSON.parse(PakoInflate(typeData[3])));
          setCategories(typeData[4]);
        });
      } else if (type == "Consoles") {
        import("../data/consolesData").then((module) => {
          const typeData = module.consolesData();

          setProcess(typeData[0]);
          setQueryProcess(typeData[1]);
          // Decompressed (inflated) String Values into JSON values
          setBrands(JSON.parse(PakoInflate(typeData[2])));
          setDefaultArray(JSON.parse(PakoInflate(typeData[3])));
          setCategories(typeData[4]);
        });
      } else if (type == "CPUs") {
        import("../data/cpusData").then((module) => {
          const typeData = module.cpusData();

          setProcess(typeData[0]);
          setQueryProcess(typeData[1]);
          // Decompressed (inflated) String Values into JSON values
          setBrands(JSON.parse(PakoInflate(typeData[2])));
          setDefaultArray(JSON.parse(PakoInflate(typeData[3])));
          setCategories(typeData[4]);
        });
      } else if (type == "Graphics Cards") {
        import("../data/graphicsCardsData").then((module) => {
          const typeData = module.graphicsCardsData();

          setProcess(typeData[0]);
          setQueryProcess(typeData[1]);
          // Decompressed (inflated) String Values into JSON values
          setBrands(JSON.parse(PakoInflate(typeData[2])));
          setDefaultArray(JSON.parse(PakoInflate(typeData[3])));
          setCategories(typeData[4]);
        });
      } else {
        import("../data/dronesData").then((module) => {
          const typeData = module.dronesData();

          setProcess(typeData[0]);
          setQueryProcess(typeData[1]);
          // Decompressed (inflated) String Values into JSON values
          setBrands(JSON.parse(PakoInflate(typeData[2])));
          setDefaultArray(JSON.parse(PakoInflate(typeData[3])));
          setCategories(typeData[4]);
        });
      }
    });
  };

  // This returns an array that is just the base of the pros string array, It's just empty categories with \n
  const defaultProCategories = () => {
    const prosCategoriesTemp = [];

    // The pros will be organized to their respective categories
    for (let i = 0; i < Categories.length; i++) {
      prosCategoriesTemp.push(`${Categories[i]["Category"].toUpperCase()} \n`);
    }

    return prosCategoriesTemp;
  };

  // Load presets from the link
  const loadPresets = async (presetURL) => {
    let processes = [];
    // Lazy import this, becaues it includes pako
    await import("../functions/DeconstructURLFriendlyCompare").then(
      (module) => {
        // Deconstruct the string into a process array
        processes = module.default(presetURL, Brands);
      }
    );

    if (processes[0].length == QueryProcess.length) {
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

        let prosAndSpecs = null;
        // prettier-ignore
        await import("../functions/GetProsAndSpecs").then(
          (module) => {
            // Deconstruct the string into a process array
            prosAndSpecs = module.default(parameterArray, result, Categories);
          }
        );

        // prettier-ignore
        setPros((prevPros) => [...prevPros, prosAndSpecs[0]]);
        setProducts((prevProducts) => [...prevProducts, prosAndSpecs[1]]);
      }

      if (analytics != null) {
        logEvent(analytics, "Load Comparison Presets", {
          Processes: processes,
          Type: type,
        });
      }
    }
  };

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

  return (
    <>
      <Navbar isMobile={isMobile}></Navbar>
      {/* Main Body */}
      <div className="LargeContainer">
        <p style={{ fontSize: 20 }} className="HeaderText">
          {type} Comparison
        </p>

        {/* Top buttons */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(5, 1fr)`,
            gridTemplateRows: `65px`,
            borderBottom: "1px solid darkGrey",
            paddingBottom: "10px",
            paddingLeft: "10px",
            paddingRight: "10px",
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
                ? {
                    fontSize: "13px",
                  }
                : {}
            }
          >
            <p>{"< Back"}</p>
          </button>

          {/* Add a new product */}
          <button
            onClick={async () => {
              if (analytics != null) {
                logEvent(analytics, "Add Comparison Item", { Category: type });
              }
              {
                /* Show product selection modal */
              }
              setProductModalVisible(true);
            }}
            className="CompareTopButton"
            style={
              isMobile
                ? {
                    fontSize: "13px",
                  }
                : {}
            }
          >
            <p>Add</p>
          </button>

          {/* Save comparison */}
          <button
            onClick={async () => {
              if (analytics != null) {
                logEvent(analytics, "Save Comparison", {
                  Category: type,
                });
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
                setAccountModalVisible(true);
              }
            }}
            className="CompareTopButton"
            style={
              isMobile
                ? {
                    fontSize: "13px",
                  }
                : {}
            }
          >
            <p>Save</p>
          </button>

          {/* Share comparison */}
          <button
            onClick={async () => {
              let presetsURL = "";

              // Lazy import this, becaues it includes pako
              await import("../functions/BuildURLFriendlyCompare").then(
                (module) => {
                  // Construct the process array into a string
                  presetsURL = module.default(saveComparisonProcesses, Brands);
                }
              );

              // The full URL
              const shareURL = comparisonLink + presetsURL;

              // Copy to user's clipboard
              await import("../functions/copyToClipboard").then((module) => {
                // Construct the process array into a string
                module.default(shareURL);
              });

              // Tell user copying to clipboard was successful
              setCopiedLink(true);
              if (analytics != null) {
                logEvent(analytics, "Share Comparison", { Type: type });
              }
            }}
            className="ShareTopButton"
            style={
              isMobile
                ? {
                    fontSize: "13px",
                  }
                : {}
            }
          >
            <p>Share</p>
          </button>

          {/* Reset specs to just the categories and processes to empty array */}
          <button
            onClick={async () => {
              if (analytics != null) {
                logEvent(analytics, "Reset Comparison", {
                  Category: type,
                });
              }

              setProducts([]);
              setSaveComparisonProcesses([]);
              setPros([]);
              setDisplayPros([]);
            }}
            className="ResetTopButton"
            style={
              isMobile
                ? {
                    fontSize: "13px",
                  }
                : {}
            }
          >
            <p>Reset</p>
          </button>
        </div>

        {/* For each product, show a column */}
        {/* For each category, show a row */}
        {products.length == 0 ? (
          <div style={{ height: "400px" }}>
            <h2 className="SimpleText" style={{ fontSize: "20px" }}>
              Click "Add" to get started
            </h2>
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
                categoryIndex != 2 ? (
                  // If not the pros index
                  categoryIndex != 0 ? (
                    // If not the second row
                    categoryIndex != 1 ? (
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
                      <p
                        className="SimpleText"
                        key={`${productIndex}-${categoryIndex}`}
                      >
                        {saveComparisonProcesses[productIndex][0] +
                          " " +
                          saveComparisonProcesses[productIndex][
                            saveComparisonProcesses[productIndex].length - 1
                          ]}
                      </p>
                    )
                  ) : (
                    // If it is the second row
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

      {/* Shows up if user needs to be logged in to complete action */}
      <Modal
        isOpen={accountModalVisible}
        contentLabel="Account Sign Up or Log In"
        className={"ModalContainer"}
        overlayClassName={"ModalOverlay"}
      >
        <Suspense
          fallback={
            <div className="ActivityIndicator" style={{ margin: "50px" }}></div>
          }
        >
          <WebAccountHandler
            screenType={"modal"}
            setModaldiv={setAccountModalVisible}
          ></WebAccountHandler>
        </Suspense>

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
        <Suspense
          fallback={
            <div className="ActivityIndicator" style={{ margin: "50px" }}></div>
          }
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
          ></SelectionModal>
        </Suspense>
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
          <p>Okay</p>
        </button>
      </Modal>
    </>
  );
}
