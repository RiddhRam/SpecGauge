import pako from "pako";

export default function DeconstructURLFriendlyCompare(url, brands) {
  const processes = [];

  // Replace any %3A with colons
  let tempURL = url.replace(/%3A/g, ":");
  // Replace any %20 with spaces
  tempURL = tempURL.replace(/%20/g, " ");
  // Replace any %2F that aren't use for navigation with extra slashes
  tempURL = tempURL.replace(/%2F/g, "/");

  const shortIndex = tempURL.indexOf("short/");

  if (shortIndex != -1) {
    tempURL = tempURL.slice(6);

    // Convert tempURL to a Uint8Array
    const compressedData = Uint8Array.from(atob(tempURL), (c) =>
      c.charCodeAt(0)
    );

    // Decompress the url
    const decompressed = pako.inflate(compressedData);

    // Convert the decompressed data Uint8Array back to a string
    tempURL = new TextDecoder().decode(decompressed);
  }

  // Split major string up into seperate strings, 1 for each product
  const products = tempURL.split("%7Cvs%7C");

  // Iterate through each products string
  for (let product in products) {
    // Split product string up into seperate strings, 1 for each process step
    const productProcess = products[product].split("%3B");

    if (shortIndex != -1) {
      // This goes first before the other value changes, or else it won't work since it won't be an index number
      productProcess[1] =
        brands[productProcess[0]].RequestStep[productProcess[1]];
      productProcess[0] = brands[productProcess[0]].Brand;
    }

    // Push the array to the major array
    processes.push(productProcess);
  }

  return processes;
}
