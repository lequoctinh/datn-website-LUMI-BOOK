import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faMapMarkerAlt, faCreditCard, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import axiosClient from '../../utils/axiosClient';
import authService from '../../services/authService';

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

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [cartRes, addrRes, userRes] = await Promise.all([
          axiosClient.get('/cart'),
          authService.getAddresses(),
          authService.getMe()
        ]);

        setCartItems(cartRes.data || []);
        const addressList = Array.isArray(addrRes) ? addrRes : (addrRes?.data || []);
        const defaultAddr = addressList.find(addr => addr.is_default === 1);

        if (defaultAddr) {
          setFormData(prev => ({
            ...prev,
            ho_ten_nhan: defaultAddr.ho_ten_nhan || '',
            sdt_nhan: defaultAddr.sdt_nhan || '',
            dia_chi_nhan: `${defaultAddr.dia_chi_chi_tiet}, ${defaultAddr.phuong_xa}, ${defaultAddr.quan_huyen}, ${defaultAddr.tinh_thanh}`
          }));
        } else if (userRes) {
          const userData = userRes.data || userRes;
          setFormData(prev => ({
            ...prev,
            ho_ten_nhan: userData.ho_ten || '',
            sdt_nhan: userData.sdt || ''
          }));
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu thanh toán:", error);
      }
    };
    fetchInitialData();
  }, []);

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.gia_ban * item.so_luong), 0);
  };
  const subtotal = calculateSubtotal();

  useEffect(() => {
    if (appliedVoucher && subtotal < appliedVoucher.don_hang_toi_thieu) {
      setAppliedVoucher(null);
      setVoucherCode('');
      setVoucherError(`Đơn hàng từ ${Number(appliedVoucher.don_hang_toi_thieu).toLocaleString()}đ mới dùng được mã này.`);
    }
  }, [subtotal, appliedVoucher]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    let newErrors = {};
    const nameRegex = /^[\p{L}\s]+$/u;
    const phoneRegex = /^(03|05|07|08|09)\d{8}$/;

    if (!formData.ho_ten_nhan.trim()) newErrors.ho_ten_nhan = "Họ tên không được để trống";
    else if (!nameRegex.test(formData.ho_ten_nhan)) newErrors.ho_ten_nhan = "Họ tên không hợp lệ";

    if (!formData.sdt_nhan.trim()) newErrors.sdt_nhan = "Số điện thoại không được để trống";
    else if (!phoneRegex.test(formData.sdt_nhan)) newErrors.sdt_nhan = "Số điện thoại không hợp lệ";

    if (!formData.dia_chi_nhan.trim()) newErrors.dia_chi_nhan = "Địa chỉ không được để trống";
    else if (formData.dia_chi_nhan.trim().length < 10) newErrors.dia_chi_nhan = "Vui lòng nhập địa chỉ chi tiết hơn";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || cartItems.length === 0) return;
    setLoading(true);
    try {
      const payload = {
        ...formData,
        phuong_thuc_thanh_toan: paymentMethod,
        ma_khuyen_mai_id: appliedVoucher ? appliedVoucher.id : null,
        tong_tien: subtotal - (appliedVoucher ? Number(appliedVoucher.so_tien_giam) : 0)
      };
      const response = await axiosClient.post('/checkout/place-order', payload);
      if (response.success) {
        navigate('/order-success', { state: { orderId: response.orderId } });
      }
    } catch (error) {
      alert(error.response?.data?.message || "Đặt hàng thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return setVoucherError("Vui lòng nhập mã");
    try {
      const response = await axiosClient.post('/admin/vouchers/check', {
        ma_code: voucherCode,
        tong_tien_don_hang: subtotal
      });
      if (response.success) {
        setAppliedVoucher(response.data);
        setVoucherError('');
      }
    } catch (error) {
      setVoucherError(error.response?.data?.message || "Mã không hợp lệ");
      setAppliedVoucher(null);
    }
  };

  const shippingFee = 0;
  const discountAmount = appliedVoucher ? Number(appliedVoucher.so_tien_giam) : 0;
  const totalAmount = subtotal + shippingFee - discountAmount;

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
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </div>
                  <h2 className="font-heading text-xl text-text-primary">Thông tin nhận hàng</h2>
                </div>
                <button 
                  onClick={() => navigate('/profile')} 
                  className="text-xs text-brand-primary hover:underline"
                >
                  Quản lý sổ địa chỉ
                </button>
              </div>

              {formData.dia_chi_nhan && (
                <div className="mb-4 p-2 bg-green-50 border border-green-100 rounded-lg text-[11px] text-green-700">
                  ✓ Đã tự động áp dụng thông tin từ địa chỉ mặc định của bạn.
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-secondary">Họ và tên</label>
                  <input type="text" name="ho_ten_nhan" value={formData.ho_ten_nhan} onChange={handleInputChange} className={`w-full px-4 py-2 rounded-lg border outline-none ${errors.ho_ten_nhan ? 'border-red-500 bg-red-50' : 'border-border-default focus:border-brand-primary'}`} />
                  {errors.ho_ten_nhan && <p className="text-red-500 text-xs italic">{errors.ho_ten_nhan}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-secondary">Số điện thoại</label>
                  <input type="text" name="sdt_nhan" value={formData.sdt_nhan} onChange={handleInputChange} className={`w-full px-4 py-2 rounded-lg border outline-none ${errors.sdt_nhan ? 'border-red-500 bg-red-50' : 'border-border-default focus:border-brand-primary'}`} />
                  {errors.sdt_nhan && <p className="text-red-500 text-xs italic">{errors.sdt_nhan}</p>}
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-text-secondary">Địa chỉ nhận hàng</label>
                  <input type="text" name="dia_chi_nhan" value={formData.dia_chi_nhan} onChange={handleInputChange} placeholder="Số nhà, tên đường, phường, quận, tỉnh..." className={`w-full px-4 py-2 rounded-lg border outline-none ${errors.dia_chi_nhan ? 'border-red-500 bg-red-50' : 'border-border-default focus:border-brand-primary'}`} />
                  {errors.dia_chi_nhan && <p className="text-red-500 text-xs italic">{errors.dia_chi_nhan}</p>}
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold text-text-secondary">Ghi chú (Tùy chọn)</label>
                  <textarea rows="2" name="ghi_chu" value={formData.ghi_chu} onChange={handleInputChange} className="w-full px-4 py-2 rounded-lg border border-border-default focus:border-brand-primary outline-none transition-all"></textarea>
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
              <label className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-brand-primary bg-brand-primary/5' : 'border-border-light'}`}>
                <div className="flex items-center gap-4">
                  <input type="radio" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="accent-brand-primary w-4 h-4" />
                  <div>
                    <p className="font-semibold text-text-primary">Thanh toán khi nhận hàng (COD)</p>
                    <p className="text-xs text-text-secondary italic">Trả tiền khi nhận sách.</p>
                  </div>
                </div>
                <img src="https://cdn-icons-png.flaticon.com/512/6491/6491490.png" className="w-8 h-8 opacity-70" alt="cod" />
              </label>
            </section>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-surface p-6 rounded-2xl shadow-card border border-border-light sticky top-24">
              <h2 className="font-heading text-xl text-text-primary mb-6 border-b pb-4">Đơn hàng của bạn</h2>
              <div className="max-h-64 overflow-y-auto mb-6 pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 mb-4">
                    <div className="relative">
                      <img 
                        src={item.hinh_anh ? `http://localhost:5000/uploads/products/${item.hinh_anh}` : 'https://via.placeholder.com/300x400'} 
                        className="w-12 h-16 object-cover rounded shadow-sm" 
                        alt={item.ten_sach} 
                      />
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

              <div className="space-y-3 pt-4 border-t text-sm">
                <div className="flex justify-between text-text-secondary">
                  <span>Tạm tính</span>
                  <span>{subtotal.toLocaleString()} đ</span>
                </div>
                <div className="flex justify-between text-text-secondary pb-4 border-b">
                  <span>Phí vận chuyển</span>
                  <span className="text-state-success">Miễn phí</span>
                </div>
                {appliedVoucher && (
                  <div className="flex justify-between text-state-success font-medium py-2">
                    <span>Giảm giá</span>
                    <span>-{discountAmount.toLocaleString()} đ</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2">
                  <span className="text-text-primary">Tổng tiền</span>
                  <span className="text-accent-primary">{totalAmount.toLocaleString()} đ</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex gap-2">
                  <input type="text" placeholder="Mã giảm giá" value={voucherCode} onChange={(e) => setVoucherCode(e.target.value.toUpperCase())} className={`flex-1 px-3 py-2 border rounded-lg outline-none uppercase text-sm ${voucherError ? 'border-red-500' : 'focus:border-brand-primary'}`} />
                  <button onClick={handleApplyVoucher} className="bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-bold">Áp dụng</button>
                </div>
                {voucherError && <p className="text-red-500 text-[11px] italic">{voucherError}</p>}
                {appliedVoucher && (
                  <div className="flex justify-between items-center bg-green-50 border border-green-200 p-2 rounded-lg">
                    <span className="text-green-700 text-xs font-bold italic">✓ {appliedVoucher.ten_khuyen_mai}</span>
                    <button onClick={() => {setAppliedVoucher(null); setVoucherCode('');}} className="text-red-500 text-xs">Gỡ</button>
                  </div>
                )}
              </div>

              <button onClick={handleSubmit} disabled={loading || cartItems.length === 0} className="w-full mt-8 bg-accent-primary hover:bg-accent-hover disabled:bg-gray-400 text-white font-bold py-4 rounded-xl transition-all shadow-md active:scale-95 uppercase">
                {loading ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-state-success font-medium">
                <FontAwesomeIcon icon={faShieldAlt} />
                <span>Bảo mật thanh toán 100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
