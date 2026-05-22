const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const ServiceCategory = require('./ServiceCategory');

const Service = sequelize.define('Service', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    categoryId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    priceMin: { type: DataTypes.INTEGER, defaultValue: 0 },
    priceMax: { type: DataTypes.INTEGER, defaultValue: 0 },
    durationEst: { type: DataTypes.STRING(50), allowNull: true },
    warranty: { type: DataTypes.STRING(100), allowNull: true },
    isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { timestamps: true });

Service.belongsTo(ServiceCategory, { foreignKey: 'categoryId' });
ServiceCategory.hasMany(Service, { foreignKey: 'categoryId' });

module.exports = Service;
