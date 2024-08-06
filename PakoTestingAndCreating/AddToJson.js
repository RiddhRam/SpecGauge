import pako from "pako";

const string =
  "eJzFl0Fv2jAUx7+KldMmUWmFG7cS1BaptBaB9TDt4CYPYi2xI8dpy6Z999mEIAwUpwnObvDi/9+/vBc/2z/+eN9JUoA39K6uvJ43pnmWkLU3lKKAnucTCSsu1H9vJAiL1IgpkWFM2coIsYjIzbAlSXKlm68zbRmoh1jAEgSwEHZPJ2nGhSRM7iL3dBWDeCzSFxDb4N9ebbQ7YCCIpJyZfAfx/wvpE3GQvl3EMdhNFCEiUQIkl6iPqIQ0R5KjVwpvSMaAMsHzs+y4HLDHvos4Zr/DiyGylR8vDuq+DThmm6vPP6e5mgLl9Dd8nvPAwGQu5VvkRytyObw2cd6GNr84qY59kNoxqF9y3Sq7Ww/n2GMKKGj0KVRK54gz0H0A0FjBWDGrwRO25Cbvvg36cvNKaEJeaKKS/LWLpTcNZnjT00jBwrjFe5hG7lcg9icoSLi0Io/40X5Rac9Q2vNbizKISaTmRAWj0t4pZsAiEJrRwDVM3HeM6aIxqda6X3hPuDGg1joH9HmaFWo1L2oV/aiDGXL35VYdXTV2nwtoXvY9D/fln7eDrfTOQR++IZ+EsX1z2IwyISute8jrFpDXXUH2W0D2rZDB4jKUgxaUg1OU5pZ/mVyO9PbtJzz89fnOtNGGWuu85CPO1R2rKedG3A3oFFJlXZO0HHxwcNoz6IpWH5CRmghp8zbUhlFX9KPC3vzPMCt5Z6RqkjcaSfvB+hxvZeK+hT0VUh097Nk9cabeSts1sHp3lgdgqxopPQFZKi/fZI8Qn2sV/QTh83GhnQDeg3re6PJUKjtAnI9xEz4l6wAO03dI0KzO3R+DWHKREj2deQ3deXRwyn+XhYCWwPsuzpFv8aCP5iDIbcIze0v6ENr0cYP98x9MgAM3";
const categories = [
  { Category: "N", Values: [] },
  { Category: "R", Values: [] },
  { Category: "Pros", Values: [] },
  { Category: "Brand", Values: [] },
  { Category: "Generation", Values: [] },
  { Category: "Card", Values: [] },
  { Category: "GPU", Values: [] },
  { Category: "Memory", Values: [] },
  { Category: "Cache", Values: [] },
  { Category: "Release Info", Values: [] },
  { Category: "Board", Values: [] },
  { Category: "Rendering", Values: [] },
  { Category: "Performance", Values: [] },
];

const compressedData = Uint8Array.from(atob(string), (c) => c.charCodeAt(0));

// Decompress the url
const decompressed = pako.inflate(compressedData);

// Convert the decompressed data Uint8Array back to a string
const inflatedString = new TextDecoder().decode(decompressed);

const JSONValue = JSON.parse(inflatedString);

// Add
for (let item in JSONValue) {
  for (let CategoryItem in categories) {
    if (JSONValue[item].Category == categories[CategoryItem]["Category"]) {
      categories[CategoryItem]["Values"].push(JSONValue[item]);
      break;
    }
  }
}

// Rearrange
for (let item in categories) {
  for (let valueItem in categories[item].Values) {
    if (categories[item].Values[valueItem].Type == "B") {
      let [item2] = categories[item].Values.splice(valueItem, 1);
      categories[item].Values.push(item2);
    }
  }
}

const newJSONs = [];

// Finally
for (let item in categories) {
  for (let valueItem in categories[item].Values) {
    newJSONs.push(categories[item].Values[valueItem]);
  }
}

console.log(newJSONs);
