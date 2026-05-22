const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Appointment = require('./Appointment');
const Customer = require('./Customer');

const RepairRequest = sequelize.define('RepairRequest', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    appointmentId: { type: DataTypes.INTEGER, allowNull: false },
    customerId: { type: DataTypes.INTEGER, allowNull: false },
    deviceName: { type: DataTypes.STRING(255), allowNull: false },
    deviceModel: { type: DataTypes.STRING(255), allowNull: true },
    issueDesc: { type: DataTypes.TEXT, allowNull: false },
    imageUrls: { type: DataTypes.JSON, allowNull: true },
    urgencyLevel: { type: DataTypes.STRING(50), defaultValue: 'Bình thường' },
    status: { type: DataTypes.STRING(50), defaultValue: 'Đang chờ xác nhận' },
}, { timestamps: true });

RepairRequest.belongsTo(Appointment, { foreignKey: 'appointmentId' });
RepairRequest.belongsTo(Customer, { foreignKey: 'customerId' });

module.exports = RepairRequest;
