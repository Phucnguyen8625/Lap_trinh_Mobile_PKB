const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });

        const existing = await User.findOne({ where: { email } });
        if (existing)
            return res.status(409).json({ message: 'Email đã được sử dụng' });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed, role: 'user' });

        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            customerId: user.customerId,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });

        const user = await User.findOne({ where: { email } });
        if (!user)
            return res.status(401).json({ message: 'Email không tồn tại' });

        const match = await bcrypt.compare(password, user.password);
        if (!match)
            return res.status(401).json({ message: 'Sai mật khẩu' });

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            customerId: user.customerId,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { email, currentPassword, newPassword } = req.body;
        if (!email || !currentPassword || !newPassword)
            return res.status(400).json({ message: 'Thiếu thông tin' });

        const user = await User.findOne({ where: { email } });
        if (!user)
            return res.status(404).json({ message: 'Tài khoản không tồn tại' });

        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match)
            return res.status(401).json({ message: 'Mật khẩu hiện tại không đúng' });

        if (newPassword.length < 6)
            return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: 'Đổi mật khẩu thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
