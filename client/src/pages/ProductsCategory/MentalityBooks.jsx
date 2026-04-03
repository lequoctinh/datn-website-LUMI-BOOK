import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faChevronRight, faCartPlus, 
    faSlidersH, faSortAmountDown, faEye, faCheckCircle, faThLarge
} from '@fortawesome/free-solid-svg-icons';

import bookService from '../../services/bookService';
import categoryService from '../../services/categoryService';
import { useCart } from '../../context/CartContext';

// Giữ hàm format giá bên ngoài component để tránh khởi tạo lại
const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(price).replace('₫', 'đ');
};

function MentalityBooks() {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
    
    const MENTALITY_CATEGORY_ID = 9; 

    const [filters, setFilters] = useState({
        page: 1,
        limit: 9,
        category_id: MENTALITY_CATEGORY_ID, 
        price_range: '',
        sort_by: 'newest'
    });

    useEffect(() => {
        let isMounted = true;
        const fetchCategories = async () => {
            try {
                const res = await categoryService.getAllCategories();
                if (res.success && isMounted) {
                    setCategories(res.data);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
        return () => { isMounted = false; };
    }, []);

    useEffect(() => {
        let isMounted = true;
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const res = await bookService.getAllBooks(filters);
                if (res.success && isMounted) {
                    setBooks(res.data);
                    setPagination(res.pagination || { total: 0, totalPages: 1 });
                }
            } catch (error) {
                console.error("Error fetching books:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        fetchBooks();
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
        return () => { isMounted = false; };
    }, [filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const handleAddToCart = (e, book) => {
        e.stopPropagation();
        addToCart(book.id, 1);
    };

    const handleCategoryNavigation = (id) => {
        if (id === MENTALITY_CATEGORY_ID) return;
        
        const routes = { 
            4: '/category/literature',
            5: '/category/economy', 
            6: '/category/children',
            7: '/category/language',
            8: '/category/biography',
            9: '/category/mentality',
            10: '/category/life'
        };

        const path = routes[id] || `/products?category_id=${id}`;
        navigate(path);
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-body text-text-primary">
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-[1200px] mx-auto px-4 py-4 flex items-center text-[13px] text-gray-400">
                    <Link to="/" className="hover:text-brand-primary transition-colors">Trang chủ</Link>
                    <FontAwesomeIcon icon={faChevronRight} className="mx-3 text-[9px]" />
                    <span className="text-brand-primary font-bold">Tâm lý - Kỹ năng</span>
                </div>
            </div>

            <div className="bg-white py-12 mb-8 border-b border-gray-50">
                <div className="max-w-[1200px] mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                        <div className="max-w-2xl">
                            <h1 className="text-4xl font-heading font-black text-text-primary mb-4 tracking-tight">
                                Tâm lý - Kỹ năng
                            </h1>
                            <p className="text-text-muted text-lg font-light leading-relaxed">
                                Khám phá kho tàng kiến thức giúp cải thiện bản thân, thấu hiểu tâm lý và rèn luyện kỹ năng sinh tồn trong thời đại mới.
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="flex items-center gap-2 text-brand-primary font-bold text-sm bg-brand-primary/5 px-4 py-2 rounded-full">
                                <FontAwesomeIcon icon={faCheckCircle} />
                                <span>Kiến thức chọn lọc</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 pb-20">
                <div className="flex flex-col lg:flex-row gap-10">
                    <aside className="w-full lg:w-[280px] shrink-0">
                        <div className="sticky top-28 space-y-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-gray-50 pb-4">
                                    <FontAwesomeIcon icon={faSlidersH} className="text-brand-primary" />
                                    Khoảng Giá
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { id: '', label: "Tất cả" },
                                        { id: 'under-100', label: "Dưới 100.000đ" },
                                        { id: '100-300', label: "100.000đ - 300.000đ" },
                                        { id: 'above-300', label: "Trên 300.000đ" },
                                    ].map((range) => (
                                        <label key={range.id} className="flex items-center cursor-pointer group">
                                            <input 
                                                type="radio" 
                                                name="price" 
                                                className="w-4 h-4 accent-brand-primary cursor-pointer"
                                                checked={filters.price_range === range.id}
                                                onChange={() => handleFilterChange('price_range', range.id)}
                                            />
                                            <span className="ml-3 text-[14px] text-gray-600 group-hover:text-brand-primary transition-colors font-medium">
                                                {range.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-gray-50 pb-4">
                                    <FontAwesomeIcon icon={faThLarge} className="text-brand-primary" />
                                    Danh mục khác
                                </h3>
                                <div className="flex flex-col gap-2">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => handleCategoryNavigation(cat.id)}
                                            className={`text-left px-4 py-3 rounded-xl text-[14px] transition-all duration-300 flex items-center justify-between group ${
                                                cat.id === MENTALITY_CATEGORY_ID 
                                                ? 'bg-brand-primary text-white font-bold shadow-md shadow-brand-primary/20' 
                                                : 'text-gray-600 hover:bg-brand-primary/5 hover:text-brand-primary font-medium'
                                            }`}
                                        >
                                            {cat.ten_danh_muc}
                                            <FontAwesomeIcon 
                                                icon={faChevronRight} 
                                                className={`text-[10px] transition-transform ${
                                                    cat.id === MENTALITY_CATEGORY_ID ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                                }`} 
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    <main className="flex-1">
                        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <span className="text-sm text-gray-500 font-medium">
                                Tìm thấy <b className="text-text-primary">{pagination.total}</b> sản phẩm
                            </span>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-gray-400 uppercase hidden sm:inline">Sắp xếp:</span>
                                <select 
                                    value={filters.sort_by}
                                    onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                                    className="bg-transparent border-none text-sm font-bold focus:ring-0 cursor-pointer text-brand-primary"
                                >
                                    <option value="newest">Mới nhất</option>
                                    <option value="price-asc">Giá tăng dần</option>
                                    <option value="price-desc">Giá giảm dần</option>
                                    <option value="best-seller">Phổ biến nhất</option>
                                </select>
                                <FontAwesomeIcon icon={faSortAmountDown} className="text-brand-primary text-xs" />
                            </div>
                        </div>
                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 animate-pulse">
                                        <div className="aspect-[3/4] bg-gray-100 rounded-xl mb-4"></div>
                                        <div className="h-4 bg-gray-100 rounded w-3/4 mb-2 mx-auto"></div>
                                        <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {books.length > 0 ? books.map((book) => (
                                    <div 
                                        key={book.id} 
                                        className="group bg-white rounded-2xl p-3 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                                    >
                                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 bg-gray-50">
                                            <img 
                                                src={book.hinh_anh} 
                                                alt={book.ten_sach} 
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                                                <button 
                                                    onClick={(e) => handleAddToCart(e, book)}
                                                    className="w-10 h-10 bg-white text-brand-primary rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all shadow-md"
                                                    title="Thêm vào giỏ"
                                                >
                                                    <FontAwesomeIcon icon={faCartPlus} />
                                                </button>
                                                <button 
                                                    onClick={() => navigate(`/product/${book.id}`)}
                                                    className="w-10 h-10 bg-white text-brand-primary rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all shadow-md"
                                                    title="Xem chi tiết"
                                                >
                                                    <FontAwesomeIcon icon={faEye} />
                                                </button>
                                            </div>
                                            {book.gia_giam > 0 && (
                                                <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                                                    -{Math.round(((book.gia_ban - book.gia_giam) / book.gia_ban) * 100)}%
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col flex-grow px-1 text-center">
                                            <p className="text-[10px] uppercase tracking-widest text-brand-primary/60 font-bold mb-1 truncate">
                                                {book.tac_gia || 'Đang cập nhật'}
                                            </p>
                                            <h3 
                                                onClick={() => navigate(`/product/${book.id}`)}
                                                className="font-heading text-sm sm:text-base text-text-primary line-clamp-2 hover:text-brand-primary transition-colors cursor-pointer mb-2 h-10 sm:h-12"
                                            >
                                                {book.ten_sach}
                                            </h3>
                                            <div className="mt-auto pt-3 border-t border-dashed border-gray-100">
                                                {book.gia_giam > 0 ? (
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-xs text-gray-400 line-through">
                                                            {formatPrice(book.gia_ban)}
                                                        </span>
                                                        <span className="text-lg font-bold text-red-500">
                                                            {formatPrice(book.gia_giam)}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-lg font-bold text-text-primary">
                                                        {formatPrice(book.gia_ban)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-full py-20 text-center text-gray-400">
                                        Không tìm thấy cuốn sách nào trong danh mục này.
                                    </div>
                                )}
                            </div>
                        )}
                        {pagination.totalPages > 1 && (
                            <div className="mt-16 flex justify-center items-center gap-2">
                                <button 
                                    disabled={filters.page === 1}
                                    onClick={() => handleFilterChange('page', filters.page - 1)}
                                    className="w-10 h-10 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-brand-primary disabled:opacity-30 transition-all"
                                >
                                    {"<"}
                                </button>
                                {[...Array(pagination.totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => handleFilterChange('page', i + 1)}
                                        className={`w-10 h-10 rounded-xl font-bold transition-all ${
                                            filters.page === i + 1 
                                            ? 'bg-brand-primary text-white shadow-md' 
                                            : 'bg-white border border-gray-100 text-gray-400 hover:border-brand-primary hover:text-brand-primary'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button 
                                    disabled={filters.page === pagination.totalPages}
                                    onClick={() => handleFilterChange('page', filters.page + 1)}
                                    className="w-10 h-10 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-brand-primary disabled:opacity-30 transition-all"
                                >
                                    {">"}
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default MentalityBooks;