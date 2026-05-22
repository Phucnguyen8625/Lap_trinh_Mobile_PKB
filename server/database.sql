-- =============================================
-- TechCareApp Database
-- =============================================

CREATE DATABASE IF NOT EXISTS TechCareApp
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE TechCareApp;

-- ---------------------------------------------
-- Bảng Customers (Khách hàng) — Phúc
-- ---------------------------------------------
CREATE TABLE IF NOT EXISTS Customers (
  id            INT           NOT NULL AUTO_INCREMENT,
  fullName      VARCHAR(255)  NOT NULL,
  phoneNumber   VARCHAR(20)   NOT NULL,
  email         VARCHAR(255)  NULL,
  address       TEXT          NULL,
  repairHistory JSON          NULL DEFAULT (JSON_ARRAY()),
  createdAt     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------
-- Bảng Technicians (Kỹ thuật viên) — Phúc
-- ---------------------------------------------
CREATE TABLE IF NOT EXISTS Technicians (
  id           INT          NOT NULL AUTO_INCREMENT,
  fullName     VARCHAR(255) NOT NULL,
  specialty    VARCHAR(255) NOT NULL,
  status       VARCHAR(50)  NOT NULL DEFAULT 'Sẵn sàng',
  currentTasks INT          NOT NULL DEFAULT 0,
  createdAt    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------
-- Bảng Appointments (Lịch hẹn) — Phúc + Bảo
-- bookingCode, deviceInfo thêm cho module Bảo
-- ---------------------------------------------
CREATE TABLE IF NOT EXISTS Appointments (
  id              INT          NOT NULL AUTO_INCREMENT,
  customerId      INT          NOT NULL,
  serviceType     VARCHAR(255) NOT NULL,
  appointmentDate DATETIME     NOT NULL,
  status          VARCHAR(50)  NOT NULL DEFAULT 'Đang chờ',
  description     TEXT         NULL,
  note            TEXT         NULL,
  bookingCode     VARCHAR(50)  NULL UNIQUE,
  deviceInfo      VARCHAR(255) NULL,
  createdAt       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (customerId) REFERENCES Customers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -------------------------------------------------
-- Bảng Assignments (Phân công kỹ thuật viên) — Phúc
-- -------------------------------------------------
CREATE TABLE IF NOT EXISTS Assignments (
  id             INT         NOT NULL AUTO_INCREMENT,
  appointmentId  INT         NOT NULL,
  technicianId   INT         NOT NULL,
  priority       VARCHAR(50) NOT NULL DEFAULT 'Trung bình',
  progressStatus VARCHAR(100) NOT NULL DEFAULT 'Đã tiếp nhận',
  statusHistory  JSON        NULL,
  createdAt      DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt      DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (appointmentId) REFERENCES Appointments(id) ON DELETE CASCADE,
  FOREIGN KEY (technicianId)  REFERENCES Technicians(id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- MODULE BẢO — Trang chủ, Đặt lịch, Tra cứu, Hồ sơ
-- ================================================

-- -----------------------------------------------
-- Bảng ServiceCategories (Danh mục dịch vụ) — Bảo
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS ServiceCategories (
  id          INT          NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100) NOT NULL,
  icon        VARCHAR(100) NULL COMMENT 'Tên icon lucide hoặc ionicons',
  colorHex    VARCHAR(10)  NULL DEFAULT '#2563EB',
  isActive    TINYINT(1)   NOT NULL DEFAULT 1,
  sortOrder   INT          NOT NULL DEFAULT 0,
  createdAt   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------
-- Bảng Services (Dịch vụ) — Bảo
-- ---------------------------------------------
CREATE TABLE IF NOT EXISTS Services (
  id           INT           NOT NULL AUTO_INCREMENT,
  categoryId   INT           NOT NULL,
  name         VARCHAR(255)  NOT NULL,
  description  TEXT          NULL,
  priceMin     INT           NOT NULL DEFAULT 0 COMMENT 'VNĐ',
  priceMax     INT           NOT NULL DEFAULT 0 COMMENT 'VNĐ',
  durationEst  VARCHAR(50)   NULL COMMENT 'Ví dụ: 30 phút, 1-2 ngày',
  warranty     VARCHAR(100)  NULL COMMENT 'Thời gian bảo hành',
  isFeatured   TINYINT(1)    NOT NULL DEFAULT 0,
  isActive     TINYINT(1)    NOT NULL DEFAULT 1,
  createdAt    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (categoryId) REFERENCES ServiceCategories(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------
-- Bảng Banners (Banner trang chủ) — Bảo
-- ---------------------------------------------
CREATE TABLE IF NOT EXISTS Banners (
  id         INT          NOT NULL AUTO_INCREMENT,
  title      VARCHAR(255) NOT NULL,
  subtitle   VARCHAR(255) NULL,
  imageUrl   VARCHAR(500) NULL,
  colorFrom  VARCHAR(10)  NULL DEFAULT '#2563EB' COMMENT 'Gradient start hex',
  colorTo    VARCHAR(10)  NULL DEFAULT '#7C3AED' COMMENT 'Gradient end hex',
  actionLink VARCHAR(255) NULL COMMENT 'Route hoặc URL khi nhấn banner',
  isActive   TINYINT(1)   NOT NULL DEFAULT 1,
  sortOrder  INT          NOT NULL DEFAULT 0,
  createdAt  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------
-- Bảng RepairRequests (Yêu cầu sửa chữa) — Bảo
-- Gắn với Appointment, lưu thêm mô tả lỗi và hình ảnh
-- ---------------------------------------------
CREATE TABLE IF NOT EXISTS RepairRequests (
  id            INT          NOT NULL AUTO_INCREMENT,
  appointmentId INT          NOT NULL,
  customerId    INT          NOT NULL,
  deviceName    VARCHAR(255) NOT NULL COMMENT 'Tên thiết bị, vd: iPhone 14 Pro',
  deviceModel   VARCHAR(255) NULL,
  issueDesc     TEXT         NOT NULL COMMENT 'Mô tả lỗi từ khách hàng',
  imageUrls     JSON         NULL COMMENT 'Mảng URL hình ảnh đính kèm',
  urgencyLevel  VARCHAR(50)  NOT NULL DEFAULT 'Bình thường'
                             COMMENT 'Bình thường | Gấp | Khẩn cấp',
  status        VARCHAR(50)  NOT NULL DEFAULT 'Đang chờ xác nhận',
  createdAt     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (appointmentId) REFERENCES Appointments(id) ON DELETE CASCADE,
  FOREIGN KEY (customerId)    REFERENCES Customers(id)    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Dữ liệu mẫu
-- =============================================

-- Khách hàng
INSERT INTO Customers (fullName, phoneNumber, email, address) VALUES
('Nguyễn Huy Phúc',      '0901234567', 'phuc@techcare.com', 'Hải Châu, Đà Nẵng'),
('Trần Minh Tâm',        '0907654321', 'tam@gmail.com',      'Thanh Khê, Đà Nẵng'),
('Lê Thị Mai',           '0912345678', 'mai@gmail.com',      'Sơn Trà, Đà Nẵng'),
('Phạm Văn Hùng',        '0923456789', 'hung@gmail.com',     'Liên Chiểu, Đà Nẵng'),
('Nguyễn Dương Thế Bảo', '0934567890', 'bao@techcare.com',   'Ngũ Hành Sơn, Đà Nẵng');

-- Kỹ thuật viên
INSERT INTO Technicians (fullName, specialty, status, currentTasks) VALUES
('Lê Văn Luyện',   'Sửa phần cứng Laptop',     'Sẵn sàng', 0),
('Phạm Hồng Thái', 'Cài đặt Phần mềm',          'Sẵn sàng', 0),
('Hoàng Anh Tuấn', 'Sửa điện thoại / Màn hình', 'Đang bận', 2),
('Nguyễn Thị Lan', 'Sửa máy tính bảng / Apple', 'Sẵn sàng', 1);

-- Lịch hẹn (có bookingCode cho các đơn của Bảo)
INSERT INTO Appointments (customerId, serviceType, appointmentDate, status, description, bookingCode, deviceInfo) VALUES
(1, 'Sửa chữa Laptop',    NOW(),                            'Đang chờ',    'Máy Dell bị sập nguồn liên tục, cần kiểm tra main.',      NULL,          NULL),
(2, 'Bảo hành',           DATE_ADD(NOW(), INTERVAL 1 DAY),  'Đã xác nhận', 'iPhone 13 bị lỗi màn hình sau khi thay pin.',             NULL,          NULL),
(3, 'Kiểm tra tổng quát', DATE_ADD(NOW(), INTERVAL 2 DAY),  'Đang chờ',    'Laptop Asus chạy chậm, quá nhiệt.',                       NULL,          NULL),
(4, 'Sửa chữa',           DATE_ADD(NOW(), INTERVAL 3 DAY),  'Đang xử lý', 'Màn hình MacBook Pro bị sọc ngang.',                       NULL,          NULL),
(5, 'Sửa chữa',           DATE_ADD(NOW(), INTERVAL -2 DAY), 'Hoàn thành',  'Samsung Galaxy S22 bị vỡ màn hình.',                      'TC-DEMO01',   'Samsung Galaxy S22'),
(5, 'Bảo hành',           DATE_ADD(NOW(), INTERVAL -5 DAY), 'Hoàn thành',  'Macbook Air pin chai, thay pin mới.',                     'TC-DEMO02',   'MacBook Air M1');

-- Phân công
INSERT INTO Assignments (appointmentId, technicianId, priority, progressStatus, statusHistory) VALUES
(1, 1, 'Cao',       'Đang kiểm tra', JSON_ARRAY(JSON_OBJECT('status','Đã tiếp nhận','time',NOW()))),
(2, 3, 'Trung bình','Đang sửa',      JSON_ARRAY(JSON_OBJECT('status','Đã tiếp nhận','time',NOW()), JSON_OBJECT('status','Đang sửa','time',NOW()))),
(4, 1, 'Khẩn cấp', 'Chờ linh kiện', JSON_ARRAY(JSON_OBJECT('status','Đã tiếp nhận','time',NOW())));

-- -----------------------------------------------
-- Danh mục dịch vụ
-- -----------------------------------------------
INSERT INTO ServiceCategories (name, icon, colorHex, sortOrder) VALUES
('Sửa chữa Laptop',       'laptop',       '#2563EB', 1),
('Sửa điện thoại',        'smartphone',   '#7C3AED', 2),
('Máy tính bảng',         'tablet',       '#0891B2', 3),
('Màn hình / Phụ kiện',   'monitor',      '#059669', 4),
('Cài đặt Phần mềm',      'settings',     '#D97706', 5),
('Bảo hành',              'shield-check', '#DC2626', 6);

-- -----------------------------------------------
-- Dịch vụ
-- -----------------------------------------------
INSERT INTO Services (categoryId, name, description, priceMin, priceMax, durationEst, warranty, isFeatured) VALUES
-- Laptop
(1, 'Thay màn hình Laptop',   'Thay thế màn hình laptop bị vỡ, hỏng led, mờ hình.',         800000,  2500000, '1-2 ngày', '3 tháng', 1),
(1, 'Vệ sinh, thay keo tản nhiệt', 'Làm sạch quạt, thay keo tản nhiệt, tăng hiệu suất.',   200000,   400000, '2-3 giờ',  '1 tháng', 0),
(1, 'Thay pin Laptop',        'Thay pin chính hãng/tương đương, cải thiện thời lượng pin.', 350000,   900000, '1-2 giờ',  '6 tháng', 1),
(1, 'Sửa bàn phím Laptop',    'Thay phím rời hoặc thay cả bàn phím.',                       150000,   700000, '1-3 giờ',  '3 tháng', 0),
-- Điện thoại
(2, 'Thay màn hình điện thoại','Thay màn hình iPhone, Samsung, Xiaomi... chính hãng.',       500000,  3500000, '1-2 giờ',  '3 tháng', 1),
(2, 'Thay pin điện thoại',    'Thay pin cho điện thoại bị phồng, chai, hao nhanh.',         200000,   600000, '30-60 phút','6 tháng', 1),
(2, 'Sửa lỗi camera',         'Kiểm tra và thay thế camera trước/sau bị mờ, hỏng.',         300000,  1200000, '1-3 giờ',  '3 tháng', 0),
-- Phần mềm
(5, 'Cài Windows / macOS',    'Cài đặt hệ điều hành, driver, phần mềm cơ bản.',              200000,   400000, '1-2 giờ',  NULL,      0),
(5, 'Diệt virus & tối ưu',    'Quét và xử lý virus, tối ưu khởi động, dọn rác hệ thống.',   150000,   300000, '1-2 giờ',  NULL,      0),
-- Bảo hành
(6, 'Kiểm tra tổng quát',     'Kiểm tra toàn bộ phần cứng và phần mềm, báo cáo tình trạng.',100000,   200000, '30-60 phút',NULL,     0);

-- -----------------------------------------------
-- Banner trang chủ
-- -----------------------------------------------
INSERT INTO Banners (title, subtitle, colorFrom, colorTo, isActive, sortOrder) VALUES
('Sửa chữa nhanh chóng',   'Đội ngũ kỹ thuật viên chuyên nghiệp, cam kết hoàn trả trong 24h', '#2563EB', '#1D4ED8', 1, 1),
('Bảo hành 6 tháng',       'Tất cả linh kiện thay thế đều được bảo hành chính hãng',           '#7C3AED', '#5B21B6', 1, 2),
('Khuyến mãi tháng 4',     'Giảm 20% phí kiểm tra tổng quát cho mọi thiết bị',                 '#059669', '#047857', 1, 3);

-- -----------------------------------------------
-- Yêu cầu sửa chữa mẫu (cho customer 5 = Bảo)
-- -----------------------------------------------
INSERT INTO RepairRequests (appointmentId, customerId, deviceName, deviceModel, issueDesc, urgencyLevel, status) VALUES
(5, 5, 'Samsung Galaxy S22', 'SM-S901B', 'Màn hình bị vỡ góc dưới bên trái sau khi rơi.',  'Bình thường', 'Hoàn thành'),
(6, 5, 'MacBook Air M1',     'A2337',    'Pin chai còn 68% sức khỏe, thời lượng rất ngắn.', 'Bình thường', 'Hoàn thành');
