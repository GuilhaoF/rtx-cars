/* eslint-disable @typescript-eslint/no-unused-vars */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCLo7AhAGnl2mLWSiXr9zOpw9mHWOS9Kf4",
  authDomain: "rtxcars.firebaseapp.com",
  projectId: "rtxcars",
  storageBucket: "rtxcars.appspot.com",
  messagingSenderId: "440173967127",
  appId: "1:440173967127:web:e98a4cbfde26c4047da952"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };