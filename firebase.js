// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Import Firestore if needed
import { getAuth } from "firebase/auth"; // Import Auth if needed
import { getStorage } from "firebase/storage"; // Import Storage if needed

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCqUTH6qNdJe89cQ2vqD8tpOk6FL9b2Zk",
  authDomain: "fir-to-firestore.firebaseapp.com",
  projectId: "firebase-to-firestore",
  storageBucket: "firebase-to-firestore.appspot.com",
  messagingSenderId: "547489165252",
  appId: "1:547489165252:web:73260715c633067075be91"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Optional: Initialize analytics if needed (ensure this is used only in browser)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// Optionally export other Firebase services
const db = getFirestore(app); // Firestore
const auth = getAuth(app); // Firebase Auth
const storage = getStorage(app); // Firebase Storage

export { app, analytics, db, auth, storage };
