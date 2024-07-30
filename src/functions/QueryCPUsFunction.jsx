import { query, where, collection, getDocs } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const db = getFirestore();

export default async function QueryCPUsFunction(brand, generation) {
  const colRef = collection(db, "CPUs");
  const q = await query(
    colRef,
    where("Brand", "==", brand),
    where("Generation", "==", generation)
  );

  const snapshot = await getDocs(q);

  const CPUsArray = [];
  snapshot.forEach((doc) => {
    CPUsArray.push(doc.data());
  });

  return CPUsArray;
}
