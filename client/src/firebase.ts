// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-2328d.firebaseapp.com",
  projectId: "mern-blog-2328d",
  storageBucket: "mern-blog-2328d.appspot.com",
  messagingSenderId: "246010195430",
  appId: "1:246010195430:web:ec39aae5ae3370c031ba27"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

