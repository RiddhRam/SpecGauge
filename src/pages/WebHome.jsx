import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Modal from "react-modal";
import { Helmet } from "react-helmet";
Modal.setAppElement("#SpecGauge");

import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import SetTitleAndDescription from "../functions/SetTitleAndDescription";
import CompareIcon from "../assets/Comparison Icon.svg";
import PredictIcon from "../assets/Prediction Icon.svg";

import { logEvent } from "firebase/analytics";
import { analytics } from "../firebaseConfig";

// The categories to select from the modals
const comparisonCategories = [
  "Vehicles",
  "Consoles",
  "CPUs",
  "Graphics Cards",
  "Drones",
];

const predictionCategories = ["Vehicles", "Graphics Cards", "CPUs"];

// The available links to navigate to from the modals
const comparisonLinks = [
  "/comparison/automobiles/",
  "/comparison/consoles/",
  "/comparison/cpus/",
  "/comparison/graphicsCards/",
  "/comparison/drones/",
];

const predictionLinks = [
  "/prediction/automobiles/",
  "/prediction/graphicsCards/",
  "/prediction/cpus/",
];

// The trending comparisons to display
const trendingComparisons = [
  {
    Category: "Vehicles",
    Product1: "2018 Mercedes-Benz AMG C63S V8 (510 Hp)",
    Product2: "2018 BMW M3 Competition (450 Hp)",
    Path: `/comparison/automobiles/Mercedes-Benz%3BC-class%3B2018%3BAMG%20C%2063%20S%20V8%20(510%20Hp)%20SPEEDSHIFT%20MCT%20Station%20wagon%20(estate)%7Cvs%7CBMW%3BM3%3B2018%3BCompetition%203.0%20(450%20Hp)%20Sedan`,
  },
  {
    Category: "Consoles",
    Product1: "Sony PlayStation 5 Slim",
    Product2: "Microsoft Xbox Series S",
    Path: `/comparison/consoles/Sony%3BPlayStation%205%20Slim%7Cvs%7CMicrosoft%3BXbox%20Series%20S`,
  },
  {
    Category: "CPUs",
    Product1: "AMD Ryzen 9 7900X",
    Product2: "Intel Core i9-14900K",
    Path: `/comparison/cpus/AMD%3BRyzen%209%3BRyzen%209%207900X%7Cvs%7CIntel%3BCore%20i9%3BCore%20i9-14900K`,
  },
  {
    Category: "Graphics Cards",
    Product1: "NVIDIA GeForce RTX 4090",
    Product2: "AMD Radeon RX 7990 XTX",
    Path: `/comparison/graphicsCards/NVIDIA%3BGeForce%2040%3BGeForce%20RTX%204090%7Cvs%7CAMD%3BNavi%20III%3BRadeon%20RX%207990%20XTX`,
  },
  {
    Category: "Drones",
    Product1: "DJI Mini 4 Pro",
    Product2: "Autel Evo II",
    Path: `/comparison/drones/DJI%3BMini%204%20Pro%7Cvs%7CAutel%3BEvo%20II`,
  },
  {},
  {
    Category: "Vehicles",
    Product1: "2020 Toyota Corolla Hybrid (122 Hp)",
    Product2: "2020 Honda Civic (205 Hp)",
    Path: `/comparison/automobiles/Toyota%3BCorolla%3B2020%3B1.8i%20(122%20Hp)%20Hybrid%20e-CVT%20Sedan%7Cvs%7CHonda%3BCivic%3B2020%3BSi%201.5T%20(205%20Hp)%20Sedan`,
  },
  {
    Category: "CPUs",
    Product1: "AMD Ryzen 5 7600X",
    Product2: "Intel Core i5-14600K",
    Path: `/comparison/cpus/AMD%3BRyzen%205%3BRyzen%205%207600X%7Cvs%7CIntel%3BCore%20i5%3BCore%20i5-14600K`,
  },
  {
    Category: "Graphics Cards",
    Product1: "NVIDIA GeForce RTX 3060 12GB",
    Product2: "Intel Arc A770 16GB",
    Path: `/comparison/graphicsCards/NVIDIA%3BGeForce%2030%3BGeForce%20RTX%203060%2012%20GB%20GA104%7Cvs%7CIntel%3BAlchemist%3BArc%20A770`,
  },
];

