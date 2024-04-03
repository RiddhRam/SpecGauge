// Boostrap design
import "bootstrap/dist/css/bootstrap.css";
import { SGStyles } from "../styles/styles";
import WebHome from "./components/WebHome";
import WebLogIn from "./components/WebLogIn";
import WebDefaultPage from "./components/WebDefaultPage";

import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function WebApp() {
  // Call SGStyles as styles
  const styles = SGStyles();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WebDefaultPage></WebDefaultPage>}></Route>{" "}
        {/* in case user goes to specgauge.com, instead of specgauge.com/home*/}
        <Route index path="/home" element={<WebHome></WebHome>}></Route>
        {/* the home page */}
        <Route path="/login" element={<WebLogIn></WebLogIn>}></Route>
        {/* the sign up/log in page */}
      </Routes>
    </BrowserRouter>
  );
}
