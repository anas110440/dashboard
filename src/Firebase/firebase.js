import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';



const firebaseConfig = {
  apiKey: "AIzaSyDwhNjBUAV_j94q3O_N_i8J5RhuyGn0kUA",
  authDomain: "dashboard-e5d1e.firebaseapp.com",
  projectId: "dashboard-e5d1e",
  storageBucket: "dashboard-e5d1e.appspot.com",
  messagingSenderId: "903984591242",
  appId: "1:903984591242:web:38a2f0fc1cab49926b9873"
};


export const fire = initializeApp(firebaseConfig);
export const fireStore = getFirestore(fire)
export const storage = getStorage(fire)

export const db = getFirestore(fire);
