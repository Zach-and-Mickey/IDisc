window.addEventListener("load", () => {
    document.body.classList.add("fade-in");
});
import { db } from "./db.js"
async function loadStatsPage() {

    // LAST 10 ROUNDS

    const rounds10 = await db.rounds
        .orderBy("date")
        .reverse()
        .limit(10)
        .toArray();

    const stats10 =
        roundStats10(rounds10);

    renderStats10("statsTable10", stats10);


    // ALL TIME

    const allRounds =
        await db.rounds.toArray();

    const statsAll =
        roundStatsAll(allRounds);

    renderStatsAll("statsTableAll", statsAll);
    renderAllRounds("roundTableAll", statsAll);
}



// CALCULATE STATS

function roundStats10(rounds10) {

    let totalScore = 0;

    let totalHoles = 0;

    let birdies = 0;
    let pars = 0;
    let bogeys = 0;
    let avgScore = "E";

    for (const round of rounds10) {

        for (const s of round.scores) {

            totalScore += (s.strokes - s.par);

            totalHoles++;

            if ((s.strokes + 1) === s.par) {
                birdies++;
            }

            else if (s.strokes === s.par) {
                pars++;
            }

            else if ((s.strokes - 1) === s.par) {
                bogeys++;
            }
        }
        avgScore = (totalScore/rounds10.length).toFixed(2);
        if (totalScore > 0) {
            avgScore = `+ ${avgScore}`
        } else if (totalScore < 0) {
            avgScore = `${avgScore}`
        }
    }

    return {

        avgScore,

        birdiePct:
            (birdies / totalHoles) * 100,

        parPct:
            (pars / totalHoles) * 100,

        bogeyPct:
            (bogeys / totalHoles) * 100
    };
}



// RENDER TABLE

function renderStats10(tableId, stats) {

    const row = `
        <tr>
            <td>${stats.avgScore}</td>
            <td>${stats.birdiePct.toFixed(1)}%</td>
            <td>${stats.parPct.toFixed(1)}%</td>
            <td>${stats.bogeyPct.toFixed(1)}%</td>
        </tr>
    `;

    document.getElementById(tableId)
        .innerHTML = row;
}

function roundStatsAll(allRounds) {
    let rounds = 0;
    let totalScore = 0;
    let totalHoles = 0;
    let aces = 0;
    let eagles = 0;
    let birdies = 0;
    let average = "E";

    for (const round of allRounds) {

        for (const s of round.scores) {

            totalScore += (s.strokes - s.par);

            totalHoles++;

            if (s.strokes === 1) {
                aces++;
            }

            else if (s.strokes+2 === s.par) {
                eagles++;
            }

            else if ((s.strokes+1) === s.par) {
                birdies++;
            }
        }
    }
            average = (totalScore/allRounds.length).toFixed(2);
        if (totalScore > 0) {
            average = `+ ${average}`
        } else if (totalScore < 0) {
            average = `${average}`
        }

    return {

        rounds: allRounds.length,
        average,
        aces: aces,
        eagles: eagles,
        birdies: birdies,
    };
}



// RENDER TABLE
function renderAllRounds(tableId, stats) {

    const row = `
        <tr>
            <th>Rounds</th>
            <th>Average</th>
        </tr>

        <tr>
            <td>${stats.rounds}</td>
            <td>${stats.average}</td>
        </tr>
    `;

    document.getElementById(tableId)
        .innerHTML = row;
}

function renderStatsAll(tableId, stats) {
    const row = `
        <tr>
            <th>Aces</th>
            <th>Eagles</th>
            <th>Birdies</th>
        </tr>
        <tr>
            <td>${stats.aces}</td>
            <td>${stats.eagles}</td>
            <td>${stats.birdies}</td>
        </tr>
    `;
        document.getElementById(tableId)
        .innerHTML = row;
}


// START PAGE

loadStatsPage();