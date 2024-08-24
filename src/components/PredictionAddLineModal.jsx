import { useEffect, useState } from "react";
import Modal from "react-modal";
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
}) {
  let modalProductPrice = productPrice;
  let modalReleaseYear = releaseYear;

  // Updates when user selects a brand because setBrand will be executed
  const brandToUse = brand.length === 0 ? brandValues[0].label : brand;

  // Doesn't have a function in the Prediction page, so we just set it here
  const [priceToUse, setPriceToUse] = useState("Current Price");
  const [rateToUse, setRateToUse] = useState(brandValues[0].value);
  const [estimatedMSRP, setEstimatedMSRP] = useState(0);
  const [showError, setShowError] = useState(false);

  // Initialize as this, or else modal will crash when user enters data and gets to the price
  useEffect(() => {
    setBrand(brandValues[0].label);
  }, [brandValues]);

  useEffect(() => {
    if (brandValues.find((brandLabel) => brandLabel.label === brand)) {
      let rate = brandValues.find(
        (brandLabel) => brandLabel.label === brand
      ).value;

      let xAdjustment = 0;

      if (rate < -0.09) {
        xAdjustment = 3.8;
      }

      console.log(xAdjustment);

      setEstimatedMSRP(
        Math.round(
          // Formula for reverse price prediction
          // modalProductPrice = current price
          // (brandValues.find((brandLabel) => brandLabel.label === brand).value = brand rate
          // 0.01 = average random rate fluctuation
          // 2025 - release = vehicle age

          // MSRP = (current price) / e^((brand rate - average random rate fluctuation) * vehicle age)
          parseInt(modalProductPrice) /
            Math.E ** ((rate + 0.004) * (2025 - releaseYear - xAdjustment))
        )
      );

      setRateToUse(rate);
    }
  }, [brandValues, releaseYear, productPrice, brand]);

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
        style={{ fontSize: 16, margin: "35px 0 15px 0" }}
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

      {/* Price Field */}
      <div style={{ position: "relative" }}>
        <span
          style={{
            position: "absolute",
            left: "10px",
            top: "49%",
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

      {/*      Math.E^(brandValues.find((brandLabel) => brandLabel.label === brand).value + 0.01) * (2025 - releaseYear))      */}

      {/* Select price type */}
      <select
        className="SelectABrandOptions"
        onChange={(event) => {
          setPriceToUse(event.target.value);
        }}
        style={{ margin: "10px 0", padding: "10px" }}
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
