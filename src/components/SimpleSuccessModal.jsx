import Modal from "react-modal";
Modal.setAppElement("#SpecGauge");

export default function SimpleSuccessModal({
  title,
  message,
  setModalVisible,
  modalVisible,
}) {
  return (
    <Modal
      isOpen={modalVisible}
      contentLabel="Copied link to clipboard"
      className={"ModalContainer"}
      overlayClassName={"ModalOverlay"}
      style={{
        overlay: {
          zIndex: 3,
        },
      }}
    >
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
    </Modal>
  );
}
