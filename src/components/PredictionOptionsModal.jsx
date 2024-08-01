import Modal from "react-modal";
Modal.setAppElement("#SpecGauge");

export default function PredictionOptionsModal({
  setShowOptionsModal,
  setRateAdjustments,
  rateAdjustments,
  isMobile,
  type,
  analytics,
  showOptionsModal,
}) {
  return (
    <Modal
      isOpen={showOptionsModal}
      contentLabel="Select Options"
      className={"ModalContainer"}
      overlayClassName={"ModalOverlay"}
      style={{
        overlay: {
          zIndex: 3,
        },
      }}
    >
      <p className="HeaderText">Select Options</p>
      <div style={{ width: "70%" }}>
        {rateAdjustments &&
          rateAdjustments.map((item, index) => (
            <div
              key={item}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <p style={{ fontSize: isMobile ? 16 : 20 }} className="PlainText">
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

      {/* Close button */}
      <button
        onClick={() => {
          // Hide the modal
          setShowOptionsModal(false);
        }}
        className="DangerButton"
        style={{ margin: "10px 0" }}
      >
        <p>Close</p>
      </button>
    </Modal>
  );
}
