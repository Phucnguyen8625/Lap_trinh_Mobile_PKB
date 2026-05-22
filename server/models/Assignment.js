const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Assignment = sequelize.define('Assignment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    appointmentId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    technicianId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    priority: {
        type: DataTypes.STRING, // Thấp, Trung bình, Cao, Khẩn cấp
        defaultValue: 'Trung bình'
    },
    progressStatus: {
        type: DataTypes.STRING, // Đã tiếp nhận, Đang kiểm tra, Đang sửa, Chờ linh kiện, Hoàn thành, Đã bàn giao
        defaultValue: 'Đã tiếp nhận'
    },
    statusHistory: {
        type: DataTypes.JSON, // Lưu timeline tiến trình
        defaultValue: [{ status: 'Đã tiếp nhận', time: new Date() }]
    }
}, {
    timestamps: true
});

module.exports = Assignment;
