# Tổng Quan Dự Án & Luồng Hoạt Động (SOURCE.md)

Tài liệu này mô tả tóm tắt chức năng và luồng hoạt động của từng tệp/thư mục quan trọng trong hệ thống bao gồm 2 phần chính: **Mobile App (React Native)** và **Backend (Node.js/Express)**.

---

## 1. Kiến Trúc Tổng Thể

Hệ thống hoạt động theo mô hình Client-Server:
- **Client (Frontend)**: Ứng dụng di động được xây dựng bằng React Native (Sử dụng JavaScript/TypeScript) để cung cấp giao diện người dùng, quản lý đặt lịch, theo dõi sửa chữa và quản lý hệ thống tuỳ thuộc vào vai trò.
- **Server (Backend)**: Máy chủ API viết bằng Node.js / Express cung cấp các endpoint REST API xử lý nghiệp vụ, xác thực và tương tác với cơ sở dữ liệu.

---

## 2. Mobile App (Frontend - thư mục `src/`)

Ứng dụng cấu trúc theo các thành phần: UI Screens, Navigation (điều hướng), Context (trạng thái toàn cục) và API Client.

### 2.1. Cấu hình gốc
- `App.tsx` / `index.js`: Điểm vào (entry point) của toàn bộ ứng dụng React Native, khởi tạo Navigation, Context và các thiết lập ban đầu.

### 2.2. Navigation (`src/navigation/`)
Quản lý luồng chuyển trang dữa trên trạng thái và vai trò của người dùng.
- `AppNavigator.tsx`: Component điều hướng chính, quyết định hiển thị các luồng nhánh con (Auth hoặc App chính) dựa theo trạng thái đăng nhập.
- `AuthNavigator.js`: Phụ trách luồng chưa đăng nhập (Đăng nhập, Đăng ký).
- `UserNavigator.tsx`: Phụ trách luồng dành cho Khách hàng (User).
- `AdminNavigator.js`: Phụ trách luồng dành cho Quản trị viên/Lễ tân (Admin/Reception).

### 2.3. Screens - Giao diện người dùng (`src/screens/`)
Chia làm nhiều thư mục con phản ánh các nhóm tính năng (hoặc người phụ trách):

**`auth/` (Xác thực):**
- `LoginScreen.js`: Màn hình Đăng nhập.
- `RegisterScreen.js`: Màn hình Đăng ký tài khoản mới.
- `RoleRedirectScreen.js`: Xử lý logic chuyển hướng dựa trên vai trò của user sau khi đăng nhập thành công.

**`bao/` (Giao diện Khách hàng chính):**
- `HomeScreen.tsx`: Trang chủ của ứng dụng phía khách hàng.
- `ServiceCatalogScreen.tsx`, `ServiceDetailScreen.tsx`: Danh mục và chi tiết danh sách các dịch vụ sửa chữa.
- `BookingScreen.tsx`, `BookingSuccessScreen.tsx`: Đặt lịch sửa chữa mới và màn hình thông báo sau khi đặt thành công.
- `TrackingScreen.tsx`: Màn hình theo dõi tiến trình của thiết bị đang được sửa chữa.
- `ProfileScreen.tsx`: Hồ sơ và thiết lập của khách hàng.
- `QuotationScreen.tsx`: Xem báo giá thay thế linh kiện, sửa chữa.

**`phuc/` (Giao diện Quản lý / Kỹ thuật viên / Lễ tân):**
- `AppointmentListScreen.tsx`, `AppointmentDetailScreen.tsx`, `AppointmentFormScreen.tsx`: Quản lý danh sách, xem chi tiết và tạo/sửa các cuộc hẹn (đặt lịch từ khách).
- `CustomerListScreen.tsx`, `CustomerDetailScreen.tsx`, `CustomerFormScreen.tsx`: Quản lý thông tin khách hàng (CRM cơ bản).
- `TechnicianListScreen.tsx`, `TechnicianDetailScreen.tsx`: Danh sách và thông tin chi tiết thợ kỹ thuật.
- `TechnicianAssignmentScreen.tsx`: Giao việc, điều phối thiết bị cho thợ sửa.
- `RepairProgressScreen.tsx`, `StatusUpdateScreen.tsx`: Cập nhật trạng thái sửa chữa của từng máy móc thiết bị đang thực hiện.
- `HandoverScreen.tsx`: Màn hình bàn giao máy lại cho khách khi hoàn thành.

**`admin/` (Giao diện Admin Dashboard & Quản lý danh mục):**
- `AdminDashboard.js`: Bảng điều khiển thống kê tổng quan của quản trị viên.
- `ServiceListScreen.js`, `ServiceDetailScreen.js`, `ServiceFormScreen.js`: CRUD và quản lý danh mục toàn bộ Dịch vụ.
- `ReceptionListScreen.js`, `ReceptionDetailScreen.js`, `ReceptionFormScreen.js`: Quản lý quy trình tiếp nhận máy lỗi từ khách.

