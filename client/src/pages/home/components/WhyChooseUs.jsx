import React from 'react';
import './css/WhyChooseUs.css';

const reasons = [
    {
        id: 1,
        image: "/WhyChooseUs/Chất lượng sách tuyển chọn.png",
        icon: "fa-solid fa-certificate",
        title: "Chất Lượng Tuyển Chọn",
        desc: "Mỗi cuốn sách đều được kiểm tra kỹ lưỡng về nội dung và hình thức.",
        delay: "0s"
    },
    {
        id: 2,
        image: "/WhyChooseUs/Uy tín và sự hỗ trợ tận tâm.png",
        icon: "fa-solid fa-heart",
        title: "Hỗ Trợ Tận Tâm",
        desc: "Đội ngũ tư vấn luôn sẵn sàng giúp bạn tìm thấy cuốn sách ưng ý.",
        delay: "0.1s"
    },
    {
        id: 3,
        image: "/WhyChooseUs/Giao hàng nhanh và tin cậy.png",
        icon: "fa-solid fa-truck-fast",
        title: "Giao Hàng Siêu Tốc",
        desc: "Hệ thống vận chuyển tối ưu, mang tri thức đến bạn nhanh nhất.",
        delay: "0.2s"
    },
    {
        id: 4,
        image: "/WhyChooseUs/Cảm hứng đọc sách mỗi ngày.png",
        icon: "fa-solid fa-lightbulb",
        title: "Lan Tỏa Cảm Hứng",
        desc: "Khơi gợi niềm đam mê đọc sách và khám phá tri thức mỗi ngày.",
        delay: "0.3s"
    }
];

const WhyChooseUs = () => {
    return (
        <section className="lumi-wcu-section py-20 flex justify-center">
            <div className="lumi-wcu-bg-grid"></div>
            <div className="lumi-wcu-orb lumi-wcu-orb-1"></div>
            <div className="lumi-wcu-orb lumi-wcu-orb-2"></div>

            <div className="w-full max-w-[1200px] px-4">
                <div className="lumi-wcu-header text-center mb-12">
                    <div className="lumi-wcu-badge inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-full mb-4">
                        <i className="fa-solid fa-star"></i>
                        <span className="font-bold text-sm uppercase tracking-wider">Giá Trị Khác Biệt</span>
                    </div>
                    <h2 className="lumi-wcu-title text-3xl md:text-4xl font-heading font-black">
                        Vì Sao Chọn <span className="text-brand-primary">Lumi Book?</span>
                    </h2>
                </div>

                <div className="lumi-wcu-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {reasons.map((item) => (
                        <div 
                            key={item.id} 
                            className="lumi-wcu-frame group"
                            style={{ animationDelay: item.delay }}
                        >
                            <div className="lumi-wcu-pin">
                                <i className={item.icon}></i>
                            </div>
                            
                            <div className="lumi-wcu-inner relative overflow-hidden rounded-2xl shadow-lg bg-white p-4">
                                <div className="lumi-wcu-sheen"></div>
                                <div className="aspect-[4/5] overflow-hidden rounded-xl mb-4">
                                    <img 
                                        src={item.image} 
                                        alt={item.title} 
                                        className="lumi-wcu-img w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            console.error("Lỗi ảnh:", item.image);
                                        }}
                                    />
                                </div>
                                <div className="text-center">
                                    <h3 className="font-bold text-lg mb-2 text-text-primary">{item.title}</h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;