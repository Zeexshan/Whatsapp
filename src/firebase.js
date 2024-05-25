import firebase from "firebase/compat/app";
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDWRlakHnLS670KvTn_Hniv3ZvAjunohZY",
  authDomain: "whatsapp-clone-4f128.firebaseapp.com",
  projectId: "whatsapp-clone-4f128",
  storageBucket: "whatsapp-clone-4f128.appspot.com",
  messagingSenderId: "849609831951",
  appId: "1:849609831951:web:441fe745836748297bd57a",
  measurementId: "G-TCR2M0KE9N"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const provider = new GoogleAuthProvider();

export { auth, provider }
export default db;



