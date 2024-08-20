export default function BuildTitlePredict(lineNames) {
  let title = "Predict:";

  // Iterate to each lineName
  // prettier-ignore
  for (let lineName in lineNames) {
      // Add the item to the title, this is for this products lineName
      title += ` ${lineNames[lineName]}`
      
      title += " vs"
    }

  // Remove the last " vs" since there's no more lines to name
  title = title.slice(0, -3);

  return title;
}
