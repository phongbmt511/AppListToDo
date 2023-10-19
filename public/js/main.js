// let allTasks = []; // list nhiem vu ban dau
// let filteredTasks = []; // list nhiem vu sau khi loc

// function loadAllData() {
//     $.ajax({
//         url: '/api/tasks',
//         type: 'GET'
//     })
//         .then(data => {
//             allTasks = data; // luu list tat ca nhiem vu
//             filteredTasks = data; // list ban dau
//             displayTasks(filteredTasks); // hien thi list sau khi loc
//         })
//         .catch(err => {
//             console.log("error");
//         });

// }
// loadAllData();

// // ham hien thi list nhiem vu
// function displayTasks(tasks) {
//     $('#content').html('');
//     const currentDate = new Date(); // lay date hien tai
//     for (let i = 0; i < tasks.length; i++) {
//         const element = tasks[i];
//         const rawDeadline = new Date(element.deadline);
//         const formattedDeadline = rawDeadline.toLocaleDateString();
//         const li = $(`<li class="li todo-text" id=${element._id}><span><input class="form-check-input" type="checkbox" value="" id="checkbox_${element._id}"></span>${element.title}-<span class="todo-text">${formattedDeadline}</span><span class="deleteBtn"><i class="fa-solid fa-trash"></i></span></li>`);
//         const editBtn = $('<span class="editBtn"><i class="fa-solid fa-pen"></i></span>');
//         editBtn.click(function () {
//             editTaskById(element._id);
//         });
//         // check nhiem vu da den han chua
//         if (rawDeadline <= currentDate) {
//             li.addClass('deadline-passed'); // nhiem vu da den han
//             const notificationContent = `Nhiệm vụ "${element.title}" đã đến hạn vào ngày ${formattedDeadline}`;
//             // cap nhap noi dung modal
//             $('#notificationContent').text(notificationContent);
//             // show modal
//             $('#notificationModal').modal('show');
//         }
//         // lang nghe su kien check box 
//         const checkbox = li.find(`#checkbox_${element._id}`);
//         checkbox.change(function () {
//             const isChecked = checkbox.prop('checked');
//             if (isChecked) {
//                 // hien thi thong bao nhiem vu da hoan thanh va gach ngang nhiem vu
//                 li.addClass('completed');
//                 prompt('Thông báo', 'Hoàn thành nhiệm vụ ');
//             } else {
//                 // xoa bo gach ngang sau khi bo check box
//                 li.removeClass('completed');
//             }
//         });
//         li.append(editBtn);
//         $('#content').append(li);
//     }
//     $('.deleteBtn').click(function () {
//         deleteById($(this).parent().attr('id'));
//     });
// }

// //goi lai ham loaddata de tai lai list nhiem vu va check den han
// loadAllData();

// // su kien nut search
// $('#search-button').click(function (e) {
//     e.preventDefault(); // ngan trang web tai lai du lieu
//     // lay value tu o search
//     let key = $('#search-input').val().trim();
//     // loc list nhiem vu theo tieu de
//     filteredTasks = allTasks.filter(task => task.title.includes(key));
//     // hien thi list sau khi loc
//     displayTasks(filteredTasks);
// });

// // goi lai ham loadalldata de cap nhap list nhiem vu sau khi edit va delete
// function refreshData() {
//     loadAllData();
// }
// // su kien nut add

// $('#addBtn').click(() => {
//     const title = $('#title').val();
//     const deadline = $('#deadline').val();
//     $.ajax({
//         url: '/api/tasks',
//         type: 'POST',
//         data: {
//             title: title,
//             deadline: deadline
//         }
//     })
//         .then(data => {
//             alert('Thêm thành công');
//             const li = $(`<li class="list-group-item" id=${data._id}>${data.title} - <b>${data.deadline}</b><span class="span-button"><i class="deleteBtn fa-solid fa-trash"></i></span></li>`);
//             $('#content').append(li);
//             $('.deleteBtn').click(function () {
//                 deleteById($(this).parent().attr('id'));
//             });
//             loadAllData();
//         })
//         .catch(err => {
//             alert("Error");
//         });
// });

// // su kien nut icon delete

// function deleteById(id) {
//     $.ajax({
//         url: '/api/tasks/' + id,
//         type: 'DELETE'
//     })
//         .then(data => {
//             alert('Xóa thành công');
//             $('#' + id).remove();
//         })
//         .catch(err => {
//             console.log("Error");
//         });
// }

// // su kien nut icon edit

// function editTaskById(id) {
//     $.ajax({
//         url: '/api/tasks/' + id,
//         type: 'GET'
//     })
//         .then(data => {
//             $('#editTaskId').val(data._id);
//             $('#editTitle').val(data.title);
//             $('#editDeadline').val(data.deadline);
//             $('#editModal').modal('show');
//         })
//         .catch(err => {
//             console.log("Error");
//         });
// }

