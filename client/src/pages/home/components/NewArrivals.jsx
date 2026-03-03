import React from 'react';
import './css/NewArrivals.css';

const newArrivals = [
{ 
    id: 1, 
    title: "Think Again", 
    author: "Adam Grant", 
    price: "185.000đ", 
    originalPrice: "230.000đ",
    discount: "-20%",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600",
    tag: "hot"
},
{ 
    id: 2, 
    title: "Noise: A Flaw in Human Judgment", 
    author: "Daniel Kahneman", 
    price: "210.000đ", 
    originalPrice: "260.000đ",
    discount: "-19%",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=600",
    tag: "new"
},
{ 
    id: 3, 
    title: "Bộ Não Phật Giáo", 
    author: "Rick Hanson", 
    price: "145.000đ", 
    originalPrice: "180.000đ",
    discount: "-20%",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600",
    tag: "new"
},
{ 
    id: 4, 
    title: "Nghệ Thuật Tư Duy", 
    author: "Rolf Dobelli", 
    price: "98.000đ", 
    originalPrice: "125.000đ",
    discount: "-22%",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600",
    tag: "reprint"
},
{ 
    id: 5, 
    title: "Dám Bị Ghét", 
    author: "Kishimi Ichiro", 
    price: "115.000đ", 
    originalPrice: "145.000đ",
    discount: "-21%",
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600",
    tag: "hot"
},
{ 
    id: 6, 
    title: "Sống Tối Giản", 
    author: "Joshua Fields", 
    price: "85.000đ", 
    originalPrice: "110.000đ",
    discount: "-23%",
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=600",
    tag: "new"
},
{ 
    id: 7, 
    title: "Essentialism", 
    author: "Greg McKeown", 
    price: "130.000đ", 
    originalPrice: "165.000đ",
    discount: "-21%",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600",
    tag: "hot"
},
{ 
    id: 8, 
    title: "Grit: Bền Bỉ", 
    author: "Angela Duckworth", 
    price: "155.000đ", 
    originalPrice: "195.000đ",
    discount: "-20%",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=600",
    tag: "new"
},
];

const NewArrivals = () => {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-12 ln-perspective">
        {newArrivals.map((book) => (
            <div key={book.id} className="ln-card rounded-2xl p-4 flex flex-col h-[480px]">
            
            <div className="ln-ribbon-mark">
                {book.tag === 'hot' && <i className="fa-solid fa-fire"></i>}
                {book.tag === 'new' && <i className="fa-solid fa-star"></i>}
                {book.tag === 'reprint' && <i className="fa-solid fa-rotate"></i>}
            </div>

            <div className="ln-book-stage mb-4">
                <div className="ln-book-obj">
                <div className="ln-spine"></div>
                <div className="ln-pages"></div>
                <div className="ln-cover">
                    <div className="ln-lighting"></div>
                    <img 
                    src={book.image} 
                    alt={book.title} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-dark/10 to-transparent pointer-events-none"></div>
                </div>
                </div>
                <div className="ln-shadow-phantom"></div>
            </div>

            <div className="flex flex-col flex-grow z-20 bg-surface">
                <div className="mb-auto">
                <h3 className="font-heading text-lg font-bold text-text-primary line-clamp-1 hover:text-brand-primary transition-colors cursor-pointer">
                    {book.title}
                </h3>
                <p className="text-text-muted text-xs uppercase tracking-wide mt-1 font-body">
                    {book.author}
                </p>
                </div>

                <div className="w-full border-t border-border-light border-dashed my-3"></div>

                <div className="flex items-end justify-between">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted line-through decoration-red-400 decoration-1">{book.originalPrice}</span>
                    <span className="text-[10px] font-bold text-accent-primary bg-accent-primary/10 px-1.5 py-0.5 rounded">{book.discount}</span>
                    </div>
                    <span className="font-heading text-xl font-bold text-accent-primary">
                    {book.price}
                    </span>
                </div>

                <button className="ln-btn-cart">
                    <i className="fa-solid fa-cart-shopping"></i>
                </button>
                </div>
            </div>
            </div>
        ))}
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