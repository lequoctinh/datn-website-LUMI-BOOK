import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlay, faAward, faBolt } from "@fortawesome/free-solid-svg-icons";
import './css/HeroSection.css';

const HERO_DATA = [
    {
        id: 1,
        title: "Tâm Lý Học Về Tiền",
        category: "TÀI CHÍNH CÁ NHÂN",
        desc: "Một góc nhìn hoàn toàn mới về sự giàu có. Không phải là những con số vô tri, mà là cách bạn kiểm soát cái tôi và nỗi sợ hãi.",
        price: "159.000đ",
        image: "/Hero_Section/Hero_Section1.png", 
        theme: "from-emerald-50 to-teal-100",
        accent: "text-emerald-800",
        btn: "bg-emerald-800",
        shadow: "shadow-emerald-900/20"
    },
    {
        id: 2,
        title: "Nhà Giả Kim",
        category: "VĂN HỌC KINH ĐIỂN",
        desc: "Khi bạn khao khát một điều gì đó, cả vũ trụ sẽ hợp lực giúp bạn đạt được. Cuốn sách gối đầu giường của hàng triệu người trẻ.",
        price: "89.000đ",
        image: "/Hero_Section/Hero_Section2.png",
        theme: "from-orange-50 to-amber-100",
        accent: "text-orange-700",
        btn: "bg-orange-700",
        shadow: "shadow-orange-900/20"
    },
    {
        id: 3,
        title: "Rừng Na Uy",
        category: "TIỂU THUYẾT LÃNG MẠN",
        desc: "Một bản nhạc buồn của tuổi trẻ, tình yêu và sự mất mát. Kiệt tác đưa tên tuổi Murakami vươn tầm thế giới.",
        price: "115.000đ",
        image: "/Hero_Section/Hero_Section3.png",
        theme: "from-slate-50 to-gray-200",
        accent: "text-slate-800",
        btn: "bg-slate-800",
        shadow: "shadow-slate-900/20"
    }
];

