import { db } from "../../../Firebase/firebase";

import {
  collection,
  getDoc,

  doc,
} from "firebase/firestore";

const bookCollectionRef = collection(db, "category");
class BookDataService {


  getBook = (id) => {
    const bookDoc = doc(db, "category", id);
    return getDoc(bookDoc);
  };
}

export default new BookDataService();