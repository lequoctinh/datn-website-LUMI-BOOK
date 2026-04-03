import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/BestSellerBooks.css';
import bookService from '../../../services/bookService';
import { useCart } from '../../../context/cartContext';

const BestSellerBooks = () => {
  const navigate = useNavigate(); 
  const { addToCart } = useCart();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const res = await bookService.getBestSellers();
        if (res.success) {
          setBooks(res.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải sách bán chạy", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBestSellers();
  }, []);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
    window.scrollTo(0, 0); 
  };

  const handleAddToCart = async (e, book) => {
    e.stopPropagation();
    
    if (book.so_luong_ton <= 0) return;

    setAddingId(book.id);
    try {
      await addToCart(book.id, 1);
    } finally {
      setTimeout(() => setAddingId(null), 500);
    }
  };

return (
    <section className="w-full bg-[#FDFBF7] py-24 flex justify-center overflow-visible">
      <div className="w-full max-w-[1200px] px-4">
        
        <div className="flex flex-col items-center mb-16">
            <span className="text-accent-primary font-bold tracking-[0.3em] text-xs uppercase mb-2">
                Lumi Premium
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-brand-primary">
                Sản Phẩm Bán Chạy
            </h2>
            <div className="ln-header-line" style={{height: '2px', width: '80px', background: 'linear-gradient(90deg, transparent, #8B5E3C, transparent)', marginTop: '1rem'}}></div>
            <p className="text-text-secondary mt-4 italic font-body text-sm max-w-xl text-center">
                Tuyển tập những tác phẩm kinh điển được cộng đồng độc giả yêu thích nhất
            </p>
        </div>

        {loading ? (
          <div className="text-center py-24 font-heading text-xl">Đang tải siêu phẩm...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 gap-y-12 ln-perspective">
            {books.map((book, index) => {
              const isDiscounted = book.gia_giam > 0 && book.gia_giam < book.gia_ban;
              const percentDiscount = isDiscounted ? Math.round(((book.gia_ban - book.gia_giam) / book.gia_ban) * 100) : 0;
              const currentPrice = isDiscounted ? book.gia_giam : book.gia_ban;
              const isItemAdding = addingId === book.id;

              return (
                <div 
                  key={book.id} 
                  className="ln-card rounded-2xl p-5 flex flex-col h-[480px]"
                >
                  <div className="ln-ribbon-mark">
                      <i className="fa-solid fa-crown text-[10px] mb-1"></i>
                      <span className="text-[10px] font-bold">#{index + 1}</span>
                  </div>

                  {isDiscounted && (
                      <div className="discount-tag">-{percentDiscount}%</div>
                  )}

                  <div className="ln-book-stage mb-4" onClick={() => handleProductClick(book.id)}>
                    <div className="ln-book-obj cursor-pointer">
                      <div className="ln-spine"></div>
                      <div className="ln-pages"></div>
                      <div className="ln-cover">
                        <div className="ln-lighting"></div>
                          <img src={book.hinh_anh ? `http://localhost:5000/uploads/products/${book.hinh_anh}` : 'https://via.placeholder.com/300x400'} alt={book.ten_sach} />
                        {book.so_luong_ton <= 0 && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-30">
                            <span className="bg-white/90 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                              Hết hàng
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent pointer-events-none"></div>
                      </div>
                    </div>
                    <div className="ln-shadow-phantom"></div>
                  </div>

                  <div className="flex flex-col flex-grow z-20">
                    <div className="mb-auto">
                      <h3 
                        className="font-heading text-lg font-bold text-text-primary line-clamp-1 hover:text-brand-primary transition-colors cursor-pointer"
                        onClick={() => handleProductClick(book.id)}
                      >
                        {book.ten_sach}
                      </h3>
                      <p className="text-text-muted text-xs uppercase tracking-wide mt-1 font-body">
                        {book.tac_gia && book.tac_gia.length > 0 
                          ? book.tac_gia.map(a => a.ten_tac_gia).join(', ') 
                          : 'Nhiều tác giả'}
                      </p>
                    </div>

                    <div className="w-full border-t border-border-light border-dashed my-3"></div>

                    <div className="flex items-end justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          {isDiscounted && (
                            <span className="text-xs text-text-muted line-through">
                              {Number(book.gia_ban).toLocaleString('vi-VN')}đ
                            </span>
                          )}
                        </div>
                        <span className="font-heading text-xl font-bold text-accent-primary">
                          {Number(currentPrice).toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                      
                      <button 
                        onClick={(e) => handleAddToCart(e, book)}
                        disabled={book.so_luong_ton <= 0 || isItemAdding}
                        className={`ln-btn-cart ${isItemAdding ? 'opacity-70' : ''}`}
                      >
                        <i className={`fa-solid ${isItemAdding ? 'fa-spinner fa-spin' : 'fa-cart-shopping'}`}></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default BestSellerBooks;