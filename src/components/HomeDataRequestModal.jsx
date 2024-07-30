import { logEvent } from "firebase/analytics";
import { useState, useRef } from "react";

export default function HomeDataRequestModal({
  analytics,
  isMobile,
  setDataModalVisible,
}) {
  const dropdownRef = useRef(null);
  // To simulate a loading time when user requests data, so user feels more satisfied, also prevents spam
  const [requestingData, setRequestingData] = useState(false);
  // Show this when user is done, to confirm, and to prevent spam
  const [doneRequest, setDoneRequest] = useState(false);
  // In case user doesn't select a type or requests no data
  const [invalidData, setInvalidData] = useState(false);
  // Tell user reason data was invalid
  const [invalidDataReason, setInvalidDataReason] = useState("");
  // Data being requested
  const [requestData, setRequestData] = useState("");

  return (
    <>
      <p className="HeaderText">Submit or Request Comparison Data</p>

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
              style={{
                marginRight: "10px",
                fontSize: isMobile ? "12px" : "20px",
              }}
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
              style={{
                fontSize: isMobile ? "12px" : "20px",
              }}
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
            style={{
              marginBottom: "20px",
            }}
          >
            <p>Okay</p>
          </button>
        </>
      )}
    </>
  );
}
