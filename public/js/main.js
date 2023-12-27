// function add task
function addTask() {
    const title = document.getElementById("title").value;
    const deadline = document.getElementById("deadline").value;
    const task = {
        title,
        deadline,
        completed: false,
    };
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateTaskList(tasks);
    document.getElementById("title").value = "";
    document.getElementById("deadline").value = "";
}

// function update task
function updateTaskList(tasks) {
    const content = document.getElementById("content");
    content.innerHTML = "";
    tasks.forEach((task, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `Title : ${task.title}, Deadline : ${task.deadline}`;
        content.appendChild(listItem);
    });
}

document.getElementById("addBtn").addEventListener("click", addTask);

const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
updateTaskList(tasks);

// function update task list
function updateTaskList(tasks) {
    const content = document.getElementById("content");
    content.innerHTML = "";
    tasks.forEach((task, index) => {
        const listItem = document.createElement("li");
        listItem.style.color = task.completed ? "gray" : "white";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.style.margin = "5px";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", function () {
            if (checkbox.checked) {
                const confirmation = confirm("Completed !");
                if (confirmation) {
                    task.completed = true;
                    listItem.style.textDecoration = "line-through";
                } else {
                    checkbox.checked = false;
                }
            } else {
                task.completed = false;
                listItem.style.textDecoration = "none";
            }
            localStorage.setItem("tasks", JSON.stringify(tasks));
        });

        const taskText = document.createElement("span");
        taskText.textContent = `Title: ${task.title}, Deadline: ${task.deadline}`;

        const editIcon = document.createElement("i");
        editIcon.classList.add("fas", "fa-edit");
        editIcon.style.marginLeft = "10px";

        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fas", "fa-trash-alt");
        deleteIcon.style.marginLeft = "10px";

        listItem.appendChild(checkbox);
        listItem.appendChild(taskText);
        listItem.appendChild(editIcon);
        listItem.appendChild(deleteIcon);

        if (task.completed) {
            listItem.style.textDecoration = "line-through";
        }

        content.appendChild(listItem);
    });
}

// ------------------------------
// icon delete
const deleteIcons = document.getElementsByClassName("fa-trash-alt");
for (let i = 0; i < deleteIcons.length; i++) {
    deleteIcons[i].addEventListener("click", function () {
        const index = i;
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        if (index >= 0 && index < tasks.length) {
            tasks.splice(index, 1);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            updateTaskList(tasks);
        }
    });
}

// icon edit
const editIcons = document.getElementsByClassName("fa-edit");
for (let i = 0; i < editIcons.length; i++) {
    editIcons[i].addEventListener("click", function () {
        const index = i;
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        if (index >= 0 && index < tasks.length) {
            const editedTitle = prompt("Edit Title:", tasks[index].title);
            const editedDeadline = prompt("Edit Deadline:", tasks[index].deadline);
            if (editedTitle !== null && editedDeadline !== null) {
                tasks[index].title = editedTitle;
                tasks[index].deadline = editedDeadline;
                localStorage.setItem("tasks", JSON.stringify(tasks));
                updateTaskList(tasks);
            }
        }
    });
}

// ------------------------------------------------------------------------------------------------------
// ham luu background vao localstorage 
function saveBackgroundToLocalStorage(url) {
    localStorage.setItem('backgroundImage', url);
}


// ham lay trang thai tu localstorage
function getBackgroundFromLocalStorage() {
    return localStorage.getItem('backgroundImage');
}

// ham cai dat nen cho body
function setBodyBackground(url) {
    document.body.style.background = `url('${url}') no-repeat center center fixed`;
    document.body.style.backgroundSize = 'cover';
}

// check xem backgorund co luu trong localstorage ko
const savedBackground = getBackgroundFromLocalStorage();
if (savedBackground) {
    setBodyBackground(savedBackground);
}

// su kien click thay doi background
document.getElementById('changeBackgroundButton').addEventListener('click', function () {
    const newBackgroundUrl = prompt('URL background new :');
    if (newBackgroundUrl) {
        setBodyBackground(newBackgroundUrl);
        saveBackgroundToLocalStorage(newBackgroundUrl);
    }
});

//---------------------
