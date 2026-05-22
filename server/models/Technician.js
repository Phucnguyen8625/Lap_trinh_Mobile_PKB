const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Technician = sequelize.define('Technician', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    specialty: {
        type: DataTypes.STRING, // Ví dụ: Phần cứng, Phần mềm, Màn hình, Apple
        allowNull: false
    },
    status: {
        type: DataTypes.STRING, // Sẵn sàng, Đang bận, Nghỉ phép
        defaultValue: 'Sẵn sàng'
    },
    currentTasks: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    timestamps: true
});

module.exports = Technician;
