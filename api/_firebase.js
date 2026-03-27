import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite"; // Using Lite for serverless stability

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyBON7QNlw9vA5ZHpyibXbQm5W9iH6tVl-0",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "drive-backend-2d169.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "drive-backend-2d169",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "drive-backend-2d169.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "357233032993",
  appId: process.env.FIREBASE_APP_ID || "1:357233032993:web:205c2ea170b1b0dd204860"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
