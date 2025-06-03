document.addEventListener("DOMContentLoaded", () => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
        tasks.splice(0, tasks.length, ...storedTasks); // keep tasks as const but update content
        updateTaskList();
        updateStats();
    }
});

const tasks = [];

const saveTasks = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const addTask = () => {
    const taskInput = document.getElementById('taskInput');
    const dateInput = document.getElementById('taskDate');
    const timeInput = document.getElementById('taskTime');

    const text = taskInput.value.trim();
    const date = dateInput.value;
    const time = timeInput.value;

    if (text) {
        tasks.push({ text: text, completed: false, date, time });
        taskInput.value = "";
        dateInput.value = "";
        timeInput.value = "";
        updateTaskList();
        updateStats();
        saveTasks();
    }
};

const toggleTaskComplete = (index) => {
    // Don’t toggle if task is overdue
    if (isPastDeadline(tasks[index].date, tasks[index].time)) return;

    tasks[index].completed = !tasks[index].completed;
    updateTaskList();
    updateStats();
    saveTasks();
};

const deleteTask = (index) => {
    tasks.splice(index, 1);
    updateTaskList();
    updateStats();
    saveTasks();
};

const editTask = (index) => {
    const taskInput = document.getElementById('taskInput');
    const dateInput = document.getElementById('taskDate');
    const timeInput = document.getElementById('taskTime');

    taskInput.value = tasks[index].text;
    dateInput.value = tasks[index].date || "";
    timeInput.value = tasks[index].time || "";

    tasks.splice(index, 1);
    updateTaskList();
    updateStats();
    saveTasks();
};

const updateStats = () => {
    const completeTasks = tasks.filter(task => task.completed && !isPastDeadline(task.date, task.time)).length;
    const totalTasks = tasks.length;
    const progress = totalTasks === 0 ? 0 : (completeTasks / totalTasks) * 100;

    const progressBar = document.getElementById('progress');
    progressBar.style.width = `${progress}%`;
    document.getElementById('numbers').innerText = `${completeTasks} / ${totalTasks}`;

    if (tasks.length && completeTasks === totalTasks) {
        blastConfetti();
    }
};

const updateTaskList = () => {
    const tasklist = document.getElementById('task-list');
    tasklist.innerHTML = '';

    tasks.forEach((task, index) => {
        const overdue = isPastDeadline(task.date, task.time);
        const listItem = document.createElement("li");

        listItem.innerHTML = `
            <div class="taskItem">
                <div class="task ${task.completed ? 'completed' : ''} ${overdue ? 'overdue' : ''}">
                    <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''} ${overdue ? 'disabled' : ''} />
                    <div>
                        <p>${task.text}</p>
                        ${task.date || task.time ? `<small>${task.date || ''} ${task.time || ''}</small>` : ''}
                    </div>
                </div>
                <div class="icons">
                    <img src="./img/edit.png" onclick="editTask(${index})" />
                    <img src="./img/bin.png" onclick="deleteTask(${index})" />
                </div>
            </div>
        `;

        if (!overdue) {
            const checkbox = listItem.querySelector('.checkbox');
            checkbox.addEventListener("change", () => {
                toggleTaskComplete(index);
            });
        }

        tasklist.appendChild(listItem);
    });
};

// Helper to check if task date/time is past current time
const isPastDeadline = (date, time) => {
    if (!date) return false;

    const now = new Date();
    const taskDateTime = new Date(date + 'T' + (time || '00:00'));

    return taskDateTime < now;
};

document.getElementById('newTask').addEventListener('click', function (e) {
    e.preventDefault();
    addTask();
});

// CONFETTI
const blastConfetti = () => {
    const count = 200,
        defaults = {
            origin: { y: 0.7 },
        };

    function fire(particleRatio, opts) {
        confetti(
            Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio),
            })
        );
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });

    fire(0.2, {
        spread: 60,
    });

    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
};
