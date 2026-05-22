import {
    login,
    logout,
    listenForAuth
}
from "./auth.js";
import { pullRounds, syncAll }
from "./sync.js";
import { db }
from "./db.js";

const loginBtn =
    document.getElementById("loginBtn");

const profilePic =
    document.getElementById("profilePic");

listenForAuth(async user => {

    if (user) {

        const name =
            user.displayName?.split(" ")[0] || "User";

        const photo =
            user.photoURL;

        if (photo) {

            profilePic.src = photo;
            profilePic.hidden = false;

            loginBtn.textContent = "";
            loginBtn.style.display = "none";

        } else {

            profilePic.hidden = true;

            loginBtn.style.display = "inline-block";
            loginBtn.textContent = name;
        }
        await syncAll(user);

    } else {

        profilePic.hidden = true;
        loginBtn.style.display = "inline-block";
        loginBtn.textContent = "Sign In";
    }
});