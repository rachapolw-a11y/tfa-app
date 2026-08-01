import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBFNUsqBSIGQkD0cf8AswlroicLmyzNzE8",
  authDomain: "tfa-academy.firebaseapp.com",
  projectId: "tfa-academy",
  storageBucket: "tfa-academy.firebasestorage.app",
  messagingSenderId: "983148814427",
  appId: "1:983148814427:web:d69e7d6665527b8490df7e"
}

const app = initializeApp(firebaseConfig)
export const db      = getFirestore(app)
export const storage = getStorage(app)
