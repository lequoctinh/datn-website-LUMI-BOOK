import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/BestSellerBooks.css';
import bookService from '../../../services/bookService';

const BestSellerBooks = () => {
  const navigate = useNavigate(); 
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleAddToCart = (e) => {
    e.stopPropagation();
    console.log("Thêm vào giỏ hàng!");
  };

  return (
    <section className="w-full bg-background py-24 flex justify-center overflow-visible">
      <div className="w-full max-w-[1200px] px-4">
        
        <div className="flex flex-col items-center mb-16 relative z-20">
          <div className="flex items-center gap-4 mb-2">
            <span className="h-[2px] w-12 bg-brand-light opacity-50"></span>
            <span className="text-brand-primary font-bold tracking-[0.3em] text-xs uppercase border border-brand-light px-4 py-1 rounded-full">
              Lumi Premium
            </span>
            <span className="h-[2px] w-12 bg-brand-light opacity-50"></span>
          </div>
          <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-brand-primary text-center mt-2">
            Sản phẩm bán chạy
          </h2>
          <p className="text-text-secondary mt-4 italic font-body text-base max-w-2xl text-center">
            Tuyển tập những tác phẩm kinh điển được cộng đồng độc giả yêu thích nhất tháng này
          </p>
        </div>

        {loading ? (
          <div className="text-center py-10 font-bold text-gray-500">Đang tải dữ liệu...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 gap-y-12 lumi-perspective">
            {books.map((book, index) => {
              const isDiscounted = book.gia_giam > 0 && book.gia_giam < book.gia_ban;
              const percentDiscount = isDiscounted ? Math.round(((book.gia_ban - book.gia_giam) / book.gia_ban) * 100) : 0;
              const currentPrice = isDiscounted ? book.gia_giam : book.gia_ban;

              return (
                <div 
                  key={book.id} 
                  onClick={() => handleProductClick(book.id)} 
                  className="lumi-card group relative rounded-xl p-5 border border-border-light cursor-pointer h-[460px] flex flex-col items-center bg-white"
                >
                  
                  {isDiscounted && (
                    <div className="absolute top-0 right-4 z-20">
                      <div className="discount-badge w-10 h-14 bg-accent-primary flex items-start justify-center pt-2 shadow-lg">
                        <span className="text-white text-xs font-bold">-{percentDiscount}%</span>
                      </div>
                    </div>
                  )}

                  <div className="absolute top-4 left-4 z-20 opacity-90">
                    <div className="bg-brand-dark/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1 border border-white/20">
                      <i className="fa-solid fa-crown text-yellow-400"></i>
                      <span>TOP {index + 1}</span>
                    </div>
                  </div>

                  <div className="relative w-full h-[260px] flex items-center justify-center mt-2 mb-4">
                    <div className="book-3d-wrapper">
                      <div className="book-spine"></div>
                      <div className="book-pages"></div>
                      <div className="book-shadow"></div>
                      <div className="book-cover">
                        <div className="light-sweep"></div>
                        <img 
                          src={book.hinh_anh || 'https://via.placeholder.com/300x400?text=Sách'} 
                          alt={book.ten_sach} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent pointer-events-none"></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col w-full text-center flex-grow z-30">
                    <h3 className="font-heading text-lg font-bold text-text-primary line-clamp-1 px-2 group-hover:text-brand-primary transition-colors">
                      {book.ten_sach}
                    </h3>
                    <p className="text-text-secondary text-xs uppercase tracking-wider mb-3 mt-1 font-body">
                      {book.author || 'Nhiều tác giả'}
                    </p>

                    <div className="w-full border-t border-dashed border-border-light my-auto"></div>

                    <div className="flex items-end justify-between w-full px-1 mt-3">
                      <div className="flex flex-col items-start text-left">
                        {isDiscounted && (
                          <span className="text-xs text-text-muted line-through decoration-red-400 decoration-1">
                            {Number(book.gia_ban).toLocaleString('vi-VN')}đ
                          </span>
                        )}
                        <span className="font-heading text-xl font-bold text-accent-primary">
                          {Number(currentPrice).toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                      
                      <button 
                        onClick={handleAddToCart}
                        className="btn-add-cart w-10 h-10 rounded-lg border border-brand-light text-brand-primary flex items-center justify-center bg-transparent hover:bg-brand-primary hover:text-white transition-all duration-300"
                      >
                        <i className="fa-solid fa-cart-shopping text-base"></i>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        <div className="mt-20 text-center">
          <button className="relative px-10 py-3 overflow-hidden font-bold rounded-full group bg-transparent border border-brand-primary text-brand-primary transition-all duration-300">
            <span className="absolute top-0 left-0 w-full h-full bg-brand-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            <span className="relative group-hover:text-white flex items-center gap-2 uppercase text-sm tracking-widest">
              Khám phá thêm <i className="fa-solid fa-arrow-right"></i>
            </span>
          </button>
        </div>

      </div>
    </section>
  );
};

export default BestSellerBooks;