// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-boilerplate-1afcb.firebaseapp.com",
  projectId: "mern-boilerplate-1afcb",
  storageBucket: "mern-boilerplate-1afcb.firebasestorage.app",
  messagingSenderId: "987053996490",
  appId: "1:987053996490:web:13c870b6e6a94baa81b733",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
