import React, { createContext, useState, useContext } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [receptions, setReceptions] = useState([
    {
      id: 'PTN-001',
      customerName: 'Lê Văn An',
      phoneNumber: '0901.234.567',
      deviceModel: 'Dell XPS 15',
      serialNumber: 'DXP123456',
      status: 'Đang chờ',
      warranty: 'Còn bảo hành',
      receivedDate: '20-04-2026',
      faultDescription: 'Không lên nguồn, pin bị phồng.',
      accessories: 'Sạc, Túi chống sốc',
      serviceId: 'DV-101'
    },
    {
      id: 'PTN-002',
      customerName: 'Trần Thị Bình',
      phoneNumber: '0988.777.666',
      deviceModel: 'MacBook Pro M2',
      serialNumber: 'MBP789012',
      status: 'Đang sửa',
      warranty: 'Hết bảo hành',
      receivedDate: '21-04-2026',
      faultDescription: 'Màn hình bị sọc, nhấp nháy.',
      accessories: 'Sạc (Type-C)',
      serviceId: 'DV-102'
    },
    {
      id: 'PTN-003',
      customerName: 'Nguyễn Duy Khánh',
      phoneNumber: '0912.333.444',
      deviceModel: 'PC Gaming Custom',
      serialNumber: 'PC-2024-001',
      status: 'Hoàn thành',
      warranty: 'Còn bảo hành',
      receivedDate: '18-04-2026',
      faultDescription: 'Vệ sinh máy và tra keo tản nhiệt.',
      accessories: 'Chỉ thùng máy',
      serviceId: 'DV-103'
    },
    {
      id: 'PTN-004',
      customerName: 'Hoàng Minh Triết',
      phoneNumber: '0933.111.222',
      deviceModel: 'Surface Pro 9',
      serialNumber: 'SF9-5566',
      status: 'Chờ linh kiện',
      warranty: 'Hết bảo hành',
      receivedDate: '19-04-2026',
      faultDescription: 'Liệt cảm ứng một phần màn hình.',
      accessories: 'Bàn phím Type Cover, Sạc',
      serviceId: 'DV-104'
    },
    {
      id: 'PTN-005',
      customerName: 'Phạm Thanh Thảo',
      phoneNumber: '0905.555.444',
      deviceModel: 'HP Pavilion 14',
      serialNumber: 'HP-PV-7788',
      status: 'Đang chờ',
      warranty: 'Còn bảo hành',
      receivedDate: '22-04-2026',
      faultDescription: 'Bàn phím bị liệt một số phím.',
      accessories: 'Sạc',
      serviceId: null
    }
  ]);

  const [services, setServices] = useState([
    {
      id: 'DV-101',
      receptionId: 'PTN-001',
      serviceName: 'Thay Pin & Kiểm tra Mainboard',
      estimatedPrice: '1.500.000 VNĐ',
      status: 'Chờ duyệt',
      approvalStatus: 'Chờ khách xác nhận',
      technicianNote: 'Cần kiểm tra kỹ IC nguồn trên main.',
      completionDate: '25-04-2026'
    },
    {
      id: 'DV-102',
      receptionId: 'PTN-002',
      serviceName: 'Thay Cáp Màn Hình',
      estimatedPrice: '3.200.000 VNĐ',
      status: 'Đang sửa',
      approvalStatus: 'Đã duyệt',
      technicianNote: 'Đã thay cáp mới, đang chạy test màn hình.',
      completionDate: '24-04-2026'
    },
    {
      id: 'DV-103',
      receptionId: 'PTN-003',
      serviceName: 'Vệ sinh & Bảo trì PC',
      estimatedPrice: '300.000 VNĐ',
      status: 'Hoàn thành',
      approvalStatus: 'Đã duyệt',
      technicianNote: 'Đã vệ sinh sạch bụi, tra keo tản nhiệt MX-4.',
      completionDate: '18-04-2026'
    },
    {
      id: 'DV-104',
      receptionId: 'PTN-004',
      serviceName: 'Thay Màn Hình Surface',
      estimatedPrice: '4.500.000 VNĐ',
      status: 'Chờ linh kiện',
      approvalStatus: 'Đã duyệt',
      technicianNote: 'Đang đặt hàng màn hình từ hãng, dự kiến 3 ngày có.',
      completionDate: '28-04-2026'
    }
  ]);

  const getReceptionById = (id) => receptions.find(r => r.id === id);
  const getServiceByReceptionId = (recId) => services.find(s => s.receptionId === recId);
  const getServiceById = (id) => services.find(s => s.id === id);

  const addReception = (newRecord) => {
    const receptionId = `PTN-${Math.floor(1000 + Math.random() * 9000)}`;
    const serviceId = `DV-${Math.floor(1000 + Math.random() * 9000)}`;

    const recordWithId = {
      ...newRecord,
      id: receptionId,
      status: 'Đang chờ',
      receivedDate: new Date().toLocaleDateString('vi-VN'),
      serviceId: serviceId
    };

    const linkedService = {
      id: serviceId,
      receptionId: receptionId,
      serviceName: 'Chưa xác định (Đang kiểm tra)',
      estimatedPrice: '0 VNĐ',
      status: 'Chờ duyệt',
      approvalStatus: 'Chờ báo giá',
      technicianNote: 'Thiết bị mới tiếp nhận, đang chờ kỹ thuật viên kiểm tra lỗi.',
      completionDate: null
    };

    setReceptions(prev => [recordWithId, ...prev]);
    setServices(prev => [linkedService, ...prev]);
    
    return recordWithId;
  };

  const updateService = (id, updatedData) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updatedData } : s));
  };

  return (
    <DataContext.Provider value={{ 
      receptions, 
      services, 
      getReceptionById, 
      getServiceByReceptionId,
      getServiceById,
      addReception,
      updateService
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
