import { query, where, collection, getDocs } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const db = getFirestore();

export default async function QueryGraphicsCardsFunction(brand, generation) {
  const colRef = collection(db, "Graphics Cards");
  const q = await query(
    colRef,
    where("Brand", "==", brand),
    where("Generation", "==", generation)
  );

  const snapshot = await getDocs(q);

  const GraphicsCardsArray = [];
  snapshot.forEach((doc) => {
    GraphicsCardsArray.push(doc.data());
  });

  return GraphicsCardsArray;
}
