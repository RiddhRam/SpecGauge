import DirectProductQueryFunction from "./DirectProductQueryFunction";

export default async function DirectQueryDronesFunction(product) {
  return await DirectProductQueryFunction("Drones", {
    Brand: product["Brand"],
    Name: product["Name"],
  });
}
