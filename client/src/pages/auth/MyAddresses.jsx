import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faPlus, faTimes, faMapMarkerAlt, faTrash, faCheckCircle, 
    faCity, faBuilding, faMap, faHome, faStar, faPhone 
} from '@fortawesome/free-solid-svg-icons';
import authService from '../../services/authService';

const MyAddresses = () => {
    const [addresses, setAddresses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    
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
        districtCode: '',
        wardCode: ''
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

    const handleProvinceChange = async (e) => {
        const code = e.target.value;
        const name = e.target.options[e.target.selectedIndex].text;
        setForm({ ...form, tinh_thanh: name, quan_huyen: '', phuong_xa: '' });
        setSelectedCodes({ provinceCode: code, districtCode: '', wardCode: '' });
        
        if (code) {
            const res = await axios.get(`https://provinces.open-api.vn/api/p/${code}?depth=2`);
            setDistricts(res.data.districts);
            setWards([]);
        }
    };

    const handleDistrictChange = async (e) => {
        const code = e.target.value;
        const name = e.target.options[e.target.selectedIndex].text;
        setForm({ ...form, quan_huyen: name, phuong_xa: '' });
        setSelectedCodes({ ...selectedCodes, districtCode: code, wardCode: '' });
        
        if (code) {
            const res = await axios.get(`https://provinces.open-api.vn/api/d/${code}?depth=2`);
            setWards(res.data.wards);
        }
    };

    const handleWardChange = (e) => {
        const code = e.target.value;
        const name = e.target.options[e.target.selectedIndex].text;
        setForm({ ...form, phuong_xa: name });
        setSelectedCodes({ ...selectedCodes, wardCode: code });
    };

    const handleEditClick = async (addr) => {
        setIsEditing(true);
        setEditId(addr.id);
        setForm({
            ho_ten_nhan: addr.ho_ten_nhan,
            sdt_nhan: addr.sdt_nhan,
            tinh_thanh: addr.tinh_thanh,
            quan_huyen: addr.quan_huyen,
            phuong_xa: addr.phuong_xa,
            dia_chi_chi_tiet: addr.dia_chi_chi_tiet,
            is_default: addr.is_default === 1
        });

        const province = provinces.find(p => p.name === addr.tinh_thanh);
        if (province) {
            const dRes = await axios.get(`https://provinces.open-api.vn/api/p/${province.code}?depth=2`);
            setDistricts(dRes.data.districts);
            const district = dRes.data.districts.find(d => d.name === addr.quan_huyen);
            
            if (district) {
                const wRes = await axios.get(`https://provinces.open-api.vn/api/d/${district.code}?depth=2`);
                setWards(wRes.data.wards);
                const ward = wRes.data.wards.find(w => w.name === addr.phuong_xa);
                
                setSelectedCodes({
                    provinceCode: province.code,
                    districtCode: district.code,
                    wardCode: ward ? ward.code : ''
                });
            }
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = isEditing 
                ? await authService.updateAddress(editId, form)
                : await authService.addAddress(form);

            if (res.success) {
                toast.success(isEditing ? '🎉 Cập nhật thành công!' : '🎉 Thêm địa chỉ mới thành công!');
                closeModal();
                fetchAddresses();
            }
        } catch (error) {
            toast.error(isEditing ? 'Lỗi cập nhật' : 'Lỗi thêm địa chỉ');
        } finally { setLoading(false); }
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setEditId(null);
        setForm({ ho_ten_nhan: '', sdt_nhan: '', tinh_thanh: '', quan_huyen: '', phuong_xa: '', dia_chi_chi_tiet: '', is_default: false });
        setSelectedCodes({ provinceCode: '', districtCode: '', wardCode: '' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) {
            try {
                const res = await authService.deleteAddress(id);
                if (res.success) {
                    setAddresses(addresses.filter(addr => addr.id !== id));
                    toast.success('Đã xóa địa chỉ');
                }
            } catch (error) { toast.error('Lỗi xóa địa chỉ'); }
        }
    };

    const handleSetDefault = async (id) => {
        try {
            const res = await authService.setDefaultAddress(id);
            if (res.success) {
                toast.success('Đã thay đổi địa chỉ mặc định');
                fetchAddresses();
            }
        } catch (error) { toast.error('Lỗi thiết lập mặc định'); }
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
                    onClick={() => { setIsEditing(false); setShowModal(true); }} 
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
                        className={`relative p-6 rounded-2xl border-2 transition-all duration-300 group ${
                            addr.is_default 
                            ? 'border-brand-primary bg-[#fffbf7] shadow-md' 
                            : 'border-transparent bg-white shadow-sm hover:shadow-md hover:border-gray-100'
                        }`}
                    >
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                    <h4 className="font-heading font-bold text-text-primary text-lg">{addr.ho_ten_nhan}</h4>
                                    {addr.is_default === 1 && (
                                        <span className="bg-brand-primary text-white text-[10px] px-2 py-1 rounded-md uppercase font-bold tracking-wider">Mặc định</span>
                                    )}
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
                                        <p className="text-gray-600 text-sm leading-relaxed font-medium">{addr.dia_chi_chi_tiet}</p>
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
                                <button 
                                    onClick={() => handleEditClick(addr)}
                                    className="flex-1 md:flex-none px-4 py-2 text-xs font-bold text-gray-500 bg-gray-50 hover:bg-white hover:text-brand-primary border border-transparent hover:border-gray-100 rounded-lg transition-all"
                                >
                                    Cập nhật
                                </button>
                                <button 
                                    onClick={() => handleDelete(addr.id)} 
                                    className="flex-1 md:flex-none px-4 py-2 text-xs font-bold text-red-400 bg-red-50 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                >
                                    Xóa bỏ
                                </button>
                                {addr.is_default === 0 && (
                                    <button 
                                        onClick={() => handleSetDefault(addr.id)}
                                        className="flex-1 md:flex-none px-4 py-2 text-xs font-bold text-brand-primary border border-brand-primary/20 hover:bg-brand-primary hover:text-white rounded-lg transition-all"
                                    >
                                        Mặc định
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-4xl text-gray-300 mb-4" />
                        <h4 className="text-lg font-bold text-gray-600">Danh sách trống</h4>
                        <button onClick={() => setShowModal(true)} className="text-brand-primary font-bold hover:underline mt-2">Thêm ngay +</button>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-[#fdfbf9]">
                            <div>
                                <h3 className="text-xl font-heading font-bold text-brand-primary">
                                    {isEditing ? 'Chỉnh Sửa Địa Chỉ' : 'Thêm Địa Chỉ Mới'}
                                </h3>
                            </div>
                            <button onClick={closeModal} className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all">
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        
                        <div className="p-8 overflow-y-auto">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Họ và tên người nhận</label>
                                        <input 
                                            type="text" 
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-brand-primary outline-none transition-all"
                                            value={form.ho_ten_nhan} 
                                            onChange={e => setForm({...form, ho_ten_nhan: e.target.value})} 
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Số điện thoại</label>
                                        <input 
                                            type="text" 
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-brand-primary outline-none transition-all"
                                            value={form.sdt_nhan} 
                                            onChange={e => setForm({...form, sdt_nhan: e.target.value})} 
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="p-5 bg-[#f9f9f9] rounded-2xl border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <select 
                                        className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none"
                                        onChange={handleProvinceChange}
                                        value={selectedCodes.provinceCode}
                                        required
                                    >
                                        <option value="" disabled>Tỉnh/Thành</option>
                                        {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                                    </select>

                                    <select 
                                        className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none disabled:bg-gray-100"
                                        onChange={handleDistrictChange}
                                        value={selectedCodes.districtCode}
                                        disabled={!selectedCodes.provinceCode}
                                        required
                                    >
                                        <option value="" disabled>Quận/Huyện</option>
                                        {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                                    </select>

                                    <select 
                                        className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm outline-none disabled:bg-gray-100"
                                        onChange={handleWardChange}
                                        value={selectedCodes.wardCode}
                                        disabled={!selectedCodes.districtCode}
                                        required
                                    >
                                        <option value="" disabled>Phường/Xã</option>
                                        {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Địa chỉ cụ thể</label>
                                    <textarea 
                                        rows="2" 
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-brand-primary outline-none transition-all resize-none"
                                        value={form.dia_chi_chi_tiet} 
                                        onChange={e => setForm({...form, dia_chi_chi_tiet: e.target.value})} 
                                        required
                                    ></textarea>
                                </div>
                                
                                <div className="flex items-center gap-3 p-4 border border-brand-primary/20 bg-brand-primary/5 rounded-xl cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        id="default_addr"
                                        className="h-5 w-5 cursor-pointer"
                                        checked={form.is_default} 
                                        onChange={e => setForm({...form, is_default: e.target.checked})} 
                                    />
                                    <label htmlFor="default_addr" className="text-sm font-bold text-brand-primary cursor-pointer">Đặt làm mặc định</label>
                                </div>

                                <div className="flex gap-4">
                                    <button type="button" onClick={closeModal} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-all">Quay Lại</button>
                                    <button 
                                        type="submit" 
                                        disabled={loading} 
                                        className="flex-[2] py-3 bg-brand-primary text-white font-bold rounded-xl shadow-lg hover:bg-brand-dark transition-all disabled:opacity-50"
                                    >
                                        {loading ? 'Đang Xử Lý...' : (isEditing ? 'Cập Nhật Ngay' : 'Hoàn Thành')}
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