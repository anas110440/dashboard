import { db } from "../../../Firebase/firebase";

import {
  getDoc,

  doc,
} from "firebase/firestore";

class BookDataService {


  getBook = (id, id2) => {
    const bookDoc = doc(db, "category", id2, "videos", id );
    return getDoc(bookDoc);
  };
}

export default new BookDataService();