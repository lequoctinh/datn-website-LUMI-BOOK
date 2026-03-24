import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faShoppingCart, faSearch, faEye, 
    faCheckCircle, faTruck, faCheck, faTimes 
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import orderService from '../services/orderService';

const OrderManager = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await orderService.getAll();
            if (res.success) {
                setOrders(res.data);
            }
        } catch (error) {
            toast.error('Lỗi khi tải danh sách đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const res = await orderService.updateStatus(id, newStatus);
            if (res.success) {
                toast.success('Cập nhật trạng thái thành công');
                if (showModal) setShowModal(false);
                fetchOrders();
            }
        } catch (error) {
            toast.error('Không thể cập nhật trạng thái');
        }
    };

    const handleViewDetail = async (id) => {
        setModalLoading(true);
        setShowModal(true);
        try {
            const res = await orderService.getDetail(id);
            if (res.success) {
                setSelectedOrder(res.order);
                setOrderItems(res.items || []);
            }
        } catch (error) {
            toast.error('Lỗi khi lấy chi tiết đơn hàng');
            setShowModal(false);
        } finally {
            setModalLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'cho_duyet': return 'bg-amber-100 text-amber-700 border border-amber-200';
            case 'da_duyet': return 'bg-purple-100 text-purple-700 border border-purple-200';
            case 'dang_giao': return 'bg-blue-100 text-blue-700 border border-blue-200';
            case 'da_giao': case 'thanh_cong': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
            case 'da_huy': return 'bg-red-100 text-red-700 border border-red-200';
            default: return 'bg-gray-100 text-gray-600 border border-gray-200';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'cho_duyet': return 'Chờ duyệt';
            case 'da_duyet': return 'Đã duyệt';
            case 'dang_giao': return 'Đang giao';
            case 'da_giao': case 'thanh_cong': return 'Thành công';
            case 'da_huy': return 'Đã hủy';
            default: return status || 'N/A';
        }
    };

    const getProductImageUrl = (imageName) => {
        if (!imageName) return 'https://placehold.co/400x500?text=No+Image';
        if (imageName.startsWith('http')) return imageName;
        return `http://localhost:5000/uploads/${imageName}`;
    };

    const filteredOrders = orders.filter(order => 
        order.ho_ten_nguoi_nhan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm)
    );

    return (
        <div className="bg-[#f8f9fa] min-h-screen p-4 md:p-8 font-sans text-gray-900">
            <div className="max-w-7xl mx-auto bg-white rounded-[40px] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="p-8 md:p-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
                                <FontAwesomeIcon icon={faShoppingCart} className="text-white text-xl" />
                            </div>
                            <h2 className="text-3xl font-black tracking-tight text-gray-800">Đơn hàng</h2>
                        </div>
                        <p className="text-gray-400 font-medium ml-16">Quản lý lộ trình và trạng thái vận chuyển</p>
                    </div>

                    <div className="relative w-full md:w-96 group">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Tìm mã đơn, tên khách hàng..."
                            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-500/20 focus:bg-white transition-all outline-none text-sm font-semibold shadow-inner"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="text-gray-400 text-[11px] uppercase tracking-[0.2em] font-black">
                                <th className="py-6 pl-10 text-left">Mã định danh</th>
                                <th className="py-6 text-left">Thông tin khách</th>
                                <th className="py-6 text-center">Thời gian</th>
                                <th className="py-6 text-center">Giá trị đơn</th>
                                <th className="py-6 text-center">Trạng thái</th>
                                <th className="py-6 pr-10 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-32 text-gray-300 font-bold italic animate-pulse">Đang truy xuất dữ liệu hệ thống...</td></tr>
                            ) : filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/80 transition-all group">
                                    <td className="py-7 pl-10 font-black text-orange-600">#LUMI-{order.id}</td>
                                    <td className="py-7">
                                        <div className="font-extrabold text-gray-800">{order.ho_ten_nguoi_nhan}</div>
                                        <div className="text-xs text-gray-400 font-bold mt-0.5">{order.sdt_nguoi_nhan}</div>
                                    </td>
                                    <td className="py-7 text-center font-bold text-gray-500 text-xs">
                                        {new Date(order.ngay_dat).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="py-7 text-center font-black text-gray-900">
                                        {Number(order.tong_tien).toLocaleString()}đ
                                    </td>
                                    <td className="py-7 text-center">
                                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${getStatusStyle(order.trang_thai)}`}>
                                            {getStatusText(order.trang_thai)}
                                        </span>
                                    </td>
                                    <td className="py-7 pr-10 text-right">
                                        <div className="flex justify-end gap-2.5">
                                            {order.trang_thai === 'cho_duyet' && (
                                                <button onClick={() => handleUpdateStatus(order.id, 'da_duyet')} title="Duyệt đơn" className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center shadow-sm">
                                                    <FontAwesomeIcon icon={faCheck} />
                                                </button>
                                            )}
                                            {order.trang_thai === 'da_duyet' && (
                                                <button onClick={() => handleUpdateStatus(order.id, 'dang_giao')} title="Giao hàng" className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center shadow-sm">
                                                    <FontAwesomeIcon icon={faTruck} />
                                                </button>
                                            )}
                                            {order.trang_thai === 'dang_giao' && (
                                                <button onClick={() => handleUpdateStatus(order.id, 'da_giao')} title="Hoàn tất" className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center shadow-sm">
                                                    <FontAwesomeIcon icon={faCheckCircle} />
                                                </button>
                                            )}
                                            <button onClick={() => handleViewDetail(order.id)} title="Xem chi tiết" className="w-10 h-10 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-800 hover:text-white transition-all flex items-center justify-center shadow-sm">
                                                <FontAwesomeIcon icon={faEye} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
                    
                    <div className="bg-white rounded-[40px] w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl relative z-10 flex flex-col animate-in fade-in zoom-in duration-300">
                        <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-20">
                            <div>
                                <h3 className="text-xl font-black text-gray-800 uppercase tracking-tight">Chi tiết vận đơn</h3>
                                <p className="text-orange-500 font-bold text-sm">#LUMI-{selectedOrder?.id}</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-12 h-12 rounded-2xl bg-gray-50 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center text-gray-400">
                                <FontAwesomeIcon icon={faTimes} className="text-lg" />
                            </button>
                        </div>
                        
                        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                            {modalLoading ? (
                                <div className="py-20 text-center text-gray-300 font-bold italic animate-pulse tracking-widest uppercase text-xs">Đang lấy dữ liệu chi tiết...</div>
                            ) : selectedOrder && (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 rounded-[30px] p-6 border border-gray-100">
                                            <p className="text-[10px] uppercase font-black text-gray-400 mb-4 tracking-widest">Người nhận hàng</p>
                                            <p className="font-black text-gray-800 text-lg mb-1 uppercase">{selectedOrder.ho_ten_nguoi_nhan}</p>
                                            <p className="text-orange-600 font-bold text-sm">{selectedOrder.sdt_nguoi_nhan}</p>
                                            <div className="mt-4 pt-4 border-t border-gray-200/60 text-sm text-gray-500 font-medium leading-relaxed italic">
                                                {selectedOrder.dia_chi_giao_hang}
                                            </div>
                                        </div>
                                        <div className="bg-gray-900 rounded-[30px] p-6 flex flex-col justify-center items-center text-center shadow-xl shadow-gray-200">
                                            <p className="text-[10px] uppercase font-black text-gray-500 mb-4 tracking-widest">Tiến độ hiện tại</p>
                                            <span className={`px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] border-2 ${getStatusStyle(selectedOrder.trang_thai)}`}>
                                                {getStatusText(selectedOrder.trang_thai)}
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="h-1 flex-1 bg-gray-50 rounded-full"></div>
                                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Danh mục sản phẩm</p>
                                            <div className="h-1 flex-1 bg-gray-50 rounded-full"></div>
                                        </div>

                                        <div className="space-y-4">
                                            {orderItems.map((item, index) => (
                                                <div key={index} className="flex items-center gap-5 p-4 rounded-[24px] bg-white border border-gray-100 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-100/50 transition-all group">
                                                    <div className="relative">
                                                        <img 
                                                            src={getProductImageUrl(item.hinh_anh)} 
                                                            alt={item.ten_sach}
                                                            className="w-20 h-24 object-cover rounded-2xl shadow-md group-hover:scale-105 transition-transform duration-300"
                                                            onError={(e) => {
                                                                e.target.onerror = null; 
                                                                e.target.src = 'https://placehold.co/400x500?text=No+Image';
                                                            }}
                                                        />
                                                        <span className="absolute -top-2 -right-2 w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center text-[10px] font-black border-4 border-white">
                                                            {item.so_luong}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-black text-gray-800 text-sm uppercase leading-tight mb-2 group-hover:text-orange-600 transition-colors">{item.ten_sach}</h4>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xs font-bold text-gray-400 italic">Đơn giá niêm yết</span>
                                                            <p className="font-black text-gray-900">{Number(item.gia_luc_mua).toLocaleString()}đ</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-orange-500 p-8 rounded-[32px] flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl shadow-orange-200">
                                        <span className="font-black text-orange-100 uppercase text-sm tracking-[0.2em]">Tổng thanh toán</span>
                                        <span className="text-4xl font-black text-white drop-shadow-md">{Number(selectedOrder.tong_tien).toLocaleString()}đ</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-8 border-t border-gray-50 bg-gray-50/50">
                            <button onClick={() => setShowModal(false)} className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-[13px] uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-xl shadow-gray-200 active:scale-[0.98]">
                                Xác nhận và đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManager;