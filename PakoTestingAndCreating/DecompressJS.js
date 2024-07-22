import pako from "pako";

const string =
  "eJzFl02P2jAQhv+KlVNXYlWpR24lbJdKZYUW2lVV9TAks8FSYqdjZxGt+t+bDzbkqyQYzJ4Q43knj8eZ8eTHH+cbhAk6Y+f21hk5U67iEHbOWFOCI8cFjYGk9L8zIRB+6jEH7W24CGom4YPO3Z4hVKlutYuzkMt0cUH4jITCw3L1cxRL0iB0aZnxYIP0kERrpOLZf0eDyebSx7BOdjC9Kdl3BKqDlZY35VoRj+pcpcUu10ffZ6BZiKA0+8C4xkgxLdkLxy3TG2QxSXUUfVE4VNBLy2XRc2OVfSL9HctijllfqaSejUp51Z4CWsStcBaGHsyF3CJpAi56OecyxWgks1TbJ50Sf0Fj0oPaPukSQateyCkqHog6Za6sAxa6Pd+DCV+zqqZSkhlerrSN53K9Y58SDNlX1Sqe/XFVODPP9xPQGqlRRXkMVwqVRLHmUrB3WeibE/jbtT/o/LPlLdjaxD76FfbhymjNBfq2TmMf/uZYRV5oK/nTB3Xjnh1csSsbN+SLvxnNEl1J+pX0p7KDr1BaB0x//3NXtF/ZDsqD/OJH3Una6sbDKU9px2a5dHchFz62r4xBkKX6CGf/yDWE804EaTdhoGJOkHUYI95WFPvF7ia0Zk+YOmmDWbGitn8jfEER6I0BZSE8pdGb5fKJ+0Z8uc4+3sz0lGcdB2wlfxvEcA3tq35IDl+19jFXnJAt+e9+zK4xtlSfN3gM+oR95JE5aCZW1+G8RxjwUdDRMHOh/YmDQKiIK9XR1wfNHRW9/Y6+Hx+ZCzF46TfHOXNzM5b1VN+F6GniHnsEEZw18tcj2RkAfv4DQlzqCA==";
const compressedData = Uint8Array.from(atob(string), (c) => c.charCodeAt(0));

// Decompress the url
const decompressed = pako.inflate(compressedData);

// Convert the decompressed data Uint8Array back to a string
const inflatedString = new TextDecoder().decode(decompressed);

console.log(JSON.parse(inflatedString));
