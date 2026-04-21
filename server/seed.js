const sequelize = require('./config/db');
const Customer = require('./models/Customer');
const Technician = require('./models/Technician');
const Appointment = require('./models/Appointment');
const Assignment = require('./models/Assignment');

const seedData = async () => {
    try {
        await sequelize.sync({ force: true }); // Xóa trắng và tạo lại bảng
        console.log('🔄 Đang khởi tạo dữ liệu mẫu...');

        // 1. Tạo Khách hàng
        const c1 = await Customer.create({
            fullName: 'Nguyễn Huy Phúc',
            phoneNumber: '0901234567',
            email: 'phuc@techcare.com',
            address: 'Hải Châu, Đà Nẵng'
        });

        const c2 = await Customer.create({
            fullName: 'Trần Minh Tâm',
            phoneNumber: '0907654321',
            email: 'tam@gmail.com',
            address: 'Thanh Khê, Đà Nẵng'
        });

        // 2. Tạo Kỹ thuật viên
        await Technician.create({ fullName: 'Lê Văn Luyện', specialty: 'Sửa phần cứng Laptop', status: 'Sẵn sàng' });
        await Technician.create({ fullName: 'Phạm Hồng Thái', specialty: 'Cài đặt Phần mềm', status: 'Sẵn sàng' });
        await Technician.create({ fullName: 'Hoàng Anh Tuấn', specialty: 'Sửa điện thoại/Màn hình', status: 'Đang bận' });

        // 3. Tạo Lịch hẹn
        const a1 = await Appointment.create({
            customerId: c1.id,
            serviceType: 'Sửa chữa Laptop',
            appointmentDate: new Date(),
            status: 'Đang chờ',
            description: 'Máy Dell bị sập nguồn liên tục, cần kiểm tra main.'
        });

        console.log('✅ Khởi tạo dữ liệu mẫu thành công!');
        process.exit();
    } catch (error) {
        console.error('❌ Lỗi seeding:', error);
        process.exit(1);
    }
};

seedData();
