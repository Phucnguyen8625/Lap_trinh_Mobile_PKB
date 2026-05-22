const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ServiceCategory = sequelize.define('ServiceCategory', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    icon: { type: DataTypes.STRING(100), allowNull: true },
    colorHex: { type: DataTypes.STRING(10), defaultValue: '#2563EB' },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { timestamps: true });

module.exports = ServiceCategory;
