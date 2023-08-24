// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBks7r2jeNpO6oOWc4udCffXby7hAk044w",
  authDomain: "food-app-dca3f.firebaseapp.com",
  databaseURL: "https://food-app-dca3f-default-rtdb.firebaseio.com",
  projectId: "food-app-dca3f",
  storageBucket: "food-app-dca3f.appspot.com",
  messagingSenderId: "869522300732",
  appId: "1:869522300732:web:2cbbccb9cb04a5a7288839",
  measurementId: "G-415DYCZPT0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);