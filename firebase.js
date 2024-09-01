// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics"; // Import isSupported correctly
import { getFirestore } from "firebase/firestore"; // Import Firestore if you're using it

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDM5HTGRFaD6fCF0J4Un68vxRDb0jMfCJI",
  authDomain: "flashcard-saas-86514.firebaseapp.com",
  projectId: "flashcard-saas-86514",
  storageBucket: "flashcard-saas-86514.appspot.com",
  messagingSenderId: "735556234353",
  appId: "1:735556234353:web:b86f3311d828ffddd37fd0",
  measurementId: "G-5L83GBDV58",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics;

// Check if the environment supports analytics before initializing it
isSupported()
  .then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  })
  .catch((error) => {
    console.error("Error initializing analytics:", error);
  });

// Initialize Firestore
const db = getFirestore(app);

// Export the required services
export { app, analytics, db }; // Ensure these are named exports
