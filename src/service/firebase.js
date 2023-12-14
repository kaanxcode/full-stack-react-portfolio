// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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

const db = getFirestore(app);

export default db;
