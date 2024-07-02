import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("SpecGauge")).render(
  // Strict Mode
  // WARNING: WHEN ENABLING, PRESET LINKS MAY NOT WORK AS INTENDED
  <React.StrictMode>
    <App />
  </React.StrictMode>

  // Production mode
  //<App />
);
