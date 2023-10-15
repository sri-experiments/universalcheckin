// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { initializeFirestore, persistentMultipleTabManager } from 'firebase/firestore';
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKKflPXG-qzcfyWICVZZ5f5BVoWU2BZfQ",
  authDomain: "experimentswithsri.firebaseapp.com",
  databaseURL: "https://experimentswithsri-default-rtdb.firebaseio.com",
  projectId: "experimentswithsri",
  storageBucket: "experimentswithsri.appspot.com",
  messagingSenderId: "247175653761",
  appId: "1:247175653761:web:57e81451bce377d7a1e080",
  measurementId: "G-Q6WWKRJXHZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
// const db = getFirestore(app);

const db = initializeFirestore(app, {localCache: persistentMultipleTabManager()})
const fcm = getMessaging(app)

export { analytics, auth, db, fcm }