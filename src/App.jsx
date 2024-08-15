import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Loading } from "./components/Loading";
import useWindowDimensions from "./useWindowDimensions";
const WebHome = lazy(() => import("./pages/WebHome"));
const WebLogIn = lazy(() => import("./pages/WebLogIn"));
const WebUserAccount = lazy(() => import("./pages/WebUserAccount"));
const Compare = lazy(() => import("./pages/Compare"));
const Prediction = lazy(() => import("./pages/Prediction"));
const Information = lazy(() => import("./pages/Information"));
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
          {/* the consoles comparison page */}
          <Route
            path="/comparison/consoles/*"
            element={
              <Suspense fallback={<Loading></Loading>}>
                <Compare
                  type={"Consoles"}
                  isMobile={isMobile}
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
                  minimumPrice={7500}
                  description={`View future prices of Cars, SUVs, Trucks, Electric (EVs) and more over time and into the future. View new and used vehicle depreciation and value.`}
                  predictionLink={
                    window.location.origin + "/prediction/automobiles/"
                  }
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
                  minimumPrice={150}
                  description={`View future prices of processors over time and into the future. Predict future costs and view past prices.`}
                  predictionLink={window.location.origin + "/prediction/cpus/"}
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
                  minimumPrice={200}
                  description={`View future prices of GPUs over time and into the future. Predict future costs and view past prices.`}
                  predictionLink={
                    window.location.origin + "/prediction/graphicsCards/"
                  }
                ></Prediction>
              </Suspense>
            }
          ></Route>
          {/* the about us page */}
          <Route
            path="/aboutus"
            element={
              <Suspense fallback={<Loading></Loading>}>
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
              <Suspense fallback={<Loading></Loading>}>
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
              <Suspense fallback={<Loading></Loading>}>
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
