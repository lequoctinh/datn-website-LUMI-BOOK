import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUser, faLock, faSignOutAlt, faPhone, faSave, faPen, 
    faShoppingBag, faHome, faMapMarkerAlt, faExclamationTriangle,
    faEye, faEyeSlash
} from '@fortawesome/free-solid-svg-icons';
import authService from '../../services/authService';
import { useUser } from '../../context/UserContext';
import MyAddresses from './MyAddresses';

const Profile = () => {
    const { user, updateUser, logout } = useUser();
    const [activeTab, setActiveTab] = useState('info');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const [infoForm, setInfoForm] = useState({ ho_ten: '', so_dien_thoai: '', avatar_url: '' });
    const [passForm, setPassForm] = useState({ mat_khau_cu: '', mat_khau_moi: '', xac_nhan_mat_khau: '' });
    const [showPass, setShowPass] = useState({
        current: false,
        new: false,
        confirm: false
    });

    useEffect(() => {
        if (user) {
            setInfoForm({
                ho_ten: user.ho_ten || '',
                so_dien_thoai: user.so_dien_thoai || '',
                avatar_url: user.avatar_url || ''
            });
        }
    }, [user]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('avatar', file);
        try {
            const res = await authService.uploadAvatar(formData);
            if (res.success) {
                const newAvatarUrl = res.imageUrl;
                await authService.updateProfile({ ...infoForm, avatar_url: newAvatarUrl });
                updateUser({ ...user, avatar_url: newAvatarUrl });
                toast.success('📸 Đổi ảnh đại diện thành công!');
            }
        } catch (error) { toast.error('Lỗi upload ảnh'); }
    };

    const handleUpdateInfo = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await authService.updateProfile(infoForm);
            if (res.success) {
                toast.success('🎉 Cập nhật hồ sơ thành công!');
                updateUser(res.user);
            }
        } catch (error) { toast.error(error.response?.data?.message || 'Lỗi cập nhật'); }
        finally { setIsLoading(false); }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passForm.mat_khau_moi !== passForm.xac_nhan_mat_khau) return toast.error('❌ Mật khẩu xác nhận không khớp!');
        setIsLoading(true);
        try {
            const res = await authService.changePassword(passForm);
            if (res.success) {
                toast.success('🔒 Đổi mật khẩu thành công!');
                setPassForm({ mat_khau_cu: '', mat_khau_moi: '', xac_nhan_mat_khau: '' });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lỗi đổi mật khẩu');
        } finally { setIsLoading(false); }
    };

    const toggleShowPass = (field) => {
        setShowPass(prev => ({ ...prev, [field]: !prev[field] }));
    };

    if (!user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#f5f5fa] font-body text-sm text-text-primary pb-12">
            <div className="bg-white shadow-sm mb-6 sticky top-0 z-30">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-500">
                        <Link to="/" className="hover:text-brand-primary">Trang chủ</Link>
                        <span>/</span>
                        <span className="text-text-primary font-bold">Tài khoản của tôi</span>
                    </div>
                    <Link to="/" className="hidden md:flex items-center gap-2 text-brand-primary font-bold hover:underline">
                        <FontAwesomeIcon icon={faHome} /> Về trang chủ
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 flex flex-col md:flex-row gap-6">
                
                <div className="w-full md:w-1/4 flex-shrink-0">
                    <div className="bg-white md:bg-transparent rounded-xl md:rounded-none p-4 md:p-0 shadow-sm md:shadow-none">
                        <div className="flex items-center gap-4 pb-4 border-b border-gray-200 md:border-none">
                            <div className="w-14 h-14 rounded-full border-2 border-white shadow-md overflow-hidden relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                                {user.avatar_url ? (
                                    <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-brand-primary text-white flex items-center justify-center font-bold text-xl">
                                        {user.ho_ten?.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <FontAwesomeIcon icon={faPen} className="text-white text-xs" />
                                </div>
                            </div>
                            <div className="overflow-hidden">
                                <div className="font-bold truncate text-base text-gray-800">{user.ho_ten}</div>
                                <button className="text-xs text-gray-500 flex items-center gap-1 hover:text-brand-primary mt-1" onClick={() => fileInputRef.current.click()}>
                                    <FontAwesomeIcon icon={faPen} /> Sửa hồ sơ
                                </button>
                                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
                            </div>
                        </div>

                        <div className="mt-6 space-y-1">
                            <button onClick={() => setActiveTab('info')} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'info' ? 'bg-white text-brand-primary font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
                                <FontAwesomeIcon icon={faUser} className="w-4" /> Hồ sơ
                            </button>
                            <button onClick={() => setActiveTab('address')} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'address' ? 'bg-white text-brand-primary font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4" /> Địa chỉ
                            </button>
                            <button onClick={() => setActiveTab('password')} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'password' ? 'bg-white text-brand-primary font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
                                <FontAwesomeIcon icon={faLock} className="w-4" /> Đổi mật khẩu
                            </button>
                            <button onClick={() => setActiveTab('orders')} className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'orders' ? 'bg-white text-brand-primary font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
                                <FontAwesomeIcon icon={faShoppingBag} className="w-4" /> Đơn mua
                            </button>
                            <div className="border-t border-gray-200 my-4"></div>
                            <button onClick={logout} className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg flex items-center gap-3 font-bold transition-colors">
                                <FontAwesomeIcon icon={faSignOutAlt} className="w-4" /> Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-3/4 bg-white shadow-sm rounded-xl min-h-[500px] p-6 md:p-8 relative">
                    
                    {activeTab === 'info' && (
                        <div className="animate-fade-in-down">
                            <div className="border-b border-gray-100 pb-4 mb-6">
                                <h1 className="text-xl font-heading font-bold text-text-primary flex items-center gap-2">
                                    <span className="w-1 h-8 bg-brand-primary rounded-full block"></span>
                                    Hồ Sơ Của Tôi
                                </h1>
                                <p className="text-sm text-text-muted mt-1 ml-3">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
                            </div>
                            
                            <form onSubmit={handleUpdateInfo} className="flex flex-col-reverse md:flex-row gap-10">
                                <div className="flex-1 space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] items-center gap-2 md:gap-4">
                                        <label className="text-gray-500 text-sm font-medium md:text-right">Họ và tên</label>
                                        <input type="text" value={infoForm.ho_ten} onChange={(e) => setInfoForm({...infoForm, ho_ten: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary focus:shadow-sm transition-all" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] items-center gap-2 md:gap-4">
                                        <label className="text-gray-500 text-sm font-medium md:text-right">Email</label>
                                        <div className="text-gray-800 font-medium px-4">
                                            {user.email} <span className="text-green-600 bg-green-50 ml-2 text-[10px] border border-green-200 px-2 py-0.5 rounded-full uppercase tracking-wider">Đã xác minh</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] items-center gap-2 md:gap-4">
                                        <label className="text-gray-500 text-sm font-medium md:text-right">Số điện thoại</label>
                                        <input type="text" value={infoForm.so_dien_thoai} onChange={(e) => setInfoForm({...infoForm, so_dien_thoai: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary focus:shadow-sm transition-all" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] items-center gap-2 md:gap-4 pt-4">
                                        <div></div>
                                        <button type="submit" disabled={isLoading} className="bg-brand-primary text-white px-8 py-2.5 rounded-xl font-bold shadow-lg hover:bg-brand-dark hover:-translate-y-0.5 transition-all">
                                            {isLoading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'address' && <MyAddresses />}

                    {activeTab === 'password' && (
                        <div className="animate-fade-in-down">
                            <div className="border-b border-gray-100 pb-4 mb-6">
                                <h1 className="text-xl font-heading font-bold text-text-primary flex items-center gap-2">
                                    <span className="w-1 h-8 bg-brand-primary rounded-full block"></span>
                                    Đổi Mật Khẩu
                                </h1>
                                <p className="text-sm text-text-muted mt-1 ml-3">Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</p>
                            </div>

                            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-8 rounded-r-lg">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-orange-400 mt-0.5" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-orange-700 font-bold">Lưu ý quan trọng:</p>
                                        <p className="text-sm text-orange-600 mt-1">
                                            Nếu bạn đăng nhập bằng <strong>Google</strong> hoặc <strong>Facebook</strong>, bạn sẽ không có mật khẩu cũ để thay đổi. 
                                            Tính năng này chỉ dành cho tài khoản đăng ký trực tiếp bằng Email.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleChangePassword} className="max-w-lg space-y-6">
                                <div className="space-y-2">
                                    <label className="text-gray-600 text-sm font-bold">Mật khẩu hiện tại</label>
                                    <div className="relative">
                                        <input 
                                            type={showPass.current ? "text" : "password"} 
                                            value={passForm.mat_khau_cu} 
                                            onChange={e => setPassForm({...passForm, mat_khau_cu: e.target.value})} 
                                            className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-primary focus:bg-white transition-all" 
                                            placeholder="••••••••" 
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => toggleShowPass('current')}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                        >
                                            <FontAwesomeIcon icon={showPass.current ? faEyeSlash : faEye} />
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-gray-600 text-sm font-bold">Mật khẩu mới</label>
                                    <div className="relative">
                                        <input 
                                            type={showPass.new ? "text" : "password"} 
                                            value={passForm.mat_khau_moi} 
                                            onChange={e => setPassForm({...passForm, mat_khau_moi: e.target.value})} 
                                            className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-primary focus:bg-white transition-all" 
                                            placeholder="••••••••" 
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => toggleShowPass('new')}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                        >
                                            <FontAwesomeIcon icon={showPass.new ? faEyeSlash : faEye} />
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-gray-600 text-sm font-bold">Xác nhận mật khẩu</label>
                                    <div className="relative">
                                        <input 
                                            type={showPass.confirm ? "text" : "password"} 
                                            value={passForm.xac_nhan_mat_khau} 
                                            onChange={e => setPassForm({...passForm, xac_nhan_mat_khau: e.target.value})} 
                                            className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-primary focus:bg-white transition-all" 
                                            placeholder="••••••••" 
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => toggleShowPass('confirm')}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                        >
                                            <FontAwesomeIcon icon={showPass.confirm ? faEyeSlash : faEye} />
                                        </button>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <button 
                                        type="submit" 
                                        disabled={isLoading} 
                                        className="bg-brand-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-brand-dark hover:-translate-y-0.5 transition-all w-full md:w-auto flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                                                Đang xử lý...
                                            </>
                                        ) : (
                                            <>
                                                <FontAwesomeIcon icon={faLock} /> Xác Nhận Đổi Mật Khẩu
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="text-center py-20 animate-fade-in-down">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                <FontAwesomeIcon icon={faShoppingBag} className="text-4xl" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-600">Chưa có đơn hàng nào</h3>
                            <p className="text-gray-400 text-sm mt-2">Hãy khám phá thêm những cuốn sách hay tại Lumi Book nhé!</p>
                            <Link to="/" className="inline-block mt-6 px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-dark transition-colors font-bold">
                                Khám phá ngay
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;