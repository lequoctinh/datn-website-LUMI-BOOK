import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faSortAmountDown, faThLarge, faList, faCartPlus } from '@fortawesome/free-solid-svg-icons';

const categories = ["Tất cả", "Văn học", "Kinh tế", "Kỹ năng sống", "Tâm lý học", "Thiếu nhi", "Ngoại ngữ"];
const prices = ["Tất cả", "Dưới 100.000đ", "100.000đ - 300.000đ", "Trên 300.000đ"];

const ProductList = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("Tất cả");

  // Dữ liệu mẫu mở rộng
  const allBooks = [
    { id: 1, title: "Nhà Giả Kim", author: "Paulo Coelho", price: 79000, oldPrice: 99000, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600", category: "Văn học" },
    { id: 2, title: "Đắc Nhân Tâm", author: "Dale Carnegie", price: 125000, oldPrice: 150000, image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600", category: "Kỹ năng sống" },
    { id: 3, title: "Sapiens", author: "Yuval Noah Harari", price: 280000, oldPrice: 350000, image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600", category: "Kinh tế" },
    { id: 4, title: "Hoàng Tử Bé", author: "Saint-Exupéry", price: 76000, oldPrice: 95000, image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=600", category: "Văn học" },
    { id: 5, title: "Tuổi Trẻ Đáng Giá", author: "Rosie Nguyễn", price: 89000, oldPrice: 120000, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600", category: "Kỹ năng sống", top: 5 },
    { id: 6, title: "Rừng Na Uy", author: "Murakami Haruki", price: 168000, oldPrice: 210000, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600", category: "Văn học", top: 6 },
    { id: 7, title: "Hai Số Phận", author: "Jeffrey Archer", price: 192000, oldPrice: 240000, image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600", category: "Văn học", top: 7 },
    { id: 8, title: "Bố Già", author: "Mario Puzo", price: 156000, oldPrice: 195000, image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=600", category: "Văn học", top: 8 }
];

  return (
    <div className="min-h-screen bg-background font-body py-10 px-4 sm:px-6 lg:px-8 text-text-primary">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Trang */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="font-heading text-4xl md:text-5xl text-brand-primary mb-2">Thư Viện Lumi</h1>
            <p className="text-text-secondary italic">Khám phá hàng ngàn cuốn sách tinh hoa được chọn lọc</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Tìm tên sách, tác giả..." 
                className="pl-10 pr-4 py-2.5 rounded-full border border-border-default focus:border-brand-primary outline-none bg-surface w-64 transition-all focus:w-80 shadow-sm"
              />
              <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand-primary" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* CỘT TRÁI: BỘ LỌC (SIDEBAR) */}
          <aside className="lg:col-span-3 space-y-8">
            <div className="bg-surface p-6 rounded-2xl shadow-card border border-border-light sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-brand-primary font-bold border-b border-border-light pb-2">
                <FontAwesomeIcon icon={faFilter} />
                <span className="uppercase tracking-widest text-sm">Bộ lọc tìm kiếm</span>
              </div>

              {/* Danh mục */}
              <div className="mb-8">
                <h3 className="font-bold mb-4 text-sm">Thể loại</h3>
                <div className="flex flex-col gap-2">
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="category" 
                        checked={activeCategory === cat}
                        onChange={() => setActiveCategory(cat)}
                        className="hidden"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${activeCategory === cat ? 'border-brand-primary bg-brand-primary' : 'border-border-default group-hover:border-brand-primary'}`}>
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                      <span className={`text-sm transition-colors ${activeCategory === cat ? 'text-brand-primary font-bold' : 'text-text-secondary group-hover:text-text-primary'}`}>
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Khoảng giá */}
              <div className="mb-8">
                <h3 className="font-bold mb-4 text-sm">Khoảng giá</h3>
                <div className="space-y-2">
                  {prices.map(price => (
                    <label key={price} className="flex items-center gap-3 cursor-pointer group text-sm text-text-secondary hover:text-text-primary">
                      <input type="checkbox" className="rounded border-border-default text-brand-primary focus:ring-brand-primary" />
                      {price}
                    </label>
                  ))}
                </div>
              </div>

              <button className="w-full py-3 bg-brand-primary/10 text-brand-primary rounded-xl font-bold text-xs uppercase hover:bg-brand-primary hover:text-white transition-all">
                Xóa tất cả lọc
              </button>
            </div>
          </aside>

          {/* CỘT PHẢI: DANH SÁCH SẢN PHẨM */}
          <div className="lg:col-span-9">
            
            {/* Toolbar trên danh sách */}
            <div className="flex items-center justify-between mb-6 bg-surface px-6 py-4 rounded-xl border border-border-light shadow-sm">
              <div className="text-sm text-text-secondary">
                Hiển thị <span className="font-bold text-text-primary">12</span> trong <span className="font-bold text-text-primary">480</span> cuốn sách
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <FontAwesomeIcon icon={faSortAmountDown} className="text-brand-primary" />
                  <select className="bg-transparent border-none outline-none font-bold text-text-primary cursor-pointer">
                    <option>Mới nhất</option>
                    <option>Giá thấp đến cao</option>
                    <option>Giá cao đến thấp</option>
                    <option>Bán chạy nhất</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Grid sản phẩm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {allBooks.map((book) => (
                <div 
                  key={book.id} 
                  onClick={() => navigate(`/product/${book.id}`)}
                  className="group bg-surface rounded-2xl p-4 border border-border-light shadow-card hover:shadow-hover transition-all cursor-pointer flex flex-col h-full"
                >
                  <div className="aspect-[3/4] rounded-xl overflow-hidden mb-4 bg-white relative">
                    <img src={book.image} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                  </div>

                  <div className="flex flex-col flex-grow">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-brand-primary font-bold mb-1 opacity-70">{book.author}</p>
                    <h3 className="font-heading text-lg text-text-primary line-clamp-2 group-hover:text-brand-primary transition-colors mb-2">
                      {book.title}
                    </h3>
                    
                    <div className="mt-auto pt-4 border-t border-dashed border-border-light flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-xs text-text-muted line-through">{book.oldPrice.toLocaleString()}đ</span>
                        <span className="text-lg font-bold text-accent-primary">{book.price.toLocaleString()}đ</span>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); /* Logic thêm giỏ hàng */ }}
                        className="w-10 h-10 bg-background rounded-full flex items-center justify-center text-brand-primary border border-brand-primary/20 hover:bg-brand-primary hover:text-white transition-all shadow-sm"
                      >
                        <FontAwesomeIcon icon={faCartPlus} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Phân trang */}
            <div className="mt-12 flex justify-center gap-2">
              <button className="w-10 h-10 rounded-lg border border-border-default flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all font-bold">1</button>
              <button className="w-10 h-10 rounded-lg border border-border-default flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all font-bold">2</button>
              <button className="w-10 h-10 rounded-lg border border-border-default flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all font-bold">...</button>
              <button className="px-4 h-10 rounded-lg border border-border-default flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all font-bold uppercase text-[10px] tracking-widest">Tiếp theo</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;