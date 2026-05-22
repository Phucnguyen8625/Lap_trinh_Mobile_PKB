const Technician = require('../models/Technician');
const Assignment = require('../models/Assignment');

exports.getAllTechnicians = async (req, res) => {
    try {
        const technicians = await Technician.findAll();
        res.json(technicians);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.assignTechnician = async (req, res) => {
    try {
        const assignment = await Assignment.create(req.body);
        // Cập nhật số task của KTV
        const technician = await Technician.findByPk(req.body.technicianId);
        if (technician) {
            await technician.increment('currentTasks');
        }
        res.status(201).json(assignment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getRepairProgress = async (req, res) => {
    try {
        const assignment = await Assignment.findOne({ 
            where: { appointmentId: req.params.appointmentId } 
        });
        if (!assignment) return res.status(404).json({ message: 'Không tìm thấy tiến trình sửa chữa' });
        res.json(assignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProgress = async (req, res) => {
    try {
        const assignment = await Assignment.findByPk(req.params.id);
        if (!assignment) return res.status(404).json({ message: 'Không tìm thấy phiếu sửa chữa' });
        
        const history = [...(assignment.statusHistory || []), { status: req.body.status, time: new Date() }];
        await assignment.update({ 
            progressStatus: req.body.status, 
            statusHistory: history 
        });
        res.json(assignment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAssignmentsByTechnician = async (req, res) => {
    try {
        const assignments = await Assignment.findAll({
            where: { technicianId: req.params.id },
            order: [['createdAt', 'DESC']]
        });
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
