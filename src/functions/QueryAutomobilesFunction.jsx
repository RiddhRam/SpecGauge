import { query, where, collection, getDocs } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const db = getFirestore();

export default async function QueryAutomobilesFunction(brand, model) {
  const colRef = collection(db, "Automobiles");
  const q = await query(
    colRef,
    where("Brand", "==", brand),
    where("Model", "==", model)
  );

  const snapshot = await getDocs(q);

  const automobilesArray = [];
  snapshot.forEach((doc) => {
    automobilesArray.push(doc.data());
  });

  return automobilesArray;
}
