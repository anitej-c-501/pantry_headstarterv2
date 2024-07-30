// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAk4dazaes3ZZErXdsHb5KQjWPdFguPkC0",
  authDomain: "pantry-tracker-de028.firebaseapp.com",
  projectId: "pantry-tracker-de028",
  storageBucket: "pantry-tracker-de028.appspot.com",
  messagingSenderId: "684483388557",
  appId: "1:684483388557:web:5661eb438929e20c29aec4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);