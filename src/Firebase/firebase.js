import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';





const firebaseConfig = {
  apiKey: "AIzaSyBJwZmm9HoHOb7VNjDY9a4pXVu_73oS1QA",
  authDomain: "grad-proj-g3.firebaseapp.com",
  projectId: "grad-proj-g3",
  storageBucket: "grad-proj-g3.appspot.com",
  messagingSenderId: "1007204384642",
  appId: "1:1007204384642:web:6943bd812a101e6964d99b",
  measurementId: "G-6PDKBGR912"
};

export const fire = initializeApp(firebaseConfig);
export const fireStore = getFirestore(fire)
export const storage = getStorage(fire)

export const db = getFirestore(fire);
