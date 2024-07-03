import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import SetTitleAndDescription from "../functions/SetTitleAndDescription";

Modal.setAppElement("#SpecGauge");

const comparisonCategories = [
  "Automobiles",
  "Consoles",
  "CPUs",
  "Graphics Cards",
  "Drones",
];

const predictionCategories = ["Automobiles", "Graphics Cards", "CPUs"];

const comparisonLinks = [
  "/comparison/automobiles",
  "/comparison/consoles",
  "/comparison/cpus",
  "/comparison/graphicsCards",
  "/comparison/drones",
];

const predictionLinks = [
  "/prediction/automobiles",
  "/prediction/graphicsCards",
  "/prediction/cpus",
];

export default function WebHome({ amplitude, isMobile }) {
  {
    /* This is for the modal that determines the comparison type */
  }
  const [compareModalVisible, setCompareModalVisible] = useState(false);
  const [predictModalVisible, setPredictModalVisible] = useState(false);

  const navigate = useNavigate();

  {
    /* Records the initial load of the website */
  }
  useEffect(() => {
    amplitude.track("Screen", { Screen: "Home" });
    SetTitleAndDescription(
      "SpecGauge | Compare products and predict prices",
      "Explore SpecGauge: Easily compare vehicles and electronics side by side. Predict future prices to make informed decisions before you buy. All the tools in one place."
    );
  }, []);

  return (
    <>
      {/* Navbar */}
      <Navbar page={"home"} isMobile={isMobile} />

      {/* Main div */}
      <div className="LargeContainer">
        {/* Select tool type, default screen */}
        {/* Subtitle */}
        <p
          className="SimpleText"
          style={{
            fontSize: isMobile ? 20 : 30,
            marginTop: 50,
          }}
        >
          Compare Today. Predict Tomorrow.
        </p>

        {/* Recently added */}
        <div className="ComingSoonContainer">
          <p
            className="SimpleText"
            style={{ fontSize: isMobile ? 20 : 25, fontWeight: "bold" }}
          >
            Recently added
          </p>
          <p className="PlainText">• Improved UI </p>
          <p className="PlainText">• Prediction Analysis AI</p>
        </div>

        {/* Navigation */}
        <div
          style={{
            textAlign: "center",
          }}
        >
          {/* Prediction */}
          <>
            <p className="PlainText">Predict future prices of products</p>
            <button
              className="NormalButton"
              onClick={() => {
                setPredictModalVisible(true);
              }}
            >
              <p>Price Prediction</p>
            </button>
          </>

          {/* Compare */}
          <div style={{ marginTop: 60 }}>
            <p className="PlainText">
              Compare thousands of different products side by side
            </p>
            <button
              className="NormalButton"
              onClick={() => {
                setCompareModalVisible(true);
              }}
            >
              <p>Start Comparing</p>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer amplitude={amplitude} isMobile={isMobile} />

      {/* Prediction Category selection modal */}
      <Modal
        isOpen={predictModalVisible}
        contentLabel="Select a comparison"
        className={"ModalContainer"}
        overlayClassName={"ModalOverlay"}
      >
        <p className="HeaderText">Select a category</p>
        {/* Buttons */}
        <div className="ModalButtonSection">
          {/* Buttons to select a category */}
          {predictionCategories.map((item, index) => (
            <button
              className="NormalButtonNoBackground"
              key={item}
              onClick={() => {
                /*amplitude.track("Prediction Screen", {
                  Screen: item,
                  Platform: isMobile ? "Mobile" : "Computer",
                });*/

                navigate(`${predictionLinks[index]}`);

                setPredictModalVisible(false);
              }}
            >
              <p>{item}</p>
            </button>
          ))}
        </div>
        {/* Cancel Button */}
        <button
          className="DangerButton"
          onClick={() => {
            setPredictModalVisible(false);
          }}
        >
          Cancel
        </button>
      </Modal>
      {/* Comparison Category selection modal */}
      <Modal
        isOpen={compareModalVisible}
        contentLabel="Select a comparison"
        className={"ModalContainer"}
        overlayClassName={"ModalOverlay"}
      >
        <p className="HeaderText">Select a category</p>
        {/* Buttons */}
        <div className="ModalButtonSection">
          {/* Buttons to select a category */}
          {comparisonCategories.map((item, index) => (
            <button
              className="NormalButtonNoBackground"
              key={item}
              onClick={() => {
                navigate(`${comparisonLinks[index]}`);

                setCompareModalVisible(false);
              }}
            >
              <p>{item}</p>
            </button>
          ))}
        </div>
        {/* Cancel Button */}
        <button
          className="DangerButton"
          onClick={() => {
            setCompareModalVisible(false);
          }}
        >
          Cancel
        </button>
      </Modal>
    </>
  );
}
