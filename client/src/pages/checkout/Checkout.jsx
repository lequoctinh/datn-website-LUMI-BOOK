import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faMapMarkerAlt, faCreditCard, faTruck, faShieldAlt } from '@fortawesome/free-solid-svg-icons';

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState('cod');

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8 font-body">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-secondary mb-8">
          <span className="hover:text-brand-primary cursor-pointer">Giỏ hàng</span>
          <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
          <span className="text-text-primary font-bold">Thanh toán</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* CỘT TRÁI: THÔNG TIN GIAO HÀNG */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Địa chỉ giao hàng */}
            <section className="bg-surface p-6 rounded-2xl shadow-card border border-border-light">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                </div>
                <h2 className="font-heading text-xl text-text-primary">Thông tin nhận hàng</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-secondary">Họ và tên</label>
                  <input type="text" placeholder="Nguyễn Văn A" className="w-full px-4 py-2 rounded-lg border border-border-default focus:border-brand-primary outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-secondary">Số điện thoại</label>
                  <input type="tel" placeholder="090..." className="w-full px-4 py-2 rounded-lg border border-border-default focus:border-brand-primary outline-none transition-all" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-text-secondary">Địa chỉ nhận hàng</label>
                  <input type="text" placeholder="Số nhà, tên đường, Phường/Xã..." className="w-full px-4 py-2 rounded-lg border border-border-default focus:border-brand-primary outline-none transition-all" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-text-secondary">Ghi chú (Tùy chọn)</label>
                  <textarea rows="2" placeholder="Ví dụ: Giao giờ hành chính..." className="w-full px-4 py-2 rounded-lg border border-border-default focus:border-brand-primary outline-none transition-all"></textarea>
                </div>
              </div>
            </section>

            {/* 2. Phương thức thanh toán */}
            <section className="bg-surface p-6 rounded-2xl shadow-card border border-border-light">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary">
                  <FontAwesomeIcon icon={faCreditCard} />
                </div>
                <h2 className="font-heading text-xl text-text-primary">Phương thức thanh toán</h2>
              </div>

              <div className="space-y-3">
                <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-brand-primary bg-brand-primary/5' : 'border-border-light hover:bg-background'}`}>
                  <div className="flex items-center gap-4">
                    <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="accent-brand-primary w-4 h-4" />
                    <div>
                      <p className="font-semibold text-text-primary">Thanh toán khi nhận hàng (COD)</p>
                      <p className="text-xs text-text-secondary italic">Bạn chỉ phải trả tiền khi nhận được sách.</p>
                    </div>
                  </div>
                  <img src="https://cdn-icons-png.flaticon.com/512/6491/6491490.png" className="w-8 h-8 opacity-70" alt="cod" />
                </label>

                <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'vnpay' ? 'border-brand-primary bg-brand-primary/5' : 'border-border-light hover:bg-background'}`}>
                  <div className="flex items-center gap-4">
                    <input type="radio" name="payment" checked={paymentMethod === 'vnpay'} onChange={() => setPaymentMethod('vnpay')} className="accent-brand-primary w-4 h-4" />
                    <div>
                      <p className="font-semibold text-text-primary">Thanh toán qua VNPay</p>
                      <p className="text-xs text-text-secondary italic">Cổng thanh toán an toàn qua Ngân hàng / QR Code.</p>
                    </div>
                  </div>
                  <img src="https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0ox Nolan x0idun861686814146087.png" className="w-12 h-4 object-contain" alt="vnpay" />
                </label>
              </div>
            </section>
          </div>

          {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
          <div className="lg:col-span-4">
            <div className="bg-surface p-6 rounded-2xl shadow-card border border-border-light sticky top-24">
              <h2 className="font-heading text-xl text-text-primary mb-6 border-b border-border-light pb-4">Đơn hàng của bạn</h2>
              
              {/* List sản phẩm tóm tắt */}
              <div className="max-h-48 overflow-y-auto mb-6 pr-2 custom-scrollbar">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <img src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600" className="w-12 h-16 object-cover rounded shadow-sm" alt="product" />
                    <span className="absolute -top-2 -right-2 bg-text-secondary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-surface">1</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">Nhà Giả Kim</p>
                    <p className="text-xs text-text-secondary">79.000 đ</p>
                  </div>
                </div>
              </div>

              {/* Tính tiền */}
              <div className="space-y-3 pt-4 border-t border-border-light text-sm">
                <div className="flex justify-between text-text-secondary">
                  <span>Tạm tính</span>
                  <span>329.000 đ</span>
                </div>
                <div className="flex justify-between text-text-secondary pb-4 border-b border-border-light">
                  <span>Phí vận chuyển</span>
                  <span>30.000 đ</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span className="text-text-primary">Tổng tiền</span>
                  <span className="text-accent-primary">359.000 đ</span>
                </div>
              </div>

              <button className="w-full mt-8 bg-accent-primary hover:bg-accent-hover text-white font-bold py-4 rounded-xl transition-all shadow-md active:scale-95 text-center uppercase tracking-wider">
                Xác nhận thanh toán
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-state-success font-medium">
                <FontAwesomeIcon icon={faShieldAlt} />
                <span>Bảo mật thông tin thanh toán 100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;