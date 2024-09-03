import { query, where, collection, getDocs } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const db = getFirestore();

export default async function DirectQueryAutomobilesFunction(product) {
  const colRef = collection(db, "Automobiles");
  const q = await query(
    colRef,
    where("Brand", "==", product["Brand"]),
    where("Model", "==", product["Model"]),
    where("Year", "==", product["Year"]),
    where("Trim", "==", product["Trim"])
  );

  const snapshot = await getDocs(q);
  const automobilesArray = [];
  snapshot.forEach((doc) => {
    automobilesArray.push(doc.data());
  });

  // Should only be 1 item so return the first
  return automobilesArray[0];
}
