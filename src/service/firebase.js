// Firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDcuf0FBUHW4NlGlEtF4hnfurYDkhJACOI",
  authDomain: "reactportfolio-bac3d.firebaseapp.com",
  projectId: "reactportfolio-bac3d",
  storageBucket: "reactportfolio-bac3d.appspot.com",
  messagingSenderId: "5049100350",
  appId: "1:5049100350:web:49cd02e2e75efa4b51096f"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export default { firestore }; // Ya da ihtiyaca göre diğer export'ları ekleyebilirsiniz.
