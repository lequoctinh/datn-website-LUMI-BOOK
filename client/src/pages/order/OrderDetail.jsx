import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronLeft, faPrint, faShoppingBag, faRedo, 
  faMapMarkerAlt, faUser, faPhone, faBoxOpen, faTruck, 
  faCheckDouble, faTimesCircle, faClock, faReceipt, faStar, faPenNib
} from '@fortawesome/free-solid-svg-icons';
import axiosClient from '../../utils/axiosClient';
import { useCart } from '../../context/cartContext';
import { toast } from 'react-toastify';
import reviewService from '../../services/reviewService';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const IMAGE_BASE_URL = 'http://localhost:5000/uploads/products/';

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axiosClient.get(`/checkout/my-orders/${id}`);
        setData(res);
      } catch (err) {
        toast.error("Không tìm thấy đơn hàng");
        navigate('/my-orders');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, navigate]);

  const handleReorder = async () => {
    try {
      if (!data?.items) return;
      await Promise.all(
        data.items.map(item => addToCart(item.sach_id, item.so_luong))
      );
      toast.success("Đã thêm lại sản phẩm vào giỏ hàng");
      navigate('/cart');
    } catch (err) {
      toast.error("Lỗi khi mua lại");
    }
  };
const handleSubmitReview = async (sachId) => {
    if (!comment.trim()) {
      toast.warning("Vui lòng nhập nội dung bình luận");
      return;
    }
    setSubmitting(true);
    try {
      const res = await reviewService.createReview({
        sach_id: sachId,
        don_hang_id: id,
        so_sao: rating,
        binh_luan: comment
      });
      if (res.success) {
        toast.success("Cảm ơn bạn đã đánh giá sản phẩm!");
        setShowReviewForm(null);
        setComment('');
        setRating(5);
        const updatedRes = await axiosClient.get(`/checkout/my-orders/${id}`);
        setData(updatedRes);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi gửi đánh giá");
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBFBFD]">
      <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const { order, items } = data;

  const steps = [
    { key: 'cho_duyet', label: 'Chờ duyệt', icon: faClock },
    { key: 'da_duyet', label: 'Đã duyệt', icon: faBoxOpen },
    { key: 'dang_giao', label: 'Đang giao', icon: faTruck },
    { key: 'da_giao', label: 'Thành công', icon: faCheckDouble },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === order.trang_thai);
  const isCancelled = order.trang_thai === 'da_huy';
  const isDelivered = order.trang_thai === 'da_giao' || order.trang_thai === 'thanh_cong';
  return (
    <div className="min-h-screen bg-[#FBFBFD] py-12 px-4 font-body">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate('/my-orders')} className="flex items-center gap-2 text-text-secondary hover:text-brand-primary mb-8 transition-all group font-bold text-sm">
          <FontAwesomeIcon icon={faChevronLeft} className="group-hover:-translate-x-1" />
          Quay lại đơn hàng của tôi
        </button>

        <div className="bg-white rounded-[40px] shadow-xl shadow-black/5 border border-border-light overflow-hidden">
          <div className="bg-gradient-to-r from-text-primary to-[#2C3E50] p-10 text-white relative">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <FontAwesomeIcon icon={faReceipt} className="text-brand-primary" />
                  <span className="text-xs font-black uppercase tracking-[0.3em] opacity-70">Mã hóa đơn điện tử</span>
                </div>
                <h1 className="text-4xl font-black mb-2 tracking-tighter">#LUMI-{order.id}</h1>
                <p className="text-sm opacity-60">Cảm ơn bạn đã tin tưởng lựa chọn Lumi Book</p>
              </div>
              <button onClick={() => window.print()} className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all">
                <FontAwesomeIcon icon={faPrint} />
              </button>
            </div>
          </div>

          <div className="p-8 md:p-12">
            {!isCancelled ? (
              <div className="relative mb-16 px-4">
                <div className="stepper-line"></div>
                <div className="stepper-line-active" style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}></div>
                <div className="relative z-10 flex justify-between">
                  {steps.map((step, index) => (
                    <div key={step.key} className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg transition-all duration-500 shadow-lg ${index <= currentStepIndex ? 'bg-brand-primary text-white scale-110' : 'bg-white border-2 border-border-default text-text-secondary'}`}>
                        <FontAwesomeIcon icon={step.icon} />
                      </div>
                      <span className={`mt-4 text-[11px] font-black uppercase tracking-wider ${index <= currentStepIndex ? 'text-text-primary' : 'text-text-secondary opacity-50'}`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-16 bg-rose-50 border-2 border-rose-100 p-8 rounded-[32px] flex items-center gap-6 text-rose-600 animate-pulse">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm">
                  <FontAwesomeIcon icon={faTimesCircle} />
                </div>
                <div>
                  <h3 className="text-xl font-black mb-1">Đơn hàng đã bị hủy</h3>
                  <p className="text-sm font-medium opacity-80">Rất tiếc, đơn hàng này đã dừng xử lý. Bạn có thể nhấn nút "Mua lại" để đặt đơn mới.</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <h3 className="text-xs font-black text-text-secondary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                  Chi tiết kiện hàng
                </h3>
                <div className="space-y-6">
                  {items.map((item, index) => (
                    <div key={index} className="flex flex-col gap-4 p-4 rounded-3xl border border-transparent hover:border-border-light hover:bg-gray-50/50 transition-all">
                      <div className="flex items-center justify-between group">
                        <div className="flex items-center gap-5">
                          <div className="w-20 h-28 rounded-2xl overflow-hidden border border-border-light shadow-sm bg-background flex-shrink-0">
                            <img 
                              src={item.hinh_anh ? (item.hinh_anh.startsWith('http') ? item.hinh_anh : `${IMAGE_BASE_URL}${item.hinh_anh}`) : 'https://via.placeholder.com/300x400?text=Lumi+Book'}
                              alt={item.ten_sach}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => { e.target.src = 'https://via.placeholder.com/300x400?text=Lumi+Book'; }}
                            />
                          </div>
                          <div>
                            <p className="font-bold text-text-primary text-lg mb-1 leading-tight">{item.ten_sach}</p>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-xs font-bold text-brand-primary bg-brand-primary/10 px-2 py-1 rounded">x{item.so_luong}</span>
                              <span className="text-sm text-text-secondary font-medium">{Number(item.gia_luc_mua).toLocaleString()} đ</span>
                            </div>
                            {isDelivered && (
                              item.da_danh_gia ? (
                                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-100 shadow-sm">
                                  <FontAwesomeIcon icon={faCheckDouble} className="text-[10px]" />
                                  <span className="text-[11px] font-black uppercase tracking-wider italic">Đã gửi đánh giá</span>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => setShowReviewForm(showReviewForm === item.sach_id ? null : item.sach_id)}
                                  className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${showReviewForm === item.sach_id ? 'text-rose-500' : 'text-brand-primary hover:underline'}`}
                                >
                                  <FontAwesomeIcon icon={showReviewForm === item.sach_id ? faTimesCircle : faPenNib} /> 
                                  {showReviewForm === item.sach_id ? 'Đóng form' : 'Viết đánh giá'}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                        <p className="font-black text-text-primary shrink-0">{(item.so_luong * item.gia_luc_mua).toLocaleString()} đ</p>
                      </div>
                      {showReviewForm === item.sach_id && !item.da_danh_gia && (
                        <div className="bg-white border-2 border-brand-primary/20 rounded-2xl p-5 mt-2 shadow-inner animate-fadeIn">
                          <p className="text-xs font-black uppercase text-text-secondary mb-3">Đánh giá sản phẩm này</p>
                          <div className="flex gap-2 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button key={star} onClick={() => setRating(star)} className={`text-xl transition-colors ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}>
                                <FontAwesomeIcon icon={faStar} />
                              </button>
                            ))}
                          </div>
                          <textarea 
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Chia sẻ cảm nhận của bạn về cuốn sách này..."
                            className="w-full h-24 p-4 bg-gray-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-brand-primary/20 resize-none mb-3"
                          />
                          <div className="flex justify-end gap-3">
                            <button onClick={() => setShowReviewForm(null)} className="px-4 py-2 text-xs font-bold text-text-secondary uppercase">Hủy</button>
                            <button 
                              disabled={submitting}
                              onClick={() => handleSubmitReview(item.sach_id)}
                              className="px-6 py-2 bg-brand-primary text-white text-xs font-black uppercase rounded-lg shadow-lg shadow-brand-primary/20 hover:bg-brand-dark transition-all disabled:opacity-50"
                            >
                              {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-10 pt-10 border-t border-dashed border-border-default space-y-4">
                  <div className="flex justify-between text-text-secondary font-medium">
                    <span>Tạm tính món hàng</span>
                    <span>{Number(order.tong_tien).toLocaleString()} đ</span>
                  </div>
                  <div className="flex justify-between text-text-secondary font-medium">
                    <span>Phí vận chuyển nội địa</span>
                    <span className="text-emerald-600 font-bold uppercase text-xs">Miễn phí toàn quốc</span>
                  </div>
                  <div className="flex justify-between items-end pt-4">
                    <span className="text-lg font-black text-text-primary">Tổng giá trị đơn hàng</span>
                    <span className="text-4xl font-black text-brand-primary tracking-tighter">{Number(order.tong_tien).toLocaleString()} đ</span>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-[#F8F9FB] rounded-[32px] p-8 border border-border-light">
                  <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-6">Thông tin giao nhận</h4>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-primary shadow-sm border border-border-light shrink-0">
                        <FontAwesomeIcon icon={faUser} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-text-secondary uppercase">Người nhận</p>
                        <p className="text-sm font-black text-text-primary">{order.ho_ten_nguoi_nhan}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-primary shadow-sm border border-border-light shrink-0">
                        <FontAwesomeIcon icon={faPhone} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-text-secondary uppercase">Liên hệ</p>
                        <p className="text-sm font-black text-text-primary">{order.sdt_nguoi_nhan}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-primary shadow-sm border border-border-light shrink-0">
                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-text-secondary uppercase">Địa điểm</p>
                        <p className="text-sm font-bold text-text-primary leading-relaxed">{order.dia_chi_giao_hang}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  {(order.trang_thai === 'da_huy' || order.trang_thai === 'da_giao') && (
                    <button onClick={handleReorder} className="w-full bg-brand-primary text-white py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-brand-primary/20 transition-all active:scale-95">
                      <FontAwesomeIcon icon={faRedo} /> Mua lại đơn này
                    </button>
                  )}
                  <button onClick={() => navigate('/')} className="w-full bg-text-primary text-white py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-black transition-all">
                    <FontAwesomeIcon icon={faShoppingBag} /> Tiếp tục khám phá sách
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;