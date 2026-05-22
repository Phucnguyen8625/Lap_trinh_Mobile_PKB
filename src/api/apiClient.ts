import axios from "axios";

// Nếu dùng Android Emulator thì dùng http://10.0.2.2:5000
// Nếu dùng thiết bị thật và Expo Go thì phải dùng địa chỉ IP máy tính (ví dụ: http://192.168.1.5:5000)
const BASE_URL = "http://192.168.100.174:5000";

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

export default apiClient;
