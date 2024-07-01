export default function DeconstructURLFriendly(url) {
  const processes = [];

  // Replace any %3A with colons
  let tempURL = url.replace(/%3A/g, ":");
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
    // Push the array to the major array
    processes.push(productProcess);
  }

  return processes;
}
