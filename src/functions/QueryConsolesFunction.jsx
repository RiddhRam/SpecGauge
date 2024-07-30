import { query, where, collection, getDocs } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const db = getFirestore();

export default async function QueryConsolesFunction(brand, name) {
  const colRef = collection(db, "Consoles");
  const q = await query(
    colRef,
    where("Brand", "==", brand),
    where("Name", "==", name)
  );

  const snapshot = await getDocs(q);

  const ConsolesArray = [];
  snapshot.forEach((doc) => {
    ConsolesArray.push(doc.data());
  });

  return ConsolesArray;
}
