const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

router.get('/', appointmentController.getAllAppointments);
router.get('/track/:code', appointmentController.trackByCode);
router.get('/customer/:customerId', appointmentController.getByCustomer);
router.post('/', appointmentController.createAppointment);
router.patch('/:id/status', appointmentController.updateAppointmentStatus);
router.patch('/:id/quotation', appointmentController.setQuotation);
router.patch('/:id/quotation-response', appointmentController.respondQuotation);

module.exports = router;
