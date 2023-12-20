import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";

const firebaseConfig = {
  apiKey: "AIzaSyDcuf0FBUHW4NlGlEtF4hnfurYDkhJACOI",
  authDomain: "reactportfolio-bac3d.firebaseapp.com",
  databaseURL:
    "https://reactportfolio-bac3d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "reactportfolio-bac3d",
  storageBucket: "reactportfolio-bac3d.appspot.com",
  messagingSenderId: "5049100350",
  appId: "1:5049100350:web:49cd02e2e75efa4b51096f",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export const login = async (email, password) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    toast.success("Giris Basarili");
    return user;
  } catch (error) {
    toast.error(error.message);
  }
};

export default db;
export { storage, auth };
