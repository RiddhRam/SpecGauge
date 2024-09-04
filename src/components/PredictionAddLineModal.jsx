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
  }, [brandValues, modalReleaseYear, productPrice, brand, rateAdjustments]);

  useEffect(() => {
    setRateAdjustments(additionalOptions);
  }, [type]);

  const updatePrice = async () => {
    const brandData = brandValues.find(
      (brandLabel) => brandLabel.label === brand
    );
    if (brandData) {
      const divisions = brandData.value;

      let bestPrice = parseInt(modalProductPrice);
      for (let division in divisions) {
        let startingPoint = parseInt(modalProductPrice);
        let startingYear = parseInt(modalReleaseYear);

        // Get the best rate for this brand given it's current price and rage
        let rate = divisions[division][1];

        // Rate cannot exceed this
        const maxRate = 0.08;

        // This is going to keep changing through the for loop, and at the end it will be the actual estimatedMSRP, before inflation
        let lastPrice = startingPoint;

        if (
          startingYear > 2024 ||
          startingYear < 2000 ||
          isNaN(startingYear) ||
          startingPoint < minimumPrice ||
          isNaN(startingPoint)
        ) {
          break;
        }

        secondLoop: for (let i = 2024; i > startingYear; i--) {
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
                const beginningYear = startingYear + rateAdjustments[item][2];

                // if current is higher than the beginning year (third parameter)
                if (i >= beginningYear) {
                  let thisAdjustment = structuredClone(rateAdjustments[item]);

                  // If this adjustment grows as time goes on
                  if (thisAdjustment[4]) {
                    // multiply by a factor of time
                    thisAdjustment[3] *= i - startingYear;
                  }

                  rate += thisAdjustment[3];

                  let possibleMaxPrice = false;

                  // Bring rate down if needed
                  // This also means price was growing rapdily and may be at the max
                  if (rate > maxRate) {
                    rate = maxRate - 0.01;
                    possibleMaxPrice = true;
                  }

                  // Skip this iteration till we reach 12 years of age because price may be at max
                  if (possibleMaxPrice && i - startingYear > 12) {
                    continue secondLoop;
                  }
                }
                continue;
              }
              // if current year is higher than the beginning year of adjustment (third parameter)
              // Necessary to fix this by 2034 because it affects 1 of the rate adjustments for cars but for now it's irrelevant
              /*
          if (2025 - parseInt(modalReleaseYear) >= rateAdjustments[item][2]) {
            // Adjust the rate by adding the rate adjustment
            rate += rateAdjustments[item][3];
          }*/
            }
          }

          // Make sure rate isn't too high still
          if (rate > maxRate) {
            rate = maxRate - 0.01;
          }

          let xAdjustment = 0;

          // xAdjustment helps reduce the MSRP of vehicles with extremely low rates
          if (rate < -0.13) {
            xAdjustment = 3.8;
          }

          // Estimate the price for each year in reverse, and if the difference between 2 years is too high, reduce it
          const estimatedPrice = Math.round(
            // Formula for reverse price prediction
            // modalProductPrice = current price
            // (brandValues.find((brandLabel) => brandLabel.label === brand).value = brand rate
            // 0.004 = max random rate fluctuation
            //  = vehicle age

            // MSRP = (current price) / e^((brand rate - average random rate fluctuation) * vehicle age)
            lastPrice /
              Math.E ** ((rate + 0.004) * (i - startingYear - xAdjustment))
          );

          let difference = lastPrice - estimatedPrice;

          /* NOTE:
          
          THINK OF IT AS 1 LINE. USE PENCIL AND PAPER TO VISUALIZE, 
          lastPrice = second chronologoical price, estimatedPrice = first
          
          The above difference is same as let difference = newCalculatedPrice - lastPrice;
          from addToGraph in Prediction.jsx
          
          */

          // After prediction adjustments
          // Not working properly for collectibles, also for values with high depreciation (lower than -0.07)
          // Also don't know about brand divisions

          // if rate is decreasing but value went down
          if (rate < 0 && difference < 0) {
            difference *= -0.135 - rate / 3;
            console.log(-0.135 + rate / 3);
          } else {
            if (difference > estimatedPrice * 0.3 && rate < 0) {
              // change differnce to be
              // Prevents sharp increases
              difference = estimatedPrice * 0.04 * -1;
              console.log("2: " + i);
            } // If new price is a decrease from last price
            else if (difference > 0) {
              console.log("3: " + i);
              // If the absolute value of the decrease is more than 68% of the last price
              if (difference > estimatedPrice * 0.68) {
                console.log("4: " + i);
                // Cut the difference to a quarter
                // Prevents sharp drops
                difference = difference * 0.25;
              }
            }
          }

          console.table({ difference: difference, limit: estimatedPrice });

          if (rate > 0) {
            difference = estimatedPrice * rate;
          }

          lastPrice += difference;
        }

        bestPrice = lastPrice;

        // if estimated msrp is significantly higher than the current price, we'll factor in inflation, if not, skip
      }
      // This will be the inflation adjusted msrp
      let adjustedMSRP = bestPrice;

      /*
        if (
          parseInt(modalProductPrice) * 3.5 <= adjustedMSRP &&
          2025 - modalReleaseYear > 14
        ) {
          // from 2024 - 2000
          const inflationRates = [
            -0.031, -0.04, -0.074, -0.045, -0.012, -0.018, -0.024, -0.021,
            -0.012, -0.001, -0.016, -0.014, -0.02, -0.031, -0.016, 0.004,
            -0.037, -0.028, -0.031, -0.033, -0.026, -0.022, -0.016, -0.027,
          ];

          // age of the vehicle
          const time = 2024 - modalReleaseYear;

          for (let i = 0; i != time; i++) {
            adjustedMSRP -= Math.abs(adjustedMSRP * inflationRates[i]);
          }
        }*/
      setEstimatedMSRP(Math.round(adjustedMSRP));
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
                    />
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
        modalReleaseYear >= 2000 &&
        modalReleaseYear <= 2025 &&
        priceToUse == "Current Price" && (
          <>
            <p className="SuccessText" style={{ margin: 0 }}>
              Estimated MSRP: ${estimatedMSRP}
            </p>
            <p className="SimpleText" style={{ fontSize: isMobile ? 11 : 15 }}>
              If estimated MSRP is wrong, please manually enter <br></br>the
              correct MSRP for best results
            </p>
          </>
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

              // Convert to an array
              let adjustmentArray = [];
              for (let param in thisAdjustment) {
                adjustmentArray.push(thisAdjustment[param]);
              }

              allRateAdjustments.push(adjustmentArray);
            }
            let result = null;

            if (priceToUse == "Current Price") {
              price = estimatedMSRP;
            }

            result = await modalAddToGraph(
              price,
              modalReleaseYear,
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
