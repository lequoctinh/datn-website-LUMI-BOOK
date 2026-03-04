import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faBars, faShoppingCart, faSearch, faTimes, 
    faUser, faBookOpen, faChartLine, faChild, 
    faGlobe, faFeather, faBrain, faLightbulb, 
    faEllipsisH, faPhone, faChevronRight,
    faSignOutAlt 
} from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../context/UserContext";
import './css/HeaderMobile.css';

const MOBILE_CATEGORIES = [
    { id: 1, name: "Sách Văn Học", icon: faBookOpen },
    { id: 2, name: "Kinh Tế - Làm Giàu", icon: faChartLine },
    { id: 3, name: "Thiếu Nhi", icon: faChild },
    { id: 4, name: "Ngoại Ngữ", icon: faGlobe },
    { id: 5, name: "Tiểu Sử - Hồi Ký", icon: faFeather },
    { id: 6, name: "Tâm Lý - Kỹ Năng", icon: faBrain },
    { id: 7, name: "Cẩm Nang Đời Sống", icon: faLightbulb },
    { id: 8, name: "Thể Loại Khác", icon: faEllipsisH },
];

function HeaderMobile() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    
    const { user, logout } = useUser();
    const navigate = useNavigate();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

    const handleLogout = () => {
        logout(); 
        setIsMenuOpen(false); 
    };

    return (
        <>
            <div className="mobile-header-wrapper w-full h-16 flex items-center justify-between px-4 sticky top-0 z-40 bg-background border-b border-black/5 md:hidden">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={toggleMenu}
                        className="mobile-menu-btn text-2xl w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors text-brand-primary"
                    >
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                    <Link to="/" className="logo-text text-xl font-heading font-black tracking-tighter text-brand-primary decoration-transparent">
                        LUMI BOOK
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={toggleSearch}
                        className={`mobile-action-btn text-lg w-9 h-9 flex items-center justify-center rounded-full transition-all ${isSearchOpen ? 'bg-brand-primary text-white' : 'text-text-primary'}`}
                    >
                        <FontAwesomeIcon icon={isSearchOpen ? faTimes : faSearch} />
                    </button>
                    
                    <div className="relative mobile-action-btn p-1 cursor-pointer">
                        <FontAwesomeIcon icon={faShoppingCart} className="text-xl text-text-primary" />
                        <span className="absolute -top-1 -right-1 bg-accent-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-sm">
                            2
                        </span>
                    </div>
                </div>
            </div>

            {isSearchOpen && (
                <div className="mobile-search-bar fixed top-16 left-0 w-full bg-white p-4 shadow-lg z-30 animate-slide-down md:hidden">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm sách, tác giả..." 
                            className="w-full py-2.5 pl-4 pr-12 rounded-lg bg-gray-100 border border-transparent focus:bg-white focus:border-brand-primary focus:outline-none transition-all text-sm font-body"
                            autoFocus
                        />
                        <button className="absolute right-0 top-0 h-full px-4 text-brand-primary">
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </div>
                </div>
            )}

            {isMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden flex">
                    <div 
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
                        onClick={toggleMenu}
                    ></div>
                    
                    <div className="relative w-[85%] max-w-[320px] h-full bg-white shadow-2xl animate-slide-in flex flex-col">
                        <div className="p-5 bg-brand-primary text-white flex flex-col gap-3">
                            <div className="flex justify-between items-start">
                                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl border-2 border-white/30 overflow-hidden">
                                    {user && user.avatar_url ? (
                                        <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <FontAwesomeIcon icon={faUser} />
                                    )}
                                </div>
                                <button onClick={toggleMenu} className="text-white/80 hover:text-white">
                                    <FontAwesomeIcon icon={faTimes} className="text-xl" />
                                </button>
                            </div>
                            
                            <div>
                                {user ? (
                                    <>
                                        <h3 className="font-heading font-bold text-lg truncate">Xin chào, {user.ho_ten}</h3>
                                        <p className="text-xs text-white/80 truncate">{user.email}</p>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="font-heading font-bold text-lg">Xin chào, Bạn đọc</h3>
                                        <div className="flex gap-3 text-xs mt-1 font-body">
                                            <Link to="/login" onClick={toggleMenu} className="underline cursor-pointer hover:text-brand-light decoration-transparent text-white">Đăng nhập</Link>
                                            <span>|</span>
                                            <Link to="/register" onClick={toggleMenu} className="underline cursor-pointer hover:text-brand-light decoration-transparent text-white">Đăng ký</Link>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto py-2">
                            <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                Danh mục sách
                            </div>
                            {MOBILE_CATEGORIES.map((cat) => (
                                <div 
                                    key={cat.id}
                                    className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50 hover:bg-brand-primary/5 cursor-pointer group transition-colors"
                                >
                                    <div className="flex items-center gap-4 text-text-primary group-hover:text-brand-primary">
                                        <FontAwesomeIcon icon={cat.icon} className="w-5 text-gray-400 group-hover:text-brand-primary transition-colors" />
                                        <span className="font-medium text-sm font-body">{cat.name}</span>
                                    </div>
                                    <FontAwesomeIcon icon={faChevronRight} className="text-xs text-gray-300" />
                                </div>
                            ))}

                            {user && (
                                <>
                                    <div className="px-4 py-2 mt-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        Tài khoản
                                    </div>
                                    <Link 
                                        to="/profile" 
                                        onClick={toggleMenu}
                                        className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-50 hover:bg-brand-primary/5 cursor-pointer text-text-primary block decoration-transparent"
                                    >
                                        <FontAwesomeIcon icon={faUser} className="w-5 text-gray-400" />
                                        <span className="font-medium text-sm">Thông tin cá nhân</span>
                                    </Link>
                                    <div className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-50 hover:bg-brand-primary/5 cursor-pointer text-text-primary">
                                        <FontAwesomeIcon icon={faShoppingCart} className="w-5 text-gray-400" />
                                        <span className="font-medium text-sm">Đơn hàng của tôi</span>
                                    </div>
                                    <div 
                                        onClick={handleLogout}
                                        className="flex items-center gap-4 px-5 py-3.5 hover:bg-red-50 cursor-pointer text-red-600 mt-2"
                                    >
                                        <FontAwesomeIcon icon={faSignOutAlt} className="w-5" />
                                        <span className="font-medium text-sm">Đăng xuất</span>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="p-4 bg-gray-50 border-t border-gray-100 mt-auto">
                            <div className="flex items-center gap-3 text-brand-primary font-bold text-sm mb-2">
                                <FontAwesomeIcon icon={faPhone} />
                                <span>Hotline: 1900 6789</span>
                            </div>
                            <p className="text-xs text-gray-500">© 2026 Lumi Book JSC</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default HeaderMobile;