// chat.js
const express = require('express');
const { Chat } = require('../model/task');
const router = express.Router();

// Define your routes without /api prefix
router.get('/chat', (req, res) => {
    Chat.find({}, (err, chatData) => {
        if (err) {
            console.error('Lỗi khi lấy dữ liệu chat:', err);
            res.status(500).send('Lỗi khi lấy dữ liệu chat');
        } else {
            res.json(chatData);
        }
    });
});

module.exports = router;
