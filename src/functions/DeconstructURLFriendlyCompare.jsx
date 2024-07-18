import PakoInflate from "./PakoInflate";

export default function DeconstructURLFriendlyCompare(url, brands) {
  const processes = [];

  let tempURL = url;

  const shortIndex = tempURL.indexOf("short/");

  // If its a short (compressed) string
  if (shortIndex != -1) {
    tempURL = tempURL.slice(6);

    // Decompress the short string
    tempURL = PakoInflate(tempURL);
  }

  // Replace any %3A with colons
  tempURL = tempURL.replace(/%3A/g, ":");
  // Replace any %20 with spaces
  tempURL = tempURL.replace(/%20/g, " ");
  // Replace any %2F that aren't use for navigation with extra slashes
  tempURL = tempURL.replace(/%2F/g, "/");

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
