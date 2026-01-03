let tasksData = {};

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
let draggedTask = null;
let columns = [todo, progress, done];

let activeTask = null;

const moveSheet = document.querySelector("#move-sheet");
const sheetButtons = moveSheet.querySelectorAll("button[data-target]");
const cancelSheet = moveSheet.querySelector(".cancel");

function addTask(title, desc, column) {
  const taskDiv = document.createElement("div");
  taskDiv.className = "task";
  taskDiv.draggable = true;

  taskDiv.innerHTML = `
  <h2>${title}</h2>
  <p>${desc}</p>
  <div class="task-actions">
    <button class="move-btn">Move</button>
    <button class="delete-btn">Delete</button>
  </div>
  `;
  column.appendChild(taskDiv);

  taskDiv.addEventListener("drag", () => {
    draggedTask = taskDiv;
  });

  const deleteBtn = taskDiv.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => {
    taskDiv.remove();
    updateTaskCounts();
  });

  const moveBtn = taskDiv.querySelector(".move-btn");

  moveBtn.addEventListener("click", () => {
    activeTask = taskDiv;
    moveSheet.classList.add("active");
  });

  return taskDiv;
}

function updateTaskCounts() {
  columns.forEach((col) => {
    const tasksInCol = col.querySelectorAll(".task");
    const count = col.querySelector(".right");

    tasksData[col.id] = Array.from(tasksInCol).map((task) => {
      return {
        title: task.querySelector("h2").innerText,
        description: task.querySelector("p").innerText,
      };
    });

    localStorage.setItem("tasksData", JSON.stringify(tasksData));
    count.innerText = tasksInCol.length;
  });
}

sheetButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.dataset.target;
    const targetColumn = document.querySelector(`#${targetId}`);

    if (activeTask && targetColumn) {
      targetColumn.appendChild(activeTask);
      updateTaskCounts();
    }

    activeTask = null;
    moveSheet.classList.remove("active");
  });
});

cancelSheet.addEventListener("click", () => {
  activeTask = null;
  moveSheet.classList.remove("active");
});

if (localStorage.getItem("tasksData")) {
  const data = JSON.parse(localStorage.getItem("tasksData"));
  for (const colId in data) {
    const col = document.querySelector(`#${colId}`);
    data[colId].forEach((task) => {
      addTask(task.title, task.description, col);
    });
    updateTaskCounts();
  }
}

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

    updateTaskCounts();

    columns.forEach((col) => {
      const tasksInCol = col.querySelectorAll(".task");
      const count = col.querySelector(".right");

      tasksData[col.id] = Array.from(tasksInCol).map((task) => {
        return {
          title: task.querySelector("h2").innerText,
          description: task.querySelector("p").innerText,
        };
      });

      localStorage.setItem("tasksData", JSON.stringify(tasksData));
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
const closeModalBtn = document.querySelector(".close-modal");

if (closeModalBtn) {
  closeModalBtn.addEventListener("click", () => {
    modal.classList.remove("active");
  });
}

toggleModalBtn.addEventListener("click", () => {
  modal.classList.add("active");
});

modalBg.addEventListener("click", () => {
  modal.classList.remove("active");
});

addTaskBtn.addEventListener("click", () => {
  const taskTitle = modal.querySelector("#task-title-input").value;
  const taskDesc = modal.querySelector("#task-desc-input").value;

  addTask(taskTitle, taskDesc, todo);
  updateTaskCounts();
  modal.classList.remove("active");

  document.querySelector("#task-title-input").value = "";
  document.querySelector("#task-desc-input").value = "";
});
