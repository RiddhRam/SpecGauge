import Modal from "react-modal";
Modal.setAppElement("#SpecGauge");

export default function SimpleErrorModal({
  message,
  setModalVisible,
  modalVisible,
}) {
  return (
    <Modal
      isOpen={modalVisible}
      contentLabel={message}
      className={"ModalContainer"}
      overlayClassName={"ModalOverlay"}
      style={{
        overlay: {
          zIndex: 3,
        },
      }}
    >
      <p className="HeaderText">Error</p>
      <div
        className="ModalButtonSection"
        style={{ display: "flex", alignItems: "center" }}
      >
        <p className="ErrorText">{message}</p>
      </div>

      <button
        onClick={() => {
          // Hide the modal
          setModalVisible(false);
        }}
        className="NormalButton"
        style={{ margin: "10px 0" }}
      >
        <p>Okay</p>
      </button>
    </Modal>
  );
}
