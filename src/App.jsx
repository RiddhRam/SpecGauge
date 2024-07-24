import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import useWindowDimensions from "./useWindowDimensions";
import WebHome from "./pages/WebHome";
const WebLogIn = lazy(() => import("./pages/WebLogIn"));
const WebUserAccount = lazy(() => import("./pages/WebUserAccount"));
const Compare = lazy(() => import("./pages/Compare"));
const Prediction = lazy(() => import("./pages/Prediction"));
const Information = lazy(() => import("./pages/Information"));
const NoPage = lazy(() => import("./pages/NoPage"));

// Firebase
import { onAuthStateChanged } from "firebase/auth";
import { query, where, collection, getDocs } from "firebase/firestore";
import { db, auth } from "./firebaseConfig";

import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Loading } from "./components/Loading";

const fast = -0.12;
const normal = -0.09;
const reputable = -0.075;
const reliable = -0.06;
const reliableMotorCycle = -0.07;
const reputableMotorCycle = -0.055;
const expensiveSportMotorCycle = -0.045;
const inBetweenCars = -0.045;
const superReliable = -0.035;
const expensiveSport = -0.03;
const superMotorCycle = -0.025;
const superCar = -0.02;

const gpuFast = -0.16;
const gpuNormal = -0.12;

const cpuNormal = -0.12;

const carsAveragePrices = [
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  24596.49306,
  24568.04833,
  24499.73456,
  23629.92042,
  26551.32829,
  35249.10294,
  34998.1869,
  31601.678,
  29804.43696,
  28069.02268,
  26335.33643,
  26434.31044,
  26533.18701,
  26631.96533,
  26730.64605,
  26829.22803,
  26927.71208,
  27026.09842,
  27124.38395,
  27222.57373,
  27320.66564,
  27706.09402,
  28091.13666,
  28475.79633,
  28860.07368,
  29243.96935,
  29627.4796,
  30010.60948,
  30393.35726,
  30775.72255,
  31157.70719,
  31539.31261,
  31920.53863,
  32301.38433,
  32681.85482,
  33061.94786,
  32613.79568,
  32166.10259,
  31718.85731,
];

const carsBrandValues = [
  { label: "Acura", value: reliable },
  { label: "Alfa Romeo", value: reputable },
  { label: "Alpine", value: inBetweenCars },
  { label: "Aston Martin", value: expensiveSport },
  { label: "Audi", value: reputable },
  { label: "Bentley", value: expensiveSport },
  { label: "BMW", value: reputable },
  { label: "BMW M-Series", value: expensiveSport },
  { label: "BMW Motorcycle", value: expensiveSportMotorCycle },
  { label: "Bugatti", value: superCar },
  { label: "Buick", value: normal },
  { label: "BYD", value: normal },
  { label: "Cadillac", value: normal },
  { label: "Chevrolet", value: normal },
  { label: "Chevrolet Corvette", value: reputable },
  { label: "Chrysler", value: normal },
  { label: "Citroen", value: fast },
  { label: "Daewoo", value: normal },
  { label: "Dodge", value: reputable },
  { label: "Ducati", value: reliableMotorCycle },
  { label: "Ferrari", value: superCar },
  { label: "Fiat", value: fast },
  { label: "Fisker", value: fast },
  { label: "Ford", value: reputable },
  { label: "Genesis", value: normal },
  { label: "GMC", value: normal },
  { label: "Harley-Davidson", value: expensiveSportMotorCycle },
  { label: "Hennessey", value: superCar },
  { label: "Honda", value: reliable },
  { label: "Honda Motorcycle", value: superMotorCycle },
  { label: "Hummer", value: fast },
  { label: "Hyundai", value: normal },
  { label: "INEOS", value: fast },
  { label: "Infiniti", value: normal },
  { label: "Isuzu", value: normal },
  { label: "Jaguar", value: expensiveSport },
  { label: "Jeep", value: normal },
  { label: "Karma", value: normal },
  { label: "Kawasaki", value: expensiveSportMotorCycle },
  { label: "Kia", value: normal },
  { label: "Koenigsegg", value: superCar },
  { label: "KTM", value: expensiveSport },
  { label: "Lamborghini", value: superCar },
  { label: "Land Rover", value: normal },
  { label: "Lexus", value: reliable },
  { label: "Lincoln", value: normal },
  { label: "Lotus", value: normal },
  { label: "Lucid", value: normal },
  { label: "Maserati", value: expensiveSport },
  { label: "Maybach", value: superCar },
  { label: "Mazda", value: reliable },
  { label: "McLaren", value: expensiveSport },
  { label: "Mercedes-AMG", value: inBetweenCars },
  { label: "Mercedes-Benz", value: reputable },
  { label: "Mercury", value: normal },
  { label: "Mini", value: fast },
  { label: "Mitsubishi", value: superReliable },
  { label: "Nissan", value: reliable },
  { label: "Oldsmobile", value: normal },
  { label: "Opel", value: normal },
  { label: "Pagani", value: superCar },
  { label: "Panoz", value: normal },
  { label: "Peugeot", value: normal },
  { label: "Plymouth", value: normal },
  { label: "Polestar", value: normal },
  { label: "Pontiac", value: normal },
  { label: "Porsche", value: expensiveSport },
  { label: "RAM", value: normal },
  { label: "Renault", value: normal },
  { label: "Rimac", value: superCar },
  { label: "Rivian", value: normal },
  { label: "Rolls-Royce", value: expensiveSport },
  { label: "Saab", value: normal },
  { label: "Saturn", value: normal },
  { label: "Scion", value: normal },
  { label: "Smart", value: fast },
  { label: "Spyker", value: normal },
  { label: "Subaru", value: reliable },
  { label: "Suzuki", value: normal },
  { label: "Suzuki Motorcycle", value: reputableMotorCycle },
  { label: "Tata", value: normal },
  { label: "Tesla", value: reputable },
  { label: "Toyota", value: superReliable },
  { label: "Triumph", value: expensiveSportMotorCycle },
  { label: "VinFast", value: fast },
  { label: "Volkswagen", value: normal },
  { label: "Volvo", value: reliable },
  { label: "Xiaomi", value: fast },
  { label: "Yamaha", value: expensiveSportMotorCycle },
];

