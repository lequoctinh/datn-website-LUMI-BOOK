import React from 'react';
import './css/WhyChooseUs.css';

const reasons = [
{
    id: 1,
    image: "/WhyChooseUs/WhyChooseUs_1.png",
    icon: "fa-solid fa-certificate",
    delay: "0s"
},
{
    id: 2,
    image: "/WhyChooseUs/WhyChooseUs_2.png",
    icon: "fa-solid fa-thumbs-up",
    delay: "0.1s"
},
{
    id: 3,
    image: "/WhyChooseUs/WhyChooseUs_3.png",
    icon: "fa-solid fa-truck-fast",
    delay: "0.2s"
},
{
    id: 4,
    image: "/WhyChooseUs/WhyChooseUs_4.png",
    icon: "fa-solid fa-gift",
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
        
        <div className="lumi-wcu-header">
        <div className="lumi-wcu-badge">
            <i className="fa-solid fa-star"></i>
            Giá Trị Khác Biệt
        </div>
        <h2 className="lumi-wcu-title">
            Vì Sao Chọn <span>Lumi Book?</span>
        </h2>
        </div>

        <div className="lumi-wcu-grid">
        {reasons.map((item) => (
            <div 
            key={item.id} 
            className="lumi-wcu-frame"
            style={{ animationDelay: item.delay }}
            >
            <div className="lumi-wcu-pin">
                <i className={item.icon}></i>
            </div>
            
            <div className="lumi-wcu-inner">
                <div className="lumi-wcu-sheen"></div>
                <img 
                src={item.image} 
                alt="Lumi Benefit" 
                className="lumi-wcu-img"
                onError={(e) => {
                    e.target.style.display = 'none';
                    console.error("Lỗi ảnh:", item.image);
                }}
                />
            </div>
            </div>
        ))}
        </div>

    </div>
    </section>
);
};

export default WhyChooseUs;