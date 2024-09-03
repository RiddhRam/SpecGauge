import { query, where, collection, getDocs } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const db = getFirestore();

export default async function DirectQueryGraphicsCardsFunction(product) {
  const colRef = collection(db, "Graphics Cards");
  const q = query(
    colRef,
    where("Brand", "==", product["Brand"]),
    where("Generation", "==", product["Generation"]),
    where("Card", "==", product["Card"])
  );

  const snapshot = await getDocs(q);
  const graphicsCardsArray = [];
  snapshot.forEach((doc) => {
    graphicsCardsArray.push(doc.data());
  });

  // Should only be 1 item so return the first
  return graphicsCardsArray[0];
}
