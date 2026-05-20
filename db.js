const db = new Dexie("DiscGolfDB");

db.version(2).stores({
    courses: "id, name",
    rounds: "id, date, courseId"
});