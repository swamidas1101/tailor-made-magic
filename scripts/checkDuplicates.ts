
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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

async function checkDesigns() {
    console.log("Fetching designs from Firestore...");
    const designsRef = collection(db, "designs");
    const snapshot = await getDocs(designsRef);

    console.log(`-------------------------------------------`);
    console.log(`Total designs in 'designs' collection: ${snapshot.size}`);
    console.log(`-------------------------------------------`);

    const designs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Check for duplicates
    // Group by (name) ONLY to see if same name exists with different tailorId
    const grouped: Record<string, any[]> = {};

    designs.forEach((design: any) => {
        // normalized key
        const name = (design.name || "").trim().toLowerCase();
        const key = name;

        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(design);
    });

    let duplicateGroups = 0;
    let totalDuplicates = 0;

    for (const [key, group] of Object.entries(grouped)) {
        if (group.length > 1) {
            duplicateGroups++;
            const count = group.length;
            totalDuplicates += (count - 1);
            console.log(`Found ${count} copies of Name: "${key}"`);
            group.forEach(d => console.log(` - ID: ${d.id}, Status: ${d.status}, Tailor: ${d.tailorId || 'MISSING'}`));
        }
    }

    console.log(`-------------------------------------------`);
    if (duplicateGroups === 0) {
        console.log("No duplicates found based on Name.");
    } else {
        console.log(`Found ${duplicateGroups} groups of duplicates.`);
        console.log(`Total extra/duplicate documents: ${totalDuplicates}`);
        console.log(`True unique count should be: ${snapshot.size - totalDuplicates}`);
    }
}

checkDesigns().catch(console.error);
