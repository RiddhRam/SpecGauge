export default function PredictionBrandSelectionModal({
  checkNoResults,
  searchString,
  brandValues,
  noResultsFound,
  setShowBrandModal,
  type,
  setSearchString,
  setBrand,
}) {
  return (
    <>
      <p className="HeaderText">Select a brand</p>

      <input
        type="text"
        value={searchString}
        className="TextInput"
        placeholder="Search"
        id={"SearchString" + type}
        onChange={(text) => checkNoResults(text.target.value)}
        style={{ margin: "15px 0" }}
      ></input>

      <div className="ModalButtonSection">
        {brandValues.map(
          (item, index) =>
            /* Brand button */
            item.label.toUpperCase().includes(searchString.toUpperCase()) && (
              <button
                className="NormalButtonNoBackground"
                onClick={() => {
                  setBrand(item.label);
                  setShowBrandModal(false);
                  setSearchString("");
                }}
                key={index}
                style={{
                  padding: "15px 10px",
                  maxWidth: "250px",
                }}
              >
                {item.label}
              </button>
            )
        )}
        {noResultsFound && <p className="SimpleText">No Results Found</p>}
      </div>
      {/* Cancel button */}
      <button
        onClick={() => {
          // Hide the modal
          setShowBrandModal(false);
        }}
        className="DangerButton"
        style={{ margin: "10px 0" }}
      >
        <p>Cancel</p>
      </button>
    </>
  );
}