// Display less for the mobile screen
// The trending comparisons to display
const mobileTrendingComparisons = [
  {
    Category: "Vehicles",
    Product1: "2018 Mercedes-Benz AMG C63S V8 (510 Hp)",
    Product2: "2018 BMW M3 Competition (450 Hp)",
    Path: `/comparison/automobiles/Mercedes-Benz%3BC-class%3B2018%3BAMG%20C%2063%20S%20V8%20(510%20Hp)%20SPEEDSHIFT%20MCT%20Station%20wagon%20(estate)%7Cvs%7CBMW%3BM3%3B2018%3BCompetition%203.0%20(450%20Hp)%20Sedan`,
  },
  {
    Category: "Consoles",
    Product1: "Sony PlayStation 5 Slim",
    Product2: "Microsoft Xbox Series S",
    Path: `/comparison/consoles/Sony%3BPlayStation%205%20Slim%7Cvs%7CMicrosoft%3BXbox%20Series%20S`,
  },
  {
    Category: "CPUs",
    Product1: "AMD Ryzen 9 7900X",
    Product2: "Intel Core i9-14900K",
    Path: `/comparison/cpus/AMD%3BRyzen%209%3BRyzen%209%207900X%7Cvs%7CIntel%3BCore%20i9%3BCore%20i9-14900K`,
  },
  {
    Category: "Graphics Cards",
    Product1: "NVIDIA GeForce RTX 4090",
    Product2: "AMD Radeon RX 7990 XTX",
    Path: `/comparison/graphicsCards/NVIDIA%3BGeForce%2040%3BGeForce%20RTX%204090%7Cvs%7CAMD%3BNavi%20III%3BRadeon%20RX%207990%20XTX`,
  },
];

