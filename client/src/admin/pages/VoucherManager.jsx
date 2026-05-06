import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSearch, faPlus, faEdit, faTrash, faTimes, 
    faSave, faTicketAlt, faCheckCircle, faHistory, faStopCircle
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import voucherService from '../services/voucherService';
import customerService from '../../services/customerService'; 

const VoucherManager = () => {
    const [vouchers, setVouchers] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        ma_code: '', loai_giam: 'phan_tram', gia_tri: '', gia_tri_toi_da: '',
        don_hang_toi_thieu: 0, so_luong: 10, ngay_bat_dau: '', ngay_ket_thuc: '',
        trang_thai: 'hoat_dong', loai_ma: 'cong_khai', nguoi_dung_id: '', gioi_han_moi_user: 1
    });

    useEffect(() => {
        fetchVouchers();
        fetchUsers();
    }, []);

    const fetchVouchers = async () => {
        setLoading(true);
        try {
            const res = await voucherService.getAll();
            if (res.success) setVouchers(res.data);
        } catch (error) { 
            toast.error('Lỗi tải danh sách mã'); 
        } finally { 
            setLoading(false); 
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await customerService.getAll(); 
            if (res.success) setUsers(res.data);
        } catch (error) {
            console.error("Lỗi lấy danh sách khách hàng:", error);
        }
    };

    const openModal = (voucher = null) => {
        if (voucher) {
            setEditId(voucher.id);
            setFormData({
                ...voucher,
                gia_tri_toi_da: voucher.gia_tri_toi_da || '', 
                don_hang_toi_thieu: voucher.don_hang_toi_thieu || 0,
                nguoi_dung_id: voucher.nguoi_dung_id || '',
                ngay_bat_dau: voucher.ngay_bat_dau ? voucher.ngay_bat_dau.split('T')[0] : '',
                ngay_ket_thuc: voucher.ngay_ket_thuc ? voucher.ngay_ket_thuc.split('T')[0] : ''
            });
        } else {
            setEditId(null);
            setFormData({
                ma_code: '', loai_giam: 'phan_tram', gia_tri: '', gia_tri_toi_da: '',
                don_hang_toi_thieu: 0, so_luong: 10, ngay_bat_dau: '', ngay_ket_thuc: '',
                trang_thai: 'hoat_dong', loai_ma: 'cong_khai', nguoi_dung_id: '', gioi_han_moi_user: 1
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = {
                ...formData,
                gia_tri_toi_da: formData.gia_tri_toi_da === '' ? null : formData.gia_tri_toi_da,
                nguoi_dung_id: formData.loai_ma === 'tri_an' ? formData.nguoi_dung_id : null
            };

            const res = editId 
                ? await voucherService.update(editId, dataToSubmit) 
                : await voucherService.create(dataToSubmit);

            if (res.success) {
                toast.success(editId ? 'Cập nhật thành công' : 'Tạo mã mới thành công');
                setShowModal(false);
                fetchVouchers();
            }
        } catch (error) { 
            toast.error(error.response?.data?.message || 'Lỗi thao tác'); 
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa mã này?')) {
            try {
                const res = await voucherService.delete(id);
                if (res.success) {
                    toast.success('Xóa mã thành công');
                    fetchVouchers();
                }
            } catch (error) {
                toast.error('Không thể xóa mã đã được sử dụng trong đơn hàng');
            }
        }
    };

    const getStatusBadge = (status) => {
        const config = {
            hoat_dong: { class: 'bg-emerald-50 text-emerald-600 border-emerald-100', label: 'Đang chạy' },
            het_han: { class: 'bg-amber-50 text-amber-600 border-amber-100', label: 'Hết hạn' },
            an: { class: 'bg-slate-50 text-slate-500 border-slate-100', label: 'Đang ẩn' }
        };
        const current = config[status] || config.an;
        return <span className={`px-2.5 py-0.5 rounded border text-xs font-medium ${current.class}`}>{current.label}</span>;
    };

    return (
        <div className="p-6 bg-slate-50 min-h-screen font-sans text-slate-900">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-800 flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-600 rounded flex items-center justify-center text-white shadow-sm">
                                <FontAwesomeIcon icon={faTicketAlt} />
                            </div>
                            Quản lý Voucher
                        </h1>
                        <p className="text-slate-500 text-sm mt-1 ml-13">Thiết lập và theo dõi các chương trình khuyến mãi</p>
                    </div>
                    <button 
                        onClick={() => openModal()} 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow-sm transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                        <FontAwesomeIcon icon={faPlus} /> Thêm Voucher mới
                    </button>
                </div>

                <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-4 py-3 font-semibold text-slate-700">Mã ưu đãi</th>
                                    <th className="px-4 py-3 font-semibold text-slate-700">Mức giảm</th>
                                    <th className="px-4 py-3 font-semibold text-slate-700">Sử dụng</th>
                                    <th className="px-4 py-3 font-semibold text-slate-700">Hiệu lực</th>
                                    <th className="px-4 py-3 font-semibold text-slate-700">Đối tượng</th>
                                    <th className="px-4 py-3 font-semibold text-slate-700">Trạng thái</th>
                                    <th className="px-4 py-3 font-semibold text-slate-700 text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading ? (
                                    <tr><td colSpan="7" className="text-center py-12 text-slate-400">Đang tải dữ liệu hệ thống...</td></tr>
                                ) : vouchers.length === 0 ? (
                                    <tr><td colSpan="7" className="text-center py-12 text-slate-400">Không tìm thấy mã khuyến mãi nào</td></tr>
                                ) : vouchers.map((v) => (
                                    <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-4">
                                            <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded tracking-wider leading-none">
                                                {v.ma_code}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="font-medium text-slate-800">
                                                {v.loai_giam === 'phan_tram' ? `${v.gia_tri}%` : `${Number(v.gia_tri).toLocaleString()}đ`}
                                            </div>
                                            <div className="text-[11px] text-slate-500 mt-0.5">Tối thiểu: {Number(v.don_hang_toi_thieu).toLocaleString()}đ</div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 w-20 bg-slate-100 h-1.5 rounded-full">
                                                    <div 
                                                        className="bg-indigo-500 h-full rounded-full transition-all" 
                                                        style={{ width: `${Math.min((v.da_su_dung / v.so_luong) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-medium text-slate-600">{v.da_su_dung}/{v.so_luong}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-xs text-slate-600 space-y-1">
                                            <div className="flex items-center gap-1.5"><FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 w-3" /> {new Date(v.ngay_bat_dau).toLocaleDateString('vi-VN')}</div>
                                            <div className="flex items-center gap-1.5"><FontAwesomeIcon icon={faStopCircle} className="text-rose-400 w-3" /> {new Date(v.ngay_ket_thuc).toLocaleDateString('vi-VN')}</div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-xs font-medium text-slate-600">
                                                {v.loai_ma === 'cong_khai' ? 'Tất cả khách' : v.loai_ma === 'nguoi_moi' ? 'Người mua mới' : 'Khách chỉ định'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">{getStatusBadge(v.trang_thai)}</td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => openModal(v)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-all"><FontAwesomeIcon icon={faEdit} /></button>
                                                <button onClick={() => handleDelete(v.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all"><FontAwesomeIcon icon={faTrash} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded shadow-xl w-full max-w-3xl overflow-hidden flex flex-col border border-slate-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-semibold text-slate-800">
                                {editId ? 'Chỉnh sửa Voucher' : 'Thêm Voucher mới'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[80vh]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Mã Voucher *</label>
                                        <input 
                                            type="text" required 
                                            value={formData.ma_code} 
                                            onChange={e => setFormData({...formData, ma_code: e.target.value.toUpperCase()})} 
                                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-mono font-bold text-indigo-600" 
                                            placeholder="VD: GIAMGIA2026" 
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Loại giảm</label>
                                            <select value={formData.loai_giam} onChange={e => setFormData({...formData, loai_giam: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none focus:border-indigo-500 bg-white">
                                                <option value="phan_tram">Phần trăm (%)</option>
                                                <option value="tien_mat">Tiền mặt (đ)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Giá trị *</label>
                                            <input type="number" required value={formData.gia_tri} onChange={e => setFormData({...formData, gia_tri: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none focus:border-indigo-500" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Giảm tối đa (đ)</label>
                                            <input type="number" value={formData.gia_tri_toi_da} onChange={e => setFormData({...formData, gia_tri_toi_da: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none focus:border-indigo-500" placeholder="0 = Không giới hạn" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Đơn tối thiểu (đ)</label>
                                            <input type="number" value={formData.don_hang_toi_thieu} onChange={e => setFormData({...formData, don_hang_toi_thieu: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none focus:border-indigo-500" />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Trạng thái phát hành</label>
                                        <select value={formData.trang_thai} onChange={e => setFormData({...formData, trang_thai: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none focus:border-indigo-500 bg-white">
                                            <option value="hoat_dong">Cho phép sử dụng (Kích hoạt)</option>
                                            <option value="an">Tạm ngưng sử dụng (Ẩn)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-emerald-600 uppercase mb-1 block">Ngày bắt đầu</label>
                                            <input type="date" required value={formData.ngay_bat_dau} onChange={e => setFormData({...formData, ngay_bat_dau: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none focus:border-emerald-500" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-rose-600 uppercase mb-1 block">Ngày kết thúc</label>
                                            <input type="date" required value={formData.ngay_ket_thuc} onChange={e => setFormData({...formData, ngay_ket_thuc: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none focus:border-rose-500" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Tổng phát hành</label>
                                            <input type="number" required value={formData.so_luong} onChange={e => setFormData({...formData, so_luong: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none focus:border-indigo-500" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Lượt dùng/Khách</label>
                                            <input type="number" required value={formData.gioi_han_moi_user} onChange={e => setFormData({...formData, gioi_han_moi_user: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none focus:border-indigo-500" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Nhóm khách hàng</label>
                                        <select value={formData.loai_ma} onChange={e => setFormData({...formData, loai_ma: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none focus:border-indigo-500 bg-white">
                                            <option value="cong_khai">Công khai cho tất cả khách</option>
                                            <option value="nguoi_moi">Dành riêng cho khách hàng mới</option>
                                            <option value="tri_an">Dành cho khách hàng chỉ định</option>
                                        </select>
                                    </div>

                                    {formData.loai_ma === 'tri_an' && (
                                        <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                                            <label className="text-xs font-bold text-indigo-600 uppercase mb-1 block">Chọn khách hàng mục tiêu</label>
                                            <select required value={formData.nguoi_dung_id} onChange={e => setFormData({...formData, nguoi_dung_id: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded text-sm outline-none focus:border-indigo-500 bg-white">
                                                <option value="">-- Chọn một khách hàng --</option>
                                                {users.map(u => <option key={u.id} value={u.id}>{u.ho_ten} ({u.email})</option>)}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded transition-all">Đóng</button>
                                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 shadow-sm flex items-center gap-2 transition-all">
                                    <FontAwesomeIcon icon={faSave} />
                                    {editId ? 'Cập nhật' : 'Xác nhận lưu'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VoucherManager;