import DirectProductQueryFunction from "./DirectProductQueryFunction";

export default async function DirectQueryGraphicsCardsFunction(product) {
  return await DirectProductQueryFunction("Graphics Cards", {
    Brand: product["Brand"],
    Generation: product["Generation"],
    Card: product["Card"],
  });
}
