// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

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
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

/**
 * Register a new user using Firebase Authentication.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password)
}

/**
 * Sign in an existing user.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<import('firebase/auth').UserCredential>}
 */
export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password)
}


