import Modal from "react-modal";
Modal.setAppElement("#SpecGauge");
import WebAccountHandler from "./WebAccountHandler";

export default function WebAccountHandlerModal({
  accountModalVisible,
  setAccountModalVisible,
}) {
  return (
    <Modal
      isOpen={accountModalVisible}
      contentLabel="Account Sign Up or Log In"
      className={"ModalContainer"}
      overlayClassName={"ModalOverlay"}
    >
      <WebAccountHandler
        screenType={"modal"}
        setModalView={setAccountModalVisible}
      ></WebAccountHandler>
      <button
        className="NormalButtonNoBackground"
        onClick={() => {
          setAccountModalVisible(false);
        }}
      >
        <p>Cancel</p>
      </button>
    </Modal>
  );
}
