window.addEventListener("load", () => {
    document.body.classList.add("fade-in");
});
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
}

loadRecentRounds();