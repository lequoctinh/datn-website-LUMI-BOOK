import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBox, faTruck, faCheckCircle, faTimesCircle, faEdit, 
  faTrashAlt, faChevronRight, faSearch, faRedo, faMapMarkerAlt, faUser, faPhone 
} from '@fortawesome/free-solid-svg-icons';
import axiosClient from '../../utils/axiosClient';
import { toast } from 'react-toastify';
import { useCart } from '../../context/cartContext';

const MyOrders = () => {
    const { addToCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const confirmCancel = (orderId) => {
    toast(
      ({ closeToast }) => (
        <div className="p-2">
          <p className="text-text-primary font-bold mb-3 text-lg">Bạn chắc chắn muốn hủy đơn?</p>
          <p className="text-text-secondary text-sm mb-6">Đơn hàng #LUMI-{orderId} sẽ bị dừng xử lý và sản phẩm sẽ được hoàn lại kho.</p>
          <div className="flex justify-end gap-3">
            <button 
              onClick={closeToast}
              className="px-5 py-2.5 rounded-xl bg-background text-text-primary font-bold text-sm"
            >
              Để tôi xem lại
            </button>
            <button 
              onClick={() => {
                executeCancel(orderId);
                closeToast();
              }}
              className="px-5 py-2.5 rounded-xl bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-200"
            >
              Xác nhận hủy đơn
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        className: 'rounded-[32px] p-8 shadow-2xl border border-border-light',
      }
    );
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

  const handleReorder = async (orderId) => {
    try {
      const res = await axiosClient.get(`/checkout/my-orders/${orderId}`);
      const itemsToReorder = res.items; 
  
      if (!itemsToReorder || itemsToReorder.length === 0) {
        toast.error("Không tìm thấy sản phẩm trong đơn hàng này");
        return;
      }
      await Promise.all(
        itemsToReorder.map(item => addToCart(item.sach_id, item.so_luong))
      );
  
      toast.success("Đã thêm toàn bộ sản phẩm vào giỏ hàng!");
      navigate('/cart'); 
  
    } catch (err) {
      toast.error("Có lỗi xảy ra khi thực hiện mua lại");
      console.error(err);
    }
  };

  const getStatusInfo = (status) => {
    const map = {
      'cho_duyet': { text: 'Chờ xử lý', color: 'text-amber-500', bg: 'bg-amber-50', icon: faBox },
      'dang_giao': { text: 'Đang vận chuyển', color: 'text-blue-500', bg: 'bg-blue-50', icon: faTruck },
      'da_giao': { text: 'Giao thành công', color: 'text-emerald-500', bg: 'bg-emerald-50', icon: faCheckCircle },
      'da_huy': { text: 'Đã hủy đơn', color: 'text-rose-400', bg: 'bg-rose-50', icon: faTimesCircle },
    };
    return map[status] || map['cho_duyet'];
  };
  return (
    <div className="min-h-screen bg-[#F8F9FB] py-16 px-4 font-body">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="font-heading text-4xl text-text-primary mb-3 tracking-tight">Đơn hàng của tôi</h1>
            <p className="text-text-secondary font-medium italic">Lumi Book - Nơi lưu giữ hành trình tri thức của bạn</p>
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Tìm mã đơn hàng #LUMI..." 
              className="pl-12 pr-6 py-4 rounded-2xl border border-border-default focus:border-brand-primary outline-none bg-white w-full md:w-80 shadow-sm transition-all"
            />
            <FontAwesomeIcon icon={faSearch} className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary/40" />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-32">
            <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-[40px] p-24 text-center border border-border-light shadow-sm">
            <p className="text-text-secondary mb-8">Bạn chưa có giao dịch nào.</p>
            <button onClick={() => navigate('/')} className="bg-text-primary text-white px-10 py-4 rounded-2xl font-bold hover:bg-black transition-all">Mua sắm ngay</button>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => {
              const status = getStatusInfo(order.trang_thai);
              return (
                <div key={order.id} className="bg-white rounded-[32px] border border-border-light overflow-hidden transition-all duration-500 hover:border-brand-primary/20">
                  <div className="p-8 md:p-10">
                    
                    <div className="flex flex-wrap justify-between items-center gap-6 mb-10 pb-8 border-b border-dashed border-border-default">
                      <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl ${status.bg} ${status.color} flex items-center justify-center text-2xl shadow-sm`}>
                          <FontAwesomeIcon icon={status.icon} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-xl font-black text-text-primary tracking-tight">#LUMI-{order.id}</span>
                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${status.bg} ${status.color}`}>
                              {status.text}
                            </span>
                          </div>
                          <p className="text-sm text-text-secondary mt-1">Ngày đặt: {new Date(order.ngay_dat).toLocaleString('vi-VN')}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xs text-text-secondary font-bold uppercase tracking-widest mb-1">Tổng cộng</p>
                        <p className="text-3xl font-black text-brand-primary leading-none">{Number(order.tong_tien).toLocaleString()} đ</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      
                      <div className="space-y-4 bg-background/30 p-6 rounded-2xl border border-border-light">
                        <p className="text-xs font-black text-text-secondary uppercase tracking-[0.2em] mb-4">Thông tin nhận hàng</p>
                        <div className="flex items-center gap-4 text-text-primary font-bold">
                          <FontAwesomeIcon icon={faUser} className="text-brand-primary w-4" />
                          <span>{order.ho_ten_nguoi_nhan}</span>
                        </div>
                        <div className="flex items-center gap-4 text-text-secondary font-medium">
                          <FontAwesomeIcon icon={faPhone} className="text-brand-primary w-4" />
                          <span>{order.sdt_nguoi_nhan}</span>
                        </div>
                        <div className="flex items-start gap-4 text-text-secondary text-sm leading-relaxed">
                          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-brand-primary w-4 mt-1" />
                          <span>{order.dia_chi_giao_hang}</span>
                        </div>
                      </div>
                      <div className="flex flex-col justify-center gap-4">
                        {order.trang_thai === 'cho_duyet' && (
                          <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => navigate(`/update-order/${order.id}`)} className="flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-border-default hover:border-text-primary font-bold text-sm transition-all shadow-sm bg-white">
                              <FontAwesomeIcon icon={faEdit} /> Chỉnh sửa
                            </button>
                            <button onClick={() => confirmCancel(order.id)} className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-sm transition-all shadow-sm">
                              <FontAwesomeIcon icon={faTrashAlt} /> Hủy đơn
                            </button>
                          </div>
                        )}

                        {order.trang_thai === 'dang_giao' && (
                          <button className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-brand-primary text-white font-bold shadow-lg shadow-brand-primary/20 hover:brightness-110 transition-all">
                            <FontAwesomeIcon icon={faTruck} className="animate-pulse" /> Theo dõi đơn hàng
                          </button>
                        )}

                        {(order.trang_thai === 'da_huy' || order.trang_thai === 'da_giao') && (
                          <button onClick={() => handleReorder(order.id)} className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-text-primary text-white font-bold hover:bg-black transition-all shadow-xl active:scale-95">
                            <FontAwesomeIcon icon={faRedo} /> Mua lại sản phẩm
                          </button>
                        )}
                        <button 
                        onClick={() => navigate(`/order-detail/${order.id}`)} 
                        className="text-center text-xs font-bold text-text-secondary hover:text-brand-primary transition-colors py-2 uppercase tracking-widest mt-2"
                        >
                        Xem chi tiết hóa đơn <FontAwesomeIcon icon={faChevronRight} className="ml-1 text-[8px]" />
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