// auth.js
const express = require('express');
const router = express.Router();
const UserModel = require('../model/user');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Tìm người dùng trong cơ sở dữ liệu dựa trên tên đăng nhập.
        const user = await UserModel.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Tài khoản người dùng không tồn tại.' });
        }

        // So sánh mật khẩu đã mã hóa trong cơ sở dữ liệu với mật khẩu đã cung cấp.
        if (user.password !== password) {
            return res.status(401).json({ message: 'Mật khẩu không đúng.' });
        }

        // Đăng nhập thành công, lưu thông tin người dùng vào session hoặc JWT token nếu cần.
        // Chuyển hướng đến trang index.html.
        res.redirect('/index.html');
    } catch (error) {
        console.error('Lỗi khi tìm kiếm tài khoản người dùng:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
});

module.exports = router;
