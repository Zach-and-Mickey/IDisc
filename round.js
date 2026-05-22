window.addEventListener("load", () => {
    document.body.classList.add("fade-in");
});
import { db } from "./db.js";
async function roundPage() {

    const params =
        new URLSearchParams(window.location.search);

    const courseId =
        params.get("id");

    const course =
        await db.courses.get(courseId);

    let currentHole = 1;

    // -----------------------------
    // ROUND STATE (NEW)
    // -----------------------------
let roundData;

const savedRound =
    await db.activeRound.get(courseId);

if (savedRound) {

    roundData = savedRound;

} else {

    roundData = {
        id: crypto.randomUUID(),
        courseId: courseId,
        date: new Date().toISOString(),
        scores: [],
        updatedAt: Date.now()
    };
}

    // -----------------------------
    // RENDER HOLE
    // -----------------------------
function renderHole() {

    const hole =
        course.holes[currentHole - 1];

    document.getElementById("courseName")
        .textContent = course.name;


    document.getElementById("par")
        .textContent = `Par ${hole.par}`;

    const existing =
        roundData.scores.find(
            s => s.hole === hole.number
        );

    document.getElementById("scoreInput")
        .value = existing ? existing.strokes : "";
}
    // -----------------------------
    // SAVE ACTIVE ROUND
    // -----------------------------

async function saveActiveRound() {

    roundData.updatedAt = Date.now();

    await db.activeRound.put({
        ...roundData,
        id: courseId
    });
}
    // -----------------------------
    // SAVE CURRENT HOLE SCORE
    // -----------------------------
function saveHoleScore() {

    const input =
        document.getElementById("scoreInput");

    if (!input.value) return;

    const strokes =
        Number(input.value);

    const hole =
        course.holes[currentHole - 1];

    const existingIndex =
        roundData.scores.findIndex(
            s => s.hole === hole.number
        );

    const entry = {
        hole: hole.number,
        strokes,
        par: hole.par
    };

    if (existingIndex >= 0) {
        roundData.scores[existingIndex] = entry;
    } else {
        roundData.scores.push(entry);
    }
    roundData.updatedAt = Date.now();
    saveActiveRound();
    renderScore();
    renderScorecard();
}

    // -----------------------------
    // ROUND SCORE CALCULATOR
    // -----------------------------
    function calculateScore() {
        let total = 0;

        for (const s of roundData.scores) {
            total += (s.strokes - s.par);
        }
        return total;
    }

    // -----------------------------
    // ROUND SCORE RENDER
    // -----------------------------
    function renderScore() {

    const score = calculateScore();
    const scoreElement = document.getElementById('roundScore');

    let text = "E";
    scoreElement.className = "";

    if (score > 0) {
        text = `+${score}`;
        scoreElement.classList.add("score-positive");
    } else if (score < 0) {
        text = `${score}`;
        scoreElement.classList.add("score-negative");
    } else {
        scoreElement.classList.add("score-even");
    }

    scoreElement.textContent = text;
}

    // -----------------------------
    // FINISH ROUND
    // -----------------------------
    async function finishRound() {

        // make sure last hole is saved
        saveHoleScore();
        roundData.updatedAt = Date.now();
        await db.rounds.put(roundData);
        await db.activeRound.delete(courseId);

        alert("Round saved!");

        window.location.href =
            `roundDetails.html?id=${roundData.id}`;
    }

    // -----------------------------
    // NEXT HOLE
    // -----------------------------
function nextHole() {

    saveHoleScore();

    if (currentHole < course.holes.length) {
    }

    currentHole++;
    renderHole();
    renderHoleNav();
    renderScorecard();
}

function prevHole() {

    saveHoleScore();

    if (currentHole > 1) {
        currentHole--;
    }

    renderHole();
    renderHoleNav();
    renderScorecard();
}
renderHole();
renderScore();
renderHoleNav();
renderScorecard();
document.getElementById("plusBtn")
    .addEventListener("click", () => {

        const input = document.getElementById("scoreInput");
        const hole = course.holes[currentHole - 1];

        if (input.value === "") {
            input.value = hole.par;
        } else {
            input.value = Number(input.value) + 1;
        }
    });

document.getElementById("minusBtn")
    .addEventListener("click", () => {

        const input = document.getElementById("scoreInput");
        const hole = course.holes[currentHole - 1];

        if (input.value === "") {
            input.value = hole.par-1;
            return;
        }

        input.value = Math.max(
            1,
            Number(input.value) - 1
        );
    });
    document.getElementById("finishRoundBtn")
    .addEventListener("click", finishRound);
    
    function renderHoleNav() {

    const nav = document.getElementById("holeNav");

    let html = "";

    for (let i = 1; i <= course.holes.length; i++) {

        html += `
            <button class="hole-btn ${i === currentHole ? "active" : ""}"
                data-hole="${i}">
                ${i}
            </button>
        `;
    }

    nav.innerHTML = html;

   document.getElementById("holeNav").onclick = (e) => {

    if (!e.target.classList.contains("hole-btn")) return;

    saveHoleScore();

    currentHole = Number(e.target.dataset.hole);

    renderHole();
    renderHoleNav();
};


}
function renderScorecard() {

    const front9 = course.holes.slice(0, 9);

    const back9 = course.holes.slice(9, 18);

    const frontTable =
        createScorecardTable(front9);

    const backTable =
        createScorecardTable(back9);

    document.getElementById("scorecard").innerHTML =
        frontTable + backTable;
}
function createScorecardTable(holes) {

    let holesRow = "<tr class='holesRow'>";
    let parRow = "<tr class='parRow'>";
    let scoreRow = "<tr class='scoreRow'>";

    for (const hole of holes) {

        const score =
            roundData.scores.find(
                s => s.hole === hole.number
            );

        holesRow += `
            <td>${hole.number}</td>
        `;

        parRow += `
            <td>${hole.par}</td>
        `;

        // no score yet
        if (!score) {

            scoreRow += `
                <td class='empty'>-</td>
            `;

            continue;
        }

        // scoring styles
        if (score.strokes === score.par - 2) {

            scoreRow += `
                <td class='eagle'>
                    ${score.strokes}
                </td>
            `;

        } else if (score.strokes === score.par - 1) {

            scoreRow += `
                <td class='birdie'>
                    ${score.strokes}
                </td>
            `;

        } else if (score.strokes === score.par) {

            scoreRow += `
                <td class='par'>
                    ${score.strokes}
                </td>
            `;

        } else if (score.strokes === score.par + 1) {

            scoreRow += `
                <td class='bogey'>
                    ${score.strokes}
                </td>
            `;

        } else if (score.strokes >= score.par + 2) {

            scoreRow += `
                <td class='double'>
                    ${score.strokes}
                </td>
            `;
        }
    }

    holesRow += "</tr>";
    parRow += "</tr>";
    scoreRow += "</tr>";

    return `
        <div class="scorecard-section">

            <table class="scorecard">

                <tbody>
                    ${holesRow}
                    ${parRow}
                    ${scoreRow}
                </tbody>

            </table>

        </div>
    `;
}
}

roundPage();