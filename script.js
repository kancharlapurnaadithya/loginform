import { auth, provider } from './firebase-config.js';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithPopup, 
    onAuthStateChanged, 
    signOut,
    sendPasswordResetEmail 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// --- DOM Elements ---
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterBtn = document.getElementById('show-register');
const showLoginBtn = document.getElementById('show-login');
const formTitle = document.getElementById('form-title');
const formSubtitle = document.getElementById('form-subtitle');
const googleBtn = document.getElementById('google-btn');
const logoutBtn = document.getElementById('logout-btn');
const forgotPw = document.getElementById('forgot-password');
const errorMsg = document.getElementById('error-message');

// --- 1. Form UI Toggling ---
if (showRegisterBtn && showLoginBtn) {
    showRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        formTitle.textContent = "Create Account";
        formSubtitle.textContent = "Join Nexus today";
        errorMsg.textContent = ""; 
    });

    showLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        formTitle.textContent = "Welcome Back";
        formSubtitle.textContent = "Sign in to continue";
        errorMsg.textContent = ""; 
    });
}

// --- 2. Route Protection & Auth State ---
onAuthStateChanged(auth, (user) => {
    const isDashboard = window.location.pathname.includes('dashboard.html');
    
    if (user) {
        if (!isDashboard) {
            window.location.href = 'dashboard.html';
        } else {
            const displayName = user.displayName || "User";
            document.getElementById('user-name').textContent = displayName;
            document.getElementById('user-firstname').textContent = displayName.split(" ")[0];
            document.getElementById('user-email').textContent = user.email;
            
            const picUrl = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6366f1&color=fff`;
            document.getElementById('user-pic').src = picUrl;
        }
    } else {
        if (isDashboard) {
            window.location.href = 'index.html';
        }
    }
});

// --- 3. Manual Email/Password Sign Up ---
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;

        try {
            errorMsg.style.color = "var(--text-main)";
            errorMsg.textContent = "Creating account...";
            
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Update profile with the provided name
            await updateProfile(userCredential.user, { displayName: name });
            
            // onAuthStateChanged will handle the redirect
        } catch (error) {
            errorMsg.style.color = "var(--error)";
            errorMsg.textContent = error.message.replace("Firebase: ", "");
        }
    });
}

// --- 4. Manual Email/Password Login ---
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            errorMsg.style.color = "var(--text-main)";
            errorMsg.textContent = "Logging in...";
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            errorMsg.style.color = "var(--error)";
            if (error.code === 'auth/invalid-credential') {
                errorMsg.textContent = "Invalid email or password.";
            } else {
                errorMsg.textContent = error.message.replace("Firebase: ", "");
            }
        }
    });
}

// --- 5. Google Login ---
if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            errorMsg.style.color = "var(--error)";
            errorMsg.textContent = "Google Sign-In failed.";
        }
    });
}

// --- 6. Forgot Password ---
if (forgotPw) {
    forgotPw.addEventListener('click', async (event) => {
        event.preventDefault(); 
        
        const emailInput = document.getElementById('login-email');
        const email = emailInput.value.trim();

        if (!email) {
            errorMsg.style.color = "var(--error)";
            errorMsg.textContent = "Please type your email address first to reset password.";
            emailInput.style.borderColor = "var(--error)"; 
            return;
        }

        try {
            errorMsg.style.color = "var(--text-main)";
            errorMsg.textContent = "Sending reset link...";
            await sendPasswordResetEmail(auth, email);
            errorMsg.style.color = "var(--success)";
            errorMsg.textContent = `A password reset link has been sent to ${email}`;
            emailInput.style.borderColor = "var(--glass-border)"; 
        } catch (error) {
            errorMsg.style.color = "var(--error)";
            errorMsg.textContent = error.message.replace("Firebase: ", "");
        }
    });
}

// --- 7. Logout ---
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout Error:", error);
        }
    });
}
