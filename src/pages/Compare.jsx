import { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";

import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import SetTitleAndDescription from "../functions/SetTitleAndDescription";
const CompareSelectionModal = lazy(() =>
  import("../components/CompareSelectionModal")
);
const WebAccountHandlerModal = lazy(() =>
  import("../components/WebAccountHandlerModal")
);
const CompareDisplaySavingComparisonModal = lazy(() =>
  import("../components/CompareDisplaySavingComparisonModal")
);
const SimpleSuccessModal = lazy(() =>
  import("../components/SimpleSuccessModal")
);

import { logEvent } from "firebase/analytics";
import { auth, analytics } from "../firebaseConfig";
import SetCanonical from "../functions/SetCanonical";

export default function Compare({
  type,
  isMobile,
  comparisonLink,
  description,
  defaultTitle,
}) {
  // Initialized in useEffect
  const [QueryProcess, setQueryProcess] = useState([]);
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
                pro.Value.indexOf("--") == -1
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

      // iterate through the pros of each product
      for (let productIndex in productPros) {
        const newJSONs = [];

        for (let categoryIndex in tempOriginalDefaultPros) {
          let tempProductPros = "";
          const productProsString = productPros[productIndex][categoryIndex];
          if (productProsString != tempOriginalDefaultPros[categoryIndex]) {
            const newJSON = {};
            // Save the category name
            newJSON["Category"] = tempOriginalDefaultPros[categoryIndex];

            // These are the pros of the product to display
            const splitIndex = productProsString.indexOf("\n");
            const prosOnlyString = productProsString.slice(splitIndex + 1);

            tempProductPros += prosOnlyString + "\n";

            newJSON["Pros"] = tempProductPros;
            newJSONs.push(newJSON);
          }
        }
        newDisplayPros.push(newJSONs);
      }
      setDisplayPros(newDisplayPros);
    } else {
      setDisplayPros(["Add at least 2 items to view the pros"]);
    }

    if (pros.length == 0) {
      SetTitleAndDescription(defaultTitle, description, window.location.href);
    } else {
      import("../functions/BuildTitleCompare").then((module) => {
        // Update the title
        const newTitle = module.default(saveComparisonProcesses);
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
    if (beginLoadingPresets && QueryProcess.length != 0) {
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
    import("../functions/PakoInflate").then(async (module) => {
      const PakoInflate = module.default;
      if (type == "Vehicles") {
        await import("../data/carsData").then((module) => {
          const typeDataFunc = module.carsData;

          const typeData = typeDataFunc();

          setQueryProcess(typeData[0]);
          // Decompressed (inflated) String Values into JSON values
          setBrands(JSON.parse(PakoInflate(typeData[1])));
          setDefaultArray(JSON.parse(PakoInflate(typeData[2])));
          setCategories(typeData[3]);
        });
      } else if (type == "CPUs") {
        await import("../data/cpusData").then((module) => {
          const typeData = module.cpusData();

          setQueryProcess(typeData[0]);
          // Decompressed (inflated) String Values into JSON values
          setBrands(JSON.parse(PakoInflate(typeData[1])));
          setDefaultArray(JSON.parse(PakoInflate(typeData[2])));
          setCategories(typeData[3]);
        });
      } else if (type == "Graphics Cards") {
        await import("../data/graphicsCardsData").then((module) => {
          const typeData = module.graphicsCardsData();

          setQueryProcess(typeData[0]);
          // Decompressed (inflated) String Values into JSON values
          setBrands(JSON.parse(PakoInflate(typeData[1])));
          setDefaultArray(JSON.parse(PakoInflate(typeData[2])));
          setCategories(typeData[3]);
        });
      } else {
        await import("../data/dronesData").then((module) => {
          const typeData = module.dronesData();

          setQueryProcess(typeData[0]);
          // Decompressed (inflated) String Values into JSON values
          setBrands(JSON.parse(PakoInflate(typeData[1])));
          setDefaultArray(JSON.parse(PakoInflate(typeData[2])));
          setCategories(typeData[3]);
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
        processes = module.default(presetURL, QueryProcess);
      }
    );

    if (Object.keys(processes[0]).length == QueryProcess.length) {
      for (let processItem in processes) {
        let result = null;
        // Lazy import the right DirectQueryFunction and use it
        if (type == "Vehicles") {
          await import("../functions/DirectQueryAutomobilesFunction").then(
            async (module) => {
              // Directly get the product
              result = await module.default(processes[processItem]);
            }
          );
        } else if (type == "CPUs") {
          await import("../functions/DirectQueryCPUsFunction").then(
            async (module) => {
              // Directly get the product
              result = await module.default(processes[processItem]);
            }
          );
        } else if (type == "Graphics Cards") {
          await import("../functions/DirectQueryGraphicsCardsFunction").then(
            async (module) => {
              // Directly get the product
              result = await module.default(processes[processItem]);
            }
          );
        } else {
          await import("../functions/DirectQueryDronesFunction").then(
            async (module) => {
              // Directly get the product
              result = await module.default(processes[processItem]);
            }
          );
        }

        const properProcess = [];

        for (let item in QueryProcess) {
          properProcess.push(processes[processItem][QueryProcess[item]]);
        }

        setSaveComparisonProcesses((prevProcesses) => [
          ...prevProcesses,
          properProcess,
        ]);

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
      name: comparisonName.replace("/", "%20"),
      processes: arrayToSave,
    };

    try {
      let WriteSavedComparisons = null;
      await import("../functions/LazyLoadGetFunctions").then((module) => {
        // Update the title
        const getFunctions = module.getFunctions;
        const httpsCallable = module.httpsCallable;

        const functions = getFunctions();
        WriteSavedComparisons = httpsCallable(
          functions,
          "WriteSavedComparisons"
        );
      });

      const result = await WriteSavedComparisons(comparison);
      return result.data;
    } catch (error) {
      return error;
    }
  };

  return (
    <div
      // Scroll to the top when page loads
      onLoad={() => {
        window.scrollTo(0, 0);
      }}
    >
      <Navbar isMobile={isMobile}></Navbar>
      {/* Main Body */}
      <div className="LargeContainer">
        <p style={{ fontSize: 20 }} className="HeaderText">
          {type} Side-By-Side Comparison
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
              product.map((category, categoryIndex) => (
                <>
                  {/* If it is the remove button index */}
                  {categoryIndex == 0 && (
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
                  )}

                  {/* If it is the pro index */}
                  {categoryIndex == 2 && (
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

                      {displayPros.length >= 2 ? (
                        <div
                          className="ComparisonRowValue"
                          style={{ fontSize: isMobile ? "13px" : "15px" }}
                        >
                          {[]
                            .concat(category.Values)
                            .map((rowValue, rowIndex) => (
                              <div key={rowIndex}>
                                {[].concat(displayPros[productIndex]).map(
                                  (proCategory, proCategoryIndex) =>
                                    displayPros[productIndex] != undefined && (
                                      <div key={proCategoryIndex}>
                                        <p
                                          style={{
                                            fontSize: isMobile
                                              ? "15px"
                                              : "18px",
                                            fontWeight: "bold",
                                            color: "#39ff14",
                                          }}
                                        >
                                          {
                                            displayPros[productIndex][
                                              proCategoryIndex
                                            ]["Category"]
                                          }
                                        </p>
                                        <p>
                                          {
                                            displayPros[productIndex][
                                              proCategoryIndex
                                            ]["Pros"]
                                          }
                                        </p>
                                      </div>
                                    )
                                )}
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div
                          className="ComparisonRowValue"
                          style={{
                            fontSize: isMobile ? "15px" : "18px",
                            fontWeight: "bold",
                            color: "#39ff14",
                            textAlign: "center",
                          }}
                        >
                          Add at least 2 items to view the pros
                        </div>
                      )}
                    </div>
                  )}

                  {/* If it is the name index */}
                  {categoryIndex == 1 && (
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
                  )}

                  {/* Must be a normal cell */}
                  {categoryIndex != 0 &&
                    categoryIndex != 1 &&
                    categoryIndex != 2 && (
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

                        <div className="ComparisonRowValue">
                          {[]
                            .concat(category.Values)
                            .map((rowValue, rowIndex) => (
                              <div key={rowIndex}>
                                {rowValue.includes(":") &&
                                category.Values.length != 1 ? (
                                  <div style={{ margin: "30px 0" }}>
                                    <p
                                      style={{
                                        fontSize: isMobile ? "15px" : "18px",
                                        fontWeight: "bold",
                                        color: "#4ca0d7",
                                      }}
                                    >
                                      {rowValue.split(":")[0].trim()}
                                    </p>
                                    <p
                                      style={{
                                        textAlign: "left",
                                        fontSize: isMobile ? "13px" : "15px",
                                      }}
                                    >
                                      {rowValue.split(":")[1].trim()}
                                    </p>
                                  </div>
                                ) : (
                                  <p
                                    style={{
                                      fontSize: isMobile ? "14px" : "17px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {rowValue}
                                  </p>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                </>
              ))
            )}
          </div>
        )}
      </div>

      <Footer isMobile={isMobile}></Footer>

      {/* Shows up if user needs to be logged in to complete action */}
      {accountModalVisible ? (
        <Suspense
          fallback={
            <div className="ActivityIndicator" style={{ margin: "50px" }}></div>
          }
        >
          <WebAccountHandlerModal
            accountModalVisible={accountModalVisible}
            setAccountModalVisible={setAccountModalVisible}
          ></WebAccountHandlerModal>
        </Suspense>
      ) : (
        <></>
      )}

      {/* Display status of saving comparison */}
      {savingComparison ? (
        <Suspense
          fallback={
            <div className="ActivityIndicator" style={{ margin: "50px" }}></div>
          }
        >
          <CompareDisplaySavingComparisonModal
            awaitingSavingComparison={awaitingSavingComparison}
            successfullySavedComparison={successfullySavedComparison}
            setSavingComparison={setSavingComparison}
            savingComparison={savingComparison}
          />
        </Suspense>
      ) : (
        <></>
      )}

      {/* Shows up when user is selecting a new product */}
      {productModalVisible ? (
        <Suspense
          fallback={
            <div className="ActivityIndicator" style={{ margin: "50px" }}></div>
          }
        >
          <CompareSelectionModal
            type={type}
            setProductModalVisible={setProductModalVisible}
            brands={Brands}
            queryProcess={QueryProcess}
            defaultArray={DefaultArray}
            categories={Categories}
            setPros={setPros}
            setProducts={setProducts}
            setSaveComparisonProcesses={setSaveComparisonProcesses}
            productModalVisible={productModalVisible}
          />
        </Suspense>
      ) : (
        <></>
      )}

      {/* Shows up when user clicks the share button */}
      {copiedLink ? (
        <Suspense
          fallback={
            <div className="ActivityIndicator" style={{ margin: "50px" }}></div>
          }
        >
          <SimpleSuccessModal
            title={"Share Comparison"}
            message={"Successfully copied link to your clipboard"}
            setModalVisible={setCopiedLink}
            modalVisible={copiedLink}
          ></SimpleSuccessModal>
        </Suspense>
      ) : (
        <></>
      )}
    </div>
  );
}
