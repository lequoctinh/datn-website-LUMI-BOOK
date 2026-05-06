import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBox, faTruck, faCheckCircle, faTimesCircle, faEdit, 
  faTrashAlt, faChevronRight, faSearch, faRedo, faMapMarkerAlt, 
  faUser, faPhone, faCreditCard, faMoneyBillWave, faTicketAlt 
} from '@fortawesome/free-solid-svg-icons';
import axiosClient from '../../utils/axiosClient';
import { toast } from 'react-toastify';
import { useCart } from '../../context/cartContext';

const MyOrders = () => {
  const { addToCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axiosClient.get('/checkout/my-orders');
      setOrders(res.data);
    } catch (err) {
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const executeCancel = async (orderId) => {
    try {
      await axiosClient.put(`/checkout/cancel-order/${orderId}`);
      toast.success("Đã hủy đơn hàng thành công");
      fetchOrders();
    } catch (err) {
      toast.error(err.message || "Lỗi khi hủy đơn");
    }
  };

  const confirmCancel = (orderId) => {
    toast(
      ({ closeToast }) => (
        <div className="py-2">
          <p className="text-gray-900 font-bold mb-2">Xác nhận hủy đơn hàng?</p>
          <p className="text-gray-600 text-sm mb-5">Hành động này không thể hoàn tác cho đơn #LUMI-{orderId}.</p>
          <div className="flex justify-end gap-2">
            <button onClick={closeToast} className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded">Đóng</button>
            <button 
              onClick={() => { executeCancel(orderId); closeToast(); }}
              className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded"
            >
              Hủy đơn
            </button>
          </div>
        </div>
      ),
      { position: "top-center", autoClose: false }
    );
  };

  const handleReorder = async (orderId) => {
    try {
      const res = await axiosClient.get(`/checkout/my-orders/${orderId}`);
      const itemsToReorder = res.items; 
      if (!itemsToReorder || itemsToReorder.length === 0) return;
      await Promise.all(itemsToReorder.map(item => addToCart(item.sach_id, item.so_luong)));
      toast.success("Đã thêm sản phẩm vào giỏ hàng");
      navigate('/cart'); 
    } catch (err) {
      toast.error("Lỗi khi mua lại");
    }
  };

  const getStatusStyle = (status) => {
    const map = {
      'cho_duyet': { text: 'Chờ xử lý', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', icon: faBox },
      'dang_giao': { text: 'Đang giao', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: faTruck },
      'da_giao': { text: 'Thành công', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100', icon: faCheckCircle },
      'da_huy': { text: 'Đã hủy', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100', icon: faTimesCircle },
    };
    return map[status] || map['cho_duyet'];
  };

  const filteredOrders = orders.filter(o => o.id.toString().includes(searchTerm));

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-body">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Quản lý đơn hàng</h1>
            <p className="text-sm text-gray-500 mt-1">Theo dõi trạng thái và phương thức thanh toán của bạn</p>
          </div>
          <div className="relative w-full md:w-72">
            <input 
              type="text" 
              placeholder="Tìm mã đơn hàng..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-gray-400 outline-none transition-all"
            />
            <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-16 text-center shadow-sm">
            <div className="text-gray-300 mb-4 text-5xl">
              <FontAwesomeIcon icon={faBox} />
            </div>
            <p className="text-gray-500 mb-6">Không tìm thấy đơn hàng nào phù hợp.</p>
            <button onClick={() => navigate('/')} className="bg-gray-900 text-white px-8 py-2.5 rounded font-medium text-sm hover:bg-gray-800 transition-all uppercase tracking-wide">Mua sắm ngay</button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const style = getStatusStyle(order.trang_thai);
              return (
                <div key={order.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-gray-900 text-lg">#LUMI-{order.id}</span>
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded border text-[10px] font-bold ${style.bg} ${style.color} ${style.border}`}>
                        <FontAwesomeIcon icon={style.icon} className="text-[10px]" />
                        {style.text.toUpperCase()}
                      </span>
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[10px] font-bold uppercase ${
                        order.trang_thai_thanh_toan === 'paid' 
                        ? 'bg-green-50 text-green-600 border-green-100' 
                        : 'bg-orange-50 text-orange-600 border-orange-100'
                      }`}>
                        {order.trang_thai_thanh_toan === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Ngày đặt: <span className="text-gray-700 font-medium">{new Date(order.ngay_dat).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>

                  <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2 text-sm">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Giao đến</p>
                        <div className="text-gray-900 font-semibold uppercase">{order.ho_ten_nguoi_nhan}</div>
                        <div className="flex items-start gap-2 text-gray-600 leading-relaxed">
                          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 text-xs mt-1 w-3" />
                          <span className="line-clamp-2">{order.dia_chi_giao_hang}</span>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Thanh toán</p>
                        <div className="flex items-center gap-2 text-gray-700 font-medium uppercase text-xs">
                          <FontAwesomeIcon icon={order.phuong_thuc_thanh_toan === 'vnpay' ? faCreditCard : faMoneyBillWave} className="text-gray-400" />
                          {order.phuong_thuc_thanh_toan}
                        </div>
                        {order.so_tien_giam > 0 && (
                          <div className="flex items-center gap-2 text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded w-fit border border-green-100 uppercase">
                            <FontAwesomeIcon icon={faTicketAlt} className="text-[10px]" />
                            Đã giảm {Number(order.so_tien_giam).toLocaleString()}đ
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-end border-l border-gray-100 pl-8 h-full">
                      <div className="text-right">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Thành tiền</p>
                        <p className="text-2xl font-bold text-red-600">{Number(order.tong_tien).toLocaleString()}đ</p>
                      </div>
                      
                      <div className="flex flex-col gap-2 w-full mt-6">
                        {order.trang_thai === 'cho_duyet' ? (
                          <div className="flex gap-2 w-full">
                            <button onClick={() => navigate(`/update-order/${order.id}`)} className="flex-1 py-2 border border-gray-300 rounded text-[10px] font-bold hover:bg-gray-50 transition-colors uppercase tracking-tighter">
                              <FontAwesomeIcon icon={faEdit} className="mr-1" /> Sửa
                            </button>
                            <button onClick={() => confirmCancel(order.id)} className="flex-1 py-2 border border-red-200 text-red-600 rounded text-[10px] font-bold hover:bg-red-50 transition-colors uppercase tracking-tighter">
                              <FontAwesomeIcon icon={faTrashAlt} className="mr-1" /> Hủy
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => handleReorder(order.id)} className="w-full py-2 bg-gray-900 text-white rounded text-[10px] font-bold hover:bg-gray-800 transition-colors uppercase tracking-wide">
                            <FontAwesomeIcon icon={faRedo} className="mr-1" /> Mua lại
                          </button>
                        )}
                        <button 
                          onClick={() => navigate(`/order-detail/${order.id}`)} 
                          className="w-full py-2 text-center text-[10px] font-bold text-blue-600 hover:bg-blue-50 rounded transition-colors flex items-center justify-center gap-1 uppercase tracking-tight"
                        >
                          Chi tiết hóa đơn <FontAwesomeIcon icon={faChevronRight} className="text-[7px]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;