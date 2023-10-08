const express = require('express');
const Chat = require('../model/chatdb');
const router = express.Router();


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
