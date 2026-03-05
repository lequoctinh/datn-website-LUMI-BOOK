import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Sửa: Thay faTruckFast -> faTruck, faShieldCheck -> faShield
import { faStar, faCartPlus, faTruck, faShield, faRotateLeft, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  // Dữ liệu mẫu
  const book = {
    title: "Nhà Giả Kim (Tái Bản 2024)",
    author: "Paulo Coelho",
    price: 79000,
    oldPrice: 99000,
    rating: 4.8,
    reviews: 1250,
    description: "Tất cả những trải nghiệm trong chuyến phiêu lưu theo đuổi vận mệnh của mình đã giúp Santiago thấu hiểu được ý nghĩa sâu xa nhất của hạnh phúc, hòa hợp với vũ trụ và con người...",
    publisher: "NXB Hội Nhà Văn",
    category: "Văn học nước ngoài",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600"
    ]
  };

  const handleAddToCart = () => {
    toast.success(`Đã thêm ${quantity} cuốn ${book.title} vào giỏ hàng!`);
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8 font-body text-text-primary">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-surface p-8 rounded-3xl shadow-card border border-border-light">
          
          {/* Cột Trái: Hình ảnh */}
          <div className="space-y-4">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-border-light shadow-md bg-white">
              <img src={book.images[0]} alt={book.title} className="w-full h-full object-contain p-4 transition-transform hover:scale-105 duration-500" />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {book.images.map((img, idx) => (
                <div key={idx} className="aspect-square rounded-lg border-2 border-border-light cursor-pointer hover:border-brand-primary overflow-hidden">
                  <img src={img} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Cột Phải: Thông tin chi tiết */}
          <div className="flex flex-col">
            <nav className="text-sm text-text-secondary mb-4 italic">
              Trang chủ / {book.category} / <span className="text-brand-primary font-semibold">{book.author}</span>
            </nav>

            <h1 className="font-heading text-4xl mb-4 leading-tight">{book.title}</h1>
            
            <div className="flex items-center gap-6 mb-6">
              <div className="flex items-center text-accent-primary">
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon key={i} icon={faStar} className={i < 4 ? "text-accent-primary" : "text-border-default"} />
                ))}
                <span className="ml-2 text-text-primary font-bold">{book.rating}</span>
              </div>
              <span className="text-text-muted">|</span>
              <span className="text-text-secondary">{book.reviews} đánh giá</span>
            </div>

            <div className="bg-background/50 p-6 rounded-2xl mb-8 border border-border-light/50">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-accent-primary">{book.price.toLocaleString()} đ</span>
                <span className="text-lg text-text-muted line-through">{book.oldPrice.toLocaleString()} đ</span>
                <span className="bg-state-danger text-white px-2 py-0.5 rounded text-sm font-bold">-20%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-4 mb-8 text-sm border-b border-border-light pb-6">
              <div className="flex flex-col gap-1">
                <span className="text-text-secondary uppercase text-[11px] tracking-wider font-bold">Tác giả</span>
                <span className="font-bold text-brand-primary">{book.author}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-text-secondary uppercase text-[11px] tracking-wider font-bold">Nhà xuất bản</span>
                <span className="font-bold">{book.publisher}</span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <span className="font-bold">Số lượng:</span>
                <div className="flex items-center border-2 border-border-default rounded-xl bg-background overflow-hidden">
                  <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="p-3 hover:text-accent-primary transition-colors">
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                  <span className="px-6 font-bold text-lg min-w-[60px] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(q => q+1)} className="p-3 hover:text-accent-primary transition-colors">
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <button 
                  onClick={handleAddToCart}
                  className="bg-brand-primary hover:bg-brand-hover text-white py-4 rounded-xl font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-wide"
                >
                  <FontAwesomeIcon icon={faCartPlus} /> Thêm vào giỏ
                </button>
                <button 
                  onClick={() => navigate('/checkout')}
                  className="bg-accent-primary hover:bg-accent-hover text-white py-4 rounded-xl font-bold shadow-md transition-all active:scale-95 uppercase tracking-wide"
                >
                  Mua ngay
                </button>
              </div>
            </div>

            {/* Chính sách cam kết - Đã sửa lỗi icon ở đây */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-border-light pt-8">
              <div className="flex items-center gap-3 text-xs text-text-secondary">
                <FontAwesomeIcon icon={faTruck} className="text-brand-primary text-xl" />
                <span>Giao siêu tốc 2h</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-text-secondary">
                <FontAwesomeIcon icon={faShield} className="text-brand-primary text-xl" />
                <span>Sách thật 100%</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-text-secondary">
                <FontAwesomeIcon icon={faRotateLeft} className="text-brand-primary text-xl" />
                <span>Đổi trả 7 ngày</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mô tả chi tiết */}
        <div className="mt-12 bg-surface p-8 rounded-3xl shadow-card border border-border-light">
          <h2 className="font-heading text-2xl mb-6 border-b border-border-light pb-4 text-brand-primary">Giới thiệu nội dung</h2>
          <div className="prose max-w-none text-text-secondary leading-relaxed space-y-4 italic">
            <p>{book.description}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;