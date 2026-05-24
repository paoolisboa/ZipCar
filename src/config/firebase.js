// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore, initializeFirestore } from "firebase/firestore";

import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";

import AsyncStorage from "@react-native-async-storage/async-storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBh6II34mEpFC8Jj7QGfZpJm9b5g8qEhBE",
  authDomain: "zipcodemovile.firebaseapp.com",
  projectId: "zipcodemovile",
  storageBucket: "zipcodemovile.firebasestorage.app",
  messagingSenderId: "841923622055",
  appId: "1:841923622055:web:a3dbf04de352c79ed41782"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let dbInstance;

try {
  dbInstance = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    ignoreUndefinedProperties: true,
  });
} catch {
  dbInstance = getFirestore(app);
}

let authInstance;

try {
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  authInstance = getAuth(app);
}

export const db = dbInstance;
export const auth = authInstance;
