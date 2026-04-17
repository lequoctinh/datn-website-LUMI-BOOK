import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faStar, faCartPlus, faTruck, faShield, faRotateLeft, 
    faPlus, faMinus, faTags, faLanguage, faBookOpen, 
    faRulerCombined, faBookAtlas, faCalendarAlt, faStore, 
    faChevronRight, faChevronLeft 
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import bookService from '../../services/bookService';
import reviewService from '../../services/reviewService';
import { useCart } from '../../context/cartContext';

const IMAGE_BASE_URL = 'http://localhost:5000/uploads/products/';
    
function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isAdding, setIsAdding] = useState(false);
    const { addToCart } = useCart();
    const [book, setBook] = useState(null);
    const [relatedBooks, setRelatedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState('');
    const [allImages, setAllImages] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [reviewStats, setReviewStats] = useState({ total: 0, average: 0 });

    useEffect(() => {
        const fetchBookDetail = async () => {
            setLoading(true);
            try {
                const res = await bookService.getPublicBookById(id);
                if (res.success) {
                    const data = res.data;
                    setBook(data);
                    
                    let albumArray = [];
                    try {
                        albumArray = typeof data.album_anh === 'string' ? JSON.parse(data.album_anh) : (data.album_anh || []);
                    } catch (e) {
                        albumArray = [];
                    }
                    
                    const images = [data.hinh_anh, ...albumArray]
                        .filter(Boolean)
                        .map(img => img.startsWith('http') ? img : `${IMAGE_BASE_URL}${img}`);
                    
                    setAllImages(images);
                    setActiveImage(images[0] || 'https://via.placeholder.com/400x600?text=No+Image');

                    const reviewRes = await reviewService.getReviewsByBook(id);
                    if (reviewRes.success) {
                        setReviews(reviewRes.data);
                        setReviewStats(reviewRes.stats || { total: reviewRes.data.length, average: 0 });
                    }

                    const relatedRes = await bookService.getBestSellers();
                    if (relatedRes.success) {
                        setRelatedBooks(relatedRes.data.filter(b => b.id !== parseInt(id)).slice(0, 4));
                    }
                }
            } catch (error) {
                toast.error("Không thể tải thông tin sách!");
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchBookDetail();
        setQuantity(1);
    }, [id, navigate]);

    const handleAddToCart = async () => {
        if (!book || book.so_luong_ton <= 0) {
            toast.error("Sản phẩm đã hết hàng");
            return;
        }

        setIsAdding(true);
        try {
            await addToCart(book.id, quantity);
        } finally {
            setIsAdding(false);
        }
    };

    const handleBuyNow = async () => {
        if (!book || book.so_luong_ton <= 0) return;
        
        setIsAdding(true);
        try {
            await addToCart(book.id, quantity);
            navigate('/cart');
        } finally {
            setIsAdding(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!book) return null;

    const isDiscounted = book.gia_giam > 0 && book.gia_giam < book.gia_ban;
    const currentPrice = isDiscounted ? book.gia_giam : book.gia_ban;
    const percentDiscount = isDiscounted ? Math.round(((book.gia_ban - book.gia_giam) / book.gia_ban) * 100) : 0;
    const MAX_THUMBNAILS = 5;
    const visibleThumbnails = allImages.slice(0, MAX_THUMBNAILS);
    const overflowCount = allImages.length - MAX_THUMBNAILS;
    const authors = book.tac_gia?.map(t => t.ten_tac_gia).join(', ') || 'Đang cập nhật';
    const categories = book.danh_muc?.map(c => c.ten_danh_muc).join(', ') || 'Đang cập nhật';

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-white border-b border-gray-100 py-4 mb-8 sticky top-0 z-40 shadow-sm">
                <div className="max-w-[1200px] mx-auto px-4 flex items-center gap-2 text-sm text-gray-500 font-medium">
                    <Link to="/" className="hover:text-brand-primary transition-colors">Trang chủ</Link>
                    <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
                    <span className="hover:text-brand-primary transition-colors cursor-pointer">{categories.split(',')[0]}</span>
                    <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
                    <span className="text-gray-800 font-bold truncate max-w-[200px] sm:max-w-md">{book.ten_sach}</span>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-4 space-y-8">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 lg:p-10 flex flex-col lg:flex-row gap-10 lg:gap-16">
                    <div className="w-full lg:w-[45%] flex flex-col gap-6 select-none">
                        <div className="w-full aspect-[3/4] rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-center p-4 relative group overflow-hidden">
                            {isDiscounted && (
                                <div className="absolute top-4 right-4 z-10 bg-red-600 text-white font-black px-3 py-1.5 rounded-full shadow-lg text-sm">
                                    -{percentDiscount}%
                                </div>
                            )}
                            <img 
                                src={activeImage} 
                                alt={book.ten_sach} 
                                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 ease-out" 
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x600?text=Lumi+Book'; }}
                            />
                        </div>

                        {allImages.length > 1 && (
                            <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-2">
                                {visibleThumbnails.map((img, index) => {
                                    const isLastAndOverflow = index === MAX_THUMBNAILS - 1 && overflowCount > 0;
                                    const isActive = activeImage === img;
                                    return (
                                        <div 
                                            key={index} 
                                            onClick={() => !isLastAndOverflow && setActiveImage(img)} 
                                            className={`relative w-20 aspect-[3/4] rounded-xl border-2 cursor-pointer overflow-hidden flex-shrink-0 transition-all duration-300 ${isActive && !isLastAndOverflow ? 'border-brand-primary ring-4 ring-brand-primary/20' : 'border-gray-100 hover:border-gray-300'}`}
                                        >
                                            <img src={img} className="w-full h-full object-cover" alt="thumbnail" />
                                            {isLastAndOverflow && (
                                                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-[2px] transition-colors hover:bg-black/70">
                                                    <span className="font-black text-xl">+{overflowCount + 1}</span>
                                                    <span className="text-[10px] uppercase font-bold tracking-widest">Xem thêm</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="w-full lg:w-[55%] flex flex-col">
                        <div className="mb-6">
                            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight tracking-tight mb-4 font-heading">{book.ten_sach}</h1>
                            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500 font-medium">Tác giả:</span>
                                    <span className="font-bold text-brand-primary">{authors}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-500 font-medium">Nhà cung cấp:</span>
                                    <span className="font-bold text-gray-800">{book.nha_cung_cap || 'Đang cập nhật'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <FontAwesomeIcon 
                                            key={i} 
                                            icon={faStar} 
                                            className={i < Math.round(reviewStats.average || 0) ? "text-yellow-400" : (reviewStats.total > 0 ? "text-gray-300" : "text-gray-300")} 
                                        />
                                    ))}
                                    <span className="text-gray-500 font-medium ml-1">
                                        {reviewStats.total > 0 ? `(${reviewStats.average}/5 dựa trên ${reviewStats.total} đánh giá)` : '(Chưa có đánh giá)'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50/80 rounded-2xl p-6 mb-8 border border-gray-100">
                            <div className="flex flex-wrap items-end gap-4">
                                <span className="text-4xl font-black text-red-600 tracking-tight">{Number(currentPrice).toLocaleString('vi-VN')} đ</span>
                                {isDiscounted && (
                                    <span className="text-lg font-bold text-gray-400 line-through mb-1.5">{Number(book.gia_ban).toLocaleString('vi-VN')} đ</span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 text-sm">
                            <div className="flex flex-col gap-1 bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
                                <span className="text-gray-500 flex items-center gap-2"><FontAwesomeIcon icon={faLanguage} className="text-brand-primary/70" />Ngôn ngữ</span>
                                <span className="font-bold text-gray-800">{book.ngon_ngu || 'Tiếng Việt'}</span>
                            </div>
                            <div className="flex flex-col gap-1 bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
                                <span className="text-gray-500 flex items-center gap-2"><FontAwesomeIcon icon={faBookOpen} className="text-brand-primary/70" />Hình thức bìa</span>
                                <span className="font-bold text-gray-800">{book.hinh_thuc || 'Đang cập nhật'}</span>
                            </div>
                            <div className="flex flex-col gap-1 bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
                                <span className="text-gray-500 flex items-center gap-2"><FontAwesomeIcon icon={faRulerCombined} className="text-brand-primary/70" />Kích thước</span>
                                <span className="font-bold text-gray-800">{book.kich_thuoc || 'Đang cập nhật'}</span>
                            </div>
                            <div className="flex flex-col gap-1 bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
                                <span className="text-gray-500 flex items-center gap-2"><FontAwesomeIcon icon={faStore} className="text-brand-primary/70" />Nhà xuất bản</span>
                                <span className="font-bold text-gray-800">{book.ten_nha_xuat_ban || 'Đang cập nhật'}</span>
                            </div>
                            <div className="flex flex-col gap-1 bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
                                <span className="text-gray-500 flex items-center gap-2"><FontAwesomeIcon icon={faCalendarAlt} className="text-brand-primary/70" />Năm xuất bản</span>
                                <span className="font-bold text-gray-800">{book.nam_xuat_ban || 'Đang cập nhật'}</span>
                            </div>
                            <div className="flex flex-col gap-1 bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
                                <span className="text-gray-500 flex items-center gap-2"><FontAwesomeIcon icon={faBookAtlas} className="text-brand-primary/70" />Số trang</span>
                                <span className="font-bold text-gray-800">{book.so_trang ? `${book.so_trang} trang` : 'Đang cập nhật'}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 mb-8 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                            <span className="font-bold text-gray-800 uppercase text-sm tracking-widest">Số lượng</span>
                            <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200">
                                <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-brand-primary transition-colors"><FontAwesomeIcon icon={faMinus} /></button>
                                <span className="w-12 text-center font-black text-gray-800">{quantity}</span>
                                <button onClick={() => setQuantity(q => Math.min(book.so_luong_ton, q+1))} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-brand-primary transition-colors"><FontAwesomeIcon icon={faPlus} /></button>
                            </div>
                            <span className="text-sm font-medium text-gray-500">
                                {book.so_luong_ton > 0 ? `Còn ${book.so_luong_ton} cuốn` : <span className="text-red-500 font-bold">Hết hàng</span>}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
                            <button 
                                onClick={handleAddToCart} 
                                disabled={book.so_luong_ton <= 0 || isAdding} 
                                className={`py-4 rounded-xl font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 border-2 ${book.so_luong_ton > 0 ? 'bg-white border-brand-primary text-brand-primary hover:bg-brand-primary/5 active:scale-95' : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'}`}
                            >
                                <FontAwesomeIcon icon={isAdding ? faRotateLeft : faCartPlus} className={`text-xl ${isAdding ? 'animate-spin' : ''}`} /> 
                                {isAdding ? 'Đang xử lý...' : 'Thêm vào giỏ'}
                            </button>
                            <button 
                                onClick={handleBuyNow} 
                                disabled={book.so_luong_ton <= 0 || isAdding} 
                                className={`py-4 rounded-xl font-black uppercase tracking-widest transition-all duration-300 shadow-lg ${book.so_luong_ton > 0 ? 'bg-brand-primary text-white hover:bg-brand-dark active:scale-95' : 'bg-gray-300 text-white cursor-not-allowed shadow-none'}`}
                            >
                                Mua ngay
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-10">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                <div className="w-1.5 h-6 bg-brand-primary rounded-full"></div>
                                <h2 className="text-xl font-black text-gray-800 uppercase tracking-wide">Giới thiệu sách</h2>
                            </div>
                            <div className="prose prose-gray max-w-none">
                                {book.mo_ta && <p className="text-gray-600 font-medium italic mb-6 leading-relaxed">{book.mo_ta}</p>}
                                <div className="text-gray-700 leading-loose text-justify whitespace-pre-line">
                                    {book.noi_dung || 'Nội dung chi tiết đang được cập nhật...'}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-10">
                            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
                                <div className="w-1.5 h-6 bg-yellow-400 rounded-full"></div>
                                <h2 className="text-xl font-black text-gray-800 uppercase tracking-wide">Đánh giá từ khách hàng</h2>
                            </div>

                            {reviews.length > 0 ? (
                                <div className="space-y-8">
                                    {reviews.map((rev) => (
                                        <div key={rev.id} className="flex gap-4 border-b border-gray-50 pb-6 last:border-0">
                                            <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-lg flex-shrink-0">
                                                {rev.ho_ten ? rev.ho_ten.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="font-bold text-gray-800">{rev.ho_ten || 'Người dùng Lumi'}</h4>
                                                    <span className="text-xs text-gray-400">
                                                        {new Date(rev.ngay_danh_gia).toLocaleDateString('vi-VN')}
                                                    </span>
                                                </div>
                                                <div className="flex text-yellow-400 text-[10px] mb-2">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FontAwesomeIcon key={i} icon={faStar} className={i < rev.so_sao ? "text-yellow-400" : "text-gray-200"} />
                                                    ))}
                                                </div>
                                                <p className="text-gray-600 text-sm leading-relaxed">{rev.binh_luan}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10">
                                    <p className="text-gray-400 italic">Sản phẩm này chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-black text-gray-800 uppercase mb-4 tracking-wide text-center">Cam kết từ Lumi</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0"><FontAwesomeIcon icon={faShield} /></div>
                                    <div><p className="font-bold text-gray-800 text-sm">100% Sách thật</p><p className="text-xs text-gray-500 mt-0.5">Hoàn tiền 200% nếu phát hiện sách giả</p></div>
                                </div>
                                <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0"><FontAwesomeIcon icon={faRotateLeft} /></div>
                                    <div><p className="font-bold text-gray-800 text-sm">Đổi trả 30 ngày</p><p className="text-xs text-gray-500 mt-0.5">Miễn phí đổi trả do lỗi nhà sản xuất</p></div>
                                </div>
                                <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0"><FontAwesomeIcon icon={faTruck} /></div>
                                    <div><p className="font-bold text-gray-800 text-sm">Giao hàng hỏa tốc</p><p className="text-xs text-gray-500 mt-0.5">Nhận sách trong 2h tại TP.HCM & HN</p></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-brand-primary rounded-3xl shadow-sm p-6 text-white text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl -ml-10 -mb-10"></div>
                            <FontAwesomeIcon icon={faTags} className="text-4xl mb-3 opacity-90" />
                            <h3 className="font-black text-lg uppercase tracking-wide mb-2">Ưu đãi thanh toán</h3>
                            <p className="text-sm text-white/90 mb-4">Nhập mã <strong className="bg-white text-brand-primary px-1.5 py-0.5 rounded">LUMIBOOK</strong> giảm thêm 15% cho đơn hàng đầu tiên.</p>
                        </div>
                    </div>
                </div>

                {relatedBooks.length > 0 && (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-10">
                        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-blue-400 rounded-full"></div>
                                <h2 className="text-xl font-black text-gray-800 uppercase tracking-wide">Có thể bạn sẽ thích</h2>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {relatedBooks.map((relBook) => {
                                const relDiscounted = relBook.gia_giam > 0 && relBook.gia_giam < relBook.gia_ban;
                                const relPrice = relDiscounted ? relBook.gia_giam : relBook.gia_ban;
                                const relPercent = relDiscounted ? Math.round(((relBook.gia_ban - relBook.gia_giam) / relBook.gia_ban) * 100) : 0;
                                return (
                                    <Link to={`/product/${relBook.id}`} key={relBook.id} className="group flex flex-col gap-3">
                                        <div className="aspect-[3/4] rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden relative">
                                            {relDiscounted && <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-full z-10">-{relPercent}%</div>}
                                            <img 
                                                src={relBook.hinh_anh ? `${IMAGE_BASE_URL}${relBook.hinh_anh}` : 'https://via.placeholder.com/300x400'} 
                                                alt={relBook.ten_sach} 
                                                className="w-full h-full object-contain mix-blend-multiply p-4 group-hover:scale-110 transition-transform duration-500" 
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <h3 className="font-bold text-gray-800 line-clamp-2 text-sm group-hover:text-brand-primary transition-colors min-h-[40px]">{relBook.ten_sach}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="font-black text-red-600">{Number(relPrice).toLocaleString('vi-VN')} đ</span>
                                                {relDiscounted && <span className="text-xs text-gray-400 line-through">{Number(relBook.gia_ban).toLocaleString('vi-VN')} đ</span>}
                                            </div>  
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductDetail;