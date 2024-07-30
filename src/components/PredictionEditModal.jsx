import { HexColorPicker } from "react-colorful";

export default function PredictionEditModal({
  lineValueDataset,
  colorChangeIndex,
  updateColor,
  setColorChangeIndex,
  removeGraph,
  setShowEditModal,
  isMobile,
}) {
  return (
    <>
      <p className="HeaderText">Edit Graph</p>
      <div className="ModalButtonSection" style={{ width: "70%" }}>
        {lineValueDataset.map((item, index) =>
          isMobile ? (
            /* Mobile display */
            <div
              key={index}
              style={{
                display: "flex",
                borderStyle: "solid",
                borderWidth: 3,
                borderColor: item.borderColor,
                padding: "15px 7px",
                margin: "5px 0",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {/* Label name */}
                <p
                  style={{ fontSize: 14, marginRight: 5 }}
                  className="PlainText"
                >
                  {item.label}
                </p>

                {/* Change color */}
                {colorChangeIndex == index ? (
                  // Color picker
                  <HexColorPicker
                    color={item.borderColor}
                    onChange={updateColor}
                    style={{ height: 150, width: 250 }}
                  ></HexColorPicker>
                ) : (
                  // Enable Color Picker
                  <button
                    style={{
                      width: 20,
                      height: 20,
                      backgroundColor: item.borderColor,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setColorChangeIndex(index);
                    }}
                  ></button>
                )}
              </div>

              {/* Delete Button */}
              <button
                className="DangerButtonNoBackground"
                style={{
                  fontSize: 12,
                }}
                onClick={async () => {
                  removeGraph(index);
                }}
              >
                <p>Delete</p>
              </button>
            </div>
          ) : (
            /* Computer display */
            <div
              key={index}
              style={{
                display: "flex",
                borderStyle: "solid",
                borderWidth: 3,
                borderColor: item.borderColor,
                padding: "15px 7px",
                margin: "5px 0",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {/* Label name */}
              <p style={{ fontSize: 20, marginRight: 5 }} className="PlainText">
                {item.label}
              </p>

              {/* Change color */}
              {colorChangeIndex == index ? (
                // Color picker
                <HexColorPicker
                  color={item.borderColor}
                  onChange={updateColor}
                ></HexColorPicker>
              ) : (
                // Enable Color Picker
                <button
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: item.borderColor,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setColorChangeIndex(index);
                  }}
                ></button>
              )}

              {/* Delete Button */}
              <button
                className="DangerButtonNoBackground"
                style={{
                  fontSize: 14,
                }}
                onClick={async () => {
                  removeGraph(index);
                }}
              >
                <p>Delete</p>
              </button>
            </div>
          )
        )}
      </div>
      {/* Close button */}
      <button
        onClick={() => {
          // Hide the modal
          setShowEditModal(false);
        }}
        className="DangerButton"
        style={{ margin: "10px 0" }}
      >
        <p>Close</p>
      </button>
    </>
  );
}
