import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";  // Import necessary functions
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXTl6m6cEAm6hG4n57hC2vgw91o3sPCXY",
  authDomain: "fir-chat-6a4d5.firebaseapp.com",
  projectId: "fir-chat-6a4d5",
  storageBucket: "fir-chat-6a4d5.firebasestorage.app",
  messagingSenderId: "425377916822",
  appId: "1:425377916822:web:725bc483ed058ba31b9fb7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Set persistence using AsyncStorage for React Native
setPersistence(auth, AsyncStorage) // Set persistence to AsyncStorage
  .catch((error) => {
    console.error("Error setting persistence: ", error);
  });

export const db = getFirestore(app);

export const usersRef = collection(db, 'users');
export const roomRef = collection(db, 'rooms');
