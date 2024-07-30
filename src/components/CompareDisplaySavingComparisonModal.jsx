export default function CompareDisplaySavingComparisonModal({
  awaitingSavingComparison,
  successfullySavedComparison,
  setSavingComparison,
}) {
  return (
    <>
      <p className="HeaderText">Save Comparison</p>
      {awaitingSavingComparison ? (
        <div
          className="ActivityIndicator"
          style={{ marginTop: 30, marginBottom: 30 }}
        ></div>
      ) : (
        <div
          className="ModalButtonSection"
          style={{
            marginBottom: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {successfullySavedComparison ? (
            <p className="SuccessText">Succesfully saved this comparison.</p>
          ) : (
            <p className="ErrorText">
              Saving this comparison was unsuccessful, try again later.
            </p>
          )}
          {/* Okay Button */}
          <button
            className="NormalButton"
            onClick={() => {
              setSavingComparison(false);
            }}
            style={{ width: "50%" }}
          >
            Okay
          </button>
        </div>
      )}
    </>
  );
}
