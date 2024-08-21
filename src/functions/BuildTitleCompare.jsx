export default function BuildTitleCompare(processes) {
  let title = "Compare:";

  // Iterate to each process
  // prettier-ignore
  for (let process in processes) {
      // Iterate to each process item
      for (let processItem in processes[process]) {
          // Add the item to the title, this is for this products process
          // if it's the first item, don't add a space
            title += ` ${processes[process][processItem]}`
      }
      
      title += " vs"
    }

  title = title.slice(0, -3);

  return title;
}
