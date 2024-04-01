import MobileApp from "./Mobile/MobileApp";
import WebApp from "./Web/WebApp";

import { Platform } from "react-native";

WebPlatform = Platform.OS === "web";

export default function App() {
  if (!WebPlatform) {
    return <MobileApp></MobileApp>;
  }
  return <WebApp></WebApp>;
}
