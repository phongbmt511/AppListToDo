const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/public', express.static(path.join(__dirname, '/public')));// ep kieu du lieu
// login
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html')
})

// index
app.get('/index.html', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})
// chat

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/Chat.html')
})



// su kien socket io
const activeUsers = new Set();
io.on("connection", (socket) => {
    socket.on("set-username", (name) => {
        // add user vao list va gui list cap nhap cho tat ca user
        activeUsers.add(name);
        io.emit("update-active-users", Array.from(activeUsers));
        // lang nghe su kien khi user roi khoi chat
        socket.on("disconnect", () => {
            activeUsers.delete(name);
            io.emit("update-active-users", Array.from(activeUsers));
        });
    });
    socket.on("on-chat", (message) => {
        // xu li tin nhan va gui lai cho all user
        io.emit("user-chat", message);

    });
});

//

server.listen(3000, () => {
    console.log('listening on port 3000')
})
