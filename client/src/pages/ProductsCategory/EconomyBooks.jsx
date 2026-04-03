import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faChevronRight, faCartPlus, 
    faSlidersH, faSortAmountDown, faEye, faThLarge,
    faChartLine
} from '@fortawesome/free-solid-svg-icons';

import bookService from '../../services/bookService';
import categoryService from '../../services/categoryService';
import { useCart } from '../../context/CartContext';

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(price).replace('₫', 'đ');
};

function EconomyBooks() {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
    
    const ECONOMY_CATEGORY_ID = 5; 

    const [filters, setFilters] = useState({
        page: 1,
        limit: 9,
        category_id: ECONOMY_CATEGORY_ID, 
        price_range: '',
        sort_by: 'newest'
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await categoryService.getAllCategories();
                if (res.success) setCategories(res.data);
            } catch (error) {
                console.error("Lỗi lấy danh mục:", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const res = await bookService.getAllBooks(filters);
                if (res.success) {
                    setBooks(res.data);
                    setPagination(res.pagination);
                }
            } catch (error) {
                console.error("Lỗi lấy danh sách sách:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, [filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const handleAddToCart = (e, book) => {
        e.stopPropagation();
        addToCart(book, 1);
    };

    const handleCategoryClick = (id) => {
        if (id === ECONOMY_CATEGORY_ID) return;
        const categoryMap = { 
            4: '/category/literature',
            5: '/category/economy', 
            6: '/category/children',
            7: '/category/language',
            8: '/category/biography',
            9: '/category/mentality',
            10: '/category/life'
        };

        const targetPath = categoryMap[id];
        if (targetPath) {
            navigate(targetPath);
        } else {
            navigate(`/products?category_id=${id}`);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-body text-text-primary">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-[1200px] mx-auto px-4 py-4 flex items-center text-[13px] text-gray-400">
                    <Link to="/" className="hover:text-brand-primary transition-colors">Trang chủ</Link>
                    <FontAwesomeIcon icon={faChevronRight} className="mx-3 text-[9px]" />
                    <span className="text-brand-primary font-bold">Kinh Tế - Làm Giàu</span>
                </div>
            </div>

            {/* Banner Section */}
            <div className="bg-white py-12 mb-8 border-b border-gray-50 relative overflow-hidden">
                <div className="max-w-[1200px] mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-md text-xs font-black uppercase tracking-widest">
                                    Knowledge is Power
                                </span>
                            </div>
                            <h1 className="text-4xl font-heading font-black text-text-primary mb-4 tracking-tight">
                                Kinh Tế & Quản Trị
                            </h1>
                            <p className="text-text-muted text-lg font-light leading-relaxed">
                                Nâng tầm tư duy tài chính, quản trị kinh doanh và bí quyết thành công từ những chuyên gia hàng đầu thế giới.
                            </p>
                        </div>
                        <div className="flex gap-4 mb-2">
                            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-full">
                                <FontAwesomeIcon icon={faChartLine} />
                                <span>Tư duy đột phá</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 pb-20">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-[280px] shrink-0">
                        <div className="sticky top-28 space-y-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-gray-50 pb-4">
                                    <FontAwesomeIcon icon={faSlidersH} className="text-brand-primary" />
                                    Mức đầu tư
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
                                                type="radio" name="price" 
                                                checked={filters.price_range === range.id}
                                                onChange={() => handleFilterChange('price_range', range.id)}
                                                className="w-4 h-4 border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer" 
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
                                    Chủ đề khác
                                </h3>
                                <div className="flex flex-col gap-2">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => handleCategoryClick(cat.id)}
                                            className={`text-left px-4 py-3 rounded-xl text-[14px] transition-all duration-300 flex items-center justify-between group ${
                                                cat.id === ECONOMY_CATEGORY_ID 
                                                ? 'bg-brand-primary text-white font-bold shadow-lg shadow-brand-primary/20' 
                                                : 'text-gray-600 hover:bg-brand-primary/5 hover:text-brand-primary font-medium'
                                            }`}
                                        >
                                            {cat.ten_danh_muc}
                                            <FontAwesomeIcon icon={faChevronRight} className={`text-[10px] ${cat.id === ECONOMY_CATEGORY_ID ? '' : 'opacity-0'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        <div className="flex justify-between items-center mb-10 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <span className="text-sm text-gray-500 font-medium">
                                Tìm thấy <b className="text-text-primary">{pagination.total}</b> đầu sách
                            </span>
                            <div className="flex items-center gap-3">
                                <select 
                                    value={filters.sort_by}
                                    onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                                    className="bg-transparent border-none text-sm font-bold focus:ring-0 text-brand-primary appearance-none cursor-pointer"
                                >
                                    <option value="newest">Mới nhất</option>
                                    <option value="price-asc">Giá tăng dần</option>
                                    <option value="price-desc">Giá giảm dần</option>
                                    <option value="best-seller">Bán chạy</option>
                                </select>
                                <FontAwesomeIcon icon={faSortAmountDown} className="text-brand-primary text-xs" />
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-white p-4 rounded-3xl border border-gray-100 space-y-4">
                                        <div className="aspect-[3/4] bg-gray-100 animate-pulse rounded-2xl"></div>
                                        <div className="h-4 bg-gray-100 animate-pulse rounded w-2/3 mx-auto"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                                {books.map((book) => (
                                    <div key={book.id} className="group bg-white rounded-3xl p-4 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full">
                                        {/* Image Wrapper Optimized */}
                                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6 bg-[#F3F4F6] shadow-inner">
                                            <img 
                                                src={book.hinh_anh} 
                                                alt={book.ten_sach} 
                                                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2" 
                                            />
                                            
                                            {/* Overlay Actions */}
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                                                <button 
                                                    onClick={(e) => handleAddToCart(e, book)}
                                                    className="w-11 h-11 bg-white text-brand-primary rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all shadow-xl transform translate-y-4 group-hover:translate-y-0 duration-300"
                                                >
                                                    <FontAwesomeIcon icon={faCartPlus} />
                                                </button>
                                                <button 
                                                    onClick={() => navigate(`/product/${book.id}`)}
                                                    className="w-11 h-11 bg-white text-brand-primary rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all shadow-xl transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
                                                >
                                                    <FontAwesomeIcon icon={faEye} />
                                                </button>
                                            </div>

                                            {/* Badge Sale */}
                                            {book.gia_giam > 0 && (
                                                <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg">
                                                    -{Math.round(((book.gia_ban - book.gia_giam) / book.gia_ban) * 100)}%
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex flex-col flex-grow px-1">
                                            <p className="text-[11px] uppercase tracking-[2px] text-brand-primary font-black mb-2 opacity-70">
                                                {book.tac_gia || 'Kinh tế - Quản trị'}
                                            </p>
                                            <h3 
                                                onClick={() => navigate(`/product/${book.id}`)} 
                                                className="font-heading text-base text-text-primary line-clamp-2 hover:text-brand-primary transition-colors cursor-pointer mb-3 leading-snug h-[3rem]"
                                            >
                                                {book.ten_sach}
                                            </h3>
                                            
                                            <div className="mt-auto pt-4 border-t border-gray-50">
                                                <div className="flex flex-col items-start gap-1">
                                                    {book.gia_giam > 0 ? (
                                                        <>
                                                            <span className="text-xs text-gray-400 line-through font-medium">
                                                                {formatPrice(book.gia_ban)}
                                                            </span>
                                                            <span className="text-xl font-black text-red-600">
                                                                {formatPrice(book.gia_giam)}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-xl font-black text-text-primary">
                                                            {formatPrice(book.gia_ban)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="mt-20 flex justify-center items-center gap-4">
                            <button 
                                disabled={filters.page === 1} 
                                onClick={() => handleFilterChange('page', filters.page - 1)} 
                                className="w-12 h-12 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-brand-primary disabled:opacity-30 transition-all"
                            >
                                {"<"}
                            </button>
                            <div className="flex gap-2">
                                {[...Array(pagination.totalPages)].map((_, i) => (
                                    <button 
                                        key={i+1} 
                                        onClick={() => handleFilterChange('page', i+1)} 
                                        className={`w-12 h-12 rounded-2xl font-bold transition-all ${filters.page === i+1 ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30' : 'bg-white border border-gray-100 text-gray-400 hover:border-brand-primary'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button 
                                disabled={filters.page === pagination.totalPages} 
                                onClick={() => handleFilterChange('page', filters.page + 1)} 
                                className="w-12 h-12 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-brand-primary disabled:opacity-30 transition-all"
                            >
                                {">"}
                            </button>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default EconomyBooks;