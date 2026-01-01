let tasksData = {};

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
let draggedTask = null;
let columns = [todo, progress, done];

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
  const choice = prompt(
    "Move task to:\n1 = To Do\n2 = In Progress\n3 = Done"
  );

  let targetColumn = null;

  if (choice === "1") targetColumn = todo;
  if (choice === "2") targetColumn = progress;
  if (choice === "3") targetColumn = done;

  if (targetColumn) {
    targetColumn.appendChild(taskDiv);
    updateTaskCounts();
  }
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
