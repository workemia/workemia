import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

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

export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: "select_account",
})

export function isFirebaseConfigured(): boolean {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
  )
}

export function isDomainAuthorized(): boolean {
  if (typeof window === "undefined") return false

  const currentDomain = window.location.hostname
  const authorizedDomains = ["localhost", "127.0.0.1", "teste3-38581.firebaseapp.com", "v0-teste1-opal.vercel.app"]

  return authorizedDomains.some((domain) => currentDomain.includes(domain))
}

export function isGoogleOAuthAvailable(): boolean {
  return isFirebaseConfigured() && isDomainAuthorized()
}
