import { query, where, collection, getDocs } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const db = getFirestore();

export default async function DirectQueryCPUsFunction(product) {
  const colRef = collection(db, "CPUs");
  const q = query(
    colRef,
    where("Brand", "==", product["Brand"]),
    where("Generation", "==", product["Generation"]),
    where("CPU", "==", product["CPU"])
  );

  const snapshot = await getDocs(q);
  const cpusArray = [];
  snapshot.forEach((doc) => {
    cpusArray.push(doc.data());
  });

  // Should only be 1 item so return the first
  return cpusArray[0];
}
