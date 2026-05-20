window.addEventListener("load", () => {
    document.body.classList.add("fade-in");
});
async function loadRoundDetails() {

    const params = new URLSearchParams(window.location.search);
    const roundId = (params.get('id'));
    const round = await db.rounds.get(roundId);
    console.log(round)
    const course = await db.courses.get(round.courseId);
    document.getElementById("courseName").textContent =
    course.name;

    document.getElementById("roundDate").textContent =
    new Date(round.date).toLocaleDateString();
    console.log(course);

    const stats =
        calculateRoundStats(round);


function calculateRoundStats(round) {

    let totalScore = 0;

    let totalHoles = 0;

    let birdies = 0;
    let pars = 0;
    let bogeys = 0;
    let score = "E"

        for (const s of round.scores) {

            totalScore += (s.strokes - s.par);

            totalHoles++;

            if ((s.strokes+1) === s.par) birdies++;
            else if ((s.strokes) === s.par) pars++;
            else if ((s.strokes-1) === s.par) bogeys++;

        }
        if (totalScore >0) {
            score = `+ ${totalScore}`;
        } else if (totalScore < 0){
            score = `${totalScore}`;
        }

    const birdiePct =
        (birdies / totalHoles) * 100;

    const parPct = 
        (pars / totalHoles) * 100;

    const bogeyPct =
        (bogeys / totalHoles) * 100;


    return {
        score,
        birdiePct,
        parPct,
        bogeyPct
    };
}
    function renderStats(stats) {

    const row = `
        <tr>
            <td>${stats.score}</td>
            <td>${stats.birdiePct.toFixed(1)}%</td>
            <td>${stats.parPct.toFixed(1)}%</td>
            <td>${stats.bogeyPct.toFixed(1)}%</td>
        </tr>
    `;

    document.getElementById("statsTable")
        .innerHTML = row;
}
function renderScorecard(round) {

    const front9 = round.scores.slice(0, 9);

    const back9 = round.scores.slice(9, 18);

    const frontTable =
        createScorecardTable(front9);

    const backTable =
        createScorecardTable(back9);

    document.getElementById("scorecard").innerHTML =
        frontTable + backTable;
}
function createScorecardTable(scores) {

    let holesRow = "<tr class='holesRow'>";
    let parRow = "<tr class='parRow'>";
    let scoreRow = "<tr class='scoreRow'>";

    for (const score of scores) {

        holesRow += `
            <td>${score.hole}</td>
        `;

        parRow += `
            <td>${score.par}</td>
        `;
        if (score.strokes === score.par-2) {
            scoreRow += `
            <td class='eagle'>${score.strokes}</td>
        `;
        } else if (score.strokes === score.par-1) {
            scoreRow += `
            <td class='birdie'>${score.strokes}</td>
        `;
        }
        else if (score.strokes === score.par) {
            scoreRow += `
            <td class='par'>${score.strokes}</td>
        `;
        }
        else if (score.strokes === score.par+1) {
            scoreRow += `
            <td class='bogey'>${score.strokes}</td>
        `;
        }
        else if (score.strokes === score.par+2) {
            scoreRow += `
            <td class='double'>${score.strokes}</td>
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
renderScorecard(round);
    renderStats(stats);
}


loadRoundDetails();