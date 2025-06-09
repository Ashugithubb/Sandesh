
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAOiJ_zbV50RbnIWEInqBGDtYfbjvYERjM",
  authDomain: "sandesh-8a801.firebaseapp.com",
  projectId: "sandesh-8a801",
  storageBucket: "sandesh-8a801.firebasestorage.app",
  messagingSenderId: "422723157194",
  appId: "1:422723157194:web:cc757c87d48324d9c14833",
  measurementId: "G-35NMQ7XGPP"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();