### 2.4. Global State & API (`src/context/` & `src/api/`)
- `AuthContext.js`: Lưu trữ trạng thái xác thực người dùng (Token, Use Info).
- `BookingContext.tsx`: Quản lý state của quá trình đặt lịch (giỏ hàng đặt lịch).
- `DataContext.js`: Có thể lưu trữ một số dữ liệu cache/toàn cục khác.
- `apiClient.ts`: Cấu hình thư viện gửi request HTTP (Axios/Fetch), thiết lập `baseURL` và interceptor (đính kèm JWT Token vào Header).

---

## 3. Server (Backend - thư mục `server/`)

Cung cấp API cho Frontend xử lý. Dựa trên mô hình MVC/Router-Controller-Model.

### 3.1 Cấu hình & Database
- `index.js`: Điểm nối chính (entry point) của Server. Khởi tạo Express app, cấu hình Middleware (CORS, Body-parser), và kết nối Database.
- `.env`: Lưu các biến môi trường nhạy cảm (DB URI, PORT, JWT_SECRET).
- `database.sql`: Chứa các script SQL dùng để khởi tạo schema cơ sở dữ liệu ban đầu.
- `seed.js`: Script chèn dữ liệu mẫu (dummy data) vào CSDL phục vụ cho quá trình test.

### 3.2. Routes (`server/routes/`)
Nơi khai báo các đường dẫn API và gán middleware xác thực hoặc trỏ tới Controller tương ứng.
- `authRoutes.js`: `/api/auth/login`, `/api/auth/register`...
- `appointmentRoutes.js`: CRUD liên quan đến Cuộc hẹn (Booking).
- `customerRoutes.js`: Lấy, sửa đổi dữ liệu User/Customer.
- `serviceRoutes.js`: RESTful APIs quản lý dịch vụ (Service category).
- `technicianRoutes.js`: Các endpoint cho Kỹ thuật viên và công việc sửa chữa.

### 3.3. Controllers (`server/controllers/`)
Chứa logic nghiệp vụ chính yếu phục vụ cho từng endpoints tương ứng:
- `authController.js`: Băm (hash) mật khẩu, xác thực user, sinh JWT Token.
- `appointmentController.js`: Logic tiếp nhận booking mới, thay đổi trạng thái booking.
- `customerController.js`: Trả về dữ liệu profile khách hàng, lịch sử sửa chữa.
- `serviceController.js`: Lọc và trả về danh sách gói dịch vụ sửa chữa.
- `technicianController.js`: Logic cập nhật công việc sửa chữa thiết bị.

### 3.4. Models (`server/models/`)
Các schema định nghĩa cấu trúc dữ liệu bản ghi cơ sở dữ liệu:
- `User.js`, `Customer.js`, `Technician.js`: Quản lý tài khoản và thông tin đối tượng.
- `Appointment.js`, `RepairRequest.js`: Lưu dữ liệu lịch hẹn và yêu cầu sửa chữa.
- `Service.js`, `ServiceCategory.js`: Lưu các dịch vụ của cửa hàng cung cấp.
- `Assignment.js`: Bảng nối (Mapping) điều phối yêu cầu cho đúng Kỹ thuật viên thực hiện.
- `Banner.js`: Quản lý hình ảnh quảng cáo app.

---

## 4. Luồng Chạy Điển Hình (Đồng bộ App & Server)
1. **Khởi động**: `index.js` (Server) chạy lên, mở port và đợi yêu cầu.
2. **Xác thực**: App chạy `App.tsx`, kiểm tra Token (qua `AuthContext`). Nếu chưa có, điều hướng sang `AuthNavigator` (Màn `LoginScreen`), thực hiện gọi POST `/api/auth/login`. Thành công, App chuyển sang phân quyền (User/Admin).
3. **Đặt lịch (Customer Flow)**: User vào `HomeScreen` -> `ServiceCatalogScreen` -> chọn và vào `BookingScreen`. Gọi POST tới `appointmentRoutes` lưu vào Model `Appointment`.
4. **Tiếp nhận & Sửa chữa (Admin/Technician Flow)**: Lễ tân dùng App (bên nhánh Phuc/Admin) vào `AppointmentListScreen` xác nhận yêu cầu -> gán cho thợ sửa (`TechnicianAssignmentScreen`) -> thợ làm và cập nhật (`RepairProgressScreen`). Server sẽ update `Replacement` / `Assignment` Model.
5. **Theo dõi (Tracking)**: User lấy ID máy hoặc mã Hóa đơn vào `TrackingScreen` gọi GET lấy tiến độ real-time hiện tại để biết ngày nhận lại máy.
