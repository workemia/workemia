import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAd-Z32Zm9aCe5nZnYAHGpglnneEjEHv9k",
  authDomain: "teste3-38581.firebaseapp.com",
  projectId: "teste3-38581",
  storageBucket: "teste3-38581.firebasestorage.app",
  messagingSenderId: "950949065772",
  appId: "1:950949065772:web:63b46ffa84f12bd17a8d89",
  measurementId: "G-8BT4EZZ4G7",
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
