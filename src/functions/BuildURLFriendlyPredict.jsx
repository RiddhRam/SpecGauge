import pako from "pako";

// The %3B represents a ";" (semicolon) in URL encoding
// The %7C represents a "|" (vertical bar) in URL encoding
// The %2F represents a "/" (forward slash) in URL encoding
// The %20 represents a " " (space) in URL encoding
// The %3A represents a ":" (colon) in URL encoding

export default function BuildURLFriendlyPredict(processes, brands) {
  let url = "";
  // Iterate to each process
  // prettier-ignore
  for (let process in processes) {
    // The index of the brand of the current item that we are adding, 0 is a placeholder
    let brandIndex = 0
    // If it's not an average price process
    if (processes[process][0] != "Average") {
        // Iterate to each process item
        for (let processItem in processes[process]) {
            // Add the item to the url, this is for this products process
            // If its the year index
            if (processItem == 1) {
                let yearInt = parseInt(processes[process][processItem])
                // Subtract year by 1990, this will remove 2 digits, lowest being 10, highest being 35
                yearInt = yearInt - 1990
                url += yearInt + "%3B"
            }
            // If it's the brand index
            else if (processItem == 2) {
                // Iterate through all brands to find a match
                for (let brandItem in brands) {
                    // Once a match is found, save the brandIndex
                    if (processes[process][processItem] == brands[brandItem]) {
                        brandIndex = brandItem
                        break;
                    }
                }
                url += brandIndex + "%3B";
            } 
            // If its the price index
            else {
                let removedSign = processes[process][processItem]
                // Remove the $ sign from the string
                removedSign = removedSign.substring(1);

                url += removedSign + "%3B";

            }
            
        }
    }
    // If it is an average price process 
    else {
        // Simply add 1 "Average"
        url += "Average" + "%3B";
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

  url = compressedBase64;

  return url;
}
