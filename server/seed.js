const bcrypt = require("bcryptjs");
const sequelize = require("./config/db");
const User = require("./models/User");
const Customer = require("./models/Customer");
const Technician = require("./models/Technician");
const Appointment = require("./models/Appointment");
const Assignment = require("./models/Assignment");
const ServiceCategory = require("./models/ServiceCategory");
const Service = require("./models/Service");
const Banner = require("./models/Banner");

const seedData = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log("🔄 Đang khởi tạo dữ liệu mẫu...");

        // ── Khách hàng (tạo trước để lấy id) ────────────────
        const [c1, c2, c3, c4] = await Customer.bulkCreate([
            {
                fullName: "Nguyễn Huy Phúc",
                phoneNumber: "0901234567",
                email: "phuc@techcare.com",
                address: "Hải Châu, Đà Nẵng",
            },
            {
                fullName: "Trần Minh Tâm",
                phoneNumber: "0907654321",
                email: "tam@gmail.com",
                address: "Thanh Khê, Đà Nẵng",
            },
            {
                fullName: "Lê Thị Mai",
                phoneNumber: "0912345678",
                email: "mai@gmail.com",
                address: "Sơn Trà, Đà Nẵng",
            },
            {
                fullName: "Phạm Văn Hùng",
                phoneNumber: "0923456789",
                email: "hung@gmail.com",
                address: "Liên Chiểu, Đà Nẵng",
            },
        ]);

        // ── Tài khoản đăng nhập (link đúng customerId) ───────
        await User.bulkCreate([
            {
                name: "TechCare Administrator",
                email: "admin@gmail.com",
                password: await bcrypt.hash("admin123", 10),
                role: "admin",
                customerId: null,
            },
            {
                name: "Nguyễn Huy Phúc",
                email: "phuc@gmail.com",
                password: await bcrypt.hash("123456", 10),
                role: "user",
                customerId: c1.id,
            },
        ]);

        // ── Kỹ thuật viên ────────────────────────────────────
        await Technician.bulkCreate([
            {
                fullName: "Lê Văn Luyện",
                specialty: "Sửa phần cứng Laptop",
                status: "Sẵn sàng",
                currentTasks: 0,
            },
            {
                fullName: "Phạm Hồng Thái",
                specialty: "Cài đặt Phần mềm",
                status: "Sẵn sàng",
                currentTasks: 0,
            },
            {
                fullName: "Hoàng Anh Tuấn",
                specialty: "Sửa điện thoại / Màn hình",
                status: "Đang bận",
                currentTasks: 0,
            },
            {
                fullName: "Nguyễn Thị Lan",
                specialty: "Sửa máy tính bảng / Apple",
                status: "Sẵn sàng",
                currentTasks: 0,
            },
        ]);

        // ── Lịch hẹn ─────────────────────────────────────────
        const now = new Date();
        const day = (n) => new Date(now.getTime() + n * 86400000);

        // c1=Phúc: 1 đơn | c2=Tâm: 1 đơn | c3=Mai: 1 đơn | c4=Hùng: 1 đơn |: 3 đơn
        const [a1, a2, , a4] = await Appointment.bulkCreate([
            {
                customerId: c1.id,
                serviceType: "Sửa chữa Laptop",
                appointmentDate: now,
                status: "Đang chờ",
                description:
                    "Máy Dell bị sập nguồn liên tục, cần kiểm tra main.",
                bookingCode: "TC-000101",
                deviceInfo: "Dell Inspiron 15",
                quotedPrice: 1500000,
                quotationStatus: "Chờ khách xác nhận",
                statusHistory: [{ status: "Đang chờ", time: now }],
            },
            {
                customerId: c2.id,
                serviceType: "Thay màn hình",
                appointmentDate: day(1),
                status: "Repairing",
                description: "iPhone 13 bị lỗi màn hình sau khi thay pin.",
                bookingCode: "TC-000202",
                deviceInfo: "iPhone 13",
                quotedPrice: 3200000,
                quotationStatus: "Đã duyệt",
                statusHistory: [
                    { status: "Đang chờ", time: day(-3) },
                    {
                        status: "Confirmed",
                        note: "Đã tiếp nhận máy",
                        time: day(-2),
                    },
                    {
                        status: "Checking",
                        note: "Đang kiểm tra màn hình",
                        time: day(-1),
                    },
                    {
                        status: "Repairing",
                        note: "Đã có linh kiện, đang thay màn hình",
                        time: now,
                    },
                ],
            },
            {
                customerId: c3.id,
                serviceType: "Kiểm tra tổng quát",
                appointmentDate: day(2),
                status: "Đang chờ",
                description: "Laptop Asus chạy chậm, quá nhiệt.",
                bookingCode: "TC-000303",
                deviceInfo: "Asus VivoBook",
                quotedPrice: null,
                quotationStatus: "Chờ báo giá",
                statusHistory: [{ status: "Đang chờ", time: now }],
            },
            {
                customerId: c4.id,
                serviceType: "Thay màn hình",
                appointmentDate: day(3),
                status: "WaitingForParts",
                description: "Màn hình MacBook Pro bị sọc ngang.",
                bookingCode: "TC-000404",
                deviceInfo: "MacBook Pro M2",
                quotedPrice: 4500000,
                quotationStatus: "Đã duyệt",
                statusHistory: [
                    { status: "Đang chờ", time: day(-4) },
                    {
                        status: "Confirmed",
                        note: "Đã tiếp nhận máy",
                        time: day(-3),
                    },
                    {
                        status: "Checking",
                        note: "Phát hiện màn hình bị lỗi backlight",
                        time: day(-2),
                    },
                    {
                        status: "WaitingForParts",
                        note: "Đang chờ nhập màn hình MacBook Pro M2",
                        time: day(-1),
                    },
                ],
            },
        ]);

        // ── Phân công ─────────────────────────────────────────
        await Assignment.bulkCreate([
            {
                appointmentId: a1.id,
                technicianId: 1,
                priority: "Cao",
                progressStatus: "Đang kiểm tra",
                statusHistory: [{ status: "Đã tiếp nhận", time: now }],
            },
            {
                appointmentId: a2.id,
                technicianId: 3,
                priority: "Trung bình",
                progressStatus: "Đang sửa",
                statusHistory: [
                    { status: "Đã tiếp nhận", time: now },
                    { status: "Đang sửa", time: now },
                ],
            },
            {
                appointmentId: a4.id,
                technicianId: 1,
                priority: "Khẩn cấp",
                progressStatus: "Chờ linh kiện",
                statusHistory: [{ status: "Đã tiếp nhận", time: now }],
            },
        ]);

        // ── Danh mục dịch vụ ─────────────────────────────────
        const [cat1, cat2, , , cat5, cat6] = await ServiceCategory.bulkCreate([
            {
                name: "Sửa chữa Laptop",
                icon: "laptop",
                colorHex: "#2563EB",
                sortOrder: 1,
            },
            {
                name: "Sửa điện thoại",
                icon: "smartphone",
                colorHex: "#7C3AED",
                sortOrder: 2,
            },
            {
                name: "Máy tính bảng",
                icon: "tablet",
                colorHex: "#0891B2",
                sortOrder: 3,
            },
            {
                name: "Màn hình / Phụ kiện",
                icon: "monitor",
                colorHex: "#059669",
                sortOrder: 4,
            },
            {
                name: "Cài đặt Phần mềm",
                icon: "settings",
                colorHex: "#D97706",
                sortOrder: 5,
            },
            {
                name: "Bảo hành",
                icon: "shield-check",
                colorHex: "#DC2626",
                sortOrder: 6,
            },
        ]);

        // ── Dịch vụ ──────────────────────────────────────────
        await Service.bulkCreate([
            {
                categoryId: cat1.id,
                name: "Thay màn hình Laptop",
                description:
                    "Thay thế màn hình laptop bị vỡ, hỏng led, mờ hình.",
                priceMin: 800000,
                priceMax: 2500000,
                durationEst: "1-2 ngày",
                warranty: "3 tháng",
                isFeatured: true,
            },
            {
                categoryId: cat1.id,
                name: "Vệ sinh, thay keo tản nhiệt",
                description:
                    "Làm sạch quạt, thay keo tản nhiệt, tăng hiệu suất.",
                priceMin: 200000,
                priceMax: 400000,
                durationEst: "2-3 giờ",
                warranty: "1 tháng",
                isFeatured: false,
            },
            {
                categoryId: cat1.id,
                name: "Thay pin Laptop",
                description: "Thay pin chính hãng, cải thiện thời lượng pin.",
                priceMin: 350000,
                priceMax: 900000,
                durationEst: "1-2 giờ",
                warranty: "6 tháng",
                isFeatured: true,
            },
            {
                categoryId: cat1.id,
                name: "Sửa bàn phím Laptop",
                description: "Thay phím rời hoặc thay cả bàn phím.",
                priceMin: 150000,
                priceMax: 700000,
                durationEst: "1-3 giờ",
                warranty: "3 tháng",
                isFeatured: false,
            },
            {
                categoryId: cat2.id,
                name: "Thay màn hình điện thoại",
                description:
                    "Thay màn hình iPhone, Samsung, Xiaomi... chính hãng.",
                priceMin: 500000,
                priceMax: 3500000,
                durationEst: "1-2 giờ",
                warranty: "3 tháng",
                isFeatured: true,
            },
            {
                categoryId: cat2.id,
                name: "Thay pin điện thoại",
                description:
                    "Thay pin cho điện thoại bị phồng, chai, hao nhanh.",
                priceMin: 200000,
                priceMax: 600000,
                durationEst: "30-60 phút",
                warranty: "6 tháng",
                isFeatured: true,
            },
            {
                categoryId: cat2.id,
                name: "Sửa lỗi camera",
                description:
                    "Kiểm tra và thay thế camera trước/sau bị mờ, hỏng.",
                priceMin: 300000,
                priceMax: 1200000,
                durationEst: "1-3 giờ",
                warranty: "3 tháng",
                isFeatured: false,
            },
            {
                categoryId: cat5.id,
                name: "Cài Windows / macOS",
                description: "Cài đặt hệ điều hành, driver, phần mềm cơ bản.",
                priceMin: 200000,
                priceMax: 400000,
                durationEst: "1-2 giờ",
                warranty: null,
                isFeatured: false,
            },
            {
                categoryId: cat5.id,
                name: "Diệt virus & tối ưu",
                description: "Quét virus, tối ưu khởi động, dọn rác hệ thống.",
                priceMin: 150000,
                priceMax: 300000,
                durationEst: "1-2 giờ",
                warranty: null,
                isFeatured: false,
            },
            {
                categoryId: cat6.id,
                name: "Kiểm tra tổng quát",
                description:
                    "Kiểm tra toàn bộ phần cứng và phần mềm, báo cáo tình trạng.",
                priceMin: 100000,
                priceMax: 200000,
                durationEst: "30-60 phút",
                warranty: null,
                isFeatured: false,
            },
        ]);

        // ── Banner ────────────────────────────────────────────
        await Banner.bulkCreate([
            {
                title: "Sửa chữa nhanh chóng",
                subtitle:
                    "Đội ngũ kỹ thuật viên chuyên nghiệp, cam kết hoàn trả trong 24h",
                colorFrom: "#2563EB",
                colorTo: "#1D4ED8",
                isActive: true,
                sortOrder: 1,
            },
            {
                title: "Bảo hành 6 tháng",
                subtitle:
                    "Tất cả linh kiện thay thế đều được bảo hành chính hãng",
                colorFrom: "#7C3AED",
                colorTo: "#5B21B6",
                isActive: true,
                sortOrder: 2,
            },
            {
                title: "Khuyến mãi tháng 4",
                subtitle: "Giảm 20% phí kiểm tra tổng quát cho mọi thiết bị",
                colorFrom: "#059669",
                colorTo: "#047857",
                isActive: true,
                sortOrder: 3,
            },
        ]);


        console.log("✅ Khởi tạo dữ liệu mẫu thành công!");
        process.exit();
    } catch (error) {
        console.error("❌ Lỗi seeding:", error);
        process.exit(1);
    }
};

seedData();
