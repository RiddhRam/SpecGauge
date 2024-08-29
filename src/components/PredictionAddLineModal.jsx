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
  additionalOptions,
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

  useEffect(() => {
    setRateAdjustments(additionalOptions);
  }, [type]);

  const updatePrice = async () => {
    if (brandValues.find((brandLabel) => brandLabel.label === brand)) {
      let xAdjustment = 0;
      let startingPoint = parseInt(modalProductPrice);
      let startingYear = 2025;

      // Get the best rate for this brand given it's current price and rage
      let rate = determineBestRate(startingPoint);

      // Rate cannot exceed this
      const maxRate = 0.08;

      // Get the rng value
      const seed = `${rate}${brand}${releaseYear}`;
      let rng = null;
      await import("../functions/SeedrandomImport").then((module) => {
        rng = module.default(seed);
      });

      // Adjust starting point if rate adjustments were used
      if (rateAdjustments) {
        // Iterate through rate adjustments
        // Iterate through these to get the settings
        for (let item in rateAdjustments) {
          // If this rate adjustment was enabled, keep going, else continue to next iteration
          if (rateAdjustments[item][1] == false) {
            continue;
          }

          // If third parameter is lower than 2000
          if (rateAdjustments[item][2] < 2000) {
            // Add that many years to vehicle production year
            const beginningYear =
              parseInt(releaseYear) + rateAdjustments[item][2];
            const time = 2025 - beginningYear;

            // if current is higher than the beginning year (third parameter)
            if (2025 >= beginningYear) {
              // if it's a huge adjustment, don't even add it, just set it
              if (rateAdjustments[item][3] > 10) {
                rate = rateAdjustments[item][3];
              } else {
                rate += rateAdjustments[item][3];
              }

              // Bring rate down if needed
              if (rate > maxRate) {
                rate = 0.09 * rng;
              }

              startingPoint = // Formula for reverse price prediction of this rate adjustment type
                // starting point = original
                // rate = rate adjustment
                // 0.02 = max random rate fluctuation
                // time = time that the rate was used

                // MSRP = (current price) / e^((brand rate - max random rate fluctuation) * time)
                parseInt(startingPoint) /
                Math.E ** ((rate + rng * 0.02) * time);

              // Set the starting year
              startingYear = 2025 - time;
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

      rate = determineBestRate(startingPoint);

      // xAdjustment helps reduce the MSRP of vehicles with extremely low rates
      if (rate < -0.095) {
        xAdjustment = 3.8;
      }

      // This is going to keep changing through the for loop, and at the end it will be the actual estimatedMSRP, before inflation
      let lastPrice = parseInt(startingPoint);

      if (releaseYear <= 2025 && releaseYear >= 2000 && lastPrice > 3000) {
        for (let i = startingYear; i != releaseYear; i--) {
          // Estimate the price for each year in reverse, and if the difference between 2 years is too high, reduce it
          const estimatedPrice = Math.round(
            // Formula for reverse price prediction
            // modalProductPrice = current price
            // (brandValues.find((brandLabel) => brandLabel.label === brand).value = brand rate
            // 0.004 = max random rate fluctuation
            // 2025 - release = vehicle age

            // MSRP = (current price) / e^((brand rate - average random rate fluctuation) * vehicle age)
            parseInt(startingPoint) /
              Math.E ** ((rate + rng * -0.001) * (2025 - i - xAdjustment))
          );

          let difference = estimatedPrice - lastPrice;

          // Difference * diffCo (difference coefficient) cannot exceed this
          let limit = startingPoint * (rate - 0.28) * -1;
          let diffCo = 0.8;

          // If rate is very high, change the limit and diffCo to these
          if (rate < -0.1) {
            limit = startingPoint * (rate * 3) * -1;
            diffCo = 0.3;
          }

          // if difference decreased the price, make it positive
          if (difference < 0) {
            difference *= -1;
          }

          // If difference is too high, reduce it to 6% of the last price
          if (difference * diffCo > limit) {
            difference = lastPrice * 0.06;
          }
          lastPrice += difference;
        }
      }

      // This will be the inflation adjusted msrp
      let adjustedMSRP = Math.round(lastPrice);

      // if estimated msrp is significantly higher than the current price, we'll factor in inflation, if not, skip
      if (parseInt(modalProductPrice) * 2.5 <= adjustedMSRP) {
        // from 2024 - 2000
        const inflationRates = [
          -0.031, -0.04, -0.074, -0.045, -0.012, -0.018, -0.024, -0.021, -0.012,
          -0.001, -0.016, -0.014, -0.02, -0.031, -0.016, 0.004, -0.037, -0.028,
          -0.031, -0.033, -0.026, -0.022, -0.016, -0.027,
        ];

        // age of the vehicle
        const time = 2024 - releaseYear;

        for (let i = 0; i != time; i++) {
          adjustedMSRP -= Math.abs(adjustedMSRP * inflationRates[i]);
        }
      }

      setEstimatedMSRP(Math.round(adjustedMSRP));
    }
  };

  const determineBestRate = (startingPoint) => {
    // Get all divisions
    const divisions = brandValues.find(
      (brandLabel) => brandLabel.label === brand
    ).value;

    // This will be the rate we use
    let rate = 0;

    let age = 2025 - parseInt(releaseYear);

    // For debugging only
    let price = 0;
    // Iterate through each division
    for (let divisionItem in divisions) {
      // [0] = limit
      // [1] = rate
      const divisionRate = divisions[divisionItem][1];

      // We have to use xAdjustments here too, only if rate is very high
      let xAdjustment = 0;

      if (divisionRate < -0.097) {
        xAdjustment = 3.8;
      }

      const MSRP = // Formula for reverse price prediction of this rate adjustment type
        // starting point = original
        // rate = rate adjustment
        // 0.01 = average random rate fluctuation
        // age = time that the rate was used

        // MSRP = (current price) / e^((brand rate - max random rate fluctuation) * (age - xAdjustment))
        parseInt(startingPoint) /
        Math.E ** ((divisionRate + 0.01) * (age - xAdjustment));

      // If the MSRP is greater than the limit of this rate, then this is the rate we will use
      // unless the next rate also exceeds it's MSRP limit, then we use that and so on until the best rate is found
      if (MSRP >= divisions[divisionItem][0]) {
        rate = divisionRate;
        price = MSRP;
      }
    }
    return rate;
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
        style={{ fontSize: 16, padding: "8px 5px 8px 20px" }}
      ></input>

      {/* Select Brand */}
      <select
        className="SelectABrandOptions"
        onChange={() => {
          setBrand(event.target.value);
        }}
        style={{ padding: "15px", margin: "15px" }}
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
              width: isMobile ? "70%" : "60%",
            }}
          >
            {rateAdjustments &&
              rateAdjustments.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{ fontSize: isMobile ? 14 : 18 }}
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
                              logEvent(
                                analytics,
                                `Toggle ${rateAdjustments[item][0]}`,
                                {
                                  // Screen type
                                  Type: type,
                                  // Category type
                                  NewValue: rateAdjustments[item][1],
                                }
                              );
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
            style={{ margin: "5px", padding: "10px" }}
          >
            <p>More Options</p>
          </button>
        )
      )}

      {/* Price Field */}
      <div style={{ position: "relative", margin: "15px 0 0 0" }}>
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
            padding: "8px 5px 8px 21px", // Add left padding to make room for the prefix
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
              let thisAdjustment = rateAdjustments[item];
              if (rateAdjustments[item][1]) {
                thisAdjustment[1] = true;
              }

              allRateAdjustments.push(thisAdjustment);
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
