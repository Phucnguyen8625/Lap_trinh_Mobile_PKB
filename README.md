Báo cáo chuyên đề - App TechCare

## Mục lục - Software Requirement Specification (SRS)

### Chức năng quản lý
- Quản lý người dùng (khách hàng, kỹ thuật viên)
- Quản lý lịch hẹn (Appointment)
- Quản lý dịch vụ (Service & ServiceCategory)
- Quản lý yêu cầu sửa chữa (RepairRequest)
- Quản lý phân công (Assignment)
- Quản lý banner quảng cáo
- Quản lý thanh toán
- Thống kê / Báo cáo

### Tính năng người dùng
- Trang chủ
- Đăng ký / Đăng nhập
- Tìm kiếm dịch vụ
- Đặt lịch bảo trì
- Xem danh mục dịch vụ
- Theo dõi lịch sử lịch hẹn
- Cập nhật thông tin cá nhân
- Thanh toán online

### Tính năng quản trị
- Dashboard admin
- Quản lý khách hàng
- Quản lý kỹ thuật viên
- Quản lý lịch hẹn
- Quản lý yêu cầu sửa chữa
- Phân công công việc

---

## 1. Thông tin đề tài BCCĐ

- **Tên hệ thống**: App TechCare - Ứng dụng đặt lịch bảo trì và quản lý dịch vụ
- **Tên dự án**: Lap_trinh_Mobile_PKB
- **Nhóm thực hiện**: Nguyễn Huy Phúc, Nguyễn Duy Khánh, Nguyễn Dương Thế Bảo
- **Công nghệ**: React Native (Expo) + Express.js + MySQL

---

## 2. Phần sinh viên cấu hình

### Frontend (React Native)
- Cài đặt dependencies: `npm install`
- Chạy ứng dụng:
  ```bash
  npm start           # Chạy với Expo
  npm run android     # Build cho Android
  npm run ios         # Build cho iOS
  npm run web         # Chạy trên web
  ```

### Backend (Express.js)
- Vào thư mục server: `cd server`
- Cài đặt dependencies: `npm install`
- Cấu hình database trong `server/config/db.js`
- Import file `server/database.sql` vào MySQL
- Chạy server:
  ```bash
  npm start      # Production
  npm run dev    # Development (với nodemon)
  ```

### Database
- Import file: `server/database.sql`
- Tạo seed data: `server/seed.js`
- Cấu hình kết nối trong `server/config/db.js`

---

## 3. Quản lý phiên bản

- Dự án được quản lý bằng Git/GitHub:
  - Repository: https://github.com/Phucnguyen8625/Lap_trinh_Mobile_PKB.git
  - Có lịch sử commit và phân chia thư mục chức năng rõ ràng

---

## 4. Tùy biến giao diện

- Giao diện được tùy biến trong các thư mục:
  - `src/theme/` - Cấu hình theme, màu sắc
  - `assets/` - Hình ảnh, icon
  - `components/` - Component UI tùy chỉnh
  - `src/screens/` - Các màn hình (bao, phuc, admin, auth)

---

## 5. Lập trình tùy biến chức năng / plugin

- Dự án có các module tùy biến chính:
  - **Navigation**: Điều hướng ứng dụng (AdminNavigator, UserNavigator, AuthNavigator, AppNavigator)
  - **Context API**: Quản lý trạng thái (AuthContext, BookingContext, DataContext)
  - **API Client**: Giao tiếp backend (`src/api/apiClient.ts`)
  - **Controllers backend**: 
    - `appointmentController` - Quản lý lịch hẹn
    - `authController` - Xác thực người dùng
    - `customerController` - Quản lý khách hàng
    - `serviceController` - Quản lý dịch vụ
    - `technicianController` - Quản lý kỹ thuật viên

---

## 6. Cơ sở dữ liệu

### Công nghệ
- **DBMS**: MySQL
- **ORM**: Sequelize

### File cơ sở dữ liệu
- `server/database.sql` - Schema cơ sở dữ liệu
- `server/seed.js` - Dữ liệu ban đầu

### Các bảng chính
- **User** - Người dùng (khách hàng, kỹ thuật viên)
- **Customer** - Thông tin khách hàng
- **Technician** - Thông tin kỹ thuật viên
- **Service** - Dịch vụ bảo trì
- **ServiceCategory** - Danh mục dịch vụ
- **Appointment** - Lịch hẹn bảo trì
- **RepairRequest** - Yêu cầu sửa chữa
- **Assignment** - Phân công công việc
- **Banner** - Banner quảng cáo

---

## 7. Cấu trúc dự án

```
Lap_trinh_Mobile_PKB-dev/
├── src/
│   ├── api/              # API client
│   ├── components/       # UI components
│   ├── context/          # State management
│   ├── navigation/       # Navigation config
│   ├── screens/          # Application screens
│   │   ├── admin/       # Admin screens
│   │   ├── auth/        # Auth screens
│   │   ├── bao/         # User screens (Bảo's part)
│   │   └── phuc/        # Management screens (Phúc's part)
│   └── theme/           # Theme & styling
├── assets/              # Images, icons
├── server/
│   ├── config/          # Database config
│   ├── controllers/     # Business logic
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── database.sql     # Database schema
│   └── seed.js          # Seed data
├── package.json         # Frontend dependencies
└── app.json             # Expo config
```
