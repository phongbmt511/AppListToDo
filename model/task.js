const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1/todolist', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: String,
    deadline: Date
});
const chatSchema = new mongoose.Schema({
    username: String, // Tên người dùng
    message: String,  // Nội dung tin nhắn
    timestamp: Date   // Thời gian gửi tin nhắn
});

const Chat = mongoose.model('Chat', chatSchema);
const TaskModel = mongoose.model('task', taskSchema);
module.exports = { TaskModel, Chat };
