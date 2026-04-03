import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faMapMarkerAlt, faCreditCard, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import axiosClient from '../../utils/axiosClient';

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [voucherError, setVoucherError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ho_ten_nhan: '',
    sdt_nhan: '',
    dia_chi_nhan: '',
    ghi_chu: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    const nameRegex = /^[\p{L}\s]+$/u;
    if (!formData.ho_ten_nhan.trim()) {
      newErrors.ho_ten_nhan = "Họ tên không được để trống";
    } else if (!nameRegex.test(formData.ho_ten_nhan)) {
      newErrors.ho_ten_nhan = "Họ tên chỉ được chứa chữ cái, không bao gồm số";
    }
  
    const phoneRegex = /^(03|05|07|08|09)\d{8}$/;
    if (!formData.sdt_nhan.trim()) {
      newErrors.sdt_nhan = "Số điện thoại không được để trống";
    } else if (!phoneRegex.test(formData.sdt_nhan)) {
      newErrors.sdt_nhan = "Số điện thoại phải đủ 10 số và không chứa chữ/ký tự lạ";
    }
  
    if (!formData.dia_chi_nhan.trim()) {
      newErrors.dia_chi_nhan = "Địa chỉ nhận hàng không được để trống";
    } else if (formData.dia_chi_nhan.trim().length < 10) {
      newErrors.dia_chi_nhan = "Vui lòng nhập địa chỉ chi tiết hơn (Số nhà, tên đường...)";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axiosClient.get('/cart');
        setCartItems(response.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCart();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.gia_ban * item.so_luong), 0);
  };

  const shippingFee = 0;
  const subtotal = calculateSubtotal();
const discountAmount = appliedVoucher ? Number(appliedVoucher.so_tien_giam) : 0;
const totalAmount = subtotal + shippingFee - discountAmount;

  const handleSubmit = async () => {
    // Gọi hàm check lỗi
    if (!validateForm()) {
        return; 
    }

    if (cartItems.length === 0) {
        alert("Giỏ hàng trống");
        return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        phuong_thuc_thanh_toan: paymentMethod,
        ma_khuyen_mai_id: appliedVoucher ? appliedVoucher.id : null, 
        tong_tien: totalAmount 
      };
      const response = await axiosClient.post('/checkout/place-order', payload);
      if (response.success) {
        navigate('/order-success', { state: { orderId: response.orderId } });
      }
    } catch (error) {
      alert(error.message || "Đặt hàng thất bại");
    } finally {
      setLoading(false);
    }
  };
  const handleApplyVoucher = async () => {
      if (!voucherCode.trim()) {
          setVoucherError("Vui lòng nhập mã giảm giá");
          return;
      }

      try {
          setVoucherError('');
          const response = await axiosClient.post('/admin/vouchers/check', {
              ma_code: voucherCode, 
              tong_tien_don_hang: subtotal 
          });

          if (response.success) {
              setAppliedVoucher(response.data); 
              setVoucherError('');
          }
      } catch (error) {
          setVoucherError(error.response?.data?.message || "Mã giảm giá hết hạn hoặc không tồn tại");
          setAppliedVoucher(null);
      }
  };

