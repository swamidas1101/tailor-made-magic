
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";

// Hardcoded config from src/lib/firebase.ts
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
const db = getFirestore(app);

async function deleteDuplicates() {
    console.log("Fetching designs from Firestore...");
    const designsRef = collection(db, "designs");
    const snapshot = await getDocs(designsRef);

    console.log(`Current total: ${snapshot.size}`);

    const batchSize = 10;
    let deletedCount = 0;

    for (const docSnapshot of snapshot.docs) {
        const data = docSnapshot.data();
        // Check if tailorId is missing or unknown
        if (!data.tailorId || data.tailorId === "unknown") {
            console.log(`Deleting duplicate/invalid design: ${data.name} (ID: ${docSnapshot.id})`);
            await deleteDoc(doc(db, "designs", docSnapshot.id));
            deletedCount++;
        }
    }

    console.log(`-------------------------------------------`);
    console.log(`Deleted ${deletedCount} designs.`);
    console.log(`New estimated total: ${snapshot.size - deletedCount}`);
}

deleteDuplicates().catch(console.error);
