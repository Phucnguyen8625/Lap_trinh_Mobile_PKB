const Appointment = require('../models/Appointment');
const Customer = require('../models/Customer');
const { Op } = require('sequelize');

exports.getAllAppointments = async (req, res) => {
    try {
        const where = {};
        if (req.query.customerId) {
            where.customerId = req.query.customerId;
        }
        const appointments = await Appointment.findAll({ where, order: [['createdAt', 'DESC']] });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.create(req.body);
        res.status(201).json(appointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateAppointmentStatus = async (req, res) => {
    try {
        const appointment = await Appointment.findByPk(req.params.id);
        if (!appointment) return res.status(404).json({ message: 'Không tìm thấy lịch hẹn' });
        await appointment.update({ status: req.body.status, note: req.body.note });
        res.json(appointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
