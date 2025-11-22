import { initializeApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBX893ySzsyokmRgrpNm5thobU6PqBbe38",
  authDomain: "meowhelpwowowoow.firebaseapp.com",
  projectId: "meowhelpwowowoow",
  storageBucket: "meowhelpwowowoow.firebasestorage.app",
  messagingSenderId: "326836734046",
  appId: "1:326836734046:web:fe2ea88cb3d5d1c849cccf",
  measurementId: "G-YYYW1RT9D6"
};

const app = initializeApp(firebaseConfig)
let auth: Auth | null = null
let db: Firestore | null = null

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(app)
  }
  return auth
}

export function getFirebaseDb(): Firestore {
  if (!db) {
    db = getFirestore(app)
  }
  return db
}

export default app
