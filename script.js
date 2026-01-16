const channelName = "SEU_CANAL"; // sem @

const tasks = {};

const client = new tmi.Client({
  connection: { secure: true, reconnect: true },
  channels: [channelName]
});

client.connect();

client.on("message", (channel, tags, message, self) => {
  if (self) return;

  const user = tags.username;
  const msg = message.trim();

  if (msg.startsWith("!todo ")) {
    addTask(user, msg.replace("!todo ", ""));
  }

  if (msg.startsWith("!done ")) {
    doneTask(user, parseInt(msg.replace("!done ", "")));
  }

  if (msg === "!clear" && tags.badges?.broadcaster) {
    clearAll();
  }
});

function addTask(user, text) {
  if (!tasks[user]) tasks[user] = [];
  tasks[user].push({ text, done: false });
  render();
}

function doneTask(user, index) {
  if (tasks[user] && tasks[user][index]) {
    tasks[user][index].done = true;
    render();
  }
}

function clearAll() {
  Object.keys(tasks).forEach(u => delete tasks[u]);
  render();
}

function render() {
  const ul = document.getElementById("tasks");
  ul.innerHTML = "";

  let total = 0;
  let completed = 0;

  Object.keys(tasks).forEach(user => {
    tasks[user].forEach(task => {
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
