// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Your web app's Firebase configuration (Replace with your actual keys)
const firebaseConfig = {
  apiKey: "AIzaSyDcEyLPFBlwLtThzkClZkIaaltaHICouaU",
  authDomain: "login-2bd46.firebaseapp.com",
  projectId: "login-2bd46",
  storageBucket: "login-2bd46.firebasestorage.app",
  messagingSenderId: "529654054460",
  appId: "1:529654054460:web:8779e1df5fab9095c6cd39"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };