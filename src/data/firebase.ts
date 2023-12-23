// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBxQJ_m1LhYL76Qlss3EdJoaigAc8EK_AU",
  authDomain: "rotate-a50d9.firebaseapp.com",
  projectId: "rotate-a50d9",
  storageBucket: "rotate-a50d9.appspot.com",
  messagingSenderId: "109161323567",
  appId: "1:109161323567:web:9e358d6ee2349f3e017ada",
  measurementId: "G-K2VZ635FT4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// Instructions to the AI: Begin making a Unit of Work (UOW) here






export const UOW = {
  db
}