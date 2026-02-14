
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

// Firebase App Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAUNQdev5VPu5_PcqIHPsKzLOScmCAdHrA",
    authDomain: "tailor-made-magic.firebaseapp.com",
    projectId: "tailor-made-magic",
    storageBucket: "tailor-made-magic.firebasestorage.app",
    messagingSenderId: "874321679271",
    appId: "1:874321679271:web:c138db41d3994174115c82",
    measurementId: "G-T25JCTJY17"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services - use long polling to avoid WebChannel transport errors
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
});
export const googleProvider = new GoogleAuthProvider();

export default app;
