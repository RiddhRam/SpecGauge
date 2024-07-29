import PakoInflate from "./PakoInflate";

export default function DeconstructURLFriendlyPredict(url, brands) {
  const processes = [];

  let tempURL = PakoInflate(url);

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

    // If it's not an Average price process
    if (productProcess[0] != "Average") {
      // Price can be left as is

      // Add 1990 back to the year
      let year = productProcess[1];
      year = parseInt(year);
      year += 1990;

      productProcess[1] = year.toString();

      // Put the brand back to it's original value by using it's index
      productProcess[2] = brands[productProcess[2]];
    }

    // Push the array to the major array
    processes.push(productProcess);
  }

  return processes;
}
