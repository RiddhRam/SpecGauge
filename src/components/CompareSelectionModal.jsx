import { useState, useEffect, useRef } from "react";
import GetProsAndSpecs from "../functions/GetProsAndSpecs";
import { logEvent } from "firebase/analytics";
import { analytics } from "../firebaseConfig";

import Modal from "react-modal";
Modal.setAppElement("#SpecGauge");

export default function CompareSelectionModal({
  type,
  setProductModalVisible,
  brands,
  queryProcess,
  defaultArray,
  categories,
  setPros,
  setProducts,
  setSaveComparisonProcesses,
  productModalVisible,
}) {
  // Current step that the modal is displaying
  const [step, setStep] = useState(0);
  // All the specs that were retrieved from cloudflare, these are requested after the last step
  const [requestedSpecs, setRequestedSpecs] = useState([]);
  // The values selected by the user using the <select> elemnt instead of the search bar
  const [tempSaveProcesses, setTempSaveProcesses] = useState(() =>
    new Array(queryProcess.length).fill("")
  );

  // For the search input
  const [searchString, setSearchString] = useState("");
  const [matchingProducts, setMatchingProducts] = useState([]);
  const [searching, setSearching] = useState(false);

  const searchBar = useRef(null);

  useEffect(() => {
    if (searchString == "") {
      setSearchString("");
      setSearching(false);
      setMatchingProducts([]);
      return;
    }
    setSearching(true);

    const flattenedBrands = brands.flat();
    const tempMatchingProducts = [];

    // Loop through all products
    productLoop: for (let productIndex in flattenedBrands) {
      const productItem = flattenedBrands[productIndex];
      let lowerCaseName = "";
      let normalName = "";

      for (let processIndex in productItem) {
        const processItem = productItem[processIndex].toLowerCase();
        lowerCaseName += processItem + " ";
        normalName += productItem[processIndex] + " ";
      }

      const searchTerms = searchString.split(" ");

      for (let searchTermIndex in searchTerms) {
        // prettier-ignore
        if (!lowerCaseName.includes(searchTerms[searchTermIndex].toLowerCase())) {
          continue productLoop;
          // I want to go to next loop of the outer for loop
        }
      }

      tempMatchingProducts.push([normalName, productItem]);
    }
    setSearchString(searchString);

    const displayResults = tempMatchingProducts.slice(0, 7);
    if (analytics != null) {
      if (displayResults.length == 0) {
        logEvent(analytics, "No Results Found", {
          Type: type,
          Tool: "Comparison",
          Search: searchString,
        });
      }
    }

    setMatchingProducts(displayResults);
  }, [searchString]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchBar.current && !searchBar.current.contains(event.target)) {
        setSearching(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchBar]);

  {
    /* CLAUDE DID THIS ENTIRELY */
  }
  const checkKeysMatch = (processIndex, brand) => {
    for (let i = 0; i < processIndex; i++) {
      if (brand[queryProcess[i]] !== tempSaveProcesses[i]) {
        return false;
      }
    }
    return true;
  };

  {
    /* CLAUDE DID THIS ENTIRELY*/
  }
  const alphanumericSort = (a, b) => {
    const regex = /(\d+)|(\D+)/g;
    const aElements = a.match(regex);
    const bElements = b.match(regex);

    for (let i = 0; i < Math.min(aElements.length, bElements.length); i++) {
      if (aElements[i] !== bElements[i]) {
        const aNum = parseInt(aElements[i], 10);
        const bNum = parseInt(bElements[i], 10);

        if (!isNaN(aNum) && !isNaN(bNum)) {
          return aNum - bNum;
        } else {
          return aElements[i].localeCompare(bElements[i]);
        }
      }
    }

    return aElements.length - bElements.length;
  };

  const addNewProduct = async (productToAdd) => {
    let result = null;

    // Lazy import the right DirectQueryFunction and use it
    if (type == "Vehicles") {
      await import("../functions/DirectQueryAutomobilesFunction").then(
        async (module) => {
          // Directly get the product
          result = await module.default(productToAdd);
        }
      );
    } else if (type == "CPUs") {
      await import("../functions/DirectQueryCPUsFunction").then(
        async (module) => {
          // Directly get the product
          result = await module.default(productToAdd);
        }
      );
    } else if (type == "Graphics Cards") {
      await import("../functions/DirectQueryGraphicsCardsFunction").then(
        async (module) => {
          // Directly get the product
          result = await module.default(productToAdd);
        }
      );
    } else {
      await import("../functions/DirectQueryDronesFunction").then(
        async (module) => {
          // Directly get the product
          result = await module.default(productToAdd);
        }
      );
    }

    const properProcess = [];

    for (let item in queryProcess) {
      properProcess.push(productToAdd[queryProcess[item]]);
    }

    setSaveComparisonProcesses((prevProcesses) => [
      ...prevProcesses,
      properProcess,
    ]);

    let parameterArray = [];

    // Deep Copy defaultArray into parameterArray then we will pass it into GetProsAndSpecs
    for (let i = 0; i < defaultArray.length; i++) {
      const defaultArrayItem = defaultArray[i];

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

    // prettier-ignore
    const prosAndSpecs = GetProsAndSpecs(parameterArray, result, categories);

    // prettier-ignore
    setPros((prevPros) => [...prevPros, prosAndSpecs[0]]);
    setProducts((prevProducts) => [...prevProducts, prosAndSpecs[1]]);

    // Reset the modal
    setStep(0);
    setTempSaveProcesses([]);
    setSearchString("");
    setMatchingProducts([]);
    setSearching(false);
    setProductModalVisible(false);
  };

  return (
    <Modal
      isOpen={productModalVisible}
      contentLabel="Select a product to compare"
      className={"ModalContainer"}
      overlayClassName={"ModalOverlay"}
    >
      {queryProcess && (
        <>
          {/* Brands */}
          <p className="HeaderText">Select a {type.slice(0, -1)}</p>
          <div style={{ position: "relative" }} ref={searchBar}>
            <input
              type="text"
              value={searchString}
              className="TextInput"
              placeholder="TYPE TO SEARCH"
              onChange={(text) => setSearchString(text.target.value)}
              style={{ margin: "15px 0" }}
            ></input>

            {/* search results */}
            {searching ? (
              <div className="SearchResultBox">
                {/* At least 1 result */}
                {matchingProducts.length > 0 &&
                  matchingProducts.map((product, index) => (
                    <div
                      key={index}
                      className="SearchResult"
                      onClick={() => {
                        addNewProduct(product[1]);
                        if (analytics != null) {
                          logEvent(analytics, "Search Bar Click", {
                            Type: type,
                            Tool: "Comparison",
                            Clicked: product[0],
                          });
                        }
                      }}
                    >
                      {product[0]}
                    </div>
                  ))}
                {matchingProducts.length == 7 && (
                  <div
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      zIndex: 10000,
                    }}
                  >
                    Showing Top 7 Results
                  </div>
                )}
                {matchingProducts.length == 0 && (
                  <div
                    style={{
                      padding: "10px",
                      textAlign: "left",
                      zIndex: 10000,
                    }}
                  >
                    No Results Found
                  </div>
                )}
              </div>
            ) : (
              <></>
            )}
          </div>

          <p className="SimpleText" style={{ fontSize: "14px" }}>
            OR SELECT
          </p>
          {brands == null ? (
            <div
              className="ActivityIndicator"
              style={{ marginTop: 30, marginBottom: 30 }}
            ></div>
          ) : (
            <div className="ModalButtonSection">
              {queryProcess.map((processItem, processIndex) => (
                <select
                  key={processIndex}
                  className="SelectABrandOptions"
                  onChange={(event) => {
                    const newValue = event.target.value;

                    // Update save processes
                    const tempSaveProcessCopy = tempSaveProcesses.slice();
                    tempSaveProcessCopy[processIndex] = newValue;

                    // Change any values after this point to "" since they need to be re selected
                    for (let item in tempSaveProcessCopy) {
                      if (item > processIndex) {
                        tempSaveProcessCopy[item] = "";
                      }
                    }
                    setTempSaveProcesses(tempSaveProcessCopy);

                    // If empty value, then it needs to be reselected
                    if (newValue == "") {
                      setStep(tempSaveProcessCopy.indexOf(""));
                      return;
                    }
                    // Or else go to next step
                    setStep(processIndex + 1);
                  }}
                  style={{
                    padding: "15px",
                    margin: "15px",
                    textAlign: "center",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    width: "200px",
                  }}
                >
                  <option value={""}>{processItem}</option>
                  {/* CLAUDE DID THIS MOSTLY */}
                  {step >= processIndex && (
                    <>
                      {Array.from(
                        new Set(
                          brands
                            .flat()
                            .filter((brand) =>
                              checkKeysMatch(processIndex, brand)
                            )
                            .map((brand) => brand[processItem])
                        )
                      )
                        .sort(alphanumericSort)
                        .map((uniqueValue, index) => (
                          <option key={index + uniqueValue} value={uniqueValue}>
                            {uniqueValue}
                          </option>
                        ))}
                    </>
                  )}
                  {processIndex != 0 &&
                    tempSaveProcesses[processIndex - 1] == "" && (
                      <option value={""}>
                        Please select a {queryProcess[processIndex - 1]}
                      </option>
                    )}
                </select>
              ))}
            </div>
          )}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                tempSaveProcesses[tempSaveProcesses.length - 1] != ""
                  ? `repeat(2, 1fr)`
                  : `1fr`,
              gridTemplateRows: `47px`,
              columnGap: "15px",
              margin: "15px 0",
            }}
          >
            {/* Cancel Button */}
            <button
              onClick={() => {
                // Reset the modal
                setStep(0);
                setTempSaveProcesses([]);
                setSearchString("");
                setMatchingProducts([]);
                setSearching(false);
                setProductModalVisible(false);
              }}
              className="DangerButton"
            >
              <p>Cancel</p>
            </button>

            {tempSaveProcesses[tempSaveProcesses.length - 1] != "" && (
              <button
                onClick={async () => {
                  const productToAdd = {};

                  for (let queryProcessIndex in queryProcess) {
                    const queryProcessItem = queryProcess[queryProcessIndex];
                    productToAdd[queryProcessItem] =
                      tempSaveProcesses[queryProcessIndex];
                  }

                  addNewProduct(productToAdd);
                }}
                className="NormalButton"
              >
                <p>Add</p>
              </button>
            )}
          </div>
        </>
      )}
    </Modal>
  );
}
