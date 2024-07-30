export default function SimpleSuccessModal({
  title,
  message,
  setModalVisible,
}) {
  return (
    <>
      <p className="HeaderText">{title}</p>
      <div
        className="ModalButtonSection"
        style={{ display: "flex", alignItems: "center" }}
      >
        <p className="SuccessText">{message}</p>
      </div>

      <button
        className="NormalButton"
        onClick={() => {
          setModalVisible(false);
        }}
        style={{ marginBottom: "10px" }}
      >
        <p>Okay</p>
      </button>
    </>
  );
}
