import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faSearch, faShoppingCart, faUser, faPhone, 
    faBars, faBookOpen, faChartLine, faChild, faGlobe, 
    faFeather, faBrain, faLightbulb, faEllipsisH, faTimes,
    faSignOutAlt,faTachometerAlt
} from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../context/UserContext";
import { useCart } from "../context/CartContext";
import './css/Header.css';

const CATEGORIES = [
    { id: 1, name: "Sách Văn Học", icon: faBookOpen, desc: "Tiểu thuyết, Tản văn" , path:"/category/literature"},
    { id: 2, name: "Kinh Tế - Làm Giàu", icon: faChartLine, desc: "Bài học kinh doanh",path:"/category/economy" },
    { id: 3, name: "Thiếu Nhi", icon: faChild, desc: "Truyện tranh, Giáo dục",path:"/category/children"},
    { id: 4, name: "Ngoại Ngữ", icon: faGlobe, desc: "Tiếng Anh, Nhật, Trung", path:"/category/language" },
    { id: 5, name: "Tiểu Sử - Hồi Ký", icon: faFeather, desc: "Danh nhân thế giới", path:"/category/biography" },
    { id: 6, name: "Tâm Lý - Kỹ Năng", icon: faBrain, desc: "Phát triển bản thân" , path:"/category/mentality" },
    { id: 7, name: "Cẩm Nang Đời Sống", icon: faLightbulb, desc: "Mẹo hay, Nấu ăn" , path:"/category/life" },
    { id: 8, name: "Thể Loại Khác", icon: faEllipsisH, desc: "Tạp chí, Lịch sử" },
];

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout } = useUser();
    const { cartItems } = useCart();
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    return (
        <header className="header-wrapper w-full hidden md:block relative">
            <div className="container mx-auto px-4 py-2 flex justify-between items-center text-sm border-b border-black/5">
                <div className="text-gray-500 font-body">
                    <FontAwesomeIcon icon={faPhone} className="mr-2 text-brand-primary" />
                    Hotline: <span className="font-semibold text-brand-primary">0357699792</span>
                </div>
                <div className="flex gap-6 text-gray-500 font-body text-xs uppercase tracking-wider">
                <Link to="/contact" className="cursor-pointer hover:text-brand-primary transition-colors">Liên Hệ</Link>
                    <span className="cursor-pointer hover:text-brand-primary transition-colors">Câu hỏi thường gặp</span>
                </div>
            </div>

            <div className="container mx-auto px-4 py-5 flex justify-between items-center gap-8">
                <Link to="/" className="logo-text text-3xl cursor-pointer tracking-tighter shrink-0 decoration-transparent text-current">
                    LUMI BOOK
                </Link>

                <div className="flex-1 max-w-2xl relative flex group">
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm sách, tác giả, thể loại..." 
                        className="search-input w-full py-3 px-5 rounded-l-xl text-sm font-body shadow-sm"
                    />
                    <button className="btn-search px-8 rounded-r-xl transition-all duration-300 shadow-sm">
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                    
                    {user ? (
                        <div className="flex items-center gap-3 cursor-pointer group relative z-50">
                            <div className="w-10 h-10 rounded-full border border-brand-light/30 flex items-center justify-center overflow-hidden bg-surface">
                                {user.avatar_url ? (
                                    <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-brand-primary text-white flex items-center justify-center font-bold text-lg">
                                        {user.ho_ten ? user.ho_ten.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex flex-col">
                                <span className="text-[11px] text-text-muted uppercase font-bold tracking-wide">Xin chào</span>
                                <span className="text-sm font-bold text-text-primary max-w-[100px] truncate">{user.ho_ten}</span>
                            </div>

                            <div className="user-dropdown absolute top-full right-0 mt-0 w-56 bg-white rounded-xl py-2 hidden group-hover:block animate-fade-in-down">
                                <div className="px-4 py-3 border-b border-gray-100 mb-1">
                                    <p className="text-sm font-bold text-text-primary truncate">{user.ho_ten}</p>
                                    <p className="text-xs text-text-muted truncate">{user.email}</p>
                                </div>
                                {user.role === 'admin' && (
                                    <Link to="/admin" className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-brand-primary font-bold flex items-center gap-2 block border-b border-gray-100">
                                        <FontAwesomeIcon icon={faTachometerAlt} className="w-4" /> Vào trang Quản trị
                                    </Link>
                                )}
                                
                                <Link to="/profile" className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 font-medium flex items-center gap-2 block">
                                    <FontAwesomeIcon icon={faUser} className="text-gray-400 w-4" /> Thông tin cá nhân
                                </Link>
                                <Link to="/my-orders" className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 font-medium flex items-center gap-2 block">
                                    <FontAwesomeIcon icon={faShoppingCart} className="text-gray-400 w-4" /> Đơn hàng của tôi
                                </Link>
                                
                                <div className="border-t border-gray-100 my-1"></div>
                                <div 
                                    onClick={logout} 
                                    className="px-4 py-2 hover:bg-red-50 cursor-pointer text-sm text-red-600 font-bold flex items-center gap-2"
                                >
                                    <FontAwesomeIcon icon={faSignOutAlt} className="w-4" /> Đăng xuất
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="flex items-center gap-3 cursor-pointer group decoration-transparent">
                            <div className="w-10 h-10 rounded-full bg-surface border border-brand-light/30 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
                                <FontAwesomeIcon icon={faUser} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] text-text-muted uppercase font-bold tracking-wide">Tài khoản</span>
                                <span className="text-sm font-bold text-text-primary group-hover:text-brand-primary transition-colors">Đăng nhập</span>
                            </div>
                        </Link>
                    )}
                    
                    <div className="w-[1px] h-8 bg-gray-300/50"></div>

                    <Link to="/cart" className="relative cursor-pointer group flex items-center justify-center w-12 h-12 transition-all duration-300">
                        <div className="w-10 h-10 flex items-center justify-center text-text-primary group-hover:text-brand-primary transition-colors">
                            <FontAwesomeIcon icon={faShoppingCart} className="text-2xl" />
                        </div>
                        {cartItems.length > 0 && (
                            <span className="cart-badge absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 bg-accent-primary text-white text-[10px] rounded-full flex items-center justify-center font-black shadow-md animate-bounce-short ring-2 ring-white">
                                {cartItems.length}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
            <div className="border-t border-b border-brand-primary/10 bg-white shadow-sm relative z-40">
                <div className="container mx-auto px-4 relative">
                    <div className="flex items-center justify-between h-14">
                        <div ref={menuRef} className="relative h-full flex items-center">
                            <button 
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className={`
                                    flex items-center gap-3 px-6 h-full font-heading font-bold uppercase tracking-wide text-sm transition-all duration-300
                                    ${isMenuOpen ? 'bg-brand-primary text-white' : 'bg-transparent text-text-primary hover:text-brand-primary'}
                                `}
                            >
                                <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} className="text-lg" />
                                <span>Danh Mục Sản Phẩm</span>
                            </button>
                            {isMenuOpen && (
                                <div className="absolute top-full left-0 w-[900px] bg-white shadow-2xl rounded-b-xl border-t-2 border-brand-primary animate-fade-in-down overflow-hidden z-[1002]">
                                    <div className="grid grid-cols-4 gap-4 p-6 bg-background/30">
                                        {CATEGORIES.map((cat) => (
                                            <Link 
                                                to={cat.path} 
                                                key={cat.id} 
                                                onClick={() => setIsMenuOpen(false)} 
                                                className="group/item flex items-start gap-4 p-4 bg-white rounded-lg border border-transparent hover:border-brand-light/50 hover:shadow-hover cursor-pointer transition-all duration-300 decoration-transparent"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-brand-light/10 text-brand-primary flex items-center justify-center group-hover/item:bg-brand-primary group-hover/item:text-white transition-colors duration-300">
                                                    <FontAwesomeIcon icon={cat.icon} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-text-primary text-sm group-hover/item:text-brand-primary transition-colors">
                                                        {cat.name}
                                                    </h3>
                                                    <p className="text-xs text-text-muted mt-1 font-body line-clamp-1">
                                                        {cat.desc}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    <Link to="/products" className="block"> 
                                        <div className="bg-brand-primary/5 p-3 text-center text-xs text-text-secondary font-bold uppercase tracking-widest border-t border-brand-primary/10 hover:bg-brand-primary/10 cursor-pointer transition-colors">
                                            Xem tất cả thể loại
                                        </div>
                                    </Link>
                                </div>
                            )}
                        </div>
                        <ul className="flex gap-8 text-sm font-bold uppercase tracking-wide font-heading text-text-secondary">
                            <li>
                                <Link to="/" className="cursor-pointer hover:text-brand-primary transition-colors">Trang chủ</Link>
                            </li>
                            <li className="cursor-pointer hover:text-brand-primary transition-colors flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></span>
                                Sách Mới
                            </li>
                            <li>
                                <Link to="/my-orders" className="cursor-pointer text-accent-primary hover:text-accent-hover transition-colors">
                                    Tra cứu đơn hàng
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    );
}
export default Header;