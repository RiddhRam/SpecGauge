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
  initialPrice,
  setInitialPrice,
  modalAddToGraph,
  brand,
  error,
}) {
  let modalInitialPrice = initialPrice;
  let modalReleaseYear = releaseYear;

  const brandToUse = brand.length === 0 ? brandValues[0].label : brand;

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
      <p className="HeaderText">Add A New Line</p>

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
          value={modalInitialPrice}
          className="TextInput"
          placeholder="Initial New Price"
          onChange={(event) =>
            handleNumberInput(event.target.value, setInitialPrice)
          }
          style={{
            fontSize: 16,
            paddingLeft: "21px", // Add left padding to make room for the prefix
          }}
        />
      </div>

      {/* Release Year Field */}
      <input
        type="number"
        value={modalReleaseYear}
        className="TextInput"
        placeholder="Release Year"
        onChange={(event) =>
          handleNumberInput(event.target.value, setReleaseYear)
        }
        style={{ fontSize: 16, margin: "15px 0" }}
      ></input>

      {/* Select Brand */}
      <select
        className="SelectABrandOptions"
        onChange={() => {
          setBrand(event.target.value);
        }}
        style={{ padding: "20px" }}
      >
        {brandValues &&
          brandValues.map((brandItem) => (
            <option value={`${brandItem.label}`} key={`${brandItem.label}`}>
              {brandItem.label}
            </option>
          ))}
      </select>

      {showError && <p className="ErrorText">{error}</p>}

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
            setInitialPrice("");
            setReleaseYear("");
          }}
          className="DangerButton"
        >
          <p>Cancel</p>
        </button>

        {/* Add button */}
        <button
          onClick={async () => {
            const result = await modalAddToGraph(
              initialPrice,
              releaseYear,
              brandToUse
            );

            if (result != 0) {
              setShowError(true);
            } else {
              // Hide the modal
              setShowAddLineModal(false);
              setInitialPrice("");
              setReleaseYear("");
              setBrand("");
              setShowError(false);
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
