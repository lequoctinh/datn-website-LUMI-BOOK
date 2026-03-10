import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBell, faBars } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '../../context/UserContext';

const AdminHeader = () => {
    const { user } = useUser();

    return (
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <button className="text-gray-500 hover:text-brand-primary transition-colors lg:hidden">
                    <FontAwesomeIcon icon={faBars} className="text-xl" />
                </button>
                <div className="relative hidden md:block">
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm nhanh..." 
                        className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-primary focus:bg-white transition-colors w-64 text-sm"
                    />
                    <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button className="relative text-gray-500 hover:text-brand-primary transition-colors">
                    <FontAwesomeIcon icon={faBell} className="text-xl" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                        3
                    </span>
                </button>

                <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-gray-800">{user?.ho_ten || 'Admin'}</p>
                        <p className="text-xs text-brand-primary capitalize">{user?.role || 'Quản trị viên'}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-brand-primary/20 overflow-hidden bg-gray-100">
                        {user?.avatar_url ? (
                            <img src={user?.avatar_url} alt="Admin" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-brand-primary text-white flex items-center justify-center font-bold">
                                {user?.ho_ten?.charAt(0).toUpperCase() || 'A'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;