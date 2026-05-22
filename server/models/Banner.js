const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Banner = sequelize.define('Banner', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    subtitle: { type: DataTypes.STRING(255), allowNull: true },
    imageUrl: { type: DataTypes.STRING(500), allowNull: true },
    colorFrom: { type: DataTypes.STRING(10), defaultValue: '#2563EB' },
    colorTo: { type: DataTypes.STRING(10), defaultValue: '#7C3AED' },
    actionLink: { type: DataTypes.STRING(255), allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { timestamps: true });

module.exports = Banner;
