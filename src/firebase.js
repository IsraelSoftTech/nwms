import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child, remove } from "firebase/database"; // ✅ Import remove
import { getStorage } from "firebase/storage"; // ✅ Import Storage

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDS_8mdUqAL4tPN_WvMAo2Tmm1iQwfEC78",
  authDomain: "register-d6145.firebaseapp.com",
  databaseURL: "https://register-d6145-default-rtdb.firebaseio.com",
  projectId: "register-d6145",
  storageBucket: "register-d6145.appspot.com",
  messagingSenderId: "984407699595",
  appId: "1:984407699595:web:1219a9e6312517b254e48e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // ✅ Realtime DB
const storage = getStorage(app);   // ✅ Firebase Storage

// ✅ Export everything needed
export { database, storage, ref, set, get, child, remove }; // Include remove in exports