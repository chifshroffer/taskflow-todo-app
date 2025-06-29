document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("taskflow-user"));

  if (location.pathname.includes("index.html") && user) {
    location.href = "app.html";
  }

  if (location.pathname.includes("app.html") && !user) {
    location.href = "index.html";
  }

  // Form logic
  const form = document.getElementById("userForm");
  if(form){
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const dob = document.getElementById("dob").value;
      const error = document.getElementById("error");

      if (!name || !dob) {
        error.textContent = "Please enter your name and date of birth.";
        return;
      }

      const age = new Date().getFullYear() - new Date(dob).getFullYear();

      if (age <= 10) {
        error.textContent = "You must be older than 10.";
        return;
      }

      const user = { name, dob };
      localStorage.setItem("taskflow-user", JSON.stringify(user));

    // ✅ Redirect to app page
      window.location.href = "app.html";
    });
  }

  // App logic
  if (path.includes("app.html")) {
    const profile = document.getElementById("profile");
    const signOut = document.getElementById("signOut");
    const addBtn = document.getElementById("add-task");
    const newTaskInput = document.getElementById("new-task");

    let tasks = JSON.parse(localStorage.getItem("taskflow-tasks")) || {
      todo: [],
      completed: [],
      archived: [],
    };

    function renderProfile() {
      const user = JSON.parse(localStorage.getItem("taskflow-user"));
      if (user && profile) {
        profile.innerHTML = `
          <img src="https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${user.name}" alt="Avatar" />
          <span>${user.name}</span>
        `;
      }
    }

    function renderTasks() {
      ["todo", "completed", "archived"].forEach((stage) => {
        const list = document.getElementById(`${stage}-list`);
        const count = document.getElementById(`${stage}-count`);
        list.innerHTML = "";
        tasks[stage].forEach((task, i) => {
          const div = document.createElement("div");
          div.className = "task";
          div.innerHTML = `
            <span>${task.text}</span>
            <small>${task.timestamp}</small>
            ${getButtons(stage, i)}
          `;
          list.appendChild(div);
        });
        count.textContent = tasks[stage].length;
      });
    }

    function getButtons(stage, index) {
      const btns = [];
      if (stage === "todo") {
        btns.push(
          `<button onclick="moveTask(${index}, 'todo', 'completed')">Complete</button>`,
          `<button onclick="moveTask(${index}, 'todo', 'archived')">Archive</button>`
        );
      } else if (stage === "completed") {
        btns.push(
          `<button onclick="moveTask(${index}, 'completed', 'todo')">Undo</button>`,
          `<button onclick="moveTask(${index}, 'completed', 'archived')">Archive</button>`
        );
      } else if (stage === "archived") {
        btns.push(
          `<button onclick="moveTask(${index}, 'archived', 'todo')">Restore to Todo</button>`,
          `<button onclick="moveTask(${index}, 'archived', 'completed')">Restore to Completed</button>`
        );
      }
      return btns.join(" ");
    }

    window.moveTask = function (index, from, to) {
      const task = tasks[from][index];
      task.timestamp = new Date().toLocaleString();
      tasks[to].push(task);
      tasks[from].splice(index, 1);
      saveTasks();
      renderTasks();
    };

    function saveTasks() {
      localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
    }

    if (addBtn) {
      addBtn.addEventListener("click", () => {
        const text = newTaskInput.value.trim();
        if (!text) return;
        tasks.todo.push({ text, timestamp: new Date().toLocaleString() });
        newTaskInput.value = "";
        saveTasks();
        renderTasks();
      });
    }

    if (signOut) {
      signOut.addEventListener("click", () => {
        localStorage.clear();
        location.href = "index.html";
      });
    }

    if (tasks.todo.length === 0) {
      fetch("https://dummyjson.com/todos")
        .then((res) => res.json())
        .then((data) => {
          tasks.todo = data.todos.slice(0, 5).map((t) => ({
            text: t.todo,
            timestamp: new Date().toLocaleString(),
          }));
          saveTasks();
          renderTasks();
        });
    } else {
      renderTasks();
    }

    renderProfile();
  }
});
// Placeholder. This would include the verified logic from canvas for age verification, user data, todo logic, API fetches, and UI updates.
