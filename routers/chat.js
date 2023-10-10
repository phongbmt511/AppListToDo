const express = require('express');
const Chat = require('../model/chatdb');
const router = express.Router();


router.get('/chat', (req, res) => {
    Chat.find({}, (err, chatData) => {
        if (err) {
            console.error('Error', err);
            res.status(500).send('Error');
        } else {
            res.json(chatData);
        }
    });
});

module.exports = router;
