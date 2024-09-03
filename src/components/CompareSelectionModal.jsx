import { useState, useEffect } from "react";
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
  // The current options to display
  const [selectionOptions, setSelectionOptions] = useState([]);
  // The array of brand names, only used when resetting the modal
  const [brandNames, setBrandNames] = useState([]);
  const [tempSaveProcesses, setTempSaveProcesses] = useState(() =>
    new Array(queryProcess.length).fill("")
  );

  // For the search input
  const [searchString, setSearchString] = useState("");
  const [noResultsFound, setNoResultsFound] = useState(false);

  useEffect(() => {
    const tempBrandNames = [];
    for (let item in brands) {
      tempBrandNames.push(brands[item][0].Brand);
    }
    setSelectionOptions(tempBrandNames);
    setBrandNames(tempBrandNames);
  }, []);

  const searchRequestSteps = (searchTerm) => {
    const flattenedBrands = brands.flat();
    const matchingProducts = [];
    for (let productIndex in flattenedBrands) {
      const productItem = flattenedBrands[productIndex];
      let lowerCaseName = "";
      let normalName = "";
      for (let processIndex in productItem) {
        const processItem = productItem[processIndex].toLowerCase();
        lowerCase += processItem + " ";
        normalName += productItem[processIndex] + " ";
      }

      if (lowerCase.includes(searchTerm)) {
        matchingProducts.push(normalName);
      }
    }
    setSearchString(searchTerm);

    return matchingProducts;
  };

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
          <input
            type="text"
            value={searchString}
            className="TextInput"
            placeholder="TYPE TO SEARCH"
            onChange={(text) => searchRequestSteps(text.target.value)}
            style={{ margin: "15px 0" }}
          ></input>

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
                      setStep(processIndex);
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
                          <option key={index} value={uniqueValue}>
                            {uniqueValue}
                          </option>
                        ))}
                    </>
                  )}
                </select>
              ))}
              {noResultsFound && <p className="SimpleText">No Results Found</p>}
            </div>
          )}
          {/* Cancel Button */}
          <button
            onClick={() => {
              // Reset the modal
              setProductModalVisible(false);
              setSelectionOptions(brandNames);
              setRequestedSpecs([]);
              setTempSaveProcesses([]);
              setStep(0);
              setSearchString("");
            }}
            className="DangerButtonNoBackground"
          >
            <p>Cancel</p>
          </button>
        </>
      )}
    </Modal>
  );
}
