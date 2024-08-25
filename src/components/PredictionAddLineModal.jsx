import { useEffect, useState } from "react";
import Modal from "react-modal";
import { logEvent } from "firebase/analytics";
Modal.setAppElement("#SpecGauge");

export default function PredictionAddLineModal({
  brandValues,
  setShowAddLineModal,
  setBrand,
  showAddLineModal,
  handleNumberInput,
  releaseYear,
  setReleaseYear,
  productPrice,
  setProductPrice,
  modalAddToGraph,
  brand,
  error,
  type,
  rateAdjustments,
  minimumPrice,
  setRateAdjustments,
  isMobile,
  analytics,
}) {
  let modalProductPrice = productPrice;
  let modalReleaseYear = releaseYear;

  // Updates when user selects a brand because setBrand will be executed
  const brandToUse = brand.length === 0 ? brandValues[0].label : brand;

  // Doesn't have a function in the Prediction page, so we just set it here
  const [priceToUse, setPriceToUse] = useState("Current Price");
  // The converted release price from current price
  const [estimatedMSRP, setEstimatedMSRP] = useState(0);
  // Whether or not to show an error
  const [showError, setShowError] = useState(false);

  const [showMoreOptions, setShowMoreOptions] = useState(false);

  // Initialize as this, or else modal will crash when user enters data and gets to the price
  useEffect(() => {
    setBrand(brandValues[0].label);
  }, [brandValues]);

  useEffect(() => {
    // this is a seperate function so it can asynchronously import SeedRandomImport
    updatePrice();
  }, [brandValues, releaseYear, productPrice, brand, rateAdjustments]);

  const updatePrice = async () => {
    if (brandValues.find((brandLabel) => brandLabel.label === brand)) {
      let rate = 0;

      let xAdjustment = 0;
      let startingPoint = modalProductPrice;

      // Rate cannot exceed this
      const maxRate = 0.12;

      // Get the rng() value
      const seed = `${rate}${brand}${releaseYear}`;
      let rng = null;
      await import("../functions/SeedrandomImport").then((module) => {
        rng = module.default(seed);
      });

      // Adjust starting point if rate adjustments were used
      if (rateAdjustments) {
        console.log("Running1");
        // Iterate through rate adjustments
        // Iterate through these to get the settings
        for (let item in rateAdjustments) {
          // If this rate adjustment was enabled, keep going, else continue to next iteration
          if (rateAdjustments[item][1] == false) {
            continue;
          }

          // If third parameter is lower than 2000
          if (rateAdjustments[item][2] < 2000) {
            console.log("Running2");
            // Add that many years to vehicle production year
            const beginningYear =
              parseInt(releaseYear) + rateAdjustments[item][2];

            console.log(beginningYear);
            // if current is higher than the beginning year (third parameter)
            if (2025 >= beginningYear) {
              console.log("Running3");
              // if it's a huge adjustment, don't even add it, just set it
              if (rateAdjustments[item][3] > 100) {
                rate = rateAdjustments[item][3];
              }

              // Bring rate down if needed
              if (rate > maxRate) {
                rate = maxRate;
              }

              const time = 2025 - beginningYear;

              startingPoint = // Formula for reverse price prediction of this rate adjustment type
                // starting point = original
                // rate = rate adjustment
                // 0.004 = average random rate fluctuation
                // time = time that the rate was used

                // MSRP = (current price) / e^((brand rate - average random rate fluctuation) * time)

                parseInt(startingPoint) /
                Math.E ** ((rate + rng() * 0.004) * time);
            }
            continue;
          }
          // if current year is higher than the beginning year of adjustment (third parameter)
          // Necessary to fix this by 2034 because it affects 1 of the rate adjustments for cars but for now it's irrelevant
          if (2025 - releaseYear >= rateAdjustments[item][2]) {
            // Adjust the rate by adding the rate adjustment
            rate += rateAdjustments[item][3];
          }
        }
      }

      // Continue normally with brand rate and new starting point
      rate = brandValues.find(
        (brandLabel) => brandLabel.label === brand
      ).reverseValue;

      if (rate < -0.095) {
        xAdjustment = 3.8;
      }

      let estimatedOriginalPrice = Math.round(
        // Formula for reverse price prediction
        // modalProductPrice = current price
        // (brandValues.find((brandLabel) => brandLabel.label === brand).value = brand rate
        // 0.004 = average random rate fluctuation
        // 2025 - release = vehicle age

        // MSRP = (current price) / e^((brand rate - average random rate fluctuation) * vehicle age)
        parseInt(startingPoint) /
          Math.E **
            ((rate + rng() * 0.004) * (2025 - releaseYear - xAdjustment))
      );

      setEstimatedMSRP(estimatedOriginalPrice);
    }
  };

  return (
    <Modal
      isOpen={showAddLineModal}
      contentLabel="Select a brand"
      className={"ModalContainer"}
      overlayClassName={"ModalOverlay"}
      // Have to set modals on this screen to zIndex 3, because the handle for the rc-slider is also on zIndex 3, so it will show through the modal
      style={{
        overlay: {
          zIndex: 3,
        },
      }}
    >
      <p className="HeaderText">Add A {type.slice(0, -1)}</p>

      {/* Release Year Field */}
      <input
        type="number"
        value={modalReleaseYear}
        className="TextInput"
        placeholder="Release Year"
        onChange={(event) =>
          handleNumberInput(event.target.value, setReleaseYear)
        }
        style={{ fontSize: 16 }}
      ></input>

      {/* Select Brand */}
      <select
        className="SelectABrandOptions"
        onChange={() => {
          setBrand(event.target.value);
        }}
        style={{ padding: "20px", margin: "20px" }}
      >
        {brandValues &&
          brandValues.map((brandItem) => (
            <option value={`${brandItem.label}`} key={`${brandItem.label}`}>
              {brandItem.label}
            </option>
          ))}
      </select>

      {/* More Options */}
      {showMoreOptions ? (
        /* Options */
        <>
          <div
            style={{
              width: isMobile ? "80%" : "70%",
            }}
          >
            {rateAdjustments &&
              rateAdjustments.map((item, index) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{ fontSize: isMobile ? 16 : 20 }}
                    className="PlainText"
                  >
                    {item[0]}
                  </p>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={rateAdjustments[index][1]}
                      onChange={() => {
                        // first parameter is name of option
                        // second parameter is value
                        // third parameter is starting year, value lower than 2000 means to add that many years to vehicle production year
                        // fourth parameter is rate change after the third parameter year, 100 means the opposite of vehicle's original rate of change
                        // Create a new rate adjustment array
                        const newRateAdjustments = [];
                        // Iterate through the last one and copy everything
                        for (let item in rateAdjustments) {
                          // If the current item isn't that same as the one that changed
                          if (item != index) {
                            // Simply add it
                            newRateAdjustments.push(rateAdjustments[item]);
                          } else {
                            // If it is the item that changed then copy it
                            const newRateAdjustment = rateAdjustments[item];
                            // But change the boolean value to be opposite
                            newRateAdjustment[1] = !rateAdjustments[item][1];
                            // Then add it
                            newRateAdjustments.push(newRateAdjustment);
                            if (analytics != null) {
                              logEvent(analytics, `Toggle ${item[0]}`, {
                                // Screen type
                                Type: type,
                                // Category type
                                NewValue: !rateAdjustments[item][1],
                              });
                            }
                          }
                        }

                        // Update the array
                        setRateAdjustments(newRateAdjustments);
                      }}
                    ></input>
                    <span className="slider"></span>
                  </label>
                </div>
              ))}
          </div>
          <button
            onClick={() => {
              setShowMoreOptions(false);
            }}
            className="NormalButton"
            style={{ margin: "0 0 10px 0" }}
          >
            Hide
          </button>
        </>
      ) : (
        /* Show more button */
        rateAdjustments && (
          <button
            onClick={async () => {
              setShowMoreOptions(true);
            }}
            className="NormalButton"
            style={{ margin: "10px 0 10px 0" }}
          >
            <p>More Options</p>
          </button>
        )
      )}

      {/* Price Field */}
      <div style={{ position: "relative", margin: "20px 0 0 0" }}>
        <span
          style={{
            position: "absolute",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color: "#fff",
          }}
        >
          $
        </span>
        <input
          type="number"
          value={modalProductPrice}
          className="TextInput"
          placeholder="Price"
          onChange={(event) =>
            handleNumberInput(event.target.value, setProductPrice)
          }
          style={{
            fontSize: 16,
            paddingLeft: "21px", // Add left padding to make room for the prefix
          }}
        />
      </div>

      {/* Show estimated msrp if Current Price is selected, release year and current price are valid */}
      {parseInt(modalProductPrice) >= minimumPrice &&
        releaseYear >= 2000 &&
        releaseYear <= 2025 &&
        priceToUse == "Current Price" && (
          <p className="SuccessText" style={{ margin: 0 }}>
            Estimated MSRP: ${estimatedMSRP}
          </p>
        )}

      {/* Select price type */}
      <select
        className="SelectABrandOptions"
        onChange={(event) => {
          setPriceToUse(event.target.value);
        }}
        style={{ margin: "10px 0 35px 0", padding: "10px" }}
      >
        <option value={"Current Price"}>Current Price</option>
        <option value={"Release Price"}>Release Price</option>
      </select>

      {showError && <p className="ErrorText">{error}</p>}

      {/* Bottom Buttons */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(2, 1fr)`,
          gridTemplateRows: `47px`,
          columnGap: "15px",
          margin: "15px 0",
        }}
      >
        {/* Cancel button */}
        <button
          onClick={() => {
            // Hide the modal
            setShowAddLineModal(false);
            setProductPrice("");
            setReleaseYear("");
          }}
          className="DangerButton"
        >
          <p>Cancel</p>
        </button>

        {/* Add button */}
        <button
          onClick={async () => {
            let price = productPrice;

            const allRateAdjustments = [];
            for (let item in rateAdjustments) {
              if (rateAdjustments[item][1]) {
                allRateAdjustments.push(rateAdjustments[item]);
              }
            }
            let result = null;

            if (priceToUse == "Current Price") {
              price = estimatedMSRP;
            }
            result = await modalAddToGraph(
              price,
              releaseYear,
              brandToUse,
              allRateAdjustments
            );

            if (result != 0) {
              setShowError(true);
            } else {
              // Hide the modal
              setShowAddLineModal(false);
              setProductPrice("");
              setReleaseYear("");
              setBrand("");
            }
          }}
          className="NormalButton"
        >
          <p>Add</p>
        </button>
      </div>
    </Modal>
  );
}
