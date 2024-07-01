export default async function GetSpecificProduct(
  defaultArray,
  process,
  queryFunc
) {
  const prerequestedSpecs = [];
  const processArray = [];
  const prosArray = [];
  // Iterate through all processes in the clicked comparison
  for (let processIndex = 0; processIndex != process.length; processIndex++) {
    // Call the function for this category and pass in the process
    const result = await queryFunc(process[processIndex]);
    // There should only be 1 result anyways, but just in case there's several, this will use the first one
    prerequestedSpecs.push(result[0]);
    processArray.push(process[processIndex]);

    const tempProsArray = [];

    for (let i = 0; i < defaultArray.length; i++) {
      const defaultArrayItem = defaultArray[i];
      if (defaultArrayItem.Important) {
        let newJSON = {};
        newJSON["Value"] = defaultArrayItem.Value;
        newJSON["Display"] = defaultArrayItem.Display;
        newJSON["Category"] = defaultArrayItem.Category;
        newJSON["Matching"] = defaultArrayItem.Matching;
        newJSON["Type"] = defaultArrayItem.Type;
        newJSON["Preference"] = defaultArrayItem.Preference;
        newJSON["HigherNumber"] = defaultArrayItem.HigherNumber;

        tempProsArray.push(newJSON);
      }
    }

    // Record Pros to tempProsArray
    for (let j = 0; j != tempProsArray.length; j++) {
      // If not based on user preference, we will deal with user preferences later
      if (!tempProsArray[j].Preference) {
        const proValue = result[0][tempProsArray[j].Matching];

        if (proValue != undefined) {
          tempProsArray[j].Value = result[0][tempProsArray[j].Matching];
        } else {
          tempProsArray[j].Value = "--";
        }
      }
    }

    prosArray.push(tempProsArray);
  }
  return {
    prerequestedSpecs: prerequestedSpecs,
    processArray: processArray,
    prosArray: prosArray,
  };
}
