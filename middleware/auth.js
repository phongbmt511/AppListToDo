const express = require('express');
const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // tim user trong trong list co so du lieu tren ten dang nhap
        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Username error!' });
        }
        // so sanh password o trong co so du lieu vs password cung cap
        if (user.password !== password) {
            return res.status(401).json({ message: 'Password error!' });
        }
        // login thanh cong -> luu vao localstorage
        // chuyen den index.html
        res.redirect('/index.html');
    } catch (error) {
        console.error('Error', error);
        res.status(500).json({ message: 'Error server' });
    }
});

module.exports = router;
