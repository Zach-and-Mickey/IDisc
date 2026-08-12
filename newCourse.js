 window.addEventListener("load", () => {
    document.body.classList.add("fade-in");
});
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
 let currentHoleIndex = 0;

        let holes = [
            {
                number: 1,
                par: 3
            }
        ];

function renderHole() {

    const hole =
        holes[currentHoleIndex];

    document.getElementById("holeCard")
    .innerHTML = `
        <div class="par-label">
            Set Par
        </div>

        <div class="par-controls">

            <button id="minusBtn">
                -
            </button>

            <div id="parValue">
                ${hole.par}
            </div>

            <button id="plusBtn">
                +
            </button>

        </div>
    `;

    document.getElementById("plusBtn")
    .addEventListener("click", () => {

        if (hole.par < 10) {

            hole.par++;

            renderHole();
        }
    });

    document.getElementById("minusBtn")
    .addEventListener("click", () => {

        if (hole.par > 1) {

            hole.par--;

            renderHole();
        }
    });

    renderHoleNav();
}

       function renderHoleNav() {

    const nav =
        document.getElementById("hole-nav");

    let html = "";

    for (let i = 0; i < holes.length; i++) {

        html += `
            <button
                class="hole-btn ${i === currentHoleIndex ? "active" : ""}"
                data-hole="${i}"
            >
                ${i + 1}
            </button>
        `;
    }

    nav.innerHTML = html;

    nav.onclick = (e) => {

        if (!e.target.classList.contains("hole-btn")) {
            return;
        }

        currentHoleIndex =
            Number(e.target.dataset.hole);

        renderHole();
    };
}
        document.getElementById("addHoleBtn")
        .addEventListener("click", () => {

            holes.push({
                number: holes.length + 1,
                par: 3
            });

            currentHoleIndex =
                holes.length - 1;

            renderHole();
        });

        document.getElementById("deleteHoleBtn")
        .addEventListener("click", () => {

            if (holes.length === 1) {
                return;
            }

            holes.splice(currentHoleIndex, 1);

            holes.forEach((hole, index) => {

                hole.number = index + 1;
            });

            if (currentHoleIndex >= holes.length) {

                currentHoleIndex =
                    holes.length - 1;
            }

            renderHole();
        });

        document.getElementById("saveCourseBtn")
        .addEventListener("click", saveCourse);

async function saveCourse() {

    const course = {

        id: crypto.randomUUID(),

        name:
            document.getElementById("courseName").value,

        holes: holes
    };

    try {

        await db.courses.add(course);

        window.location.href =
            "courses.html";

    } catch (error) {

        console.error(error);

        alert("Failed to save course.");
    }
}

        renderHole();
