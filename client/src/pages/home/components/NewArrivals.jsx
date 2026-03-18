import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bookService from '../../../services/bookService';
import './css/NewArrivals.css';
import { useCart } from '../../../context/cartContext';

const NewArrivals = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [addingId, setAddingId] = useState(null);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchNewBooks = async () => {
            try {
                const res = await bookService.getNewArrivals();
                if (res.success) {
                    setBooks(res.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchNewBooks();
    }, []);

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

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    if (loading) {
        return <div className="w-full py-24 text-center font-heading text-xl">Đang tải sách mới...</div>;
    }

    return (
        <section className="w-full bg-[#F6F1E9] py-24 flex justify-center overflow-visible">
            <div className="w-full max-w-[1200px] px-4">
                <div className="flex flex-col items-center mb-16">
                    <span className="text-accent-primary font-bold tracking-[0.3em] text-xs uppercase mb-2">
                        Lumi Selection
                    </span>
                    <h2 className="font-heading text-4xl md:text-5xl font-bold text-brand-primary">
                        Sách Mới Phát Hành
                    </h2>
                    <div className="ln-header-line"></div>
                    <p className="text-text-secondary mt-4 italic font-body text-sm max-w-xl text-center">
                        Khám phá những tác phẩm mới nhất vừa được bổ sung vào kho tàng tri thức
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 gap-y-12 ln-perspective">
                    {books.map((book) =>{
                        const isItemAdding = addingId === book.id;
                        return (
                        <div key={book.id} className="ln-card rounded-2xl p-4 flex flex-col h-[480px]">
                            <div className="ln-ribbon-mark">
                                <i className="fa-solid fa-star"></i>
                            </div>

                            <div className="ln-book-stage mb-4" onClick={() => navigate(`/product/${book.id}`)}>
                                <div className="ln-book-obj cursor-pointer">
                                    <div className="ln-spine"></div>
                                    <div className="ln-pages"></div>
                                    <div className="ln-cover">
                                        <div className="ln-lighting"></div>
                                        <img 
                                            src={book.hinh_anh} 
                                            alt={book.ten_sach} 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-tr from-brand-dark/10 to-transparent pointer-events-none"></div>
                                    </div>
                                </div>
                                <div className="ln-shadow-phantom"></div>
                            </div>

                            <div className="flex flex-col flex-grow z-20 bg-surface">
                                <div className="mb-auto">
                                    <h3 
                                        className="font-heading text-lg font-bold text-text-primary line-clamp-1 hover:text-brand-primary transition-colors cursor-pointer"
                                        onClick={() => navigate(`/product/${book.id}`)}
                                    >
                                        {book.ten_sach}
                                    </h3>
                                    <p className="text-text-muted text-xs uppercase tracking-wide mt-1 font-body">
                                        {book.author || 'Đang cập nhật'}
                                    </p>
                                </div>

                                <div className="w-full border-t border-border-light border-dashed my-3"></div>

                                <div className="flex items-end justify-between">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            {book.gia_giam < book.gia_ban && (
                                                <>
                                                    <span className="text-xs text-text-muted line-through decoration-red-400 decoration-1">
                                                        {formatPrice(book.gia_ban)}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-accent-primary bg-accent-primary/10 px-1.5 py-0.5 rounded">
                                                        {book.discount_percent}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                        <span className="font-heading text-xl font-bold text-accent-primary">
                                            {formatPrice(book.gia_giam || book.gia_ban)}
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

                <div className="mt-16 text-center">
                    <button className="relative px-10 py-3 overflow-hidden font-bold rounded-full group bg-transparent border border-brand-dark text-brand-dark hover:text-surface transition-colors duration-300">
                        <span className="absolute inset-0 w-full h-full bg-brand-dark transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></span>
                        <span className="relative z-10 uppercase text-xs tracking-[0.15em] flex items-center gap-2">
                            Xem toàn bộ sách mới <i className="fa-solid fa-arrow-right"></i>
                        </span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default NewArrivals;