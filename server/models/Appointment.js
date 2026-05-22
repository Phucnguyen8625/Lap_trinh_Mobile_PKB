const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Appointment = sequelize.define('Appointment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    customerId: { type: DataTypes.INTEGER, allowNull: false },
    serviceType: { type: DataTypes.STRING, allowNull: false },
    appointmentDate: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'Đang chờ' },
    description: { type: DataTypes.TEXT, allowNull: true },
    note: { type: DataTypes.TEXT, allowNull: true },
    bookingCode: { type: DataTypes.STRING, allowNull: true, unique: true },
    deviceInfo: { type: DataTypes.STRING, allowNull: true },
    quotedPrice: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null },
    quotationStatus: {
        type: DataTypes.ENUM('Chờ báo giá', 'Chờ khách xác nhận', 'Đã duyệt', 'Từ chối'),
        allowNull: true,
        defaultValue: 'Chờ báo giá',
    },
    statusHistory: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
    },
}, { timestamps: true });

// Association — phải require sau khi define để tránh circular
const Customer = require('./Customer');
Appointment.belongsTo(Customer, { foreignKey: 'customerId' });
Customer.hasMany(Appointment, { foreignKey: 'customerId' });

module.exports = Appointment;
