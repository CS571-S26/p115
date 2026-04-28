// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser } from "firebase/auth"


// Firebase Configuration - Hardcoded for portfolio edition
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

/**
 * Delete the account.
 * @returns 
 */
export const deleteAccount = () => {
  const user = auth.currentUser
  if (!user) throw new Error('No user is currently signed in.')
  return deleteUser(user)
}


