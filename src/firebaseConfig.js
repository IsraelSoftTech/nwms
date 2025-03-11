import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDS_8mdUqAL4tPN_WvMAo2Tmm1iQwfEC78",
    authDomain: "register-d6145.firebaseapp.com",
    databaseURL: "https://register-d6145-default-rtdb.firebaseio.com",
    projectId: "register-d6145",
    storageBucket: "register-d6145.firebasestorage.app",
    messagingSenderId: "984407699595",
    appId: "1:984407699595:web:1219a9e6312517b254e48e"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
export default app;
