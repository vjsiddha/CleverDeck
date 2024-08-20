// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDM5HTGRFaD6fCF0J4Un68vxRDb0jMfCJI",
  authDomain: "flashcard-saas-86514.firebaseapp.com",
  projectId: "flashcard-saas-86514",
  storageBucket: "flashcard-saas-86514.appspot.com",
  messagingSenderId: "735556234353",
  appId: "1:735556234353:web:b86f3311d828ffddd37fd0",
  measurementId: "G-5L83GBDV58"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);