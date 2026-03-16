// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZMFsxvFip2R6z8X60lulviU7rq8sqFUs",
  authDomain: "ai-travel-planner-5dbd8.firebaseapp.com",
  projectId: "ai-travel-planner-5dbd8",
  storageBucket: "ai-travel-planner-5dbd8.firebasestorage.app",
  messagingSenderId: "832860173062",
  appId: "1:832860173062:web:eb8533ac6223d0069e2487",
  measurementId: "G-KJFX5FJCYL"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);