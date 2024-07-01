export default function BuildURLFriendly(processes) {
  let url = "";

  // Iterate to each process
  // prettier-ignore
  for (let process in processes) {
    // Iterate to each process item
    for (let processItem in processes[process]) {
        // Add the item to the url, this is for this products process
        // The %3B represents a ; (semicolon) in URL encoding
      url += processes[process][processItem] + "%3B";
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
  return url;
}
