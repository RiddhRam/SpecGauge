import PakoInflate from "./PakoInflate";

export default function DeconstructURLFriendlyCompare(url, queryProcess) {
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

  const processes = [];

  // Iterate through each products string
  for (let productIndex in products) {
    // Split product string up into seperate strings, 1 for each process step
    const productProcess = products[productIndex].split("%3B");

    const jsonProcess = {};

    for (let queryProcessIndex in queryProcess) {
      jsonProcess[queryProcess[queryProcessIndex]] =
        productProcess[queryProcessIndex];
    }

    // Push the JSON to the major array
    processes.push(jsonProcess);
  }

  return processes;
}
