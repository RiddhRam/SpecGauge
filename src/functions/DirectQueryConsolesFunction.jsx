import { query, where, collection, getDocs } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const db = getFirestore();

export default async function DirectQueryConsolesFunction(product) {
  const colRef = collection(db, "Consoles");
  const q = query(
    colRef,
    where("Brand", "==", product[0]),
    where("Name", "==", product[1])
  );

  const snapshot = await getDocs(q);
  const consolesArray = [];
  snapshot.forEach((doc) => {
    consolesArray.push(doc.data());
  });

  // Should only be 1 item so return the first
  return consolesArray[0];
}
