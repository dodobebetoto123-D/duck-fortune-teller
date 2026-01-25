import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Will need this for authentication

const firebaseConfig = {
  apiKey: "AIzaSyAiuvaWQeZ1DgzxrkQUML-kz0w4gzSmft0",
  authDomain: "duck-fortune-teller.firebaseapp.com",
  projectId: "duck-fortune-teller",
  storageBucket: "duck-fortune-teller.firebasestorage.app",
  messagingSenderId: "533699582877",
  appId: "1:533699582877:web:b2376df3ddb603279f6d74",
  // measurementId: "G-PKGYJNHQHM" // Omitted as Analytics was disabled
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
