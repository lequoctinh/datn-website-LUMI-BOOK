import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faPlus, faTimes, faMapMarkerAlt, faTrash, faCheckCircle, 
    faCity, faBuilding, faMap, faHome, faStar, faPhone // <-- Đã thêm faPhone vào đây
} from '@fortawesome/free-solid-svg-icons';
import authService from '../../services/authService';

const MyAddresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [form, setForm] = useState({
        ho_ten_nhan: '', sdt_nhan: '', 
        tinh_thanh: '', quan_huyen: '', phuong_xa: '', 
        dia_chi_chi_tiet: '', is_default: false
    });

    const [selectedCodes, setSelectedCodes] = useState({
        provinceCode: '',
        districtCode: ''
    });

    useEffect(() => {
        fetchAddresses();
        fetchProvinces();
    }, []);

    const fetchAddresses = async () => {
        try {
            const res = await authService.getAddresses();
            if (res.success) setAddresses(res.data);
        } catch (error) { console.error(error); }
    };

    const fetchProvinces = async () => {
        try {
            const res = await axios.get('https://provinces.open-api.vn/api/?depth=1');
            setProvinces(res.data);
        } catch (error) { console.error("Lỗi lấy tỉnh thành", error); }
    };

    const fetchDistricts = async (provinceCode) => {
        try {
            const res = await axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
            setDistricts(res.data.districts);
        } catch (error) { console.error("Lỗi lấy quận huyện", error); }
    };

    const fetchWards = async (districtCode) => {
        try {
            const res = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
            setWards(res.data.wards);
        } catch (error) { console.error("Lỗi lấy phường xã", error); }
    };

    const handleProvinceChange = (e) => {
        const code = e.target.value;
        const index = e.target.selectedIndex;
        const name = e.target.options[index].text;

        setForm({ ...form, tinh_thanh: name, quan_huyen: '', phuong_xa: '' });
        setSelectedCodes({ ...selectedCodes, provinceCode: code, districtCode: '' });
        setDistricts([]);
        setWards([]);
        if (code) fetchDistricts(code);
    };

    const handleDistrictChange = (e) => {
        const code = e.target.value;
        const index = e.target.selectedIndex;
        const name = e.target.options[index].text;

        setForm({ ...form, quan_huyen: name, phuong_xa: '' });
        setSelectedCodes({ ...selectedCodes, districtCode: code });
        setWards([]);
        if (code) fetchWards(code);
    };

    const handleWardChange = (e) => {
        const index = e.target.selectedIndex;
        const name = e.target.options[index].text;
        setForm({ ...form, phuong_xa: name });
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await authService.addAddress(form);
            if (res.success) {
                toast.success('🎉 Thêm địa chỉ mới thành công!');
                setShowModal(false);
                fetchAddresses();
                setForm({ ho_ten_nhan: '', sdt_nhan: '', tinh_thanh: '', quan_huyen: '', phuong_xa: '', dia_chi_chi_tiet: '', is_default: false });
                setSelectedCodes({ provinceCode: '', districtCode: '' });
            }
        } catch (error) {
            toast.error('Lỗi thêm địa chỉ');
        } finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) {
            try {
                await authService.deleteAddress(id);
                setAddresses(addresses.filter(addr => addr.id !== id));
                toast.success('Đã xóa địa chỉ');
            } catch (error) { toast.error('Lỗi xóa địa chỉ'); }
        }
    };

    return (
        <div className="animate-fade-in-down h-full flex flex-col">
            <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
                <div>
                    <h3 className="text-2xl font-heading font-bold text-brand-primary relative inline-block">
                        Sổ Địa Chỉ
                        <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-brand-primary/20 rounded-full"></span>
                    </h3>
                    <p className="text-sm text-text-muted mt-2">Quản lý nơi nhận hàng của bạn</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)} 
                    className="group bg-brand-primary text-white px-5 py-3 rounded-xl text-sm font-bold shadow-lg shadow-brand-primary/30 hover:bg-brand-dark hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
                >
                    <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform">
                        <FontAwesomeIcon icon={faPlus} className="text-xs" />
                    </div>
                    Thêm Địa Chỉ Mới
                </button>
            </div>

            <div className="grid grid-cols-1 gap-5">
                {addresses.length > 0 ? addresses.map(addr => (
                    <div 
                        key={addr.id} 
                        className={`relative p-6 rounded-2xl border-2 transition-all duration-300 group overflow-hidden ${
                            addr.is_default 
                            ? 'border-brand-primary bg-[#fffbf7] shadow-md' 
                            : 'border-transparent bg-white shadow-sm hover:shadow-md hover:border-gray-100'
                        }`}
                    >
                        {addr.is_default === 1 && (
                            <div className="absolute top-0 right-0">
                                <div className="bg-brand-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm flex items-center gap-1">
                                    <FontAwesomeIcon icon={faStar} /> Mặc định
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col md:flex-row justify-between items-start gap-4 relative z-10">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <h4 className="font-heading font-bold text-text-primary text-lg">{addr.ho_ten_nhan}</h4>
                                    <div className="h-4 w-[1px] bg-gray-300"></div>
                                    <span className="text-text-secondary font-medium text-sm flex items-center gap-1">
                                        <FontAwesomeIcon icon={faPhone} className="text-xs text-gray-400" />
                                        {addr.sdt_nhan}
                                    </span>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-500 text-xs">
                                            <FontAwesomeIcon icon={faHome} />
                                        </div>
                                        <p className="text-gray-600 text-sm leading-relaxed font-medium">
                                            {addr.dia_chi_chi_tiet}
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 w-6 h-6 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 text-green-500 text-xs">
                                            <FontAwesomeIcon icon={faMap} />
                                        </div>
                                        <p className="text-gray-500 text-sm leading-relaxed">
                                            {addr.phuong_xa}, {addr.quan_huyen}, {addr.tinh_thanh}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto pt-4 md:pt-0 border-t md:border-none border-gray-100">
                                <button className="flex-1 md:flex-none px-4 py-2 text-xs font-bold text-gray-500 bg-gray-50 hover:bg-white hover:text-brand-primary hover:shadow-sm border border-transparent hover:border-gray-100 rounded-lg transition-all">
                                    Cập nhật
                                </button>
                                <button 
                                    onClick={() => handleDelete(addr.id)} 
                                    className="flex-1 md:flex-none px-4 py-2 text-xs font-bold text-red-400 bg-red-50 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                >
                                    Xóa bỏ
                                </button>
                                {addr.is_default === 0 && (
                                    <button className="flex-1 md:flex-none px-4 py-2 text-xs font-bold text-brand-primary border border-brand-primary/20 hover:bg-brand-primary hover:text-white rounded-lg transition-all">
                                        Thiết lập mặc định
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-4xl text-gray-300" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-600">Danh sách trống</h4>
                        <p className="text-gray-400 text-sm mb-6">Bạn chưa lưu địa chỉ nhận hàng nào.</p>
                        <button onClick={() => setShowModal(true)} className="text-brand-primary font-bold hover:underline">Thêm ngay +</button>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-slide-down flex flex-col max-h-[70vh]">
                        <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-[#fdfbf9]">
                            <div>
                                <h3 className="text-xl font-heading font-bold text-brand-primary">Thêm Địa Chỉ Mới</h3>
                                <p className="text-xs text-gray-500 mt-1">Vui lòng điền chính xác để giao hàng nhanh nhất</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        
                        <div className="p-8 overflow-y-auto custom-scrollbar">
                            <form onSubmit={handleAdd} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="group relative">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Họ và tên người nhận</label>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 focus:outline-none transition-all font-medium text-gray-700 placeholder-gray-400" 
                                                placeholder="VD: Nguyễn Văn A"
                                                value={form.ho_ten_nhan} 
                                                onChange={e => setForm({...form, ho_ten_nhan: e.target.value})} 
                                                required 
                                            />
                                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                                <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">
                                                    <FontAwesomeIcon icon={faCheckCircle} className="text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="group">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Số điện thoại</label>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 focus:outline-none transition-all font-medium text-gray-700 placeholder-gray-400" 
                                                placeholder="VD: 098xxx"
                                                value={form.sdt_nhan} 
                                                onChange={e => setForm({...form, sdt_nhan: e.target.value})} 
                                                required 
                                            />
                                            <FontAwesomeIcon icon={faPhone} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 bg-[#f9f9f9] rounded-2xl border border-gray-100 space-y-4">
                                    <label className="text-xs font-bold text-brand-primary uppercase tracking-wider block mb-1">
                                        <FontAwesomeIcon icon={faMap} className="mr-1" /> Khu vực hành chính
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="relative">
                                            <select 
                                                className="w-full appearance-none pl-9 pr-8 py-3 bg-white border border-gray-200 rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none text-sm font-medium text-gray-700 cursor-pointer hover:border-gray-300 transition-colors"
                                                onChange={handleProvinceChange}
                                                required
                                                defaultValue=""
                                            >
                                                <option value="" disabled>Chọn Tỉnh/Thành</option>
                                                {provinces.map(p => (
                                                    <option key={p.code} value={p.code}>{p.name}</option>
                                                ))}
                                            </select>
                                            <FontAwesomeIcon icon={faCity} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                        </div>

                                        <div className="relative">
                                            <select 
                                                className="w-full appearance-none pl-9 pr-8 py-3 bg-white border border-gray-200 rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none text-sm font-medium text-gray-700 cursor-pointer hover:border-gray-300 transition-colors disabled:bg-gray-100 disabled:text-gray-400"
                                                onChange={handleDistrictChange}
                                                required
                                                disabled={!selectedCodes.provinceCode}
                                                defaultValue=""
                                            >
                                                <option value="" disabled>Chọn Quận/Huyện</option>
                                                {districts.map(d => (
                                                    <option key={d.code} value={d.code}>{d.name}</option>
                                                ))}
                                            </select>
                                            <FontAwesomeIcon icon={faBuilding} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                        </div>

                                        <div className="relative">
                                            <select 
                                                className="w-full appearance-none pl-9 pr-8 py-3 bg-white border border-gray-200 rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 outline-none text-sm font-medium text-gray-700 cursor-pointer hover:border-gray-300 transition-colors disabled:bg-gray-100 disabled:text-gray-400"
                                                onChange={handleWardChange}
                                                required
                                                disabled={!selectedCodes.districtCode}
                                                defaultValue=""
                                            >
                                                <option value="" disabled>Chọn Phường/Xã</option>
                                                {wards.map(w => (
                                                    <option key={w.code} value={w.code}>{w.name}</option>
                                                ))}
                                            </select>
                                            <FontAwesomeIcon icon={faMapMarkerAlt} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Địa chỉ cụ thể</label>
                                    <div className="relative">
                                        <textarea 
                                            rows="2" 
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 focus:outline-none transition-all font-medium text-gray-700 resize-none" 
                                            placeholder="Số nhà, tên đường, tòa nhà..." 
                                            value={form.dia_chi_chi_tiet} 
                                            onChange={e => setForm({...form, dia_chi_chi_tiet: e.target.value})} 
                                            required
                                        ></textarea>
                                        <FontAwesomeIcon icon={faHome} className="absolute left-4 top-4 text-gray-400 text-sm" />
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3 p-4 border border-brand-primary/20 bg-brand-primary/5 rounded-xl cursor-pointer hover:bg-brand-primary/10 transition-colors">
                                    <div className="relative flex items-center">
                                        <input 
                                            type="checkbox" 
                                            id="default_addr"
                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 checked:bg-brand-primary checked:border-brand-primary transition-all"
                                            checked={form.is_default} 
                                            onChange={e => setForm({...form, is_default: e.target.checked})} 
                                        />
                                        <FontAwesomeIcon icon={faCheckCircle} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-xs opacity-0 peer-checked:opacity-100 pointer-events-none" />
                                    </div>
                                    <label htmlFor="default_addr" className="text-sm font-bold text-brand-primary cursor-pointer select-none">
                                        Đặt làm địa chỉ nhận hàng mặc định
                                    </label>
                                </div>

                                <div className="pt-2 flex gap-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowModal(false)} 
                                        className="flex-1 py-3.5 text-gray-500 font-bold hover:bg-gray-100 hover:text-gray-700 rounded-xl transition-colors border border-transparent"
                                    >
                                        Quay Lại
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={loading} 
                                        className="flex-[2] py-3.5 bg-brand-primary text-white font-bold rounded-xl shadow-lg shadow-brand-primary/30 hover:bg-brand-dark hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Đang Xử Lý...' : 'Hoàn Thành'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyAddresses;