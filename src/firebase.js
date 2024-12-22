// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_zl75nOOQB8wONLv-yjNSCR-dVEK11JE",
  authDomain: "recipe-app-52615.firebaseapp.com",
  projectId: "recipe-app-52615",
  storageBucket: "recipe-app-52615.firebasestorage.app",
  messagingSenderId: "789790696618",
  appId: "1:789790696618:web:c2a03b1c2d0156d6629cd3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);