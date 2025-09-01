// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyABfIx49ajxtaezvDTrI-0GvpVT9p5hR0E",
  authDomain: "shortlet-554cb.firebaseapp.com",
  projectId: "shortlet-554cb",
  // ✅ Use the bucket name, not the CDN domain
  storageBucket: "shortlet-554cb.appspot.com",
  messagingSenderId: "455203308730",
  appId: "1:455203308730:web:0885d7fc1515887790ee83",
  measurementId: "G-5YF2DB0N0S"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
