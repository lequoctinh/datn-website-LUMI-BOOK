import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faEye, faEyeSlash, faTimes, faSave, faCloudUploadAlt, faTag, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import bannerService from '../services/bannerService';

const BannerManager = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [formData, setFormData] = useState({
        tieu_de: '',
        danh_muc: '',
        noi_dung: '',
        gia_ban: '',
        gia_giam: '',
        hinh_anh: null,
        trang_thai: 'hien_thi'
    });

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        setLoading(true);
        try {
            const res = await bannerService.getAll();
            if (res.success) setBanners(res.data);
        } catch (error) {
            toast.error('Lỗi khi tải danh sách banner');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, hinh_anh: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const openModal = (banner = null) => {
        if (banner) {
            setEditId(banner.id);
            setFormData({
                tieu_de: banner.tieu_de || '',
                danh_muc: banner.danh_muc || '',
                noi_dung: banner.noi_dung || '',
                gia_ban: banner.gia_ban || '',
                gia_giam: banner.gia_giam || '',
                trang_thai: banner.trang_thai || 'hien_thi',
                hinh_anh: null
            });
            setPreviewImage(`http://localhost:5000/uploads/banner/${banner.hinh_anh}`);
        } else {
            setEditId(null);
            setFormData({ 
                tieu_de: '', 
                danh_muc: '', 
                noi_dung: '', 
                gia_ban: '', 
                gia_giam: '', 
                trang_thai: 'hien_thi',
                hinh_anh: null 
            });
            setPreviewImage(null);
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = new FormData();
        data.append('tieu_de', formData.tieu_de || '');
        data.append('danh_muc', formData.danh_muc || '');
        data.append('noi_dung', formData.noi_dung || '');
        data.append('gia_ban', formData.gia_ban || 0);
        data.append('gia_giam', formData.gia_giam || 0);
        data.append('trang_thai', formData.trang_thai);
        
        if (formData.hinh_anh) {data.append('hinh_anh_banner', formData.hinh_anh);
        }

        try {
            let res;
            if (editId) {
                res = await bannerService.update(editId, data);
            } else {
                res = await bannerService.create(data);
            }

            if (res.success) {
                toast.success(editId ? 'Cập nhật banner thành công' : 'Thêm banner thành công');
                setShowModal(false);
                fetchBanners();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi lưu dữ liệu');
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const res = await bannerService.toggleStatus(id);
            if (res.success) {
                toast.success(res.message);
                fetchBanners();
            }
        } catch (error) {
            toast.error('Không thể thay đổi trạng thái');
        }
    };

    const formatVND = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };
return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[calc(100vh-100px)] animate-fade-in-down">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-heading font-bold text-gray-800">Quản Lý Banner</h2>
                <button onClick={() => openModal()} className="bg-brand-primary text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-dark transition-colors shadow-lg shadow-brand-primary/30">
                    <FontAwesomeIcon icon={faPlus} /> Thêm Banner
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200">
                            <th className="p-4 font-bold rounded-tl-lg w-32">Hình ảnh</th>
                            <th className="p-4 font-bold">Thông tin chi tiết</th>
                            <th className="p-4 font-bold text-center">Giá hiển thị</th>
                            <th className="p-4 font-bold text-center w-32">Trạng thái</th>
                            <th className="p-4 font-bold text-right rounded-tr-lg w-32">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm">
                        {loading ? (
                            <tr><td colSpan="5" className="text-center py-10">Đang tải dữ liệu...</td></tr>
                        ) : banners.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-10">Chưa có banner nào</td></tr>
                        ) : banners.map((banner) => (
                            <tr key={banner.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="p-4">
                                    <img 
                                        src={`http://localhost:5000/uploads/banner/${banner.hinh_anh}`} 
                                        className="w-24 h-12 object-cover rounded-lg border shadow-sm bg-gray-100" 
                                        alt="banner"
                                    />
                                </td>
                                <td className="p-4">
                                    <div className="text-[10px] font-bold text-brand-primary uppercase tracking-wider mb-1">
                                        {banner.danh_muc || 'CHƯA CÓ DANH MỤC'}
                                    </div>
                                    <div className="font-bold text-gray-800 text-base">{banner.tieu_de || 'N/A'}</div>
                                    <div className="text-xs text-gray-400 line-clamp-1 italic">{banner.noi_dung}</div>
                                    </td>
                                <td className="p-4 text-center">
                                    <div className="font-bold text-emerald-600">
                                        {formatVND(banner.gia_giam > 0 ? banner.gia_giam : banner.gia_ban)}
                                    </div>
                                    {banner.gia_giam > 0 && (
                                        <div className="text-[10px] text-gray-400 line-through">
                                            {formatVND(banner.gia_ban)}
                                        </div>
                                    )}
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${banner.trang_thai === 'hien_thi' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                        {banner.trang_thai === 'hien_thi' ? 'Đang hiện' : 'Đang ẩn'}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => handleToggleStatus(banner.id)} 
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${banner.trang_thai === 'hien_thi' ? 'bg-amber-50 text-amber-500 hover:bg-amber-500 hover:text-white' : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}
                                            title={banner.trang_thai === 'hien_thi' ? 'Ẩn banner' : 'Hiện banner'}
                                        >
                                            <FontAwesomeIcon icon={banner.trang_thai === 'hien_thi' ? faEyeSlash : faEye} />
                                        </button>
                                        <button 
                                            onClick={() => openModal(banner)} 
                                            className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors flex items-center justify-center"
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
{showModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-slide-down my-auto">
                        <div className="p-5 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
                            <h3 className="text-lg font-bold text-gray-800">{editId ? 'Cập Nhật Banner' : 'Thêm Banner Mới'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Hình ảnh banner <span className="text-red-500">*</span></label>
                                    <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-2 text-center hover:border-brand-primary transition-colors cursor-pointer">
                                        {previewImage ? (
                                            <div className="relative group">
                                                <img src={previewImage} className="w-full h-48 object-cover rounded-lg" alt="preview" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity">
                                                    <span className="text-white text-xs font-bold">Thay đổi ảnh</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="py-12 text-gray-400">
                                                <FontAwesomeIcon icon={faCloudUploadAlt} size="2x" className="mb-2" />
                                                <p className="text-xs">Nhấn để tải lên ảnh (Tỷ lệ 3:1)</p>
                                            </div>
                                        )}
                                        <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                    </div>
                                </div>
<div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Tiêu đề banner</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.tieu_de} 
                                        onChange={e => setFormData({...formData, tieu_de: e.target.value})}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all" 
                                        placeholder="Ví dụ: Tâm Lý Học Về Tiền"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Danh mục hiển thị</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3.5 text-gray-400 text-xs">
                                            <FontAwesomeIcon icon={faTag} />
                                        </span>
                                        <input 
                                            type="text" 
                                            value={formData.danh_muc} 
                                            onChange={e => setFormData({...formData, danh_muc: e.target.value})}
                                            className="w-full p-3 pl-8 border border-gray-200 rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all" 
                                            placeholder="Ví dụ: TÀI CHÍNH CÁ NHÂN"
                                        />
                                    </div>
                                </div>
<div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1 text-red-600">Giá gốc (VNĐ)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3.5 text-gray-400 text-xs">
                                            <FontAwesomeIcon icon={faDollarSign} />
                                        </span>
                                        <input 
                                            type="number" 
                                            value={formData.gia_ban} 
                                            onChange={e => setFormData({...formData, gia_ban: e.target.value})}
                                            className="w-full p-3 pl-8 border border-gray-200 rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all" 
                                            placeholder="159000"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1 text-emerald-600">Giá khuyến mãi (VNĐ)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3.5 text-gray-400 text-xs">
                                            <FontAwesomeIcon icon={faDollarSign} />
                                        </span>
                                        <input 
                                            type="number" 
                                            value={formData.gia_giam} 
                                            onChange={e => setFormData({...formData, gia_giam: e.target.value})}
                                            className="w-full p-3 pl-8 border border-gray-200 rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all" 
                                            placeholder="Để trống nếu không giảm giá"
                                        />
                                    </div>
                                </div>
<div className="md:col-span-1">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Trạng thái ban đầu</label>
                                    <select 
                                        value={formData.trang_thai}
                                        onChange={e => setFormData({...formData, trang_thai: e.target.value})}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                                    >
                                        <option value="hien_thi">Hiển thị ngay</option>
                                        <option value="an">Tạm ẩn</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Mô tả tóm tắt</label>
                                    <textarea 
                                        rows="2"
                                        value={formData.noi_dung} 
                                        onChange={e => setFormData({...formData, noi_dung: e.target.value})}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all resize-none" 
                                        placeholder="Mô tả ngắn gọn về cuốn sách hoặc chương trình..."
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors">
                                    Hủy bỏ
                                </button>
                                <button type="submit" className="px-6 py-2.5 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-dark transition-colors flex items-center gap-2 shadow-lg shadow-brand-primary/30">
                                    <FontAwesomeIcon icon={faSave} /> {editId ? 'Lưu thay đổi' : 'Tạo banner'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BannerManager;