function HeroSection() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            handleNext();
        }, 6000);
        return () => clearInterval(timer);
    }, [currentIndex]);

    const handleNext = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % HERO_DATA.length);
            setIsAnimating(false);
        }, 500); 
    };

    const data = HERO_DATA[currentIndex];

    return (
        <section className={`lumi-hero-wrapper bg-gradient-to-br ${data.theme} transition-colors duration-1000`}>
            
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(8)].map((_, i) => (
                    <div 
                        key={i} 
                        className="lumi-particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 6 + 2}px`,
                            height: `${Math.random() * 6 + 2}px`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${Math.random() * 10 + 10}s`
                        }}
                    ></div>
                ))}
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-white/40 rounded-full blur-[80px] md:blur-[120px] mix-blend-overlay pointer-events-none"></div>

            <div className="container mx-auto px-4 py-12 md:py-0 h-full relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-0">
                
                <div className={`w-full md:w-1/2 flex flex-col items-start space-y-6 md:space-y-8 pl-0 md:pl-10 transition-all duration-500 z-20 ${isAnimating ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}>
                    
                    <div className="lumi-glass-box px-4 py-1.5 md:px-6 md:py-2 rounded-full flex items-center gap-3 lumi-anim-slide-up" style={{animationDelay: '0.1s'}}>
                        <FontAwesomeIcon icon={faBolt} className={`${data.accent}`} />
                        <span className={`text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase ${data.accent}`}>
                            {data.category}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-7xl font-heading font-black text-gray-900 leading-[1.1] lumi-anim-slide-up" style={{animationDelay: '0.2s'}}>
                        {data.title.split(' ').map((word, i) => (
                            <span key={i} className="inline-block mr-2 md:mr-3">{word}</span>
                        ))}
                    </h1>

                    <div className="relative pl-4 md:pl-6 border-l-4 border-gray-900/10 lumi-anim-slide-up" style={{animationDelay: '0.3s'}}>
                        <p className="text-base md:text-xl text-gray-600 font-body leading-relaxed max-w-lg line-clamp-4 md:line-clamp-none">
                            {data.desc}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-2 md:pt-4 lumi-anim-slide-up" style={{animationDelay: '0.4s'}}>
                        <button className={`group relative px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl text-white font-bold overflow-hidden transition-all hover:scale-105 ${data.btn} ${data.shadow} shadow-xl flex-1 md:flex-none`}>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            <span className="relative flex items-center justify-center gap-2 md:gap-3 text-sm md:text-base">
                                MUA NGAY {data.price}
                                <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                        
                        <button className="group px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl bg-white/50 border border-white text-gray-800 font-bold backdrop-blur-sm hover:bg-white transition-all shadow-sm flex items-center justify-center gap-3 flex-1 md:flex-none text-sm md:text-base">
                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-[10px] md:text-xs group-hover:scale-110 transition-transform">
                                <FontAwesomeIcon icon={faPlay} className="ml-0.5" />
                            </div>
                            Đọc Thử
                        </button>
                    </div>

                    <div className="hidden md:flex items-center gap-6 pt-6 opacity-80 lumi-anim-slide-up" style={{animationDelay: '0.5s'}}>
                        <div className="flex -space-x-3">
                            <img src="https://i.pravatar.cc/100?img=1" className="w-10 h-10 rounded-full border-2 border-white" alt="User" />
                            <img src="https://i.pravatar.cc/100?img=5" className="w-10 h-10 rounded-full border-2 border-white" alt="User" />
                            <img src="https://i.pravatar.cc/100?img=8" className="w-10 h-10 rounded-full border-2 border-white" alt="User" />
                            <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-900 text-white flex items-center justify-center text-xs font-bold">+2k</div>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex text-yellow-500 text-xs mb-1">
                                {[...Array(5)].map((_,i)=><FontAwesomeIcon key={i} icon={faAward} />)}
                            </div>
                            <span className="text-sm font-bold text-gray-500">Đánh giá 5.0 tuyệt đối</span>
                        </div>
                    </div>
                </div>

                <div className={`w-full md:w-1/2 min-h-[400px] md:h-full relative lumi-3d-stage transition-all duration-700 pb-20 md:pb-0 ${isAnimating ? 'opacity-0 scale-90 translate-x-10' : 'opacity-100 scale-100 translate-x-0'}`}>
                    
                    <div className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] border border-white/40 rounded-full lumi-spin-slow opacity-30"></div>
                    <div className="absolute w-[250px] h-[250px] md:w-[500px] md:h-[500px] border border-dashed border-gray-900/10 rounded-full lumi-spin-reverse opacity-40"></div>
                    <div className={`absolute w-[150px] h-[150px] md:w-[200px] md:h-[200px] bg-white rounded-full blur-[60px] md:blur-[80px] mix-blend-soft-light lumi-glow-effect`}></div>

                    <div className="lumi-book-container lumi-anim-float group">
                        <div className="lumi-book-spine"></div>
                        
                        <img 
                            src={data.image} 
                            alt={data.title}
                            className="lumi-book-cover relative w-auto h-auto md:w-[350px]"
                            onError={(e) => {
                                e.target.style.display = 'none'; 
                                console.error("Lỗi load ảnh:", data.image);
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-1.5 md:h-2 bg-gray-200/30 z-40">
                <div 
                    key={currentIndex} 
                    className={`h-full ${data.btn} lumi-progress-bar`}
                ></div>
            </div>

            <div className="absolute bottom-10 right-10 hidden md:flex flex-col gap-4 z-50">
                {HERO_DATA.map((_, idx) => (
                    <button 
                        key={idx}
                        onClick={() => { if(!isAnimating) { setIsAnimating(true); setTimeout(() => { setCurrentIndex(idx); setIsAnimating(false); }, 500); } }}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-gray-900 scale-150 ring-4 ring-gray-900/20' : 'bg-gray-400 hover:bg-gray-600'}`}
                    />
                ))}
            </div>
        </section>
    );
}

export default HeroSection;