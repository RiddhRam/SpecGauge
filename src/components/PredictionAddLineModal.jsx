import { useState } from "react";
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
}) {
  let modalProductPrice = productPrice;
  let modalReleaseYear = releaseYear;

  // Updates when user selects a brand because setBrand will be executed
  const brandToUse = brand.length === 0 ? brandValues[0].label : brand;

  // Doesn't have a function in the Prediction page, so we just set it here
  const [priceToUse, setPriceToUse] = useState("Current Price");
  const [showError, setShowError] = useState(false);

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
          placeholder="Release Price"
          onChange={(event) =>
            handleNumberInput(event.target.value, setProductPrice)
          }
          style={{
            fontSize: 16,
            paddingLeft: "21px", // Add left padding to make room for the prefix
          }}
        />
      </div>

      {/* Select price type */}
      {/*
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
            const allRateAdjustments = [];
            for (let item in rateAdjustments) {
              if (rateAdjustments[item][1]) {
                allRateAdjustments.push(rateAdjustments[item]);
              }
            }
            let result = null;
            result = await modalAddToGraph(
              productPrice,
              releaseYear,
              brandToUse,
              priceToUse,
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
