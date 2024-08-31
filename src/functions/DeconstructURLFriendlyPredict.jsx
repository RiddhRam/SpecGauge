import PakoInflate from "./PakoInflate";

export default function DeconstructURLFriendlyPredict(
  url,
  brands,
  rateAdjustments
) {
  const processes = [];
  const allRateAdjustments = [];

  let tempURL = PakoInflate(url);

  // Replace any %3A with colons
  tempURL = tempURL.replace(/%3A/g, ":");
  // Replace any %2F that aren't use for navigation with extra slashes
  tempURL = tempURL.replace(/%2F/g, "/");

  // Split major string up into seperate strings, 1 for each product
  const products = tempURL.split("%7Cvs%7C");

  // Iterate through each products string
  for (let product in products) {
    // Split product string up into seperate strings, 1 for each process step
    const productProcess = products[product].split("%3B");

    let productRateAdjustments = null;

    // If this type has rate adjustments
    if (rateAdjustments && productProcess[0] != "Average") {
      // Get the last item, which also contains the rate adjustments
      const lastItem = productProcess[productProcess.length - 1];

      // Split it up, then the first up of the split is the actual last item,
      // which will be reassigned to the array
      const splitLastItem = lastItem.split("%2A");
      const actualLastItem = splitLastItem[0];
      productProcess[productProcess.length - 1] = actualLastItem;

      const tempRateAdjustments = [];
      for (let item in splitLastItem) {
        // Skip the first item
        if (item == "0") {
          continue;
        }
        // Add this rate adjustment
        tempRateAdjustments.push(splitLastItem[item]);
      }

      productRateAdjustments = tempRateAdjustments;
    }

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

    // If there are productRateAdjustments
    if (productRateAdjustments) {
      for (let item in productRateAdjustments) {
        productRateAdjustments[item] =
          rateAdjustments[productRateAdjustments[item]];
        // Enable the adjustment if not default
        productRateAdjustments[item][1] = true;
      }
    }

    // Push the arrays to the major arrays
    processes.push(productProcess);
    allRateAdjustments.push(productRateAdjustments);
  }

  return { processes, allRateAdjustments };
}
