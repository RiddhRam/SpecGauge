import DirectProductQueryFunction from "./DirectProductQueryFunction";

export default async function DirectQueryAutomobilesFunction(product) {
  return await DirectProductQueryFunction("Automobiles", {
    Brand: product["Brand"],
    Model: product["Model"],
    Year: product["Year"],
    Trim: product["Trim"],
  });
}
