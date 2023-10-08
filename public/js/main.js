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
    const currentDate = new Date(); // Lấy ngày hiện tại

    for (let i = 0; i < tasks.length; i++) {
        const element = tasks[i];
        const rawDeadline = new Date(element.deadline);
        const formattedDeadline = rawDeadline.toLocaleDateString();
        const li = $(`<li class="li todo-text" id=${element._id}><span><input class="form-check-input" type="checkbox" value="" id="checkbox_${element._id}"></span>${element.title}-<span class="todo-text">${formattedDeadline}</span><span class="deleteBtn"><i class="fa-solid fa-trash"></i></span></li>`);
        const editBtn = $('<span class="editBtn"><i class="fa-solid fa-pen"></i></span>');
        editBtn.click(function () {
            editTaskById(element._id);
        });

        // Kiểm tra xem nhiệm vụ đã đến hạn hay chưa
        if (rawDeadline <= currentDate) {
            li.addClass('deadline-passed'); // Thêm lớp CSS để đánh dấu nhiệm vụ đã đến hạn
            const notificationContent = `Nhiệm vụ "${element.title}" đã đến hạn vào ngày ${formattedDeadline}`;

            // Cập nhật nội dung modal
            $('#notificationContent').text(notificationContent);

            // Hiển thị modal
            $('#notificationModal').modal('show');
        }

        // Lắng nghe sự kiện thay đổi checkbox
        const checkbox = li.find(`#checkbox_${element._id}`);
        checkbox.change(function () {
            const isChecked = checkbox.prop('checked');
            if (isChecked) {
                // Hiển thị thông báo đã hoàn thành và gạch ngang nhiệm vụ
                li.addClass('completed');
                prompt('Thông báo', 'Đánh dấu hoàn thành !');
            } else {
                // Loại bỏ gạch ngang khi bỏ chọn checkbox
                li.removeClass('completed');
            }
        });

        li.append(editBtn);
        $('#content').append(li);
    }
    $('.deleteBtn').click(function () {
        deleteById($(this).parent().attr('id'));
    });
}

// Gọi hàm loadAllData() để tải danh sách nhiệm vụ và kiểm tra đến hạn
loadAllData();

// Sự kiện click cho nút "Search"
$('#search-button').click(function (e) {
    e.preventDefault(); // Ngăn chặn hành động mặc định của nút "Search" (tránh làm trang web tải lại)

    // Lấy giá trị từ ô tìm kiếm
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
            //allTasks.push(data); // Cập nhật danh sách tất cả nhiệm vụ
            // const li = $(`<li class="list-group-item" id=${data._id}>${data.title} - <b>${data.deadline}</b> <button type="button" class="deleteBtn btn btn-primary">Delete</button></li>`);
            const li = $(`<li class="list-group-item" id=${data._id}>${data.title} - <b>${data.deadline}</b><span class="span-button"><i class="deleteBtn fa-solid fa-trash"></i></span></li>`);
            $('#content').append(li);
            $('.deleteBtn').click(function () {
                deleteById($(this).parent().attr('id'));
            });
            loadAllData();
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


// Định dạng hàm để thay đổi nền của <body>
function changeBodyBackground(url) {
    document.body.style.background = `url('${url}') no-repeat center center fixed`;
    document.body.style.backgroundSize = 'cover';
}

//Gọi hàm changeBodyBackground khi người dùng nhấn nút "Thay đổi nền"
document.getElementById('changeBackgroundButton').addEventListener('click', function () {
    const newBackgroundUrl = prompt('Nhập URL của hình nền mới:');
    if (newBackgroundUrl) {
        changeBodyBackground(newBackgroundUrl);
    }
});

