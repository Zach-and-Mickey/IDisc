window.addEventListener("load", () => {
    document.body.classList.add("fade-in");
});
async function initCoursePage() {

    const courseId = getCourseIdFromURL();

    setRoundLink(courseId);

    await renderCourseStats(courseId);
}


// ---------- URL HELPERS ----------

function getCourseIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}


// ---------- LINK ----------

function setRoundLink(courseId) {

    const link = document.getElementById("roundLink");

    link.href = `round.html?id=${courseId}`;
}


// ---------- STATS ----------

async function renderCourseStats(courseId) {

    const rounds = await db.rounds
        .where("courseId")
        .equals(courseId)
        .toArray();

    const container = document.getElementById("content");

    if (rounds.length === 0) {
        container.innerHTML = "<h3>No rounds played yet</h3>";
        return;
    }

    let totalScore = 0;
    let bestScore = Infinity;
    let bestRound = null;

    for (const round of rounds) {

        let roundScore = 0;

        for (const s of round.scores) {
            roundScore += (s.strokes - s.par);
        }

        totalScore += roundScore;

        if (roundScore < bestScore) {
            bestScore = roundScore;
            bestRound = round;
        }
    }

    const avgScore = totalScore / rounds.length;
if (bestScore > 0) {
container.innerHTML = `
    <div class="stat">
        <div class="label">Times Played:</div>
        <div class="value">${rounds.length}</div>
    </div>

    <div class="stat">
        <div class="label">Average Score: </div>
        <div class="value">${avgScore.toFixed(1)}</div>
    </div>

    <div class="stat">
        <div class="roundLabel"><a href="roundDetails.html?id=${bestRound.id}">Best Round: </a></div>
        <div class="value"><a class="value" href="roundDetails.html?id=${bestRound.id}">
            +${bestScore}
            </a>
        </div>
    </div>
`;} else if (bestScore < 0) {
container.innerHTML = `
    <div class="stat">
        <div class="label">Times Played:</div>
        <div class="value">${rounds.length}</div>
    </div>

    <div class="stat">
        <div class="label">Average Score: </div>
        <div class="value">${avgScore.toFixed(1)}</div>
    </div>

    <div class="stat">
        <div class="roundLabel"><a href="roundDetails.html?id=${bestRound.id}">Best Round: </a></div>
        <div class="value"><a class="value" href="roundDetails.html?id=${bestRound.id}">
            -${bestScore}
            </a>
        </div>
    </div>
`;}
}


// ---------- START ----------

initCoursePage();