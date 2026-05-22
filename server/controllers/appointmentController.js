const Appointment = require('../models/Appointment');
const Customer = require('../models/Customer');

exports.getAllAppointments = async (req, res) => {
    try {
        const where = {};
        if (req.query.customerId) where.customerId = req.query.customerId;

        const appointments = await Appointment.findAll({
            where,
            include: [{ model: Customer, attributes: ['fullName', 'phoneNumber', 'email'] }],
            order: [['createdAt', 'DESC']],
        });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createAppointment = async (req, res) => {
    try {
        const initialStatus = req.body.status || 'Đang chờ';
        const appointment = await Appointment.create({
            ...req.body,
            statusHistory: [{ status: initialStatus, time: new Date() }],
        });
        res.status(201).json(appointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateAppointmentStatus = async (req, res) => {
    try {
        const appointment = await Appointment.findByPk(req.params.id);
        if (!appointment) return res.status(404).json({ message: 'Không tìm thấy lịch hẹn' });

        const history = Array.isArray(appointment.statusHistory) ? [...appointment.statusHistory] : [];
        history.push({ status: req.body.status, note: req.body.note || null, time: new Date() });

        await appointment.update({ status: req.body.status, note: req.body.note, statusHistory: history });
        res.json(appointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Admin cập nhật báo giá cho khách hàng
exports.setQuotation = async (req, res) => {
    try {
        const appointment = await Appointment.findByPk(req.params.id);
        if (!appointment) return res.status(404).json({ message: 'Không tìm thấy lịch hẹn' });
        const { quotedPrice } = req.body;
        await appointment.update({ quotedPrice, quotationStatus: 'Chờ khách xác nhận' });
        res.json(appointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Khách hàng duyệt / từ chối báo giá
exports.respondQuotation = async (req, res) => {
    try {
        const appointment = await Appointment.findByPk(req.params.id);
        if (!appointment) return res.status(404).json({ message: 'Không tìm thấy lịch hẹn' });
        const { action } = req.body; // 'approve' | 'reject'
        const quotationStatus = action === 'approve' ? 'Đã duyệt' : 'Từ chối';
        await appointment.update({ quotationStatus });
        res.json(appointment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.trackByCode = async (req, res) => {
    try {
        const appointment = await Appointment.findOne({
            where: { bookingCode: req.params.code },
            include: [{ model: Customer, attributes: ['fullName', 'phoneNumber'] }],
        });
        if (!appointment) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getByCustomer = async (req, res) => {
    try {
        const appointments = await Appointment.findAll({
            where: { customerId: req.params.customerId },
            order: [['createdAt', 'DESC']],
        });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
