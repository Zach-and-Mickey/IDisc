import {
    collection,
    getDoc,
    getDocs,
    doc,
    setDoc
}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import { dbCloud, auth }
from "./firebase.js";

import { db }
from "./db.js";
console.log("dbCloud =", dbCloud);
console.log("dbCloud type =", typeof dbCloud);

export async function pullRounds(user) {

    const snap = await getDocs(
        collection(dbCloud, "users", user.uid, "rounds")
    );

    const cloudRounds = [];

snap.forEach(d => {
    cloudRounds.push({
        id: d.id,
        ...d.data()
    });
});
for (const round of cloudRounds) {

    const local = await db.rounds.get(round.id);

    if (!local) {

        await db.rounds.put(round);

    } else if (round.updatedAt > local.updatedAt) {

        await db.rounds.put(round);

        console.log("Updated local round:", round.id);
    }
}
}

export async function pushRounds(user) {

    const localRounds = await db.rounds.toArray();

    for (const round of localRounds) {

        const cloudRef = doc(
            dbCloud,
            "users",
            user.uid,
            "rounds",
            round.id
        );

        const snap = await getDoc(cloudRef);

        const cloudData = snap.exists() ? snap.data() : null;

        // CASE 1: doesn't exist in cloud → push it
        if (!cloudData) {

            await setDoc(cloudRef, round);
            console.log("New push:", round.id);
            continue;
        }

        // CASE 2: cloud exists but local is newer → overwrite
        if (round.updatedAt > cloudData.updatedAt) {

            await setDoc(cloudRef, round);
            console.log("Updated cloud:", round.id);
        }
    }
}
export async function syncAll(user) {

    if (!user) return;

    console.log("Starting sync...");

    await pullRounds(user);
    await pushRounds(user);

    console.log("Sync complete");
}
import { onAuthStateChanged } from
"https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";


onAuthStateChanged(auth, (user) => {

    if (user) {
        console.log("Logged in:", user.uid);
        syncAll(user);
    } else {
        console.log("Logged out");
    }
});