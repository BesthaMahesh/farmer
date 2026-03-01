import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, RecaptchaVerifier } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDsKl3a93r504B7aBocBuSVYtsj8EMV2h0",
    authDomain: "farmer-2e094.firebaseapp.com",
    projectId: "farmer-2e094",
    storageBucket: "farmer-2e094.firebasestorage.app",
    messagingSenderId: "732560990885",
    appId: "1:732560990885:web:533e7665bae8ba8f0d234c",
    measurementId: "G-HJPB30GR8L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Recaptcha setup for Phone Auth
export const setupRecaptcha = (containerId) => {
    return new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: (response) => {
            console.log("Recaptcha verified");
        }
    });
};
