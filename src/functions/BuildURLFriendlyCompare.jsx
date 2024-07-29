import pako from "pako";

export default function BuildURLFriendlyCompare(processes, brands) {
  let url = "";

  // Iterate to each process
  // prettier-ignore
  for (let process in processes) {
    // The index of the brand of the current item that we are adding, 0 is a placeholder
    let brandIndex = 0
    // Iterate to each process item
    for (let processItem in processes[process]) {
      // Add the item to the url, this is for this products process
      // The %3B represents a ; (semicolon) in URL encoding
      // If it's the brand index
      if (processItem == 0) {
        // Iterate through all brands to find a match
        for (let brandItem in brands) {
          // Once a match is found, save the brandIndex
          if (processes[process][processItem] == brands[brandItem].Brand) {
            brandIndex = brandItem
            break;
          }
        }
        url += brandIndex + "%3B";
      } 
      // If its the second step index
      else if (processItem == 1) {
        // Iterate through all second steps options for that brand to find a match
        for (let secondStepItem in brands[brandIndex].RequestStep) {
          // Once a match is found, add the secondStepItem
          if (processes[process][processItem] == brands[brandIndex].RequestStep[secondStepItem]) {
            url += secondStepItem + "%3B";
            break;
          }
        }
      }
      else {
        url += processes[process][processItem] + "%3B";
      }
      
    }
    // Remove the last ; from the string, since the products process is over.
    url = url.slice(0, -3)
    // Add this since its a new product now, the %20 means space. 
    // Two %20 before and after to avoid mixing it up with a product that might have vs in its name
    url += "%7Cvs%7C";
  }
  // Remove the last %7Cvs%7C since there are no more products
  url = url.slice(0, -8);
  // Replace any extra slashes that aren't use for navigation with %2F
  url = url.replace(/\//g, "%2F");
  // Replace any spaces with %20
  url = url.replace(/ /g, "%20");
  // Replace any colons with %3A
  url = url.replace(/:/g, "%3A");

  // Convert the url to a Uint8Array
  const inputUint8Array = new TextEncoder().encode(url);

  // Compress the url
  const compressed = pako.deflate(inputUint8Array);

  // Convert the compressed url back to a string (base64 in this case)
  const compressedBase64 = btoa(
    String.fromCharCode(...new Uint8Array(compressed))
  );

  // Start with 'short/' so the DeconstructURLFriendlyCompare function knows that it's the updated version.
  url = "short/" + compressedBase64;

  return url;
}
