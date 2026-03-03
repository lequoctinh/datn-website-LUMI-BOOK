import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen, faChartLine, faChild, faGlobe, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import './css/BookCategories.css';

const FEATURED_CATS = [
    { 
        id: "01", 
        name: "Văn Học", 
        sub: "Tiểu thuyết & Tản văn",
        desc: "Những câu chuyện chạm đến cảm xúc và tâm hồn.",
        icon: faBookOpen, 
        path: "/danh-muc/van-hoc",
        color: "text-rose-900",
        bg_hover: "group-hover:bg-rose-50",
        border: "group-hover:border-rose-200"
    },
    { 
        id: "02", 
        name: "Kinh Tế", 
        sub: "Tư duy & Làm giàu",
        desc: "Bài học thương trường từ những vĩ nhân.",
        icon: faChartLine, 
        path: "/danh-muc/kinh-te",
        color: "text-emerald-900",
        bg_hover: "group-hover:bg-emerald-50",
        border: "group-hover:border-emerald-200"
    },
    { 
        id: "03", 
        name: "Thiếu Nhi", 
        sub: "Giáo dục & Truyện tranh",
        desc: "Ươm mầm tri thức cho thế hệ tương lai.",
        icon: faChild, 
        path: "/danh-muc/thieu-nhi",
        color: "text-amber-900",
        bg_hover: "group-hover:bg-amber-50",
        border: "group-hover:border-amber-200"
    },
    { 
        id: "04", 
        name: "Ngoại Văn", 
        sub: "Sách tiếng Anh - Nhật",
        desc: "Mở rộng chân trời với ngôn ngữ toàn cầu.",
        icon: faGlobe, 
        path: "/danh-muc/ngoai-van",
        color: "text-sky-900",
        bg_hover: "group-hover:bg-sky-50",
        border: "group-hover:border-sky-200"
    }
];

function BookCategories() {
    return (
        <section className="relative z-30 w-full -mt-20 md:-mt-24 px-4 pb-16">
            <div className="mx-auto max-w-[1200px]">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {FEATURED_CATS.map((item) => (
                        <Link 
                            to={item.path}
                            key={item.id} 
                            className={`group relative block h-[320px] bg-white rounded-t-2xl rounded-b-lg shadow-xl border-b-4 border-transparent ${item.border} transition-all duration-500 ease-out hover:-translate-y-3 hover:shadow-2xl overflow-hidden`}
                        >
                            <div className={`absolute inset-0 opacity-0 ${item.bg_hover} transition-all duration-500`}></div>
                            
                            <div className="absolute -right-4 -top-6 text-[120px] font-black text-gray-100 font-heading select-none group-hover:scale-110 group-hover:text-gray-200/50 transition-all duration-700">
                                {item.id}
                            </div>

                            <div className="relative h-full p-8 flex flex-col justify-between z-10">
                                <div>
                                    <div className={`w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl mb-6 shadow-sm group-hover:scale-110 group-hover:rotate-6 group-hover:bg-white transition-all duration-500 ${item.color}`}>
                                        <FontAwesomeIcon icon={item.icon} />
                                    </div>

                                    <h3 className="text-2xl font-heading font-bold text-gray-800 mb-1 group-hover:translate-x-1 transition-transform">
                                        {item.name}
                                    </h3>
                                    <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4 group-hover:text-gray-500 transition-colors">
                                        {item.sub}
                                    </p>
                                    <p className="text-sm text-gray-500 font-body leading-relaxed line-clamp-3 opacity-80 group-hover:opacity-100 transition-opacity">
                                        {item.desc}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 text-xs font-bold text-gray-800 uppercase tracking-widest group-hover:gap-4 transition-all duration-300">
                                    <span className="relative pb-1">
                                        Xem Chi Tiết
                                        <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-brand-primary transition-all duration-300 group-hover:w-full"></span>
                                    </span>
                                    <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default BookCategories;