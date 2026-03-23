import React from 'react';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
  // Dữ liệu mẫu (Mock data) để Toàn nhìn thấy giao diện ngay lập tức
  const mockOrders = [
    {
      id: "DH12345",
      ngay_dat: "2026-03-20",
      tong_tien: 250000,
      trang_thai: "Hoàn thành",
      hinh_thuc_tt: "Thanh toán khi nhận hàng"
    },
    {
      id: "DH12346",
      ngay_dat: "2026-03-22",
      tong_tien: 155000,
      trang_thai: "Đang giao",
      hinh_thuc_tt: "Chuyển khoản"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Lịch sử đơn hàng</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Mã đơn hàng</th>
              <th className="py-3 px-6 text-left">Ngày đặt</th>
              <th className="py-3 px-6 text-center">Tổng tiền</th>
              <th className="py-3 px-6 text-center">Trạng thái</th>
              <th className="py-3 px-6 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {mockOrders.map((order) => (
              <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <span className="font-medium">#{order.id}</span>
                </td>
                <td className="py-3 px-6 text-left">
                  {new Date(order.ngay_dat).toLocaleDateString('vi-VN')}
                </td>
                <td className="py-3 px-6 text-center font-bold text-red-500">
                  {order.tong_tien.toLocaleString()}đ
                </td>
                <td className="py-3 px-6 text-center">
                  <span className={`py-1 px-3 rounded-full text-xs ${
                    order.trang_thai === 'Hoàn thành' ? 'bg-green-200 text-green-700' : 'bg-yellow-200 text-yellow-700'
                  }`}>
                    {order.trang_thai}
                  </span>
                </td>
                <td className="py-3 px-6 text-center">
                <Link to="/order-history/:id">
  <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition">
    Chi tiết
  </button>
</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {mockOrders.length === 0 && (
          <div className="p-10 text-center text-gray-500">
            Bạn chưa có đơn hàng nào. <a href="/" className="text-blue-500 underline">Mua sắm ngay!</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;