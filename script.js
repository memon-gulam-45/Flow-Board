const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
let draggedTask = null;
let columns = [todo, progress, done];

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

    columns.forEach((col) => {
      const tasksInCol = col.querySelectorAll(".task");
      const count = col.querySelector(".right");

      count.innerText = tasksInCol.length;
    });
  });
}

addDragOnColumn(todo);
addDragOnColumn(progress);
addDragOnColumn(done);

// Modal functionality
const toggleModalBtn = document.querySelector("#toggle-modal");
const modalBg = document.querySelector(".modal .bg");
const modal = document.querySelector(".modal");
const addTaskBtn = document.querySelector("#add-new-task");

toggleModalBtn.addEventListener("click", () => {
  modal.classList.add("active");
});

modalBg.addEventListener("click", () => {
  modal.classList.remove("active");
});

addTaskBtn.addEventListener("click", () => {
  const taskTitle = modal.querySelector("#task-title-input").value;
  const taskDesc = modal.querySelector("#task-desc-input").value;

  const taskDiv = document.createElement("div");
  taskDiv.className = "task";
  taskDiv.draggable = true;

  taskDiv.innerHTML = `
  <h2>${taskTitle}</h2>
  <p>${taskDesc}</p>
  <button>Delete</button>
  `;
  todo.appendChild(taskDiv);

  columns.forEach((col) => {
    const tasksInCol = col.querySelectorAll(".task");
    const count = col.querySelector(".right");

    count.innerText = tasksInCol.length;
  });

  taskDiv.addEventListener("drag", () => {
    draggedTask = taskDiv;
  });

  modal.classList.remove("active");
});
