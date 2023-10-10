let allTasks = []; // list nhiem vu ban dau
let filteredTasks = []; // list nhiem vu sau khi loc

function loadAllData() {
    $.ajax({
        url: '/api/tasks',
        type: 'GET'
    })
        .then(data => {
            allTasks = data; // luu list tat ca nhiem vu
            filteredTasks = data; // list ban dau
            displayTasks(filteredTasks); // hien thi list sau khi loc
        })
        .catch(err => {
            console.log("error");
        });

}
loadAllData();

// ham hien thi list nhiem vu
function displayTasks(tasks) {
    $('#content').html('');
    const currentDate = new Date(); // lay date hien tai
    for (let i = 0; i < tasks.length; i++) {
        const element = tasks[i];
        const rawDeadline = new Date(element.deadline);
        const formattedDeadline = rawDeadline.toLocaleDateString();
        const li = $(`<li class="li todo-text" id=${element._id}><span><input class="form-check-input" type="checkbox" value="" id="checkbox_${element._id}"></span>${element.title}-<span class="todo-text">${formattedDeadline}</span><span class="deleteBtn"><i class="fa-solid fa-trash"></i></span></li>`);
        const editBtn = $('<span class="editBtn"><i class="fa-solid fa-pen"></i></span>');
        editBtn.click(function () {
            editTaskById(element._id);
        });
        // check nhiem vu da den han chua
        if (rawDeadline <= currentDate) {
            li.addClass('deadline-passed'); // nhiem vu da den han
            const notificationContent = `Nhiệm vụ "${element.title}" đã đến hạn vào ngày ${formattedDeadline}`;
            // cap nhap noi dung modal
            $('#notificationContent').text(notificationContent);
            // show modal
            $('#notificationModal').modal('show');
        }
        // lang nghe su kien check box 
        const checkbox = li.find(`#checkbox_${element._id}`);
        checkbox.change(function () {
            const isChecked = checkbox.prop('checked');
            if (isChecked) {
                // hien thi thong bao nhiem vu da hoan thanh va gach ngang nhiem vu
                li.addClass('completed');
                prompt('Thông báo', 'Đánh dấu hoàn thành !');
            } else {
                // xoa bo gach ngang sau khi bo check box
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

//goi lai ham loaddata de tai lai list nhiem vu va check den han
loadAllData();

// su kien nut search
$('#search-button').click(function (e) {
    e.preventDefault(); // ngan trang web tai lai du lieu
    // lay value tu o search
    let key = $('#search-input').val().trim();
    // loc list nhiem vu theo tieu de
    filteredTasks = allTasks.filter(task => task.title.includes(key));
    // hien thi list sau khi loc
    displayTasks(filteredTasks);
});

// goi lai ham loadalldata de cap nhap list nhiem vu sau khi edit va delete
function refreshData() {
    loadAllData();
}
// su kien nut add

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
            const li = $(`<li class="list-group-item" id=${data._id}>${data.title} - <b>${data.deadline}</b><span class="span-button"><i class="deleteBtn fa-solid fa-trash"></i></span></li>`);
            $('#content').append(li);
            $('.deleteBtn').click(function () {
                deleteById($(this).parent().attr('id'));
            });
            loadAllData();
        })
        .catch(err => {
            alert("Error");
        });
});

// su kien nut icon delete

function deleteById(id) {
    $.ajax({
        url: '/api/tasks/' + id,
        type: 'DELETE'
    })
        .then(data => {
            alert('Xóa thành công');
            $('#' + id).remove();
        })
        .catch(err => {
            console.log("Error");
        });
}

// su kien nut icon edit

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
            console.log("Error");
        });
}

// su li su kien click luu edit

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
            console.log("Error");
        });
});


// ham thay doi background body
function changeBodyBackground(url) {
    document.body.style.background = `url('${url}') no-repeat center center fixed`;
    document.body.style.backgroundSize = 'cover';
}

// goi ham changeBodyBackground khi click background
document.getElementById('changeBackgroundButton').addEventListener('click', function () {
    const newBackgroundUrl = prompt('Nhập URL của hình nền mới:');
    if (newBackgroundUrl) {
        changeBodyBackground(newBackgroundUrl);
    }
});
//
