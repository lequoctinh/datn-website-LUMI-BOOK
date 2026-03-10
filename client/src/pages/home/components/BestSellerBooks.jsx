import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/BestSellerBooks.css';
const bestSellers = [
{ 
    id: 1, 
    title: "Nhà Giả Kim", 
    author: "Paulo Coelho", 
    price: "119.000đ", 
    originalPrice: "159.000đ",
    discount: "-25%",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600",
    top: 1
},
{ 
    id: 2, 
    title: "Đắc Nhân Tâm", 
    author: "Dale Carnegie", 
    price: "144.000đ", 
    originalPrice: "180.000đ",
    discount: "-20%",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600",
    top: 2
},
{ 
    id: 3, 
    title: "Tuổi Trẻ Đáng Giá", 
    author: "Rosie Nguyễn", 
    price: "89.000đ", 
    originalPrice: "120.000đ",
    discount: "-26%",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600",
    top: 3
},
{ 
    id: 4, 
    title: "Rừng Na Uy", 
    author: "Murakami Haruki", 
    price: "168.000đ", 
    originalPrice: "210.000đ",
    discount: "-20%",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600",
    top: 4
},
{ 
    id: 5, 
    title: "Sapiens Lược Sử", 
    author: "Yuval Noah Harari", 
    price: "280.000đ", 
    originalPrice: "350.000đ",
    discount: "-20%",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600",
    top: 5
},
{ 
    id: 6, 
    title: "Hoàng Tử Bé", 
    author: "Saint-Exupéry", 
    price: "76.000đ", 
    originalPrice: "95.000đ",
    discount: "-20%",
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=600",
    top: 6
},
{ 
    id: 7, 
    title: "Hai Số Phận", 
    author: "Jeffrey Archer", 
    price: "192.000đ", 
    originalPrice: "240.000đ",
    discount: "-20%",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600",
    top: 7
},
{ 
    id: 8, 
    title: "Bố Già", 
    author: "Mario Puzo", 
    price: "156.000đ", 
    originalPrice: "195.000đ",
    discount: "-20%",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=600",
    top: 8
},
];

const BestSellerBooks = () => {
  const navigate = useNavigate(); // 2. Khởi tạo navigate

  const handleProductClick = (id) => {
    // 3. Hàm điều hướng khi click vào card
    navigate(`/product/${id}`);
    window.scrollTo(0, 0); // Đảm bảo trang mới luôn ở đầu trang
  };

  const handleAddToCart = (e) => {
    // 4. Hàm ngăn chặn việc nhảy trang khi click vào nút Giỏ hàng
    e.stopPropagation();
    console.log("Thêm vào giỏ hàng!");
    // Logic thêm vào giỏ hàng của bạn ở đây
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
          <h2 className="font-heading text-4xl md:text-6xl font-extrabold text-brand-primary text-center mt-2">
            Sản phẩm bán chạy
          </h2>
          <p className="text-text-secondary mt-4 italic font-body text-base max-w-2xl text-center">
            Tuyển tập những tác phẩm kinh điển được cộng đồng độc giả yêu thích nhất tháng này
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 gap-y-12 lumi-perspective">
          {bestSellers.map((book) => (
            <div 
              key={book.id} 
              onClick={() => handleProductClick(book.id)} // 5. Thêm sự kiện click cho toàn bộ card
              className="lumi-card group relative rounded-xl p-5 border border-border-light cursor-pointer h-[460px] flex flex-col items-center"
            >
              
              <div className="absolute top-0 right-4 z-20">
                <div className="discount-badge w-10 h-14 bg-accent-primary flex items-start justify-center pt-2 shadow-lg">
                  <span className="text-white text-xs font-bold">{book.discount}</span>
                </div>
              </div>

              <div className="absolute top-4 left-4 z-20 opacity-90">
                <div className="bg-brand-dark/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1 border border-white/20">
                  <i className="fa-solid fa-crown text-yellow-400"></i>
                  <span>TOP {book.top}</span>
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
                      src={book.image} 
                      alt={book.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent pointer-events-none"></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col w-full text-center flex-grow z-30">
                <h3 className="font-heading text-lg font-bold text-text-primary line-clamp-1 px-2 group-hover:text-brand-primary transition-colors">
                  {book.title}
                </h3>
                <p className="text-text-secondary text-xs uppercase tracking-wider mb-3 mt-1 font-body">
                  {book.author}
                </p>

                <div className="w-full border-t border-dashed border-border-light my-auto"></div>

                <div className="flex items-end justify-between w-full px-1 mt-3">
                  <div className="flex flex-col items-start text-left">
                    <span className="text-xs text-text-muted line-through decoration-red-400 decoration-1">
                      {book.originalPrice}
                    </span>
                    <span className="font-heading text-xl font-bold text-accent-primary">
                      {book.price}
                    </span>
                  </div>
                  
                  {/* 6. Thêm onClick và stopPropagation cho nút thêm vào giỏ */}
                  <button 
                    onClick={handleAddToCart}
                    className="btn-add-cart w-10 h-10 rounded-lg border border-brand-light text-brand-primary flex items-center justify-center bg-transparent hover:bg-brand-primary hover:text-white transition-all duration-300"
                  >
                    <i className="fa-solid fa-cart-shopping text-base"></i>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

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