// Component for each platform
//import MobileApp from "./Mobile/MobileApp";
import WebApp from "./Web/WebApp";

export default function App() {
  // If not a browser platform
  //return <MobileApp></MobileApp>;
  // If a browser platform
  return <WebApp></WebApp>;
}