export default function WebHome({ isMobile }) {
  const dropdownRef = useRef(null);
  {
    /* This is for the modal that determines the comparison type */
  }
  // Show select compare category modal
  const [compareModalVisible, setCompareModalVisible] = useState(false);
  // Show select predict category modal
  const [predictModalVisible, setPredictModalVisible] = useState(false);
  // Show request data modal
  const [dataModalVisible, setDataModalVisible] = useState(false);
  // Data being requested
  const [requestData, setRequestData] = useState("");
  // In case user doesn't select a type or requests no data
  const [invalidData, setInvalidData] = useState(false);
  // Tell user reason data was invalid
  const [invalidDataReason, setInvalidDataReason] = useState("");
  // To simulate a loading time when user requests data, so user feels more satisfied, also prevents spam
  const [requestingData, setRequestingData] = useState(false);
  // Show this when user is done, to confirm, and to prevent spam
  const [doneRequest, setDoneRequest] = useState(false);
  const navigate = useNavigate();
  {
    /* Records the initial load of the website */
  }

  useEffect(() => {
    setTimeout(() => {
      if (analytics != null) {
        logEvent(analytics, "Screen", {
          Screen: "Home",
          Platform: isMobile ? "Mobile" : "Computer",
        });
      }
    }, 1500);

    SetTitleAndDescription(
      "SpecGauge | Compare Products and Predict Prices",
      "Explore SpecGauge: Easily compare vehicles and electronics side by side. Predict future prices to make informed decisions before you buy. All the tools in one place.",
      window.location.href
    );

    //const userLanguage = navigator.language || navigator.userLanguage;
    //alert(userLanguage);
  }, []);

  return (
    <>
      {/* Set canonical for search engines */}
      <Helmet>
        <link rel="canonical" href={window.location.origin} />
      </Helmet>

      {/* Navbar */}
      <Navbar isMobile={isMobile} page={"home"} />

      {/* Main div */}
      <div className="LargeContainer">
        {/* Select tool type and view trending comparisons, default screen */}
        {/* Subtitle */}
        <h2
          className="SimpleText"
          style={{
            fontSize: isMobile ? 16 : 25,
            marginTop: 50,
            marginBottom: 30,
          }}
        >
          Compare Today. Predict Tomorrow.
        </h2>

        {/* COMPARE THOUSANDS OF PRODUCTS SIDE BY SIDE */}
        <h3
          className="ReversePlainText"
          style={{
            fontSize: isMobile ? 15 : 20,
            backgroundColor: "#39FF14",
            padding: "10px",
            textAlign: "center",
            margin: "0 5px",
          }}
        >
          {"COMPARE THOUSANDS OF PRODUCTS"}
          <br />
          {"SIDE BY SIDE"}
        </h3>

        {/* Compare Icon goes here */}
        <img
          src={CompareIcon}
          alt="Compare Icon"
          style={{ margin: "30px 0" }}
        ></img>

        {/* Start Comparing button */}
        <button
          className="NormalButton"
          onClick={() => {
            setCompareModalVisible(true);
          }}
        >
          <p>Start Comparing</p>
        </button>

        {/* Trending Comparisons */}
        <>
          <h4
            className="SimpleText"
            style={{ fontSize: isMobile ? 15 : 20, marginTop: 50 }}
          >
            Trending Comparisons
          </h4>
          {isMobile ? (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(2, 1fr)`,
                  gridTemplateRows: `205px 205px`,
                  columnGap: "10px",
                  rowGap: "10px",
                  margin: "10px 50px",
                }}
              >
                {/* First 3 items on first row */}
                {mobileTrendingComparisons.map(
                  (comparisonItem, comparisonIndex) => (
                    <div
                      className="TrendingComparison"
                      style={{
                        borderStyle: "none",
                        borderRadius: "10px",
                        display: "grid",
                        gridTemplateColumns: "1fr",
                        gridTemplateRows: "30px 40px 30px 50px 30px",
                        padding: "0 2px",
                        minWidth: "134px",
                      }}
                      key={comparisonIndex}
                    >
                      <p
                        style={{
                          color: "#4ca0d7",
                          textAlign: "center",
                          fontSize: "15px",
                        }}
                      >
                        {comparisonItem.Category}
                      </p>
                      <p
                        className="TrendingComparisonText"
                        style={{ fontSize: "12px" }}
                      >
                        {comparisonItem.Product1}
                      </p>
                      <p
                        className="TrendingComparisonText"
                        style={{ fontSize: "11px" }}
                      >
                        VS
                      </p>
                      <p
                        className="TrendingComparisonText"
                        style={{ fontSize: "12px" }}
                      >
                        {comparisonItem.Product2}
                      </p>

                      <Link
                        to={comparisonItem.Path}
                        className="TrendingComparisonButton"
                        style={{ fontSize: "12px" }}
                        onClick={(event) => {
                          event.preventDefault();
                          if (analytics != null) {
                            logEvent(analytics, "Trending Comparison", {
                              // Screen type
                              Category: comparisonItem.Category,
                              Platform: "Mobile",
                            });
                          }
                          navigate(comparisonItem.Path);
                        }}
                      >
                        Compare
                      </Link>
                    </div>
                  )
                )}
              </div>
            </>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(5, 1fr)`,
                gridTemplateRows: `205px 205px`,
                columnGap: "7px",
                rowGap: "10px",
                margin: "0 100px",
              }}
            >
              {trendingComparisons.map((comparisonItem, comparisonIndex) =>
                comparisonIndex != 5 ? (
                  <div
                    className="TrendingComparison"
                    style={{
                      borderStyle: "none",
                      borderRadius: "10px",
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gridTemplateRows: "30px 40px 30px 60px 30px",
                      minWidth: "145px",
                    }}
                    key={comparisonIndex}
                  >
                    <p
                      style={{
                        color: "#4ca0d7",
                        textAlign: "center",
                        fontSize: "16px",
                      }}
                    >
                      {comparisonItem.Category}
                    </p>
                    <p
                      className="TrendingComparisonText"
                      style={{ fontSize: "13px" }}
                    >
                      {comparisonItem.Product1}
                    </p>
                    <p
                      className="TrendingComparisonText"
                      style={{ fontSize: "13px" }}
                    >
                      VS
                    </p>
                    <p
                      className="TrendingComparisonText"
                      style={{ fontSize: "13px" }}
                    >
                      {comparisonItem.Product2}
                    </p>

                    <Link
                      to={comparisonItem.Path}
                      className="TrendingComparisonButton"
                      style={{ fontSize: "13px" }}
                      onClick={(event) => {
                        event.preventDefault();
                        if (analytics != null) {
                          logEvent(analytics, "Trending Comparison", {
                            // Screen type
                            Category: comparisonItem.Category,
                            Platform: "Mobile",
                          });
                        }
                        navigate(comparisonItem.Path);
                      }}
                    >
                      Compare
                    </Link>
                  </div>
                ) : (
                  <div key={comparisonIndex}></div>
                )
              )}
            </div>
          )}
        </>

        {/* Prediction */}
        {/* PREDICT FUTURE PRICES */}
        <h3
          className="ReversePlainText"
          style={{
            margin: "40px 5px 0px 5px",
            fontSize: isMobile ? 15 : 20,
            backgroundColor: "#A855F7",
            padding: "10px",
            textAlign: "center",
          }}
        >
          PREDICT FUTURE PRICES
        </h3>

        {/* Predict Icon goes here */}
        <img
          src={PredictIcon}
          alt="Predict Icon"
          style={{ margin: "30px 0" }}
        ></img>

        {/* Price Prediction button */}
        <button
          className="NormalButton"
          onClick={() => {
            setPredictModalVisible(true);
          }}
        >
          <p>Price Prediction</p>
        </button>

        {/* User request or submit data */}
        {/* SUBMIT OR REQUEST DATA */}
        <h3
          className="ReversePlainText"
          style={{
            margin: "80px 0px 30px 0px",
            fontSize: isMobile ? 15 : 20,
            backgroundColor: "#F8FF00",
            padding: "10px",
            textAlign: "center",
          }}
        >
          SUBMIT OR REQUEST DATA
        </h3>

        <button
          className="NormalButton"
          onClick={() => {
            setDataModalVisible(true);
          }}
        >
          <p>Submit or Request Data</p>
        </button>
      </div>

      {/* Footer */}
      <Footer isMobile={isMobile} />

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
                if (analytics != null) {
                  logEvent(analytics, "Modal Button", {
                    Type: "Comparison",
                    Category: item,
                    Platform: isMobile ? "Mobile" : "Computer",
                  });
                }
                navigate(`${comparisonLinks[index]}`);
                setCompareModalVisible(false);
              }}
              style={{
                width: "95%",
                whiteSpace: "nowrap",
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
          style={{ marginBottom: "20px" }}
        >
          Cancel
        </button>
      </Modal>

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
                if (analytics != null) {
                  logEvent(analytics, "Modal Button", {
                    Type: "Prediction",
                    Category: item,
                    Platform: isMobile ? "Mobile" : "Computer",
                  });
                }

                navigate(`${predictionLinks[index]}`);

                setPredictModalVisible(false);
              }}
              style={{
                width: "95%",
                whiteSpace: "nowrap",
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
          style={{ marginBottom: "20px" }}
        >
          Cancel
        </button>
      </Modal>

      {/* Data Request modal */}
      <Modal
        isOpen={dataModalVisible}
        contentLabel="Select a request type"
        className={"ModalContainer"}
        overlayClassName={"ModalOverlay"}
      >
        <p className="HeaderText">Submit or Request Data</p>

        {!requestingData && !doneRequest && (
          <>
            {/* Dropdown Menu */}
            <select
              name="type"
              id="type"
              ref={dropdownRef}
              style={{ marginBottom: "30px" }}
            >
              <option value="">Please choose a type</option>
              <option value="Request-Product">Request Product</option>
              <option value="Request-Category">Request Category</option>
              <option value="Submit-Data">Submit Data</option>
              <option value="Submit-Fix">Submit Fix</option>
            </select>

            <textarea
              value={requestData}
              className="RequestDataTextInput"
              placeholder="What would you like us to do?"
              onChange={(event) => setRequestData(event.target.value)}
            ></textarea>

            {invalidData && <p className="ErrorText">{invalidDataReason}</p>}

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                height: "50px",
                padding: "10px",
              }}
            >
              {/* Cancel button */}
              <button
                onClick={() => {
                  setDataModalVisible(false);
                  setInvalidData(false);
                }}
                className="DangerButton"
                style={{ marginRight: "10px" }}
              >
                <p>Cancel</p>
              </button>

              {/* Submit or Request button */}
              <button
                onClick={() => {
                  if (dropdownRef.current.value.split("-")[0] == "") {
                    setInvalidData(true);
                    setInvalidDataReason("Please choose a type first");
                  } else if (requestData == "") {
                    setInvalidData(true);
                    setInvalidDataReason(
                      "Please tell us what you want us to add"
                    );
                  } else {
                    setRequestingData(true);
                    setTimeout(() => {
                      setRequestingData(false);
                      setDoneRequest(true);
                    }, 200);

                    if (analytics != null) {
                      logEvent(analytics, dropdownRef.current.value, {
                        // Request data
                        Request: requestData,
                      });
                    }

                    setInvalidData(false);
                  }
                }}
                className="NormalButton"
              >
                <p>Submit/Request</p>
              </button>
            </div>
          </>
        )}

        {/* Show this so user sees a buffer animation */}
        {requestingData && (
          <div
            className="ActivityIndicator"
            style={{ marginBottom: "20px" }}
          ></div>
        )}

        {doneRequest && (
          <>
            <p className="SuccessText">
              Your request was submitted. Thank you for your contribution!
            </p>
            {/* Submit or Request button */}
            <button
              onClick={() => {
                setDoneRequest(false);
                setRequestData("");
                setDataModalVisible(false);
              }}
              className="NormalButton"
              style={{ marginBottom: "20px" }}
            >
              <p>Okay</p>
            </button>
          </>
        )}
      </Modal>
    </>
  );
}