// first parameter is name of option
// second parameter is default value
// third parameter is starting year, value lower than 2000 means to add that many years to vehicle production year
// fourth parameter is rate change after the third parameter year, 100 means the opposite of vehicle's original rate of change
// PUT ANY ADDITION RATE CHANGES (fourth parameter) BEFORE MULTIPLICATION CHANGES
const carsAdditionalOptions = [
  ["Collectible", false, 25, -1],
  ["Gasoline/Diesel", true, 2035, 0.04],
];

const graphicsCardsBrandValues = [
  { label: "AMD", value: gpuFast },
  { label: "Intel", value: gpuFast },
  { label: "NVIDIA", value: gpuNormal },
];

const processorsBrandValues = [
  { label: "AMD", value: cpuNormal },
  { label: "Intel", value: cpuNormal },
];

export default function App() {
  const [userVal, setUserVal] = useState(false);
  const isMobile = useWindowDimensions();

  const queryAutomobilesFunction = async (brand, model) => {
    const colRef = collection(db, "Automobiles");
    const q = await query(
      colRef,
      where("Brand", "==", brand),
      where("Model", "==", model)
    );

    const snapshot = await getDocs(q);

    const automobilesArray = [];
    snapshot.forEach((doc) => {
      automobilesArray.push(doc.data());
    });

    return automobilesArray;
  };

  const directQueryAutomobilesFunction = async (product) => {
    const colRef = collection(db, "Automobiles");
    const q = await query(
      colRef,
      where("Brand", "==", product[0]),
      where("Model", "==", product[1]),
      where("Year", "==", product[2]),
      where("Trim", "==", product[3])
    );

    const snapshot = await getDocs(q);
    const automobilesArray = [];
    snapshot.forEach((doc) => {
      automobilesArray.push(doc.data());
    });

    // Should only be 1 item so return the first
    return automobilesArray[0];
  };

  const queryConsolesFunction = async (brand, name) => {
    const colRef = collection(db, "Consoles");
    const q = await query(
      colRef,
      where("Brand", "==", brand),
      where("Name", "==", name)
    );

    const snapshot = await getDocs(q);

    const ConsolesArray = [];
    snapshot.forEach((doc) => {
      ConsolesArray.push(doc.data());
    });

    return ConsolesArray;
  };

  const directQueryConsolesFunction = async (product) => {
    const colRef = collection(db, "Consoles");
    const q = query(
      colRef,
      where("Brand", "==", product[0]),
      where("Name", "==", product[1])
    );

    const snapshot = await getDocs(q);
    const consolesArray = [];
    snapshot.forEach((doc) => {
      consolesArray.push(doc.data());
    });

    // Should only be 1 item so return the first
    return consolesArray[0];
  };

  const queryGraphicsCardsFunction = async (brand, generation) => {
    const colRef = collection(db, "Graphics Cards");
    const q = await query(
      colRef,
      where("Brand", "==", brand),
      where("Generation", "==", generation)
    );

    const snapshot = await getDocs(q);

    const GraphicsCardsArray = [];
    snapshot.forEach((doc) => {
      GraphicsCardsArray.push(doc.data());
    });

    return GraphicsCardsArray;
  };

  const directQueryGraphicsCardsFunction = async (product) => {
    const colRef = collection(db, "Graphics Cards");
    const q = query(
      colRef,
      where("Brand", "==", product[0]),
      where("Generation", "==", product[1]),
      where("Card", "==", product[2])
    );

    const snapshot = await getDocs(q);
    const graphicsCardsArray = [];
    snapshot.forEach((doc) => {
      graphicsCardsArray.push(doc.data());
    });
    // Should only be 1 item so return the first
    return graphicsCardsArray[0];
  };

  const queryCPUsFunction = async (brand, generation) => {
    const colRef = collection(db, "CPUs");
    const q = await query(
      colRef,
      where("Brand", "==", brand),
      where("Generation", "==", generation)
    );

    const snapshot = await getDocs(q);

    const CPUsArray = [];
    snapshot.forEach((doc) => {
      CPUsArray.push(doc.data());
    });

    return CPUsArray;
  };

  const directQueryCPUsFunction = async (product) => {
    const colRef = collection(db, "CPUs");
    const q = query(
      colRef,
      where("Brand", "==", product[0]),
      where("Generation", "==", product[1]),
      where("CPU", "==", product[2])
    );

    const snapshot = await getDocs(q);
    const cpusArray = [];
    snapshot.forEach((doc) => {
      cpusArray.push(doc.data());
    });

    // Should only be 1 item so return the first
    return cpusArray[0];
  };

  const queryDronesFunction = async (brand, name) => {
    const colRef = collection(db, "Drones");
    const q = await query(
      colRef,
      where("Brand", "==", brand),
      where("Name", "==", name)
    );

    const snapshot = await getDocs(q);

    const dronesArray = [];
    snapshot.forEach((doc) => {
      dronesArray.push(doc.data());
    });

    return dronesArray;
  };

  const directQueryDronesFunction = async (product) => {
    const colRef = collection(db, "Drones");
    const q = query(
      colRef,
      where("Brand", "==", product[0]),
      where("Name", "==", product[1])
    );

    const snapshot = await getDocs(q);
    const dronesArray = [];
    snapshot.forEach((doc) => {
      dronesArray.push(doc.data());
    });

    // Should only be 1 item so return the first
    return dronesArray[0];
  };

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

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* in case user goes to specgauge.com, instead of specgauge.com/home */}
          <Route
            path="/"
            element={<WebHome isMobile={isMobile}></WebHome>}
          ></Route>
          {/* the home page */}
          <Route
            index
            path="/home"
            element={<WebHome isMobile={isMobile}></WebHome>}
          ></Route>
          {/* the login page */}
          <Route
            index
            path="/login"
            element={
              <Suspense
                fallback={
                  <>
                    <Navbar isMobile={isMobile}></Navbar>
                    <Loading></Loading>
                  </>
                }
              >
                <WebLogIn isMobile={isMobile}></WebLogIn>
              </Suspense>
            }
          ></Route>
          {/* the user account page */}
          <Route
            index
            path="/account"
            element={
              <Suspense
                fallback={
                  <>
                    <Navbar isMobile={isMobile}></Navbar>
                    <Loading></Loading>
                  </>
                }
              >
                <WebUserAccount isMobile={isMobile}></WebUserAccount>
              </Suspense>
            }
          ></Route>
          {/* the cars comparison page */}
          <Route
            path="/comparison/automobiles/*"
            element={
              <Suspense
                fallback={
                  <>
                    <Navbar isMobile={isMobile}></Navbar>
                    <Loading></Loading>
                  </>
                }
              >
                <Compare
                  type={"Vehicles"}
                  isMobile={isMobile}
                  QueryFunction={queryAutomobilesFunction}
                  DirectQueryFunction={directQueryAutomobilesFunction}
                  comparisonLink={
                    window.location.origin + "/comparison/automobiles/"
                  }
                  description={`Compare multiple new and used Cars, SUVs, Trucks and Electric Vehicle (EVs) and more side-by-side. The ultimate automobile comparison tool.`}
                  defaultTitle={`Compare Multiple Vehicles Side-by-Side - Car Comparison Tool`}
                ></Compare>
              </Suspense>
            }
          ></Route>
          {/* the consoles comparison page */}
          <Route
            path="/comparison/consoles/*"
            element={
              <Suspense
                fallback={
                  <>
                    <Navbar isMobile={isMobile}></Navbar>
                    <Loading></Loading>
                  </>
                }
              >
                <Compare
                  type={"Consoles"}
                  isMobile={isMobile}
                  QueryFunction={queryConsolesFunction}
                  DirectQueryFunction={directQueryConsolesFunction}
                  comparisonLink={
                    window.location.origin + "/comparison/consoles/"
                  }
                  description={`Compare Xbox vs Nintendo vs PlayStation vs Steam Deck and more consoles side-by-side. The ultimate gaming console comparison tool`}
                  defaultTitle={`Compare Multiple Consoles Side-by-Side - Console Comparison Tool`}
                ></Compare>
              </Suspense>
            }
          ></Route>
          {/* the cpus comparison page */}
          <Route
            path="/comparison/cpus/*"
            element={
              <Suspense
                fallback={
                  <>
                    <Navbar isMobile={isMobile}></Navbar>
                    <Loading></Loading>
                  </>
                }
              >
                <Compare
                  type={"CPUs"}
                  isMobile={isMobile}
                  QueryFunction={queryCPUsFunction}
                  DirectQueryFunction={directQueryCPUsFunction}
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
              <Suspense
                fallback={
                  <>
                    <Navbar isMobile={isMobile}></Navbar>
                    <Loading></Loading>
                  </>
                }
              >
                <Compare
                  type={"Graphics Cards"}
                  isMobile={isMobile}
                  QueryFunction={queryGraphicsCardsFunction}
                  DirectQueryFunction={directQueryGraphicsCardsFunction}
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
              <Suspense
                fallback={
                  <>
                    <Navbar isMobile={isMobile}></Navbar>
                    <Loading></Loading>
                  </>
                }
              >
                <Compare
                  type={"Drones"}
                  isMobile={isMobile}
                  QueryFunction={queryDronesFunction}
                  DirectQueryFunction={directQueryDronesFunction}
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
              <Suspense
                fallback={
                  <>
                    <Navbar isMobile={isMobile}></Navbar>
                    <Loading></Loading>
                  </>
                }
              >
                <Prediction
                  type={"Vehicles"}
                  isMobile={isMobile}
                  averagePrices={carsAveragePrices}
                  brandValues={carsBrandValues}
                  minimumPrice={7500}
                  description={`View future prices of Cars, SUVs, Trucks, Electric (EVs) and more over time and into the future. View new and used vehicle depreciation and value.`}
                  predictionLink={
                    window.location.origin + "/prediction/automobiles/"
                  }
                  additionalOptions={carsAdditionalOptions}
                ></Prediction>
              </Suspense>
            }
          ></Route>
          {/* the cpus prediction page */}
          <Route
            path="/prediction/cpus/*"
            element={
              <Suspense
                fallback={
                  <>
                    <Navbar isMobile={isMobile}></Navbar>
                    <Loading></Loading>
                  </>
                }
              >
                <Prediction
                  type={"CPUs"}
                  isMobile={isMobile}
                  averagePrices={null}
                  brandValues={processorsBrandValues}
                  minimumPrice={150}
                  description={`View future prices of processors over time and into the future. Predict future costs and view past prices.`}
                  predictionLink={window.location.origin + "/prediction/cpus/"}
                  additionalOptions={null}
                ></Prediction>
              </Suspense>
            }
          ></Route>
          {/* the graphics cards prediction page */}
          <Route
            path="/prediction/graphicsCards/*"
            element={
              <Suspense
                fallback={
                  <>
                    <Navbar isMobile={isMobile}></Navbar>
                    <Loading></Loading>
                  </>
                }
              >
                <Prediction
                  type={"Graphics Cards"}
                  isMobile={isMobile}
                  averagePrices={null}
                  brandValues={graphicsCardsBrandValues}
                  minimumPrice={200}
                  description={`View future prices of GPUs over time and into the future. Predict future costs and view past prices.`}
                  predictionLink={
                    window.location.origin + "/prediction/graphicsCards/"
                  }
                  additionalOptions={null}
                ></Prediction>
              </Suspense>
            }
          ></Route>
          {/* the about us page */}
          <Route
            path="/aboutus"
            element={
              <Suspense
                fallback={
                  <>
                    <Navbar isMobile={isMobile}></Navbar>
                    <Loading></Loading>
                  </>
                }
              >
                <Information
                  isMobile={isMobile}
                  title={"About Us"}
                  text={
                    /* prettier-ignore */
                    <div>

<p className="InfoText">Welcome to SpecGauge – your ultimate sidekick for tech and car comparisons!</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>

<p className="InfoText">We get it. Making the right choice in a world full of options can be overwhelming. Whether you’re picking out your next car, drone, gaming console, GPU, or CPU, we've got your back. Our mission? To help you make informed decisions with ease and confidence. </p>

<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoSubtitle">What We Do:</p>

<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>

<p className="InfoText" style={{fontWeight: 'bold'}}>• Compare Products Side by Side: </p><p className="InfoText">Check out detailed comparisons of the latest and greatest cars, drones, consoles, GPUs, and CPUs. No more guessing games – see how your top picks stack up against each other in real-time.</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText" style={{fontWeight: 'bold'}}>• Predict Future Prices: </p><p className="InfoText">Wondering how much that new tech or car will cost down the road? Our unique prediction feature lets you forecast prices all the way to 2055. Yep, you read that right. Get ahead of the game and plan your purchases like a pro.</p>

<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoSubtitle">Why SpecGauge?</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>

<p className="InfoText">We blend cutting-edge data analysis with a user-friendly interface to bring you accurate, reliable, and easy-to-understand insights. Our team is passionate about technology and cars, and we’re here to share that passion with you.</p>

<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">Whether you're a tech geek, a car enthusiast, or just someone looking to get the best bang for your buck, SpecGauge is designed with you in mind. We're all about making complex information simple and accessible.</p>

<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">So, dive in, explore, and let us help you find the perfect match for your needs. With SpecGauge, you're not just making a choice; you're making the right choice.</p>

<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">Thanks for stopping by. Let's navigate the future together!</p>
                </div>
                  }
                  description={
                    "Welcome to SpecGauge – your ultimate sidekick for tech and car comparisons. We get it. Making the right choice in a world full of options can be overwhelming. Whether you’re picking out your next car, drone, gaming console, GPU, or CPU, we've got your back. Our mission? To help you make informed decisions with ease and confidence."
                  }
                ></Information>
              </Suspense>
            }
          ></Route>
          {/* the terms of service page */}
          <Route
            path="/termsofservice"
            element={
              <Suspense
                fallback={
                  <>
                    <Navbar isMobile={isMobile}></Navbar>
                    <Loading></Loading>
                  </>
                }
              >
                <Information
                  isMobile={isMobile}
                  title={"Terms of Service"}
                  text={
                    /* prettier-ignore */
                    <div>
<p className="InfoText">Welcome to SpecGauge! These Terms of Service ("Terms") outline the rules and regulations for using our website.</p>

<p className="InfoText">By accessing this website, we assume you accept these Terms in full. Do not continue to use SpecGauge if you do not agree to all of the Terms stated on this page.</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoSubtitle">1. Use of the Website</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText" style={{fontWeight: 'bold'}}>1.1. </p><p className="InfoText">You agree to use SpecGauge only for lawful purposes and in a way that does not infringe on the rights of others or restrict or inhibit anyone else’s use and enjoyment of the website.</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText" style={{fontWeight: 'bold'}}>1.2. </p><p className="InfoText">We reserve the right to modify or discontinue, temporarily or permanently, the website (or any part of it) with or without notice.</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoSubtitle">2. Predictions and Accuracy</p>

<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText" style={{fontWeight: 'bold'}}>2.1. </p><p className="InfoText">SpecGauge provides future price predictions for products. These predictions are based on historical data and trends and are intended for informational purposes only. We do not guarantee the accuracy or reliability of these predictions.</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoSubtitle">3. Intellectual Property</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>


<p className="InfoText" style={{fontWeight: 'bold'}}>3.1. </p><p className="InfoText">The content on SpecGauge, including text, graphics, logos, images, and software, is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, display, perform, or otherwise use any part of SpecGauge without our prior written consent.</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoSubtitle">4. Privacy</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>

<p className="InfoText" style={{fontWeight: 'bold'}}>4.1. </p><p className="InfoText">Your privacy is important to us. Please refer to our Privacy Policy to understand how we collect, use, and disclose information about you.</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoSubtitle">5. Limitation of Liability</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>

<p className="InfoText" style={{fontWeight: 'bold'}}>5.1. </p><p className="InfoText">To the extent permitted by law, SpecGauge and its affiliates shall not be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in any way connected with your use of this website.</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoSubtitle">6. Governing Law</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>

<p className="InfoText" style={{fontWeight: 'bold'}}>6.1. </p><p className="InfoText">These Terms shall be governed by and construed in accordance with the laws of Canada, without regard to its conflict of law provisions.</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoSubtitle">7. Changes to the Terms</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>

<p className="InfoText" style={{fontWeight: 'bold'}}>7.1. </p><p className="InfoText">We reserve the right to revise these Terms at any time without prior notice. By using SpecGauge after any such changes, you agree to be bound by the revised Terms.</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">If you have any questions or concerns about these Terms of Service, please contact us at specgauge@gmail.com.</p>
              </div>
                  }
                  description={
                    "Read the Terms of Service for SpecGauge. Understand the rules, guidelines, and policies that govern your use of our services and website. Stay informed about your rights and responsibilities as a user."
                  }
                ></Information>
              </Suspense>
            }
          ></Route>
          {/* the privacy policy page */}
          <Route
            path="/privacypolicy"
            element={
              <Suspense
                fallback={
                  <>
                    <Navbar isMobile={isMobile}></Navbar>
                    <Loading></Loading>
                  </>
                }
              >
                <Information
                  isMobile={isMobile}
                  title={"Privacy Policy"}
                  text={
                    /* prettier-ignore */
                    <div>

<p className="InfoText">{"\n"}</p>
<p className="InfoText">We collect user activity data through Google Analytics to understand how our app is used and improve it for you. This data helps us tweak features and make your experience better. The data is not linked to you or your email. We do not store any of your usage data on our servers. We don't sell this info to third parties — your privacy is our priority.</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">When users visit our website, we utilize Google Ads to promote our services. Google Ads may place cookies on users' browsers and collect certain anonymous information for advertising purposes. This data helps us reach our audience effectively.</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">Additionally, this website displays advertisements using Google AdSense. Google uses advertising cookies which enables it and its partners to serve ads to users based on their visit to this sites and/or other sites on the Internet. Users may opt out of personalized advertising by visiting myadcenter.google.com Further information and options about opting out the advertising cookies can be found at www.AboutAds.info.</p>

<p className="InfoText">When users create accounts using their email and password, we collect and store this information securely. It's used solely for account management purposes, like resetting passwords or sending important updates related to their account.</p>
<p className="InfoText">{"\n"}</p>
<p className="InfoText">{"\n"}</p>

<p className="InfoText">If you have any questions or concerns about our Privacy Policy, please contact us at specgauge@gmail.com.</p>

                </div>
                  }
                  description={
                    "Review the Privacy Policy of SpecGauge. Learn how we collect, use, and protect your personal information. Understand your privacy rights and our commitment to safeguarding your data."
                  }
                ></Information>
              </Suspense>
            }
          ></Route>
          {/* any other page, error 404 */}
          <Route
            path="*"
            element={
              <Suspense
                fallback={
                  <>
                    <Navbar isMobile={isMobile}></Navbar>
                    <Loading></Loading>
                  </>
                }
              >
                <NoPage isMobile={isMobile}></NoPage>
              </Suspense>
            }
          ></Route>
        </Routes>
      </BrowserRouter>

      <Footer isMobile={isMobile}></Footer>
    </>
  );
}
