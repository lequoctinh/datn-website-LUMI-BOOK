# DATN - LUMI-BOOK (Website Bán Sách Trực Tuyến)

Dự án Đồ án tốt nghiệp xây dựng hệ thống website bán sách hiện đại, sử dụng kiến trúc tách biệt Client-Server để tối ưu hiệu năng và khả năng bảo trì.

## 🛠 Công nghệ sử dụng

### Frontend (Client)
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS (v3.4.1)
- **Responsive:** react-responsive
- **Icons:** React Icons / Lucide React

### Backend (Server)
- **Runtime:** Node.js & Express
- **Database:** MySQL (Quản lý qua phpMyAdmin)
- **Environment:** dotenv, cors, nodemon

### Công cụ & Hạ tầng
- **Quản lý mã nguồn:** Git & GitHub
- **Triển khai (Deployment):** VPS
- **Công cụ điều khiển:** Putty (SSH), WinSCP (SFTP)

---

## Cấu trúc thư mục

DATN/
├── client/              # Mã nguồn giao diện người dùng (React)
│   ├── src/             # Logic và components
│   └── tailwind.config.js
├── server/              # Mã nguồn API và xử lý Backend (Node.js)
│   ├── index.js         # Điểm khởi đầu của Server
│   └── .env             # Biến môi trường (Không push lên Git)
└── README.md            # Tài liệu hướng dẫn dự án
## 💻 Hướng dẫn dành cho Lập trình viên (Development Guide)

### Cách thêm một tính năng mới (Feature Workflow)
1.  **Backend:**
    * Tạo Route mới trong `server/routes`.
    * Viết Controller xử lý logic và truy vấn Database (phpMyAdmin).
    * Test API bằng Postman hoặc Thunder Client.
2.  **Frontend:**
    * Tạo Component mới trong `client/src/components`.
    * Sử dụng `Axios` để gọi API từ Backend.
    * Dùng **Tailwind CSS** để định dạng giao diện cho phù hợp với thiết kế tổng thể.
    * Sử dụng **react-responsive** để kiểm tra giao diện trên Mobile/Tablet.

### Cách triển khai lên VPS (Deployment)
1.  Dùng **WinSCP** nén và đẩy code lên thư mục `/var/www/` trên server (loại bỏ `node_modules`).
2.  Mở **Putty**, SSH vào server.
3.  Cài đặt môi trường: `npm install`.
4.  Sử dụng `pm2` để duy trì server Node.js chạy ngầm liên tục.