import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Loading } from "./components/Loading";
import useWindowDimensions from "./useWindowDimensions";
const WebHome = lazy(() => import("./pages/WebHome"));
const WebLogIn = lazy(() => import("./pages/WebLogIn"));
const WebUserAccount = lazy(() => import("./pages/WebUserAccount"));
const Compare = lazy(() => import("./pages/Compare"));
const Prediction = lazy(() => import("./pages/Prediction"));
const NoPage = lazy(() => import("./pages/NoPage"));

// Firebase
import { onAuthStateChanged } from "firebase/auth";
import { logEvent } from "firebase/analytics";
import { auth, analytics } from "./firebaseConfig";

export default function App() {
  const [userVal, setUserVal] = useState(false);
  const isMobile = useWindowDimensions();

  useEffect(() => {
    // listen for changes (sign in, sign out)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // update userVal upon any change
      setUserVal(user);
    });

    return () => {
      unsubscribe();
    };
  });

  useEffect(() => {
    try {
      const userLanguage = navigator.language || navigator.userLanguage;

      if (analytics != null) {
        logEvent(analytics, "User Language", {
          Language: userLanguage,
          Platform: isMobile ? "Mobile" : "Computer",
        });
      }
    } catch {
      // Might not need this to be a try catch
      if (analytics != null) {
        logEvent(analytics, "No User Language", {
          Platform: isMobile ? "Mobile" : "Computer",
        });
      }
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* in case user goes to specgauge.com, instead of specgauge.com/home */}
          <Route
            path="/"
            element={
              <Suspense fallback={<Loading></Loading>}>
                <WebHome isMobile={isMobile}></WebHome>
              </Suspense>
            }
          ></Route>
          {/* the home page */}
          <Route
            index
            path="/home"
            element={
              <Suspense fallback={<Loading></Loading>}>
                <WebHome isMobile={isMobile}></WebHome>
              </Suspense>
            }
          ></Route>
          {/* the login page */}
          <Route
            index
            path="/login"
            element={
              <Suspense fallback={<Loading></Loading>}>
                <WebLogIn isMobile={isMobile}></WebLogIn>
              </Suspense>
            }
          ></Route>
          {/* the user account page */}
          <Route
            index
            path="/account"
            element={
              <Suspense fallback={<Loading></Loading>}>
                <WebUserAccount isMobile={isMobile}></WebUserAccount>
              </Suspense>
            }
          ></Route>
          {/* the cars comparison page */}
          <Route
            path="/comparison/automobiles/*"
            element={
              <Suspense fallback={<Loading></Loading>}>
                <Compare
                  type={"Vehicles"}
                  isMobile={isMobile}
                  comparisonLink={
                    window.location.origin + "/comparison/automobiles/"
                  }
                  description={`Compare multiple new and used Cars, SUVs, Trucks and Electric Vehicle (EVs) and more side-by-side. The ultimate automobile comparison tool.`}
                  defaultTitle={`Compare Multiple Vehicles Side-by-Side - Car Comparison Tool`}
                ></Compare>
              </Suspense>
            }
          ></Route>
          {/* the cpus comparison page */}
          <Route
            path="/comparison/cpus/*"
            element={
              <Suspense fallback={<Loading></Loading>}>
                <Compare
                  type={"CPUs"}
                  isMobile={isMobile}
                  comparisonLink={window.location.origin + "/comparison/cpus/"}
                  description={`Compare AMD Ryzen vs Intel Core processors side-by-side. View real-world benchmark performance in the ultimate CPU comparison tool.`}
                  defaultTitle={`Compare Multiple Processors Side-by-Side - CPUs Comparison Tool`}
                ></Compare>
              </Suspense>
            }
          ></Route>
          {/* the graphics cards comparison page */}
          <Route
            path="/comparison/graphicsCards/*"
            element={
              <Suspense fallback={<Loading></Loading>}>
                <Compare
                  type={"Graphics Cards"}
                  isMobile={isMobile}
                  comparisonLink={
                    window.location.origin + "/comparison/graphicsCards/"
                  }
                  description={`Compare NVIDIA GeForce vs AMD Radeon vs Intel Alchemist GPUs side-by-side. Including GTX 10, RTX 20, RTX 30, RTX 40 series and RX 5000 - RX 7000 GPUs.`}
                  defaultTitle={`Compare Multiple GPUs Side-by-Side - Graphics Cards Comparison Tool`}
                ></Compare>
              </Suspense>
            }
          ></Route>
          {/* the drones comparison page */}
          <Route
            path="/comparison/drones/*"
            element={
              <Suspense fallback={<Loading></Loading>}>
                <Compare
                  type={"Drones"}
                  isMobile={isMobile}
                  comparisonLink={
                    window.location.origin + "/comparison/drones/"
                  }
                  description={`Compare DJI, Autel, Parrot, Holy Stone and more drones side-by-side. View the DJI Mini, Autel Evo, Parrot Anafi in the ultimate drone comparison tool.`}
                  defaultTitle={`Compare Multiple Drones Side-by-Side - Drone Comparison Tool`}
                ></Compare>
              </Suspense>
            }
          ></Route>
          {/* the automobiles prediction page */}
          <Route
            path="/prediction/automobiles/*"
            element={
              <Suspense fallback={<Loading></Loading>}>
                <Prediction
                  type={"Vehicles"}
                  isMobile={isMobile}
                  minimumPrice={3000}
                  description={`View future prices of Cars, SUVs, Trucks, Electric (EVs) and more over time and into the future. View new and used vehicle depreciation and value.`}
                  predictionLink={
                    window.location.origin + "/prediction/automobiles/"
                  }
                  minimumAdjuster={1000}
                ></Prediction>
              </Suspense>
            }
          ></Route>
          {/* the cpus prediction page */}
          <Route
            path="/prediction/cpus/*"
            element={
              <Suspense fallback={<Loading></Loading>}>
                <Prediction
                  type={"CPUs"}
                  isMobile={isMobile}
                  minimumPrice={100}
                  description={`View future prices of processors over time and into the future. Predict future costs and view past prices.`}
                  predictionLink={window.location.origin + "/prediction/cpus/"}
                  minimumAdjuster={10}
                ></Prediction>
              </Suspense>
            }
          ></Route>
          {/* the graphics cards prediction page */}
          <Route
            path="/prediction/graphicsCards/*"
            element={
              <Suspense fallback={<Loading></Loading>}>
                <Prediction
                  type={"Graphics Cards"}
                  isMobile={isMobile}
                  minimumPrice={100}
                  description={`View future prices of GPUs over time and into the future. Predict future costs and view past prices.`}
                  predictionLink={
                    window.location.origin + "/prediction/graphicsCards/"
                  }
                  minimumAdjuster={10}
                ></Prediction>
              </Suspense>
            }
          ></Route>
          {/* any other page, error 404 */}
          <Route
            path="*"
            element={
              <Suspense fallback={<Loading></Loading>}>
                <NoPage isMobile={isMobile}></NoPage>
              </Suspense>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
