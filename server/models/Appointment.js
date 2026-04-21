const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Appointment = sequelize.define('Appointment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    customerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    serviceType: {
        type: DataTypes.STRING, // Ví dụ: Sửa chữa, Bảo hành, Kiểm tra
        allowNull: false
    },
    appointmentDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING, // Đang chờ, Đã xác nhận, Đã hủy, Đang xử lý
        defaultValue: 'Đang chờ'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    note: {
        type: DataTypes.TEXT, // Ghi chú tiếp nhận của admin
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Appointment;
