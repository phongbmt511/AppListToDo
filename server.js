const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require("socket.io");
const Chat = require('./model/chatdb'); // Import the Chat model
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const taskRouter = require('./routers/task')
const chatRouter = require('./routers/chat');

app.use('/api/tasks', taskRouter)

app.use('/public', express.static(path.join(__dirname, '/public')));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html')
})
app.get('/index.html', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})
app.use('/api/chat', chatRouter);
app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/Chat.html')
})
// app.get('/login.html', (req, res) => {
//     res.sendFile(__dirname + '/login.html')
// })
const activeUsers = new Set();

io.on("connection", (socket) => {
    socket.on("set-username", (name) => {
        // Thêm người dùng vào danh sách và gửi danh sách cập nhật cho tất cả người dùng
        activeUsers.add(name);
        io.emit("update-active-users", Array.from(activeUsers));

        // Lắng nghe sự kiện khi người dùng rời cuộc trò chuyện
        socket.on("disconnect", () => {
            activeUsers.delete(name);
            io.emit("update-active-users", Array.from(activeUsers));
        });
    });

    socket.on("on-chat", (message) => {
        // Xử lý tin nhắn và gửi lại cho tất cả người dùng
        io.emit("user-chat", message);

        // Lưu tin nhắn vào cơ sở dữ liệu MongoDB
        const newChat = new Chat({
            username: message.name,
            message: message.message,
            timestamp: new Date(),
        });
        newChat.save()
            .then(() => {
                console.log('Tin nhắn đã được lưu vào cơ sở dữ liệu.');
            })
            .catch(err => {
                console.error('Lỗi khi lưu tin nhắn:', err);
            });
    });
});

//

server.listen(3000, () => {
    console.log('listening on port 3000')
})
