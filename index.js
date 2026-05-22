window.addEventListener("load", () => {
    document.body.classList.add("fade-in");
});
const profilePic = document.getElementById("profilePic");
const profileMenu = document.getElementById("profileMenu");

profilePic.addEventListener("click", (e) => {
    e.stopPropagation();
    profileMenu.classList.toggle("hidden");
    
});
import { db } from "./db.js";
import { login, logout } from "./auth.js";

document.getElementById("loginBtn")
    .addEventListener("click", async () => {
        await login();
        profileMenu.classList.add("hidden")
    })

document.getElementById("logoutBtn")
    .addEventListener("click", async () => {
        await logout();
        profileMenu.classList.add("hidden");
    });

document.getElementById("switchBtn")
    .addEventListener("click", async () => {

        // forces Google popup again
        await login();

        profileMenu.classList.add("hidden");
    });
    document.addEventListener("click", (e) => {

    if (!profilePic.contains(e.target) &&
        !profileMenu.contains(e.target)) {
        profileMenu.classList.add("hidden");
    }
});
async function loadActiveRound() {

    const activeRounds =
        await db.activeRound.toArray();

    if (activeRounds.length === 0) return;

    const round = activeRounds[0];

    const course =
        await db.courses.get(round.courseId);

    const stats =
        calculateRoundStats(round);

    const container =
        document.getElementById("activeRoundContainer");

    container.innerHTML = `

        <a
            class="round-card active-round"
            href="round.html?id=${round.courseId}"
        >

            <h2>Active Round</h2>

            <h3>${course.name}</h3>

            <div class="active-table-wrapper">

                <table class="recent-round-table">

                    <thead>
                        <tr>
                            <th>Par</th>
                            <th>Strokes</th>
                            <th>Score</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>${stats.totalPar}</td>
                            <td>${stats.strokes}</td>
                            <td>${formatScore(stats.total)}</td>
                        </tr>
                    </tbody>

                </table>

            </div>

        </a>
    `;
}
async function loadRecentRounds() {

    const rounds = await db.rounds
        .orderBy("date")
        .reverse()
        .limit(4)
        .toArray();

    const container =
        document.getElementById("recentRounds");

    let html = "";

    for (const round of rounds) {

        const course =
            await db.courses.get(round.courseId);

        const stats =
            calculateRoundStats(round);
        const date = new Date(round.date).toLocaleDateString();
        html += `

            <a
                class="round-card"
                href="roundDetails.html?id=${round.id}"
            >

                <h3>${course.name} - ${date}</h3>

            <div class="table-wrapper">
                <table class="recent-round-table">

                    <thead>
                        <tr>
                            <th>Par</th>
                            <th>Strokes</th>
                            <th>Score</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td>${stats.totalPar}</td>
                            <td>${stats.strokes}</td>
                            <td>${formatScore(stats.total)}</td>
                        </tr>
                    </tbody>

                </table>
            </div>                

            </a>
        `;
    }

    container.innerHTML = html;
}
    function calculateRoundStats(round) {

        let total = 0;
        let totalPar = 0;
        let strokes = 0;

        for (const s of round.scores) {

            total += (s.strokes - s.par);

            strokes += s.strokes;

            totalPar += s.par;
        }

        return {
            total,
            totalPar,
            strokes
        };
    }


    function formatScore(score) {

        if (score > 0) return `+${score}`;

        if (score < 0) return `${score}`;

        return "E";
    }
loadActiveRound();
loadRecentRounds();