import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCEADSlFszmZx-dS_5oWQpEOJ5FwXpYuCI",
  authDomain: "child-behaviour.firebaseapp.com",
  databaseURL: "https://child-behaviour-default-rtdb.firebaseio.com",
  projectId: "child-behaviour",
  storageBucket: "child-behaviour.firebasestorage.app",
  messagingSenderId: "423279395716",
  appId: "1:423279395716:web:0c3592777033115aa7d3d1",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
