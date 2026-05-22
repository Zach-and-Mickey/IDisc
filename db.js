export const db = new Dexie("DiscGolfDB");

db.version(3).stores({
    courses: "id, name",
    rounds: "id, date, courseId",
    activeRound: "id, date, courseId"
});