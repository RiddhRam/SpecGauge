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
  process,
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
  const [tempSaveProcesses, setTempSaveProcesses] = useState([]);

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

  const checkNoResults = (text) => {
    let matchFound = false;
    for (let item in selectionOptions) {
      if (selectionOptions[item].toUpperCase().includes(text.toUpperCase())) {
        matchFound = true;
        break;
      }
    }

    if (matchFound) {
      setNoResultsFound(false);
    } else {
      setNoResultsFound(true);
    }
    setSearchString(text);
  };

  return (
    <Modal
      isOpen={productModalVisible}
      contentLabel="Select a product to compare"
      className={"ModalContainer"}
      overlayClassName={"ModalOverlay"}
    >
      {process && (
        <>
          {/* Brands */}
          <p className="HeaderText">Select {process[step]}</p>
          <input
            type="text"
            value={searchString}
            className="TextInput"
            placeholder="TYPE TO SEARCH"
            onChange={(text) => checkNoResults(text.target.value)}
            style={{ margin: "15px 0" }}
          ></input>

          <p className="SimpleText" style={{ fontSize: "13px" }}>
            OR<br></br>
            <br></br>SELECT
          </p>
          {brands == null ? (
            <div
              className="ActivityIndicator"
              style={{ marginTop: 30, marginBottom: 30 }}
            ></div>
          ) : (
            <div className="ModalButtonSection">
              {queryProcess.map((processItem, index) => (
                <select
                  key={index}
                  className="SelectABrandOptions"
                  onChange={(event) => {
                    // setBrand(event.target.value);
                  }}
                  style={{
                    padding: "15px",
                    margin: "15px",
                    textAlign: "center",
                  }}
                ></select>
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
