import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faLock, faUnlock, faUsers, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import customerService from '../../services/customerService';

const CustomerManager = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const res = await customerService.getAll();
            if (res.success) {
                setCustomers(res.data);
            }
        } catch (error) {
            toast.error('Lỗi khi tải danh sách khách hàng');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (user) => {
        const newStatus = user.trang_thai === 'active' ? 'locked' : 'active';
        const actionText = newStatus === 'locked' ? 'Khóa' : 'Mở khóa';
        
        if (window.confirm(`Bạn có chắc muốn ${actionText} tài khoản này?`)) {
            try {
                const res = await customerService.updateStatus(user.id, newStatus);
                if (res.success) {
                    toast.success(`${actionText} thành công`);
                    fetchCustomers();
                }
            } catch (error) {
                toast.error('Không thể cập nhật trạng thái');
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa vĩnh viễn khách hàng này?')) {
            try {
                const res = await customerService.delete(id);
                if (res.success) {
                    toast.success('Xóa khách hàng thành công');
                    fetchCustomers();
                }
            } catch (error) {
                toast.error('Lỗi khi xóa khách hàng');
            }
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[calc(100vh-100px)] animate-fade-in-down">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-heading font-bold text-gray-800 flex items-center gap-2">
                    <FontAwesomeIcon icon={faUsers} className="text-brand-primary" />
                    Quản Lý Khách Hàng
                </h2>
                <div className="text-sm text-gray-500 font-medium">
                    Tổng cộng: <span className="text-brand-primary">{customers.length}</span> người dùng
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200">
                            <th className="p-4 font-bold rounded-tl-lg">Khách hàng</th>
                            <th className="p-4 font-bold">Liên hệ</th>
                            <th className="p-4 font-bold">Trạng thái</th>
                            <th className="p-4 font-bold">Ngày tham gia</th>
                            <th className="p-4 font-bold text-right rounded-tr-lg">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm">
                        {loading ? (
                            <tr><td colSpan="5" className="text-center py-10">Đang tải dữ liệu...</td></tr>
                        ) : customers.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-10">Chưa có khách hàng nào</td></tr>
                        ) : (
                            customers.map((user) => (
                                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img 
                                                src={user.avatar_url || 'https://ui-avatars.com/api/?name=' + user.ho_ten} 
                                                alt="avatar" 
                                                className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                            />
                                            <div>
                                                <div className="font-bold text-gray-800">{user.ho_ten}</div>
                                                <div className="text-[10px] text-brand-primary font-bold uppercase">{user.role}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1 text-xs">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <FontAwesomeIcon icon={faEnvelope} className="w-3" /> {user.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <FontAwesomeIcon icon={faPhone} className="w-3" /> {user.so_dien_thoai || 'N/A'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                            user.trang_thai === 'active' ? 'bg-green-100 text-green-600' : 
                                            user.trang_thai === 'locked' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                                        }`}>
                                            {user.trang_thai === 'active' ? 'Đang hoạt động' : 
                                            user.trang_thai === 'locked' ? 'Bị khóa' : 'Chờ xác thực'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-500">
                                        {new Date(user.created_at).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleToggleStatus(user)}
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                                    user.trang_thai === 'active' 
                                                    ? 'bg-orange-50 text-orange-500 hover:bg-orange-500 hover:text-white' 
                                                    : 'bg-green-50 text-green-500 hover:bg-green-500 hover:text-white'
                                                }`}
                                                title={user.trang_thai === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                                            >
                                                <FontAwesomeIcon icon={user.trang_thai === 'active' ? faLock : faUnlock} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(user.id)}
                                                className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                                                title="Xóa người dùng"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CustomerManager;