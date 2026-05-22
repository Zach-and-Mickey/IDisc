window.addEventListener("load", () => {
    document.body.classList.add("fade-in");
});
import { db } from "./db.js";
async function renderCourses() {

const courses =
    (await db.courses.toArray())
        .sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    const container =
        document.getElementById("courseList");

    if (courses.length === 0) {

        container.innerHTML = `
            <p>No courses added yet.</p>
        `;

        return;
    }

    container.innerHTML = courses.map(course => `
        <div class="course-card">

            <h2><a href="courseStats.html?id=${course.id}">${course.name}</a></h2>

        </div>
    `).join("");
}

renderCourses();