// // su li su kien click luu edit

// $('#saveEditBtn').click(function () {
//     const id = $('#editTaskId').val();
//     const title = $('#editTitle').val();
//     const deadline = $('#editDeadline').val();
//     $.ajax({
//         url: '/api/tasks/' + id,
//         type: 'PUT',
//         data: {
//             newTitle: title,
//             newDeadline: deadline
//         }
//     })
//         .then(data => {
//             $('#editModal').modal('hide');
//             // Update list nhiem vu 
//             const taskItem = $('#' + id);
//             const formattedDeadline = new Date(deadline).toLocaleDateString();
//             taskItem.find('.todo-text').eq(0).text(title); // Update title
//             taskItem.find('.todo-text').eq(1).text(formattedDeadline); // Update deadline
//             loadAllData();
//         })
//         .catch(err => {
//             console.log("Error");
//         });
// });
// Function to handle the add task event
function addTask() {
    // Retrieve task details from input fields
    const title = document.getElementById("title").value;
    const deadline = document.getElementById("deadline").value;

    // Create a task object
    const task = {
        title,
        deadline,
    };

    // Get the existing tasks from localStorage or initialize an empty array
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Add the new task to the array
    tasks.push(task);

    // Save the updated tasks array to localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Update the display to show the new task
    updateTaskList(tasks);

    // Clear input fields
    document.getElementById("title").value = "";
    document.getElementById("deadline").value = "";
}

// Function to update the task list on the screen
function updateTaskList(tasks) {
    const content = document.getElementById("content");
    content.innerHTML = ""; // Clear the current list

    // Loop through tasks and create list items to display them
    tasks.forEach((task, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `Title : ${task.title}, Deadline : ${task.deadline}`;
        content.appendChild(listItem);
    });
}

// Add an event listener to the "Add" button
document.getElementById("addBtn").addEventListener("click", addTask);

// Initialize the task list on page load
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
updateTaskList(tasks);

// Function to update the task list on the screen
function updateTaskList(tasks) {
    const content = document.getElementById("content");
    content.innerHTML = ""; // Clear the current list

    // Loop through tasks and create list items to display them with icons
    tasks.forEach((task, index) => {
        const listItem = document.createElement("li");
        listItem.style.color = "white"; // Apply white text color

        const taskText = document.createElement("span");
        taskText.textContent = `Title: ${task.title}, Deadline: ${task.deadline}`;

        // Create an edit icon
        const editIcon = document.createElement("i");
        editIcon.classList.add("fas", "fa-edit");
        editIcon.style.marginLeft = "10px"; // Add some spacing

        // Create a delete icon
        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fas", "fa-trash-alt");
        deleteIcon.style.marginLeft = "10px"; // Add some spacing

        listItem.appendChild(taskText);
        listItem.appendChild(editIcon);
        listItem.appendChild(deleteIcon);

        content.appendChild(listItem);
    });
}
// ------------------------------
// Add event handlers for the delete icons
const deleteIcons = document.getElementsByClassName("fa-trash-alt");
for (let i = 0; i < deleteIcons.length; i++) {
    deleteIcons[i].addEventListener("click", function () {
        const index = i; // Get the index of the clicked task
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        if (index >= 0 && index < tasks.length) {
            // Remove the task at the specified index
            tasks.splice(index, 1);

            // Save the updated tasks array back to localStorage
            localStorage.setItem("tasks", JSON.stringify(tasks));

            // Update the display
            updateTaskList(tasks);
        }
    });
}
// 
// Add event handlers for the edit icons
const editIcons = document.getElementsByClassName("fa-edit");
for (let i = 0; i < editIcons.length; i++) {
    editIcons[i].addEventListener("click", function () {
        const index = i; // Get the index of the clicked task
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        if (index >= 0 && index < tasks.length) {
            // Display a modal or form to edit the task
            const editedTitle = prompt("Edit Task Title:", tasks[index].title);
            const editedDeadline = prompt("Edit Deadline:", tasks[index].deadline);

            if (editedTitle !== null && editedDeadline !== null) {
                // Update the task title and deadline
                tasks[index].title = editedTitle;
                tasks[index].deadline = editedDeadline;

                // Save the updated tasks array back to localStorage
                localStorage.setItem("tasks", JSON.stringify(tasks));

                // Update the display
                updateTaskList(tasks);
            }
        }
    });
}

// 


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
    const newBackgroundUrl = prompt('Nhập URL background mới :');
    if (newBackgroundUrl) {
        setBodyBackground(newBackgroundUrl);
        saveBackgroundToLocalStorage(newBackgroundUrl);
    }
});

//---------------------
