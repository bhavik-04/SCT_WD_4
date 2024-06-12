document.addEventListener("DOMContentLoaded", function () {
    const taskForm = document.getElementById("taskForm");
    const taskInput = document.getElementById("taskInput");
    const taskDateTime = document.getElementById("taskDateTime");
    const taskLists = document.getElementById("taskLists");

    // Load tasks from localStorage
    loadTasks();

    taskForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const taskText = taskInput.value;
        const taskDate = taskDateTime.value;
        if (taskText && taskDate) {
            addTask(taskText, taskDate);
            taskInput.value = "";
            taskDateTime.value = "";
        }
    });

    function addTask(text, dateTime) {
        const task = {
            id: Date.now(),
            text,
            dateTime,
            completed: false
        };

        const tasks = getTasksFromStorage();
        tasks.push(task);
        saveTasksToStorage(tasks);
        renderTasks(tasks);
    }

    function renderTasks(tasks) {
        taskLists.innerHTML = "";
        tasks.forEach(task => {
            const taskElement = document.createElement("div");
            taskElement.classList.add("task");
            if (task.completed) {
                taskElement.classList.add("completed");
            }

            const taskContent = document.createElement("span");
            taskContent.innerText = `${task.text} - ${new Date(task.dateTime).toLocaleString()}`;
            taskElement.appendChild(taskContent);

            const actions = document.createElement("div");
            actions.classList.add("actions");

            const completeButton = document.createElement("button");
            completeButton.innerText = "Complete";
            completeButton.onclick = () => {
                task.completed = !task.completed;
                saveTasksToStorage(tasks);
                renderTasks(tasks);
            };
            actions.appendChild(completeButton);

            const editButton = document.createElement("button");
            editButton.innerText = "Edit";
            editButton.onclick = () => {
                const newTaskText = prompt("Edit your task", task.text);
                const newDateTime = prompt("Edit Date and Time", task.dateTime);
                if (newTaskText && newDateTime) {
                    task.text = newTaskText;
                    task.dateTime = newDateTime;
                    saveTasksToStorage(tasks);
                    renderTasks(tasks);
                }
            };
            actions.appendChild(editButton);

            const deleteButton = document.createElement("button");
            deleteButton.innerText = "Delete";
            deleteButton.onclick = () => {
                const updatedTasks = tasks.filter(t => t.id !== task.id);
                saveTasksToStorage(updatedTasks);
                renderTasks(updatedTasks);
            };
            actions.appendChild(deleteButton);

            taskElement.appendChild(actions);
            taskLists.appendChild(taskElement);
        });
    }

    function getTasksFromStorage() {
        return JSON.parse(localStorage.getItem("tasks")) || [];
    }

    function saveTasksToStorage(tasks) {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = getTasksFromStorage();
        renderTasks(tasks);
    }
});
