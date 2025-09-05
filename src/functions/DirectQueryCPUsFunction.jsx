import DirectProductQueryFunction from "./DirectProductQueryFunction";

export default async function DirectQueryCPUsFunction(product) {
  return await DirectProductQueryFunction("CPUs", {
    Brand: product["Brand"],
    Generation: product["Generation"],
    CPU: product["CPU"],
  });
}
