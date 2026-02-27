import { auth, provider } from './firebase-config.js';
import { 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    onAuthStateChanged, 
    signOut,
    sendPasswordResetEmail 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// --- DOM Elements ---
const loginForm = document.getElementById('login-form');
const googleBtn = document.getElementById('google-btn');
const logoutBtn = document.getElementById('logout-btn');
const forgotPw = document.getElementById('forgot-password');
const errorMsg = document.getElementById('error-message');

// --- 1. Route Protection & Auth State ---
// This runs automatically whenever the user logs in or out
onAuthStateChanged(auth, (user) => {
    const isDashboard = window.location.pathname.includes('dashboard.html');
    
    if (user) {
        // If user is logged in and on Login page, move to Dashboard
        if (!isDashboard) {
            window.location.href = 'dashboard.html';
        } else {
            // Update UI with Firebase Data
            document.getElementById('user-name').textContent = user.displayName || "User";
            document.getElementById('user-email').textContent = user.email;
        }
    } else {
        // If no user and trying to access dashboard, kick back to login
        if (isDashboard) {
            window.location.href = 'index.html';
        }
    }
});

// --- 2. Email/Password Login ---
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            errorMsg.textContent = "Logging in..."; // UI Feedback
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error(error.code);
            // Friendly error messages
            if (error.code === 'auth/invalid-credential') {
                errorMsg.textContent = "Wrong email or password.";
            } else {
                errorMsg.textContent = "Error: " + error.message;
            }
        }
    });
}

// --- 3. Google Login ---
// Updated Google Login Logic
if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
        try {
            console.log("Google Sign-In started..."); // Debugging kosam
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Full Error Object:", error); // Error ento console lo kanipisthundi
            
            // Specifically check for this error
            if (error.code === 'auth/operation-not-allowed') {
                errorMsg.textContent = "Google Sign-In is not enabled in Firebase Console.";
            } else {
                errorMsg.textContent = "Google Sign-In failed: " + error.message;
            }
        }
    });
}

// --- 4. Forgot Password ---
// 4. Forgot Password Fix
if (forgotPw) {
    forgotPw.addEventListener('click', async (event) => {
        // PREVENT page from refreshing (the # in <a href="#"> causes refresh)
        event.preventDefault(); 
        
        const emailInput = document.getElementById('email');
        const email = emailInput.value;

        if (!email) {
            errorMsg.textContent = "Error: Please type your email address first.";
            emailInput.style.border = "2px solid red"; // Visual feedback
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            alert("A password reset link has been sent to: " + email);
            errorMsg.textContent = ""; 
        } catch (error) {
            console.error("Reset Error Code:", error.code);
            errorMsg.textContent = "Error: " + error.message;
        }
    });
}

// --- 5. Logout ---
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
            window.location.href = 'index.html';
        } catch (error) {
            console.error("Logout Error:", error);
        }
    });
}