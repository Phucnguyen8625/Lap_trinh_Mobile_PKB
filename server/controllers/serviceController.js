const Service = require('../models/Service');
const ServiceCategory = require('../models/ServiceCategory');
const Banner = require('../models/Banner');

exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.findAll({
            where: { isActive: true },
            include: [{ model: ServiceCategory, attributes: ['id', 'name', 'icon', 'colorHex'] }],
            order: [['isFeatured', 'DESC'], ['id', 'ASC']],
        });
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const cats = await ServiceCategory.findAll({
            where: { isActive: true },
            order: [['sortOrder', 'ASC']],
        });
        res.json(cats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.findAll({
            where: { isActive: true },
            order: [['sortOrder', 'ASC']],
        });
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
