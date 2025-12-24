const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
let draggedTask = null;

const tasks = document.querySelectorAll(".task");

tasks.forEach((task) => {
  task.addEventListener("drag", () => {
    draggedTask = task;
  });
});

function addDragOnColumn(column) {
  column.addEventListener("dragenter", (e) => {
    e.preventDefault();
    column.classList.add("hover-over");
  });
  column.addEventListener("dragleave", (e) => {
    e.preventDefault();
    column.classList.remove("hover-over");
  });
  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
  column.addEventListener("drop", (e) => {
    e.preventDefault();
    column.appendChild(draggedTask);
    column.classList.remove("hover-over");
  });
}

addDragOnColumn(todo);
addDragOnColumn(progress);
addDragOnColumn(done);

// Modal functionality
const toggleModalBtn = document.querySelector("#toggle-modal");
const modalBg = document.querySelector(".modal .bg");
const modal = document.querySelector(".modal");

toggleModalBtn.addEventListener("click", () => {
  modal.classList.add("active");
});

modalBg.addEventListener("click", () => {
  modal.classList.remove("active");
});
