import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faTachometerAlt, faBook, faTags, faShoppingCart, 
    faUsers, faStar, faImage, faSignOutAlt, faBookOpen
} from '@fortawesome/free-solid-svg-icons';
import { useUser } from '../../context/UserContext';

const AdminSidebar = () => {
    const location = useLocation();
    const { logout } = useUser();

    const menuItems = [
        { title: 'Tổng quan', icon: faTachometerAlt, path: '/admin' },
        { title: 'Quản lý Sách', icon: faBook, path: '/admin/books' },
        { title: 'Danh mục', icon: faTags, path: '/admin/categories' },
        { title: 'Đơn hàng', icon: faShoppingCart, path: '/admin/orders' },
        { title: 'Khách hàng', icon: faUsers, path: '/admin/users' },
        { title: 'Đánh giá', icon: faStar, path: '/admin/reviews' },
        { title: 'Banner', icon: faImage, path: '/admin/banners' },
    ];

    return (
        <div className="w-64 bg-white h-screen shadow-lg flex flex-col fixed left-0 top-0 z-20">
            <div className="h-16 flex items-center justify-center border-b border-gray-100">
                <Link to="/admin" className="text-2xl font-heading font-black text-brand-primary tracking-tighter flex items-center gap-2 decoration-transparent">
                    <FontAwesomeIcon icon={faBookOpen} />
                    LUMI ADMIN
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
                <div className="space-y-1">
                    {menuItems.map((item, index) => {
                        const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/admin');
                        return (
                            <Link 
                                key={index} 
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium decoration-transparent ${
                                    isActive 
                                    ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/30' 
                                    : 'text-gray-600 hover:bg-brand-primary/10 hover:text-brand-primary'
                                }`}
                            >
                                <FontAwesomeIcon icon={item.icon} className={`w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                                {item.title}
                            </Link>
                        );
                    })}
                </div>
            </div>

            <div className="p-4 border-t border-gray-100">
                <button 
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 font-bold transition-colors"
                >
                    <FontAwesomeIcon icon={faSignOutAlt} className="w-5" />
                    Đăng xuất
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;