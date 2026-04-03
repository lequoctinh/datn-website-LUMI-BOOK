import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSearch, faPlus, faEdit, faTrash, faTimes, 
    faSave, faTicketAlt, faCircleCheck, faClock, faBan 
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
                // Đảm bảo không bị null để tránh lỗi "controlled input"
                gia_tri_toi_da: voucher.gia_tri_toi_da || '', 
                don_hang_toi_thieu: voucher.don_hang_toi_thieu || 0,
                nguoi_dung_id: voucher.nguoi_dung_id || '',
                // Định dạng lại ngày để hiển thị đúng trong <input type="date" />
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
            // Chuẩn hóa dữ liệu trước khi gửi đi
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
        const styles = {
            hoat_dong: 'bg-green-100 text-green-700',
            het_han: 'bg-orange-100 text-orange-700',
            an: 'bg-gray-100 text-gray-700'
        };
        const labels = { hoat_dong: 'Đang chạy', het_han: 'Hết hạn', an: 'Đang ẩn' };
        return <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${styles[status]}`}>{labels[status]}</span>;
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[calc(100vh-100px)] font-sans">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight">
                    <FontAwesomeIcon icon={faTicketAlt} className="mr-2 text-brand-primary" />
                    Quản Lý Mã Khuyến Mãi
                </h2>
                <button onClick={() => openModal()} className="bg-brand-primary text-white px-5 py-2.5 rounded-xl font-black flex items-center gap-2 hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/20 uppercase text-sm">
                    <FontAwesomeIcon icon={faPlus} /> Tạo mã mới
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 uppercase text-[11px] tracking-wider">
                            <th className="p-4 font-black border-b">Mã Code</th>
                            <th className="p-4 font-black border-b">Loại & Giá trị</th>
                            <th className="p-4 font-black border-b">Đã dùng</th>
                            <th className="p-4 font-black border-b">Thời hạn</th>
                            <th className="p-4 font-black border-b">Đối tượng</th>
                            <th className="p-4 font-black border-b">Trạng thái</th>
                            <th className="p-4 font-black border-b text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7" className="text-center py-20 font-medium text-gray-400">Đang tải dữ liệu...</td></tr>
                        ) : vouchers.length === 0 ? (
                            <tr><td colSpan="7" className="text-center py-20 font-medium text-gray-400">Chưa có mã khuyến mãi nào</td></tr>
                        ) : vouchers.map((v) => (
                            <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="p-4 font-black text-brand-primary tracking-wider uppercase">{v.ma_code}</td>
                                <td className="p-4">
                                    <div className="font-bold text-gray-800">
                                        {v.loai_giam === 'phan_tram' ? `${v.gia_tri}%` : `${Number(v.gia_tri).toLocaleString()}đ`}
                                    </div>
                                    <div className="text-[10px] text-gray-400 font-medium">Tối thiểu: {Number(v.don_hang_toi_thieu).toLocaleString()}đ</div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                            <div 
                                                className="bg-brand-primary h-full" 
                                                style={{ width: `${Math.min((v.da_su_dung / v.so_luong) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-[11px] font-bold text-gray-600">{v.da_su_dung}/{v.so_luong}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-[11px] text-gray-500 leading-relaxed font-medium">
                                    <div className="flex items-center gap-1"><FontAwesomeIcon icon={faClock} className="text-[9px] text-green-500" /> {new Date(v.ngay_bat_dau).toLocaleDateString('vi-VN')}</div>
                                    <div className="flex items-center gap-1"><FontAwesomeIcon icon={faBan} className="text-[9px] text-red-500" /> {new Date(v.ngay_ket_thuc).toLocaleDateString('vi-VN')}</div>
                                </td>
                                <td className="p-4">
                                    <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter">
                                        {v.loai_ma === 'cong_khai' ? 'Tất cả' : v.loai_ma === 'nguoi_moi' ? 'Người mới' : 'Tri ân'}
                                    </span>
                                </td>
                                <td className="p-4">{getStatusBadge(v.trang_thai)}</td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-1">
                                        <button onClick={() => openModal(v)} className="text-blue-500 hover:bg-blue-50 w-8 h-8 rounded-lg transition-all flex items-center justify-center"><FontAwesomeIcon icon={faEdit} /></button>
                                        <button onClick={() => handleDelete(v.id)} className="text-red-500 hover:bg-red-50 w-8 h-8 rounded-lg transition-all flex items-center justify-center"><FontAwesomeIcon icon={faTrash} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                        <div className="p-5 border-b flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-black text-gray-800 uppercase flex items-center gap-2">
                                <FontAwesomeIcon icon={faTicketAlt} className="text-brand-primary" />
                                {editId ? 'Cập nhật mã giảm giá' : 'Tạo mã khuyến mãi mới'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-5">
                                    <div>
                                        <label className="text-[11px] font-black uppercase text-gray-400 mb-1.5 block">Mã Code *</label>
                                        <input 
                                            type="text" required 
                                            value={formData.ma_code} 
                                            onChange={e => setFormData({...formData, ma_code: e.target.value.toUpperCase()})} 
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-brand-primary font-black uppercase tracking-widest text-brand-primary" 
                                            placeholder="VD: LUMIBOOK2026" 
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[11px] font-black uppercase text-gray-400 mb-1.5 block">Loại giảm</label>
                                            <select value={formData.loai_giam} onChange={e => setFormData({...formData, loai_giam: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-brand-primary font-bold">
                                                <option value="phan_tram">Phần trăm (%)</option>
                                                <option value="tien_mat">Tiền mặt (đ)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-black uppercase text-gray-400 mb-1.5 block">Giá trị *</label>
                                            <input type="number" required value={formData.gia_tri} onChange={e => setFormData({...formData, gia_tri: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-brand-primary font-bold" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[11px] font-black uppercase text-gray-400 mb-1.5 block">Giảm tối đa (đ)</label>
                                            <input type="number" value={formData.gia_tri_toi_da} onChange={e => setFormData({...formData, gia_tri_toi_da: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-brand-primary font-bold" placeholder="0 = Không giới hạn" />
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-black uppercase text-gray-400 mb-1.5 block">Đơn tối thiểu (đ)</label>
                                            <input type="number" value={formData.don_hang_toi_thieu} onChange={e => setFormData({...formData, don_hang_toi_thieu: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-brand-primary font-bold" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-black uppercase text-gray-400 mb-1.5 block">Trạng thái mã</label>
                                        <select value={formData.trang_thai} onChange={e => setFormData({...formData, trang_thai: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-brand-primary font-bold">
                                            <option value="hoat_dong">Kích hoạt (Đang chạy)</option>
                                            <option value="an">Ẩn (Tạm ngưng)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[11px] font-black uppercase text-gray-400 mb-1.5 block text-green-600">Ngày bắt đầu</label>
                                            <input type="date" required value={formData.ngay_bat_dau} onChange={e => setFormData({...formData, ngay_bat_dau: e.target.value})} className="w-full p-3 bg-green-50/30 border border-green-100 rounded-2xl outline-none focus:border-green-500 font-bold" />
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-black uppercase text-gray-400 mb-1.5 block text-red-600">Ngày kết thúc</label>
                                            <input type="date" required value={formData.ngay_ket_thuc} onChange={e => setFormData({...formData, ngay_ket_thuc: e.target.value})} className="w-full p-3 bg-red-50/30 border border-red-100 rounded-2xl outline-none focus:border-red-500 font-bold" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[11px] font-black uppercase text-gray-400 mb-1.5 block">Tổng số lượng mã</label>
                                            <input type="number" required value={formData.so_luong} onChange={e => setFormData({...formData, so_luong: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-brand-primary font-bold" />
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-black uppercase text-gray-400 mb-1.5 block">Lượt dùng/Khách</label>
                                            <input type="number" required value={formData.gioi_han_moi_user} onChange={e => setFormData({...formData, gioi_han_moi_user: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-brand-primary font-bold" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-black uppercase text-gray-400 mb-1.5 block">Áp dụng cho</label>
                                        <select value={formData.loai_ma} onChange={e => setFormData({...formData, loai_ma: e.target.value})} className="w-full p-3 bg-blue-50 border border-blue-100 rounded-2xl outline-none focus:border-brand-primary font-bold text-blue-700">
                                            <option value="cong_khai">Công khai (Tất cả khách hàng)</option>
                                            <option value="nguoi_moi">Người mới (Đơn hàng đầu tiên)</option>
                                            <option value="tri_an">Tri ân (Chỉ định khách hàng)</option>
                                        </select>
                                    </div>

                                    {formData.loai_ma === 'tri_an' && (
                                        <div className="animate-fade-in">
                                            <label className="text-[11px] font-black uppercase text-blue-600 mb-1.5 block">Chọn khách hàng</label>
                                            <select required value={formData.nguoi_dung_id} onChange={e => setFormData({...formData, nguoi_dung_id: e.target.value})} className="w-full p-3 bg-yellow-50 border border-yellow-200 rounded-2xl outline-none focus:border-yellow-500 font-bold text-gray-700">
                                                <option value="">-- Tìm khách hàng --</option>
                                                {users.map(u => <option key={u.id} value={u.id}>{u.ho_ten} - {u.email}</option>)}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-10">
                                <button type="button" onClick={() => setShowModal(false)} className="px-8 py-3 text-gray-500 font-black uppercase text-xs hover:bg-gray-100 rounded-2xl transition-all">Hủy</button>
                                <button type="submit" className="px-12 py-3 bg-brand-primary text-white font-black rounded-2xl shadow-xl shadow-brand-primary/30 uppercase text-xs hover:bg-brand-dark hover:-translate-y-0.5 transition-all flex items-center gap-2">
                                    <FontAwesomeIcon icon={faSave} />
                                    {editId ? 'Lưu thay đổi' : 'Xác nhận tạo'}
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