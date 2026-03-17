import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faSortAmountDown, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import bookService from '../../services/bookService';
import categoryService from '../../services/categoryService';

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(price).replace('₫', 'đ');
};

const prices = [
    { id: '', name: "Tất cả" },
    { id: 'under-100', name: `Dưới ${formatPrice(100000)}` },
    { id: '100-300', name: `${formatPrice(100000)} - ${formatPrice(300000)}` },
    { id: 'above-300', name: `Trên ${formatPrice(300000)}` }
];

const ProductList = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([{ id: 'all', ten_danh_muc: "Tất cả" }]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

    const [filters, setFilters] = useState({
        page: 1,
        limit: 12,
        search: '',
        category_id: 'all',
        price_range: '',
        sort_by: 'newest'
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await categoryService.getAll();
                if (res.success) {
                    setCategories([{ id: 'all', ten_danh_muc: "Tất cả" }, ...res.data]);
                }
            } catch (error) {
                console.error("Lỗi fetch categories:", error);
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
                console.error("Lỗi fetch books:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, [filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    return (
        <div className="min-h-screen bg-background font-body py-10 px-4 sm:px-6 lg:px-8 text-text-primary">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div>
                        <h1 className="font-heading text-4xl md:text-5xl text-brand-primary mb-2">Thư Viện Lumi</h1>
                        <p className="text-text-secondary italic">Khám phá hàng ngàn cuốn sách tinh hoa</p>
                    </div>
                    
                    <div className="relative group">
                        <input 
                            type="text" 
                            placeholder="Tìm tên sách..." 
                            className="pl-10 pr-4 py-2.5 rounded-full border border-border-default focus:border-brand-primary outline-none bg-surface w-64 transition-all focus:w-80 shadow-sm"
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                        />
                        <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <aside className="lg:col-span-3 space-y-8">
                        <div className="bg-surface p-6 rounded-2xl shadow-card border border-border-light sticky top-24">
                            <h3 className="font-bold mb-4 text-sm uppercase tracking-widest text-brand-primary">Thể loại</h3>
                            <div className="flex flex-col gap-2 mb-8">
                                {categories.map(cat => (
                                    <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                                        <input 
                                            type="radio" 
                                            name="category" 
                                            checked={filters.category_id === cat.id}
                                            onChange={() => handleFilterChange('category_id', cat.id)}
                                            className="hidden"
                                        />
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${filters.category_id === cat.id ? 'border-brand-primary bg-brand-primary' : 'border-border-default'}`}>
                                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                        </div>
                                        <span className={`text-sm ${filters.category_id === cat.id ? 'text-brand-primary font-bold' : 'text-text-secondary'}`}>
                                            {cat.ten_danh_muc || cat.name}
                                        </span>
                                    </label>
                                ))}
                            </div>

                            <h3 className="font-bold mb-4 text-sm uppercase tracking-widest text-brand-primary">Khoảng giá</h3>
                            <div className="space-y-2 mb-8">
                                {prices.map(p => (
                                    <label key={p.id} className="flex items-center gap-3 cursor-pointer text-sm text-text-secondary">
                                        <input 
                                            type="radio" 
                                            name="price"
                                            checked={filters.price_range === p.id}
                                            onChange={() => handleFilterChange('price_range', p.id)}
                                            className="rounded border-border-default text-brand-primary focus:ring-brand-primary" 
                                        />
                                        {p.name}
                                    </label>
                                ))}
                            </div>

                            <button 
                                onClick={() => setFilters({ page: 1, limit: 12, search: '', category_id: 'all', price_range: '', sort_by: 'newest' })}
                                className="w-full py-3 bg-brand-primary/10 text-brand-primary rounded-xl font-bold text-xs uppercase hover:bg-brand-primary hover:text-white transition-all"
                            >
                                Xóa tất cả lọc
                            </button>
                        </div>
                    </aside>

                    <div className="lg:col-span-9">
                        <div className="flex items-center justify-between mb-6 bg-surface px-6 py-4 rounded-xl border border-border-light shadow-sm">
                            <div className="text-sm text-text-secondary">
                                Hiển thị <span className="font-bold text-text-primary">{books.length}</span> trong <span className="font-bold text-text-primary">{pagination.total}</span> cuốn sách
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <FontAwesomeIcon icon={faSortAmountDown} className="text-brand-primary" />
                                <select 
                                    className="bg-transparent border-none outline-none font-bold text-text-primary cursor-pointer"
                                    onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                                    value={filters.sort_by}
                                >
                                    <option value="newest">Mới nhất</option>
                                    <option value="price-asc">Giá thấp đến cao</option>
                                    <option value="price-desc">Giá cao đến thấp</option>
                                    <option value="best-seller">Bán chạy nhất</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                          <div className="flex flex-col items-center justify-center py-20 opacity-50">
                              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary mb-4"></div>
                              <p className="font-medium">Đang tìm sách...</p>
                          </div>
                      ) : (
                          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                              {books.map((book) => (
                                  <div 
                                      key={book.id} 
                                      className="group bg-surface rounded-2xl p-3 border border-border-light shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                                  >
                                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4 bg-white">
                                          <img 
                                              src={book.hinh_anh} 
                                              alt={book.ten_sach} 
                                              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                                          />
                                          
                                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                              <button 
                                                  onClick={(e) => e.stopPropagation()}
                                                  className="w-10 h-10 bg-white text-brand-primary rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-lg"
                                                  title="Thêm vào giỏ"
                                              >
                                                  <FontAwesomeIcon icon={faCartPlus} />
                                              </button>
                                              <button 
                                                  onClick={() => navigate(`/product/${book.id}`)}
                                                  className="w-10 h-10 bg-white text-brand-primary rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75 shadow-lg"
                                                  title="Xem chi tiết"
                                              >
                                                  <FontAwesomeIcon icon={faSearch} />
                                              </button>
                                          </div>
                                          {book.gia_giam > 0 && (
                                              <div className="absolute top-2 left-2 bg-accent-primary text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md">
                                                  -{Math.round(((book.gia_ban - book.gia_giam) / book.gia_ban) * 100)}%
                                              </div>
                                          )}
                                      </div>

                                      <div className="flex flex-col flex-grow px-1">
                                          <p className="text-[10px] uppercase tracking-widest text-brand-primary font-bold mb-1 opacity-60 truncate">
                                              {book.author || 'Lumi Select'}
                                          </p>
                                          <h3 
                                              onClick={() => navigate(`/product/${book.id}`)}
                                              className="font-heading text-sm sm:text-base text-text-primary line-clamp-2 hover:text-brand-primary transition-colors cursor-pointer mb-2 min-h-[2.5rem] leading-snug"
                                          >
                                              {book.ten_sach}
                                          </h3>
                                          
                                          <div className="mt-auto pt-2 border-t border-dashed border-border-light">
                                              {book.gia_giam > 0 ? (
                                                  <div className="flex flex-col">
                                                      <span className="text-[11px] text-text-muted line-through opacity-70 leading-none mb-1">
                                                          {formatPrice(book.gia_ban)}
                                                      </span>
                                                      <div className="flex items-center justify-between">
                                                          <span className="text-base sm:text-lg font-bold text-accent-primary">
                                                              {formatPrice(book.gia_giam)}
                                                          </span>
                                                          <span className="text-[10px] bg-accent-primary/10 text-accent-primary px-1.5 py-0.5 rounded font-bold">
                                                              -{Math.round(((book.gia_ban - book.gia_giam) / book.gia_ban) * 100)}%
                                                          </span>
                                                      </div>
                                                  </div>
                                              ) : (
                                                  <div className="flex items-center justify-between py-1">
                                                      <span className="text-base sm:text-lg font-bold text-text-primary">
                                                          {formatPrice(book.gia_ban)}
                                                      </span>
                                                  </div>
                                              )}
                                          </div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      )}

                        <div className="mt-12 flex justify-center gap-2">
                            {[...Array(pagination.totalPages)].map((_, i) => (
                                <button 
                                    key={i + 1}
                                    onClick={() => handleFilterChange('page', i + 1)}
                                    className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all font-bold ${filters.page === i + 1 ? 'bg-brand-primary text-white' : 'border-border-default hover:bg-brand-primary/10'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductList;