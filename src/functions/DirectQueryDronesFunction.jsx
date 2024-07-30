import { query, where, collection, getDocs } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const db = getFirestore();

export default async function DirectQueryDronesFunction(product) {
  const colRef = collection(db, "Drones");
  const q = query(
    colRef,
    where("Brand", "==", product[0]),
    where("Name", "==", product[1])
  );

  const snapshot = await getDocs(q);
  const dronesArray = [];
  snapshot.forEach((doc) => {
    dronesArray.push(doc.data());
  });

  // Should only be 1 item so return the first
  return dronesArray[0];
}
