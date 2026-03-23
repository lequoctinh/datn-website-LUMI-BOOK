import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faChevronRight, faCartPlus, 
    faSlidersH, faSortAmountDown, faEye, faCheckCircle, faThLarge
} from '@fortawesome/free-solid-svg-icons';

import bookService from '../../services/bookService';
import categoryService from '../../services/categoryService';
import { useCart } from '../../context/cartContext';

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(price).replace('₫', 'đ');
};

const BiographyBooks = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
    
    const BIOGRAPHY_CATEGORY_ID = 8; 

    const [filters, setFilters] = useState({
        page: 1,
        limit: 9,
        category_id: BIOGRAPHY_CATEGORY_ID, 
        price_range: '',
        sort_by: 'newest'
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await categoryService.getAllCategories();
                if (res.success) {
                    setCategories(res.data);
                }
            } catch (error) {
                console.error(error);
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
                console.error(error);
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
        addToCart(book.id, 1);
    };

    const handleCategoryClick = (id) => {
        if (id === BIOGRAPHY_CATEGORY_ID) return;
        
        const categoryMap = { 
            4: '/category/literature',
            5: '/category/economy', 
            6: '/category/children',
            7: '/category/language',
            8: '/category/biography',
            9: '/category/mentality'

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
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-[1200px] mx-auto px-4 py-4 flex items-center text-[13px] text-gray-400">
                    <Link to="/" className="hover:text-brand-primary transition-colors">Trang chủ</Link>
                    <FontAwesomeIcon icon={faChevronRight} className="mx-3 text-[9px]" />
                    <span className="text-brand-primary font-bold">Tiểu sử - Hồi ký</span>
                </div>
            </div>

            <div className="bg-white py-12 mb-8 border-b border-gray-50">
                <div className="max-w-[1200px] mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                        <div className="max-w-2xl">
                            <h1 className="text-4xl font-heading font-black text-text-primary mb-4 tracking-tight">
                                Tiểu sử - Hồi ký
                            </h1>
                            <p className="text-text-muted text-lg font-light leading-relaxed">
                                Những câu chuyện cuộc đời chân thực, đầy cảm hứng từ những nhân vật tầm cỡ và những hành trình vượt qua nghịch cảnh.
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="flex items-center gap-2 text-brand-primary font-bold text-sm bg-brand-primary/5 px-4 py-2 rounded-full">
                                <FontAwesomeIcon icon={faCheckCircle} />
                                <span>Câu chuyện thật 100%</span>
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
                                    Danh mục
                                </h3>
                                <div className="flex flex-col gap-2">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => handleCategoryClick(cat.id)}
                                            className={`text-left px-4 py-3 rounded-xl text-[14px] transition-all duration-300 flex items-center justify-between group ${
                                                cat.id === BIOGRAPHY_CATEGORY_ID 
                                                ? 'bg-brand-primary text-white font-bold shadow-lg shadow-brand-primary/20' 
                                                : 'text-gray-600 hover:bg-brand-primary/5 hover:text-brand-primary font-medium'
                                            }`}
                                        >
                                            {cat.ten_danh_muc}
                                            <FontAwesomeIcon 
                                                icon={faChevronRight} 
                                                className={`text-[10px] transition-transform duration-300 ${
                                                    cat.id === BIOGRAPHY_CATEGORY_ID ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                                                }`} 
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    <main className="flex-1">
                        <div className="flex justify-between items-center mb-10 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <span className="text-sm text-gray-500 font-medium">
                                Tìm thấy <b className="text-text-primary">{pagination.total}</b> cuốn sách
                            </span>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-gray-400 uppercase">Sắp xếp:</span>
                                <select 
                                    value={filters.sort_by}
                                    onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                                    className="bg-transparent border-none text-sm font-bold focus:ring-0 p-0 cursor-pointer text-brand-primary appearance-none"
                                >
                                    <option value="newest">Mới nhất</option>
                                    <option value="price-asc">Giá: Thấp đến Cao</option>
                                    <option value="price-desc">Giá: Cao đến Thấp</option>
                                    <option value="best-seller">Bán chạy nhất</option>
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
                                        <div className="h-4 bg-gray-100 animate-pulse rounded w-1/2 mx-auto"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                                {books.map((book) => (
                                    <div 
                                        key={book.id} 
                                        className="group bg-white rounded-2xl p-3 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                                    >
                                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 bg-white">
                                            <img 
                                                src={book.hinh_anh} 
                                                alt={book.ten_sach} 
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                                            />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <button 
                                                    onClick={(e) => handleAddToCart(e, book)}
                                                    className="w-10 h-10 bg-white text-brand-primary rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-lg"
                                                >
                                                    <FontAwesomeIcon icon={faCartPlus} />
                                                </button>
                                                <button 
                                                    onClick={() => navigate(`/product/${book.id}`)}
                                                    className="w-10 h-10 bg-white text-brand-primary rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75 shadow-lg"
                                                >
                                                    <FontAwesomeIcon icon={faEye} />
                                                </button>
                                            </div>
                                            {book.gia_giam > 0 && (
                                                <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md">
                                                    -{Math.round(((book.gia_ban - book.gia_giam) / book.gia_ban) * 100)}%
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col flex-grow px-1 text-center">
                                            <p className="text-[10px] uppercase tracking-widest text-brand-primary font-bold mb-1 opacity-60 truncate">
                                                {book.tac_gia || 'Nhân vật lịch sử'}
                                            </p>
                                            <h3 
                                                onClick={() => navigate(`/product/${book.id}`)}
                                                className="font-heading text-sm sm:text-base text-text-primary line-clamp-2 hover:text-brand-primary transition-colors cursor-pointer mb-2"
                                            >
                                                {book.ten_sach}
                                            </h3>
                                            <div className="mt-auto pt-2 border-t border-dashed border-gray-100">
                                                {book.gia_giam > 0 ? (
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-xs text-gray-400 line-through mb-1">
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
                                ))}
                            </div>
                        )}

                        {pagination.totalPages > 1 && (
                            <div className="mt-20 flex justify-center items-center gap-4">
                                <button 
                                    disabled={filters.page === 1}
                                    onClick={() => handleFilterChange('page', filters.page - 1)}
                                    className="w-12 h-12 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-brand-primary hover:border-brand-primary transition-all font-bold disabled:opacity-30"
                                >
                                    {"<"}
                                </button>
                                <div className="flex gap-2">
                                    {[...Array(pagination.totalPages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => handleFilterChange('page', i + 1)}
                                            className={`w-12 h-12 rounded-2xl font-bold transition-all ${
                                                filters.page === i + 1 
                                                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                                                : 'bg-white border border-gray-100 text-gray-400 hover:text-brand-primary hover:border-brand-primary'
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <button 
                                    disabled={filters.page === pagination.totalPages}
                                    onClick={() => handleFilterChange('page', filters.page + 1)}
                                    className="w-12 h-12 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-brand-primary hover:border-brand-primary transition-all font-bold disabled:opacity-30"
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
};

export default BiographyBooks;