import { query, where, collection, getDocs } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const db = getFirestore();

export default async function DirectQueryAutomobilesFunction(product) {
  const colRef = collection(db, "Automobiles");
  const q = await query(
    colRef,
    where("Brand", "==", product[0]),
    where("Model", "==", product[1]),
    where("Year", "==", product[2]),
    where("Trim", "==", product[3])
  );

  const snapshot = await getDocs(q);
  const automobilesArray = [];
  snapshot.forEach((doc) => {
    automobilesArray.push(doc.data());
  });

  // Should only be 1 item so return the first
  return automobilesArray[0];
}
