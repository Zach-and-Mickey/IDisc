// auth.js

import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import { auth }
from "./firebase.js";

const provider =
    new GoogleAuthProvider();

export async function login() {

    try {

        const result =
            await signInWithPopup(auth, provider);

        return result.user;

    } catch (err) {

        console.error(err);
    }
}

export async function logout() {

    await signOut(auth);
}

export function listenForAuth(callback) {

    onAuthStateChanged(
        auth,
        callback
    );
}