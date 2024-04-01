// Component for each platform
import MobileApp from "./Mobile/MobileApp";
import WebApp from "./Web/WebApp";

// Find out which platform it's on
import { Platform } from "react-native";

WebPlatform = Platform.OS === "web";

export default function App() {
  if (!WebPlatform) {
    // If not a browser platform
    return <MobileApp></MobileApp>;
  }
  // If a browser platform
  return <WebApp></WebApp>;
}
