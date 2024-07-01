export default function GetProsAndSpecs(defaultArray, result, categories) {
  // This gets added to the pros array
  const tempProsArray = [];
  // Only get the important specs for pros
  for (let i = 0; i < defaultArray.length; i++) {
    const defaultArrayItem = defaultArray[i];
    if (defaultArrayItem.Important) {
      let newJSON2 = {};
      newJSON2["Value"] = defaultArrayItem.Value;
      newJSON2["Display"] = defaultArrayItem.Display;
      newJSON2["Category"] = defaultArrayItem.Category;
      newJSON2["Matching"] = defaultArrayItem.Matching;
      newJSON2["Type"] = defaultArrayItem.Type;
      newJSON2["HigherNumber"] = defaultArrayItem.HigherNumber;

      tempProsArray.push(newJSON2);
    }
  }

  for (let key in result) {
    for (let i = 0; i < defaultArray.length; i++) {
      // Compare the items in the specs to the Matching key of the DefaultArray items
      if (key == defaultArray[i].Matching) {
        // When a match is found save the value are record it in tempDefault
        let value = result[key];
        // Need this for cars since the values are broken and it turns into something like
        // Curb Weight: kg
        // or
        // Length: mm
        if (value == " kg") {
          value = "-- kg";
        } else if (value == " mm") {
          value = "-- mm";
        }
        if (
          value != "True" &&
          value != "False" &&
          value != "No" &&
          value != "Yes" &&
          value != "--" &&
          value != "----" &&
          value.length != 0 // have to add this since some values accidentally got saved as "----"
        ) {
          // This keeps the spec label but adds the value
          defaultArray[i].Value = defaultArray[i].Value.replace("--", value);
          defaultArray[i].Value = defaultArray[i].Value.replace(/;/g, " ");
          defaultArray[i].Display = true;
        } else if (value == "True" || value == "Yes") {
          // Boolean values become true
          defaultArray[i].Display = true;
        }

        // Record Pros to tempProsArray
        // If not based on user preference, we will deal with user preferences later
        if (!defaultArray[i].Preference) {
          for (let j = 0; j != tempProsArray.length; j++) {
            if (tempProsArray[j].Matching == key) {
              tempProsArray[j].Value = value;
            }
          }
        }

        break;
      }
    }
  }

  // This is the array that gets added to the specs array
  const tempSpecsArray = [];
  for (let i = 0; i < categories.length; i++) {
    tempSpecsArray.push([]);
  }

  // Copy only the values
  // Each cell is an array of strings
  // Only if Display is true
  for (let key in defaultArray) {
    if (defaultArray[key].Display) {
      for (let i = 0; i < categories.length; i++) {
        if (defaultArray[key].Category == categories[i]["Category"]) {
          tempSpecsArray[i].push(defaultArray[key].Value);
          break;
        }
      }
    }
  }

  // If any are empty then just use '--'
  for (let i = 0; i < tempSpecsArray.length; i++) {
    if (tempSpecsArray[i] == "") {
      tempSpecsArray[i] = ["--"];
    }
  }

  // Deep copy categories into tempCategories
  const tempCategories = [];
  for (let item in categories) {
    const tempItem = categories[item];

    let newJSON = {};
    newJSON["Category"] = tempItem["Category"];
    newJSON["Values"] = tempItem["Values"];

    tempCategories.push(newJSON);
  }

  const tempNewProduct = [];
  for (let item in tempCategories) {
    let newCategory = tempCategories[item];
    newCategory.Values = tempSpecsArray[item];
    tempNewProduct.push(newCategory);
  }

  return [tempProsArray, tempNewProduct];
}
