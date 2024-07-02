import { useState, useEffect } from "react";
import GetProsAndSpecs from "../functions/GetProsAndSpecs";
import BuildTitle from "../functions/BuildTitle";

export default function SelectionModal({
  type,
  setProductModalVisible,
  brands,
  queryFunction,
  queryProcess,
  process,
  defaultArray,
  categories,
  setPros,
  setProducts,
  setSaveComparisonProcesses,
  amplitude,
}) {
  // Current step that the modal is displaying
  const [step, setStep] = useState(0);
  // All the specs that were retrieved from firebase, these are requested after the second step
  const [requestedSpecs, setRequestedSpecs] = useState([]);
  // The current options to display
  const [selectionOptions, setSelectionOptions] = useState([]);
  // Determines whether or not to show the loading icon
  const [loading, setLoading] = useState(false);
  // The array of brand names, only used when resetting the modal
  const [brandNames, setBrandNames] = useState([]);
  // This variable saves the brand for when user moves to the second screen
  const [selectedBrand, setSelectedBrand] = useState("");
  const [tempSaveProcesses, setTempSaveProcesses] = useState([]);

  useEffect(() => {
    const tempBrandNames = [];
    for (let item in brands) {
      tempBrandNames.push(brands[item].Brand);
    }
    setSelectionOptions(tempBrandNames);
    setBrandNames(tempBrandNames);
  }, []);

  return (
    <>
      {/* Brands */}
      <p className="HeaderText">Select {process[step]}</p>

      {loading ? (
        <div
          className="ActivityIndicator"
          style={{ marginTop: 30, marginBottom: 30 }}
        ></div>
      ) : (
        <div className="ModalButtonSection">
          {selectionOptions.map((item, index) => (
            <button
              className="NormalButtonNoBackground"
              key={item + index}
              onClick={async () => {
                // Start the spec loading animation
                setLoading(true);
                // For next step
                let tempArray = [];
                let nextSelection = [];
                const nextStep = step + 1;

                let result = [];
                // If it's the first step, go off to the SecondStep selection screen
                if (step == 0) {
                  amplitude.track("Begin Request", {
                    Brand: item,
                    Category: type,
                  });
                  tempArray = brands[index].SecondStep;
                  nextSelection = brands[index].SecondStep;
                  setSelectedBrand(item);
                } else if (step == 1) {
                  // Query the products after the second step
                  amplitude.track("Fetch Request", {
                    SecondStep: item,
                    Category: type,
                  });
                  result = await queryFunction(selectedBrand, item);
                } else {
                  // If we have queried them, then just pick off from the last step
                  result = requestedSpecs;
                }

                // Iterate through all result keys
                for (let resultKey in result) {
                  const currentResult = result[resultKey];
                  // Check for a match between the clicked value and the key value of the key that matches the current process in queryProcess
                  if (
                    selectionOptions[index] == currentResult[queryProcess[step]]
                  ) {
                    tempArray.push(currentResult);

                    // Check for duplicates
                    let duplicate = false;
                    for (let selectionIndex in nextSelection) {
                      if (
                        currentResult[queryProcess[nextStep]] ==
                        nextSelection[selectionIndex]
                      ) {
                        duplicate = true;
                        break;
                      }
                    }
                    // If no duplicates then add it to the array that we will use for the next selection screen
                    if (!duplicate) {
                      nextSelection.push(currentResult[queryProcess[nextStep]]);
                    }
                  }
                }

                // If its not the last step
                if (nextStep != queryProcess.length) {
                  // Increment the step, and filter out the requestedSpecs with the above array, also change the selection options
                  setStep(nextStep);
                  setSelectionOptions(nextSelection.sort());
                  setRequestedSpecs(tempArray);
                  setTempSaveProcesses((prevProcess) => [...prevProcess, item]);
                } else {
                  // If its the last step
                  // Add the last item to this new array then add it to the total array in Compare.js
                  const tempComparisonProcess = tempSaveProcesses;
                  tempComparisonProcess.push(item);
                  setSaveComparisonProcesses((prevProcesses) => [
                    ...prevProcesses,
                    tempComparisonProcess,
                  ]);
                  setTempSaveProcesses([]);

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

                  amplitude.track("Complete Request", {
                    Brand: tempComparisonProcess[0],
                    Category: type,
                    Product: tempComparisonProcess[1],
                  });

                  // returns [tempProsArray, tempNewProduct]
                  // prettier-ignore
                  const prosAndSpecs = GetProsAndSpecs(parameterArray, tempArray[0], categories);

                  // prettier-ignore
                  setPros((prevPros) => [...prevPros, prosAndSpecs[0]]);
                  setProducts((prevProducts) => [
                    ...prevProducts,
                    prosAndSpecs[1],
                  ]);

                  // Reset the modal
                  setProductModalVisible(false);
                  setStep(0);
                  setSelectionOptions(brandNames);
                  setRequestedSpecs([]);
                  setSelectedBrand("");
                }

                setLoading(false);
              }}
            >
              <p>{item}</p>
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => {
          // Reset the modal
          setProductModalVisible(false);
          setSelectionOptions(brandNames);
          setRequestedSpecs([]);
          setTempSaveProcesses([]);
          setStep(0);
          setSelectedBrand("");
        }}
        className="DangerButtonNoBackground"
      >
        <p>Cancel</p>
      </button>
    </>
  );
}
