import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Cảm ơn bạn! Lumi Book đã nhận được thông tin và sẽ phản hồi sớm nhất.");
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Trang */}
        <div className="text-center mb-16">
          <h1 className="font-heading text-4xl md:text-5xl text-brand-primary mb-4">Liên Hệ Với Lumi</h1>
          <div className="h-1 w-20 bg-accent-primary mx-auto mb-6"></div>
          <p className="text-text-secondary max-w-2xl mx-auto italic">
            Chúng mình luôn sẵn sàng lắng nghe những chia sẻ, góp ý hoặc giải đáp mọi thắc mắc của bạn về những cuốn sách.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-surface rounded-3xl overflow-hidden shadow-card border border-border-light">
          
          {/* CỘT TRÁI: THÔNG TIN LIÊN HỆ */}
          <div className="lg:col-span-5 bg-brand-primary p-8 md:p-12 text-white relative overflow-hidden">
            {/* Trang trí background */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            
            <h2 className="text-2xl font-bold mb-8">Thông tin liên hệ</h2>
            
            <div className="space-y-8 relative z-10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wider opacity-70">Địa chỉ</h4>
                  <p className="mt-1">FPT Polytechnic, Tòa nhà Innovation, TP. Hồ Chí Minh</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                  <FontAwesomeIcon icon={faPhone} />
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wider opacity-70">Hotline</h4>
                  <p className="mt-1">1900 6789 (8:00 - 21:00)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wider opacity-70">Email</h4>
                  <p className="mt-1">support@lumibook.vn</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                  <FontAwesomeIcon icon={faClock} />
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wider opacity-70">Giờ làm việc</h4>
                  <p className="mt-1">Thứ 2 - Chủ Nhật: 08:00 AM - 21:00 PM</p>
                </div>
              </div>
            </div>

            <div className="mt-16 relative z-10">
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Theo dõi chúng mình</h4>
              <div className="flex gap-4">
                {[faFacebookF, faInstagram, faYoutube].map((icon, index) => (
                  <a key={index} href="#" className="w-10 h-10 bg-white/10 hover:bg-accent-primary rounded-full flex items-center justify-center transition-all border border-white/20">
                    <FontAwesomeIcon icon={icon} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: FORM GỬI TIN NHẮN */}
          <div className="lg:col-span-7 p-8 md:p-12">
            <h2 className="text-2xl font-bold text-brand-primary mb-8 italic">Gửi lời nhắn cho Lumi</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-text-muted ml-1">Họ và tên</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-3 rounded-xl border border-border-default focus:border-brand-primary outline-none bg-background transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-text-muted ml-1">Email</label>
                  <input 
                    type="email" 
                    required
                    placeholder="example@gmail.com"
                    className="w-full px-4 py-3 rounded-xl border border-border-default focus:border-brand-primary outline-none bg-background transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-text-muted ml-1">Chủ đề</label>
                <select className="w-full px-4 py-3 rounded-xl border border-border-default focus:border-brand-primary outline-none bg-background transition-all cursor-pointer">
                  <option>Tư vấn chọn sách</option>
                  <option>Hỗ trợ đơn hàng</option>
                  <option>Hợp tác / Kinh doanh</option>
                  <option>Góp ý dịch vụ</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-text-muted ml-1">Lời nhắn của bạn</label>
                <textarea 
                  rows="5" 
                  required
                  placeholder="Hãy viết điều gì đó cho chúng mình nhé..."
                  className="w-full px-4 py-3 rounded-xl border border-border-default focus:border-brand-primary outline-none bg-background transition-all resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full md:w-auto px-12 py-4 bg-brand-primary text-white rounded-full font-bold uppercase text-sm tracking-widest hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/20"
              >
                Gửi tin nhắn ngay
              </button>
            </form>
          </div>
        </div>
        
        {/* Bản đồ Google Maps (Iframe) */}
        <div className="mt-16 rounded-3xl overflow-hidden h-96 shadow-card border border-border-light grayscale hover:grayscale-0 transition-all duration-700">
          <iframe 
            title="Lumi Book Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.863981044384!2d105.74459307503133!3d21.038127780613523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313454b991d80fd5%3A0x536c053530689e9d!2zVHLhu4tuaCBWxINuIELDtCwgWHXDom4gUGjGsMahbmcsIE5hbSBU4burIExpw6ptLCBIw  N  huG7mWksIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1710000000000!5m2!1svi!2s" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;