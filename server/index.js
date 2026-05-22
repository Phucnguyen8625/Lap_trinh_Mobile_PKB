const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const technicianRoutes = require('./routes/technicianRoutes');
const serviceRoutes = require('./routes/serviceRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/technicians', technicianRoutes);
app.use('/api', serviceRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Chào mừng bạn đến với TechCare API (Node.js)' });
});

// Kiểm tra kết nối DB và Start Server
sequelize.sync({ alter: true }).then(() => { // alter: true tự động thêm cột mới vào bảng đã có
    console.log('✅ Kết nối & Đồng bộ MySQL thành công!');
    app.listen(PORT, () => {
        console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('❌ Lỗi DB:', err);
});
