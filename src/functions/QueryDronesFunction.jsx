import { query, where, collection, getDocs } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const db = getFirestore();

export default async function QueryDronesFunction(brand, name) {
  const colRef = collection(db, "Drones");
  const q = await query(
    colRef,
    where("Brand", "==", brand),
    where("Name", "==", name)
  );

  const snapshot = await getDocs(q);

  const dronesArray = [];
  snapshot.forEach((doc) => {
    dronesArray.push(doc.data());
  });

  return dronesArray;
}
