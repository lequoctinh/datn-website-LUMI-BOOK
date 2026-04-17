import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag, faClipboardList, faEnvelope, faHeadset, faHeart } from '@fortawesome/free-solid-svg-icons';
import confetti from 'canvas-confetti';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = location.state || { orderId: '8888' }; // Default demo nếu không có state

  useEffect(() => {
    // Hiệu ứng pháo hoa khi vừa vào trang
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  }, []);

  useEffect(() => {
    // Đẩy một trạng thái giả vào history
    window.history.pushState(null, null, window.location.href);
    
    // Lắng nghe sự kiện bấm nút Back/Forward
    const handlePopState = () => {
      navigate('/', { replace: true }); // Đẩy về trang chủ và ghi đè lịch sử
    };

    window.addEventListener('popstate', handlePopState);

    // Cleanup khi rời khỏi trang Success
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center py-20 px-4 font-body">
      <div className="max-w-2xl w-full">
        {/* Card chính với hiệu ứng Glassmorphism nhẹ */}
        <div className="relative bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white overflow-hidden">
          
          {/* Header Trang trí */}
          <div className="h-2 bg-gradient-to-r from-brand-primary via-accent-primary to-brand-primary"></div>

          <div className="p-10 md:p-16 text-center">
            {/* Icon Trạng thái tỏa sáng */}
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-state-success rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <div className="relative w-24 h-24 bg-state-success text-white rounded-full flex items-center justify-center text-4xl shadow-lg shadow-state-success/30">
                <FontAwesomeIcon icon={faHeart} className="animate-bounce" />
              </div>
            </div>

            <h1 className="font-heading text-4xl md:text-5xl text-text-primary mb-4 tracking-tight">
              Tuyệt vời, <span className="text-brand-primary">Lumi Book</span> đã nhận đơn!
            </h1>
            <p className="text-lg text-text-secondary max-w-md mx-auto leading-relaxed mb-10">
              Mỗi cuốn sách là một hành trình mới. Cảm ơn bạn đã để chúng tôi đồng hành cùng tri thức của bạn.
            </p>

            {/* Ticket đơn hàng - Thiết kế phá cách */}
<div className="relative bg-background rounded-3xl p-8 mb-10 border border-border-light group hover:border-brand-primary transition-all duration-500">
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#F8F9FA] rounded-full border-r border-border-light"></div>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#F8F9FA] rounded-full border-l border-border-light"></div>
              
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-left">
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-1">Mã định danh đơn hàng</p>
                  <p className="text-2xl font-black text-text-primary italic">#LUMI-{orderId}</p>
                </div>
                <div className="h-px md:h-12 w-full md:w-px bg-border-default"></div>
                <div className="text-right hidden md:block">
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mb-1">Trạng thái hệ thống</p>
                  <div className="flex items-center gap-2 text-state-success font-bold">
                    <span className="w-2 h-2 bg-state-success rounded-full animate-ping"></span>
                    ĐÃ XÁC NHẬN
                  </div>
                </div>
              </div>
            </div>

            {/* Điều hướng */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
            onClick={() => navigate('/my-orders', { state: { highlightOrderId: orderId } })}
            className="..."
            >
            <FontAwesomeIcon icon={faClipboardList} className="relative z-10" />
            <span className="relative z-10">Quản lý đơn hàng</span>
            </button>

              <button
                onClick={() => navigate('/')}
                className="flex items-center justify-center gap-3 bg-white border-2 border-border-default hover:border-text-primary text-text-primary font-bold py-5 rounded-2xl transition-all active:scale-95"
              >
                <FontAwesomeIcon icon={faShoppingBag} />
                Tiếp tục khám phá
              </button>
            </div>
          </div>

          {/* Bottom Info Bar */}
          <div className="bg-background/50 border-t border-border-light px-10 py-6 flex flex-wrap justify-center gap-8 text-sm text-text-secondary font-medium">
<div className="flex items-center gap-2 hover:text-brand-primary cursor-pointer transition-colors">
                <FontAwesomeIcon icon={faEnvelope} />
                <span>Check Email xác nhận</span>
             </div>
             <div className="flex items-center gap-2 hover:text-brand-primary cursor-pointer transition-colors">
                <FontAwesomeIcon icon={faHeadset} />
                <span>Hỗ trợ 24/7</span>
             </div>
          </div>
        </div>

        {/* Thông điệp chân thành dưới cùng */}
        <p className="mt-8 text-center text-text-secondary/60 text-xs italic">
          "Sách là nguồn của cải quý giá của thế giới và là di sản xứng đáng của các thế hệ và các quốc gia."
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;