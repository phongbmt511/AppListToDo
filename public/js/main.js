// function loadAllData() {
//     $.ajax({
//         url: '/api/tasks',
//         type: 'GET'
//     })
//         .then(data => {
//             $('#content').html('');
//             for (let i = 0; i < data.length; i++) {
//                 const element = data[i];
//                 const rawDeadline = new Date(element.deadline); // Chuyển đổi thành đối tượng Date
//                 const formattedDeadline = rawDeadline.toLocaleDateString(); // Định dạng thành ngày tháng năm (không có giờ)
//                 const li = $(`<li class="li todo-text" id=${element._id}>${element.title}-<span class="todo-text">${formattedDeadline}</span><span class="deleteBtn"><i class="fa-solid fa-trash"></i></span></li>`);
//                 const editBtn = $('<span class="editBtn"><i class="fa-solid fa-pen"></i></span>');
//                 editBtn.click(function () {
//                     editTaskById(element._id);
//                 });
//                 li.append(editBtn);
//                 $('#content').append(li);
//             }
//             $('.deleteBtn').click(function () {
//                 deleteById($(this).parent().attr('id'));
//             });
//             $('#search-button').click(function (e) {
//                 let key = $('#search-input').val()
//                 console.log(key);
//             })

//         })
//         .catch(err => {
//             console.log("error");
//         });
// }

// loadAllData();
let allTasks = []; // Danh sách tất cả nhiệm vụ ban đầu
let filteredTasks = []; // Danh sách nhiệm vụ sau khi lọc

function loadAllData() {
    $.ajax({
        url: '/api/tasks',
        type: 'GET'
    })
        .then(data => {
            allTasks = data; // Lưu danh sách tất cả các nhiệm vụ
            filteredTasks = data; // Ban đầu, danh sách sau khi lọc sẽ giống danh sách tất cả
            displayTasks(filteredTasks); // Hiển thị danh sách sau khi lọc
        })
        .catch(err => {
            console.log("error");
        });
}

loadAllData();

// Hàm để hiển thị danh sách nhiệm vụ
function displayTasks(tasks) {
    $('#content').html('');
    for (let i = 0; i < tasks.length; i++) {
        const element = tasks[i];
        const rawDeadline = new Date(element.deadline);
        const formattedDeadline = rawDeadline.toLocaleDateString();
        const li = $(`<li class="li todo-text" id=${element._id}>${element.title}-<span class="todo-text">${formattedDeadline}</span><span class="deleteBtn"><i class="fa-solid fa-trash"></i></span></li>`);
        const editBtn = $('<span class="editBtn"><i class="fa-solid fa-pen"></i></span>');
        editBtn.click(function () {
            editTaskById(element._id);
        });
        li.append(editBtn);
        $('#content').append(li);
    }
    $('.deleteBtn').click(function () {
        deleteById($(this).parent().attr('id'));
    });
}

// Sự kiện click cho nút "Search"
$('#search-button').click(function (e) {
    e.preventDefault();
    let key = $('#search-input').val().trim();

    // Lọc danh sách nhiệm vụ theo tiêu đề
    filteredTasks = allTasks.filter(task => task.title.includes(key));

    // Hiển thị danh sách sau khi lọc
    displayTasks(filteredTasks);
});

// ...

// Gọi lại hàm loadAllData() để cập nhật danh sách nhiệm vụ sau khi chỉnh sửa hoặc xóa
function refreshData() {
    loadAllData();
}

// ...


$('#addBtn').click(() => {
    const title = $('#title').val();
    const deadline = $('#deadline').val();
    $.ajax({
        url: '/api/tasks',
        type: 'POST',
        data: {
            title: title,
            deadline: deadline
        }
    })
        .then(data => {
            alert('Thêm thành công');
            // const li = $(`<li class="list-group-item" id=${data._id}>${data.title} - <b>${data.deadline}</b> <button type="button" class="deleteBtn btn btn-primary">Delete</button></li>`);
            const li = $(`<li class="list-group-item" id=${data._id}>${element.title} - <b>${data.deadline}</b><span class="span-button"><i class="deleteBtn fa-solid fa-trash"></i></span></li>`);
            $('#content').append(li);
            $('.deleteBtn').click(function () {
                deleteById($(this).parent().attr('id'));
            });
        })
        .catch(err => {
            alert("Thêm thất bại");
        });
});

function deleteById(id) {
    $.ajax({
        url: '/api/tasks/' + id,
        type: 'DELETE'
    })
        .then(data => {
            $('#' + id).remove();
        })
        .catch(err => {
            console.log("Lỗi khi xóa");
        });
}

function editTaskById(id) {
    $.ajax({
        url: '/api/tasks/' + id,
        type: 'GET'
    })
        .then(data => {
            $('#editTaskId').val(data._id);
            $('#editTitle').val(data.title);
            $('#editDeadline').val(data.deadline);
            $('#editModal').modal('show');
        })
        .catch(err => {
            console.log("Error loading task for editing");
        });
}

$('#saveEditBtn').click(function () {
    const id = $('#editTaskId').val();
    const title = $('#editTitle').val();
    const deadline = $('#editDeadline').val();
    $.ajax({
        url: '/api/tasks/' + id,
        type: 'PUT',
        data: {
            newTitle: title,
            newDeadline: deadline
        }
    })
        .then(data => {
            $('#editModal').modal('hide');
            // Update the task in the task list
            const taskItem = $('#' + id);
            const formattedDeadline = new Date(deadline).toLocaleDateString();
            taskItem.find('.todo-text').eq(0).text(title); // Update the title
            taskItem.find('.todo-text').eq(1).text(formattedDeadline); // Update the deadline text
            loadAllData();
        })
        .catch(err => {
            console.log("Error saving edited task");
        });
});