const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode('');
};
useEffect(() => {
    if (appliedVoucher && subtotal < appliedVoucher.don_hang_toi_thieu) {
        setAppliedVoucher(null);
        setVoucherCode(''); 
        setVoucherError(`Đơn hàng từ ${Number(appliedVoucher.don_hang_toi_thieu).toLocaleString()}đ mới dùng được mã này.`);
    }
}, [subtotal, appliedVoucher]);
  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8 font-body">
      <div className="max-w-6xl mx-auto">
        <nav className="flex items-center gap-2 text-sm text-text-secondary mb-8">
          <span className="hover:text-brand-primary cursor-pointer" onClick={() => navigate('/cart')}>Giỏ hàng</span>
          <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
          <span className="text-text-primary font-bold">Thanh toán</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
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
                    <input 
                      type="text" 
                      name="ho_ten_nhan"
                      value={formData.ho_ten_nhan}
                      onChange={handleInputChange}
                      placeholder="Nguyễn Văn A" 
                      className={`w-full px-4 py-2 rounded-lg border focus:border-brand-primary outline-none transition-all ${errors.ho_ten_nhan ? 'border-red-500 bg-red-50' : 'border-border-default'}`} 
                    />
                    {errors.ho_ten_nhan && <p className="text-red-500 text-xs italic mt-1">{errors.ho_ten_nhan}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-text-secondary">Số điện thoại</label>
                    <input 
                      type="text"
                      name="sdt_nhan"
                      value={formData.sdt_nhan}
                      onChange={handleInputChange}
                      placeholder="0901234567" 
                      className={`w-full px-4 py-2 rounded-lg border focus:border-brand-primary outline-none transition-all ${errors.sdt_nhan ? 'border-red-500 bg-red-50' : 'border-border-default'}`} 
                    />
                    {errors.sdt_nhan && <p className="text-red-500 text-xs italic mt-1">{errors.sdt_nhan}</p>}
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-text-secondary">Địa chỉ nhận hàng</label>
                    <input 
                      type="text" 
                      name="dia_chi_nhan"
                      value={formData.dia_chi_nhan}
                      onChange={handleInputChange}
                      placeholder="Số 123, đường ABC, Quận/Huyện, Tỉnh/Thành..." 
                      className={`w-full px-4 py-2 rounded-lg border focus:border-brand-primary outline-none transition-all ${errors.dia_chi_nhan ? 'border-red-500 bg-red-50' : 'border-border-default'}`} 
                    />
                    {errors.dia_chi_nhan && <p className="text-red-500 text-xs italic mt-1">{errors.dia_chi_nhan}</p>}
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-semibold text-text-secondary">Ghi chú (Tùy chọn)</label>
                    <textarea 
                      rows="2" 
                      name="ghi_chu"
                      value={formData.ghi_chu}
                      onChange={handleInputChange}
                      placeholder="Ví dụ: Giao vào giờ hành chính..." 
                      className="w-full px-4 py-2 rounded-lg border border-border-default focus:border-brand-primary outline-none transition-all"
                    ></textarea>
                  </div>
                </div>
            </section>

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
              </div>
            </section>
          </div>
          <div className="lg:col-span-4">
            <div className="bg-surface p-6 rounded-2xl shadow-card border border-border-light sticky top-24">
              <h2 className="font-heading text-xl text-text-primary mb-6 border-b border-border-light pb-4">Đơn hàng của bạn</h2>
              
              <div className="max-h-64 overflow-y-auto mb-6 pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 mb-4">
                    <div className="relative">
                      <img src={item.hinh_anh} className="w-12 h-16 object-cover rounded shadow-sm" alt={item.ten_sach} />
                      <span className="absolute -top-2 -right-2 bg-text-secondary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-surface">
                        {item.so_luong}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{item.ten_sach}</p>
                      <p className="text-xs text-text-secondary">{Number(item.gia_ban).toLocaleString()} đ</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-border-light text-sm">
                <div className="flex justify-between text-text-secondary">
                  <span>Tạm tính</span>
                  <span>{subtotal.toLocaleString()} đ</span>
                </div>
                <div className="flex justify-between text-text-secondary pb-4 border-b border-border-light">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium text-state-success">Miễn phí toàn quốc</span>
                </div>
                {appliedVoucher && (
                  <div className="flex justify-between text-state-success font-medium py-2">
                    <span>Giảm giá voucher</span>
                    <span>-{Number(appliedVoucher.so_tien_giam).toLocaleString()} đ</span>
                  </div>
                )}

                <div className="flex justify-between text-lg font-bold pt-2">
                  <span className="text-text-primary">Tổng tiền</span>
                  <span className="text-accent-primary">{totalAmount.toLocaleString()} đ</span>
                </div>
              </div>
                <div className="mb-6">
                  <div className="flex gap-2">
                      <input 
                          type="text" 
                          placeholder="Mã giảm giá (Ví dụ: LUMI20)"
                          value={voucherCode}
                          onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                          className={`flex-1 px-3 py-2 border rounded-lg outline-none uppercase font-bold text-sm ${voucherError ? 'border-red-500' : 'border-border-default focus:border-brand-primary'}`}
                      />
                      <button 
                          onClick={handleApplyVoucher}
                          className="bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-opacity-90 transition-all"
                      >
                          Áp dụng
                      </button>
                  </div>
                  {voucherError && <p className="text-red-500 text-[11px] mt-1 italic">{voucherError}</p>}
                  
                  {appliedVoucher && (
                      <div className="mt-2 flex justify-between items-center bg-green-50 border border-green-200 p-2 rounded-lg">
                          <span className="text-green-700 text-xs font-bold italic">
                              ✓ Đã áp dụng mã {appliedVoucher.ten_khuyen_mai}
                          </span>
                          <button onClick={handleRemoveVoucher} className="text-red-500 text-xs hover:underline">Gỡ</button>
                      </div>
                  )}
              </div>
              <button 
                onClick={handleSubmit}
                disabled={loading || cartItems.length === 0}
                className="w-full mt-8 bg-accent-primary hover:bg-accent-hover disabled:bg-gray-400 text-white font-bold py-4 rounded-xl transition-all shadow-md active:scale-95 text-center uppercase tracking-wider"
              >
                {loading ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
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