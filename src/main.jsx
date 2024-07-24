import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("SpecGauge")).render(
  // Strict Mode
  // WARNING: WHEN ENABLING, PRESET LINKS MAY NOT WORK AS INTENDED
  <StrictMode>
    <App />
  </StrictMode>

  // Production mode
  //<App />
);
