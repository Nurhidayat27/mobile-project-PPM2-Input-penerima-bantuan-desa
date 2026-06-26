// services/firebase.ts

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBbRplDF0yDaQE-sDcwW1t0mnsf54W5EPI",
  authDomain: "bantuan-desa.firebasestorage.app",
  projectId: "bantuan-desa",
  storageBucket: "bantuan-desa.firebasestorage.app",
  messagingSenderId: "688291194204",
  appId: "1:688291194204:android:0329fe1e38f034c8944d99"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);