const tasks = JSON.parse(localStorage.getItem("tasks")) || {};

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask(user, text) {
  if (!tasks[user]) tasks[user] = [];
  tasks[user].push({ text, done: false });
  save();
  render();
}

function doneTask(user, index) {
  if (tasks[user] && tasks[user][index]) {
    tasks[user][index].done = true;
    save();
    render();
  }
}

function render() {
  const ul = document.getElementById("tasks");
  ul.innerHTML = "";

  let total = 0;
  let completed = 0;

  Object.keys(tasks).forEach(user => {
    tasks[user].forEach((task, i) => {
      total++;
      if (task.done) completed++;

      const li = document.createElement("li");
      li.textContent = `${user}: ${task.text}`;
      if (task.done) li.classList.add("done");
      ul.appendChild(li);
    });
  });

  document.getElementById("progress").textContent =
    total ? `${completed} of ${total} completed` : "";
}

function clearAll() {
  Object.keys(tasks).forEach(user => {
    delete tasks[user];
  });
  save();
  render();
}


/* API via URL */
const params = new URLSearchParams(window.location.search);

if (params.get("action") === "add") {
  addTask(params.get("user"), params.get("task"));
}

if (params.get("action") === "done") {
  doneTask(params.get("user"), parseInt(params.get("id")));
}

if (params.get("action") === "clear") {
  clearAll();
}

render();

