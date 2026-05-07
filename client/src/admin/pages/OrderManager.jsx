import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faLayerGroup, faSearch, faClock, faCircleCheck, 
    faTruckMoving, faBan, faChevronRight, faClose, faFilter, faCreditCard, faMoneyBill
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import adminOrderService from '../services/adminOrderService';

function OrderManager() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [tempReason, setTempReason] = useState('');

    const IMAGE_BASE_URL = 'http://localhost:5000/uploads/products/';
    const DEFAULT_IMAGE = 'https://via.placeholder.com/150';

    const getImageUrl = (path) => {
        if (!path) return DEFAULT_IMAGE;
        if (path.startsWith('http')) return path;
        return `${IMAGE_BASE_URL}${path}`;
    };

    useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
}, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await adminOrderService.getAllOrders();
            if (res?.success) {
                setOrders(res.data);
            }
        } catch (error) {
            toast.error('Không thể kết nối máy chủ');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        if (newStatus === 'da_huy') {
            setShowCancelModal(true);
            return;
        }

        try {
            const res = await adminOrderService.updateStatus(id, { 
                trang_thai: newStatus,
                ly_do_huy: null 
            });
            if (res?.success) {
                toast.success('Cập nhật trạng thái thành công');
                setOrders(prev => prev.map(o => o.id === id ? { ...o, trang_thai: newStatus } : o));
                if (selectedOrder && selectedOrder.id === id) {
                    setSelectedOrder(prev => ({ ...prev, trang_thai: newStatus }));
                }
            }
        } catch (error) {
            toast.error('Lỗi cập nhật');
        }
    };

    const confirmCancelOrder = async () => {
        if (!tempReason.trim()) {
            toast.warning("Vui lòng nhập lý do hủy");
            return;
        }
        setModalLoading(true);
        try {
            const res = await adminOrderService.updateStatus(selectedOrder.id, {
                trang_thai: 'da_huy',
                ly_do_huy: tempReason 
            });
            if (res?.success) {
                toast.success("Đơn hàng đã được hủy");
                setShowCancelModal(false);
                setOrders(prev => prev.map(o => 
                    o.id === selectedOrder.id ? { ...o, trang_thai: 'da_huy', ly_do_huy: tempReason } : o
                ));
                setSelectedOrder(prev => ({ 
                    ...prev, 
                    trang_thai: 'da_huy', 
                    ly_do_huy: tempReason 
                }));
                setTempReason('');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lỗi khi hủy đơn');
        } finally {
            setModalLoading(false);
        }
    };

    const handleViewDetail = async (id) => {
        setModalLoading(true);
        setShowModal(true);
        try {
            const res = await adminOrderService.getOrderDetail(id)
            if (res?.success) {
                setSelectedOrder(res.order);
                setOrderItems(res.items || []);
            }
        } catch (error) {
            toast.error('Lỗi tải chi tiết');
            setShowModal(false);
        } finally {
            setModalLoading(false);
        }
    };

    const filteredOrders = useMemo(() => {
        return orders.filter(o => {
            const searchLower = searchTerm.toLowerCase().trim();
            const orderIdStr = o.id.toString();
            const referenceStr = `lb00${o.id}`.toLowerCase();
            const customerName = o.ho_ten_nguoi_nhan?.toLowerCase() || '';
            const matchText = customerName.includes(searchLower) || orderIdStr.includes(searchLower) || referenceStr.includes(searchLower);
            const matchStatus = filterStatus === 'all' || o.trang_thai === filterStatus;
            return matchText && matchStatus;
        });
    }, [orders, searchTerm, filterStatus]);

    const StatusBadge = ({ status }) => {
        const map = {
            cho_duyet: { label: 'Chờ duyệt', color: '#f59e0b', bg: '#fffbeb', icon: faClock },
            da_duyet: { label: 'Đã duyệt', color: '#3b82f6', bg: '#eff6ff', icon: faCircleCheck },
            dang_giao: { label: 'Đang giao', color: '#8b5cf6', bg: '#f5f3ff', icon: faTruckMoving },
            da_giao: { label: 'Thành công', color: '#10b981', bg: '#ecfdf5', icon: faCircleCheck },
            da_huy: { label: 'Đã hủy', color: '#ef4444', bg: '#fef2f2', icon: faBan }
        };
        const item = map[status] || { label: status, color: '#64748b', bg: '#f8fafc', icon: faClock };
        return (
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded border shadow-sm" style={{ backgroundColor: item.bg, borderColor: `${item.color}20` }}>
                <FontAwesomeIcon icon={item.icon} style={{ color: item.color, fontSize: '10px' }} />
                <span className="text-[11px] font-bold uppercase tracking-tight" style={{ color: item.color }}>{item.label}</span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#f1f3f5] p-4 lg:p-10 font-sans tracking-tight text-[#2d3436]">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-xl font-extrabold flex items-center gap-2 text-slate-800 uppercase">
                            <FontAwesomeIcon icon={faLayerGroup} className="text-slate-400" />
                            Quản lý đơn hàng
                        </h1>
                        <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-widest">LumiBook Management System</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                            <input type="text" placeholder="Tìm mã đơn #LB hoặc tên khách..." className="pl-9 pr-4 py-2 bg-white border border-slate-300 rounded text-sm w-72 focus:border-slate-900 focus:ring-0 outline-none transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        <div className="flex items-center gap-2 bg-white border border-slate-300 rounded px-3 py-2">
                            <FontAwesomeIcon icon={faFilter} className="text-slate-400 text-xs" />
                            <select className="text-xs font-bold outline-none bg-transparent cursor-pointer" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                <option value="all">Tất cả trạng thái</option>
                                <option value="cho_duyet">Chờ duyệt</option>
                                <option value="da_duyet">Đã xác nhận</option>
                                <option value="dang_giao">Đang chuyển</option>
                                <option value="da_giao">Thành công</option>
                                <option value="da_huy">Đã hủy</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                                <th className="px-6 py-4">Mã đơn</th>
                                <th className="px-6 py-4">Khách hàng</th>
                                <th className="px-6 py-4 text-center">Thanh toán</th>
                                <th className="px-6 py-4 text-right">Tổng tiền</th>
                                <th className="px-6 py-4 text-center">Trạng thái</th>
                                <th className="px-6 py-4 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="6" className="py-20 text-center text-slate-300 text-sm italic font-medium">Đang tải dữ liệu...</td></tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr><td colSpan="6" className="py-20 text-center text-slate-400 text-sm font-medium">Không tìm thấy đơn hàng nào</td></tr>
                            ) : filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50/50 transition-all cursor-pointer" onClick={() => handleViewDetail(order.id)}>
                                    <td className="px-6 py-4 font-mono text-xs text-slate-400">#LB{order.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-bold text-slate-800">{order.ho_ten_nguoi_nhan}</div>
                                        <div className="text-[10px] text-slate-400 font-medium">{new Date(order.ngay_dat).toLocaleDateString('vi-VN')}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase ${order.phuong_thuc_thanh_toan === 'vnpay' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                                                {order.phuong_thuc_thanh_toan === 'vnpay' ? 'VNPay' : 'COD'}
                                            </span>
                                            {order.phuong_thuc_thanh_toan === 'vnpay' && (
                                                <span className={`text-[8px] font-bold ${order.trang_thai_thanh_toan === 'paid' ? 'text-emerald-500' : 'text-orange-500'}`}>
                                                    {order.trang_thai_thanh_toan === 'paid' ? '● Đã trả' : '○ Chờ trả'}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="text-sm font-black text-slate-900">{Number(order.tong_tien).toLocaleString()}đ</div>
                                        {order.voucher_code && <div className="text-[9px] text-emerald-500 font-bold italic">Giảm giá: {order.voucher_code}</div>}
                                    </td>
                                    <td className="px-6 py-4 text-center"><StatusBadge status={order.trang_thai} /></td>
                                    <td className="px-6 py-4 text-center"><FontAwesomeIcon icon={faChevronRight} className="text-slate-300 text-[10px]" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowModal(false)}></div>
                    <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Chi tiết đơn hàng</h3>
                                <p className="text-[10px] text-slate-400 font-mono">Reference LB-00{selectedOrder?.id}</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                                <FontAwesomeIcon icon={faClose} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            {modalLoading ? (
                                <div className="h-full flex items-center justify-center text-slate-300 italic text-xs">Đang tải...</div>
                            ) : selectedOrder && (
                                <>
                                    <div className="space-y-6">
                                        <div className="border-l-4 border-slate-900 pl-4 py-1">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Địa chỉ giao hàng</h4>
                                            <p className="text-sm font-bold text-slate-800">{selectedOrder.ho_ten_nguoi_nhan} • {selectedOrder.sdt_nguoi_nhan}</p>
                                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{selectedOrder.dia_chi_giao_hang}</p>
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Danh sách ấn phẩm</h4>
                                            {orderItems.map((item, idx) => (
                                                <div key={idx} className="flex gap-4 p-2 hover:bg-slate-50 rounded transition-colors">
                                                    <div className="w-12 h-16 bg-slate-100 rounded overflow-hidden flex-shrink-0 border border-slate-200">
                                                        <img src={getImageUrl(item.hinh_anh)} className="w-full h-full object-cover" alt={item.ten_sach} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-bold text-slate-800 truncate uppercase leading-tight">{item.ten_sach}</p>
                                                        <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase italic">Số lượng: {item.so_luong} x {Number(item.gia_luc_mua).toLocaleString()}đ</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-6 rounded border border-slate-200 space-y-4">
                                        {selectedOrder.ma_code && (
                                            <div className="flex justify-between items-start pb-4 border-b border-dashed border-slate-200">
                                                <div>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Voucher đã dùng</span>
                                                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 uppercase">{selectedOrder.ma_code}</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Giá trị giảm</span>
                                                    <span className="text-xs font-bold text-red-500">-{selectedOrder.loai_giam === 'phan_tram' ? `${selectedOrder.voucher_value}%` : `${Number(selectedOrder.voucher_value).toLocaleString()}đ`}</span>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-slate-500 uppercase">Thanh toán qua</span>
                                            <div className="flex items-center gap-2 font-bold text-slate-700 text-xs uppercase">
                                                <FontAwesomeIcon icon={selectedOrder.phuong_thuc_thanh_toan === 'vnpay' ? faCreditCard : faMoneyBill} className="text-slate-400" />
                                                {selectedOrder.phuong_thuc_thanh_toan === 'vnpay' ? 'Ví điện tử VNPay' : 'Tiền mặt (COD)'}
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center border-t border-slate-200 pt-4">
                                            <span className="text-xs font-black text-slate-900 uppercase">Tổng thanh toán</span>
                                            <span className="text-xl font-mono font-black text-slate-900">{Number(selectedOrder.tong_tien).toLocaleString()}đ</span>
                                        </div>
                                        {selectedOrder.phuong_thuc_thanh_toan === 'vnpay' && selectedOrder.trang_thai_thanh_toan !== 'paid' && (
                                            <div className="p-3 bg-orange-50 border border-orange-100 rounded text-center">
                                                <p className="text-[10px] text-orange-600 font-black uppercase italic">⚠️ Khách hàng chưa hoàn tất thanh toán Online</p>
                                            </div>
                                        )}
                                        </div>
                                </>
                            )}
                        </div>

                        <div className="p-6 bg-white border-t border-slate-100 flex flex-col gap-3">
                            <div className="flex gap-2 w-full">
                                {selectedOrder?.trang_thai === 'cho_duyet' && (
                                    <button onClick={() => handleUpdateStatus(selectedOrder.id, 'da_duyet')} className="flex-1 py-3.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded hover:shadow-lg transition-all">Xác nhận đơn hàng</button>
                                )}
                                {selectedOrder?.trang_thai === 'da_duyet' && (
                                    <button onClick={() => handleUpdateStatus(selectedOrder.id, 'dang_giao')} className="flex-1 py-3.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded hover:bg-blue-700 transition-all">Bắt đầu giao hàng</button>
                                )}
                                {selectedOrder?.trang_thai === 'dang_giao' && (
                                    <button onClick={() => handleUpdateStatus(selectedOrder.id, 'da_giao')} className="flex-1 py-3.5 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded hover:bg-emerald-700 transition-all">Xác nhận đã giao</button>
                                )}
                                {selectedOrder?.trang_thai !== 'da_giao' && selectedOrder?.trang_thai !== 'da_huy' && (
                                    <button onClick={() => handleUpdateStatus(selectedOrder.id, 'da_huy')} className="px-4 py-3.5 border border-red-200 text-red-500 text-[10px] font-black uppercase rounded hover:bg-red-50 transition-all">Hủy đơn</button>
                                )}
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-full py-3 border border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded">Đóng cửa sổ</button>
                        </div>
                    </div>
                </div>
            )}

            {showCancelModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowCancelModal(false)}></div>
                    <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl p-6">
                        <h3 className="text-lg font-black text-slate-900 uppercase mb-4">Xác nhận hủy đơn hàng</h3>
                        <div className="space-y-4">
                            <textarea className="w-full border border-slate-200 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-red-500" rows="4" value={tempReason} onChange={(e) => setTempReason(e.target.value)} placeholder="Nhập lý do hủy đơn..."></textarea>
                            <div className="flex gap-3">
                                <button onClick={() => setShowCancelModal(false)} className="flex-1 py-3 text-xs font-bold text-slate-500 bg-slate-100 rounded-lg">Quay lại</button>
                                <button onClick={confirmCancelOrder} className="flex-[2] py-3 text-xs font-black text-white bg-red-500 rounded-lg uppercase shadow-lg">Xác nhận hủy</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrderManager;