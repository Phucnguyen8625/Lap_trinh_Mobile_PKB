const express = require('express');
const router = express.Router();
const technicianController = require('../controllers/technicianController');

router.get('/', technicianController.getAllTechnicians);
router.post('/assign', technicianController.assignTechnician);
router.get('/progress/:appointmentId', technicianController.getRepairProgress);
router.patch('/progress/:id', technicianController.updateProgress);
router.get('/:id/assignments', technicianController.getAssignmentsByTechnician);

module.exports = router;
