const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/serviceController');

router.get('/services', ctrl.getAllServices);
router.get('/service-categories', ctrl.getAllCategories);
router.get('/banners', ctrl.getAllBanners);

module.exports = router;
