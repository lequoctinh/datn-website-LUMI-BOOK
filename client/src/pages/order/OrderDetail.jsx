  import React, { useState, useEffect } from 'react';
  import { useParams, useNavigate } from 'react-router-dom';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { 
    faChevronLeft, faPrint, faShoppingBag, faRedo, 
    faMapMarkerAlt, faUser, faPhone, faBoxOpen, faTruck, 
    faCheckCircle, faClock, faReceipt, faStar, faPenNib,
    faCreditCard, faMoneyBillWave, faTicketAlt
  } from '@fortawesome/free-solid-svg-icons';
  import axiosClient from '../../utils/axiosClient';
  import reviewService from '../../services/reviewService';
  import { useCart } from '../../context/cartContext';
  import { toast } from 'react-toastify';

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
        toast.success("Đã thêm sản phẩm vào giỏ hàng");
        navigate('/cart');
      } catch (err) {
        toast.error("Lỗi khi mua lại");
      }
    };

    const handleSubmitReview = async (sachId) => {
      if (!comment.trim()) {
        toast.warning("Vui lòng nhập nội dung đánh giá");
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
          toast.success("Đánh giá thành công!");
          setShowReviewForm(null);
          setComment('');
          const updatedRes = await axiosClient.get(`/checkout/my-orders/${id}`);
          setData(updatedRes);
        }
      } catch (err) {
        toast.error("Lỗi khi gửi đánh giá");
      } finally {
        setSubmitting(false);
      }
    };

    if (loading) return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

    const { order, items } = data;
    const isCancelled = order.trang_thai === 'da_huy';
    const isDelivered = ['da_giao', 'thanh_cong'].includes(order.trang_thai);

    const steps = [
      { key: 'cho_duyet', label: 'Chờ duyệt', icon: faClock },
      { key: 'da_duyet', label: 'Đã xác nhận', icon: faBoxOpen },
      { key: 'dang_giao', label: 'Đang giao', icon: faTruck },
      { key: 'da_giao', label: 'Thành công', icon: faCheckCircle },
    ];
    const currentStepIndex = steps.findIndex(s => s.key === order.trang_thai);

    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 font-body text-gray-800">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => navigate('/my-orders')} 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
              Quay lại danh sách
            </button>
            <button 
              onClick={() => window.print()} 
              className="text-gray-500 hover:text-gray-800 text-sm flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPrint} />
              In hóa đơn
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Chi tiết đơn đặt hàng</div>
                <h1 className="text-2xl font-mono font-bold text-gray-900">#LUMI-{order.id}</h1>
                <p className="text-sm text-gray-500">Ngày đặt: {new Date(order.ngay_dat).toLocaleString('vi-VN')}</p>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase border ${
                  isCancelled ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                }`}>
                  {isCancelled ? 'Đã hủy đơn' : steps[currentStepIndex]?.label || 'Đang xử lý'}
                </span>
              </div>
            </div>

            <div className="p-8">
              {!isCancelled && (
                <div className="mb-12">
                  <div className="flex items-center justify-between relative">
                    {steps.map((step, index) => (
                      <div key={step.key} className="flex flex-col items-center relative z-10 flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm mb-3 transition-colors ${
                          index <= currentStepIndex ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'
                        }`}>
                          <FontAwesomeIcon icon={step.icon} />
                        </div>
                        <span className={`text-[11px] font-bold uppercase tracking-tight ${
                          index <= currentStepIndex ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {step.label}
                        </span>
                        {index < steps.length - 1 && (
                          <div className={`absolute top-5 left-1/2 w-full h-[2px] -z-10 ${
                            index < currentStepIndex ? 'bg-gray-900' : 'bg-gray-100'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                  <h3 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2 uppercase tracking-wide">
                    <FontAwesomeIcon icon={faReceipt} className="text-gray-400" />
                    Sản phẩm đã chọn
                  </h3>
                  
                  <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
                    {items.map((item, index) => (
                      <div key={index} className="py-6 flex gap-4">
                        <div className="w-20 h-28 bg-gray-50 rounded border border-gray-200 flex-shrink-0 overflow-hidden">
                          <img 
                            src={item.hinh_anh ? (item.hinh_anh.startsWith('http') ? item.hinh_anh : `${IMAGE_BASE_URL}${item.hinh_anh}`) : 'https://via.placeholder.com/150'}
                            alt={item.ten_sach}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-gray-900 line-clamp-1">{item.ten_sach}</h4>
                            <span className="font-bold text-gray-900">{(item.so_luong * item.gia_luc_mua).toLocaleString()}đ</span>
                          </div>
                          <p className="text-sm text-gray-500 mb-4 tracking-wide">
                            {Number(item.gia_luc_mua).toLocaleString()}đ x {item.so_luong}
                          </p>
                          
                          {isDelivered && (
                            item.da_danh_gia ? (
                              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded uppercase">Đã đánh giá</span>
                            ) : (
                              <button 
                                onClick={() => setShowReviewForm(showReviewForm === item.sach_id ? null : item.sach_id)}
                                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1.5"
                              >
                                <FontAwesomeIcon icon={faPenNib} className="text-[10px]" /> Viết nhận xét
                              </button>
                            )
                          )}

                          {showReviewForm === item.sach_id && (
                            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
                              <div className="flex gap-1 mb-3">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <button key={s} onClick={() => setRating(s)} className={`text-sm ${s <= rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                                    <FontAwesomeIcon icon={faStar} />
                                  </button>
                                ))}
                              </div>
                              <textarea 
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full text-sm p-3 border border-gray-300 rounded focus:ring-1 focus:ring-gray-400 outline-none h-20 bg-white"
                                placeholder="Bạn thấy sách này thế nào?"
                              />
                              <div className="flex justify-end gap-2 mt-3">
                                <button onClick={() => setShowReviewForm(null)} className="px-3 py-1 text-xs font-bold text-gray-500 uppercase">Hủy</button>
                                <button 
                                  onClick={() => handleSubmitReview(item.sach_id)}
                                  disabled={submitting}
                                  className="px-4 py-1.5 bg-gray-900 text-white text-xs font-bold rounded hover:bg-gray-800 disabled:opacity-50"
                                >
                                  {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 space-y-3 max-w-xs ml-auto text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Tạm tính ({items.length} sản phẩm):</span>
                      <span>{Number(order.tong_tien_hang || order.tong_tien).toLocaleString()}đ</span>
                    </div>
                    
                    {order.so_tien_giam > 0 && (
                      <div className="flex justify-between text-green-600 font-medium">
                        <span className="flex items-center gap-1">
                          <FontAwesomeIcon icon={faTicketAlt} className="text-[10px]" />
                          Mã giảm giá {order.ten_khuyen_mai && `(${order.ten_khuyen_mai})`}:
                        </span>
                        <span>-{Number(order.so_tien_giam).toLocaleString()}đ</span>
                      </div>
                    )}

                    <div className="flex justify-between text-gray-600">
                      <span>Phí vận chuyển:</span>
                      <span className="text-green-600 font-medium">Miễn phí</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-gray-200">
                      <span className="font-bold text-gray-900 text-base">Tổng số tiền:</span>
                      <span className="font-bold text-red-600 text-xl">{Number(order.tong_tien).toLocaleString()}đ</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-6">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Thông tin nhận hàng</h4>
                    <div className="space-y-5">
                      <div className="flex gap-3">
                        <FontAwesomeIcon icon={faUser} className="text-gray-400 mt-1 text-xs" />
                        <div>
                          <p className="text-sm font-bold text-gray-900">{order.ho_ten_nguoi_nhan}</p>
                          <p className="text-xs text-gray-500">Người nhận</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <FontAwesomeIcon icon={faPhone} className="text-gray-400 mt-1 text-xs" />
                        <div>
                          <p className="text-sm font-bold text-gray-900">{order.sdt_nguoi_nhan}</p>
                          <p className="text-xs text-gray-500">Số điện thoại</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400 mt-1 text-xs" />
                        <div>
                          <p className="text-sm font-medium text-gray-700 leading-relaxed">{order.dia_chi_giao_hang}</p>
                          <p className="text-xs text-gray-500">Địa chỉ</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-6">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Thanh toán</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">Phương thức</span>
                        <div className="flex items-center gap-2 text-gray-900">
                          <FontAwesomeIcon icon={order.phuong_thuc_thanh_toan === 'vnpay' ? faCreditCard : faMoneyBillWave} className="text-xs text-gray-400" />
                          <span className="text-xs font-bold uppercase">{order.phuong_thuc_thanh_toan}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">Trạng thái</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${
                          order.trang_thai_thanh_toan === 'paid' 
                          ? 'bg-green-50 text-green-600 border-green-100' 
                          : 'bg-orange-50 text-orange-600 border-orange-100'
                        }`}>
                          {order.trang_thai_thanh_toan === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                        </span>
                      </div>
                      {order.ma_giao_dich && (
                        <div className="pt-3 border-t border-gray-200">
                          <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Mã giao dịch (VNPAY)</p>
                          <p className="text-[11px] font-mono text-gray-600 break-all bg-white p-2 rounded border border-gray-100">{order.ma_giao_dich}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {(isCancelled || isDelivered) && (
                      <button 
                        onClick={handleReorder}
                        className="w-full bg-gray-900 text-white py-3.5 rounded font-bold text-xs flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors uppercase tracking-wider shadow-sm"
                      >
                        <FontAwesomeIcon icon={faRedo} /> Mua lại đơn này
                      </button>
                    )}
                    <button 
                      onClick={() => navigate('/')}
                      className="w-full bg-white border border-gray-300 text-gray-700 py-3.5 rounded font-bold text-xs flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors uppercase tracking-wider"
                    >
                      <FontAwesomeIcon icon={faShoppingBag} /> Tiếp tục mua sắm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center mt-12 text-gray-400 text-xs">
            Cảm ơn bạn đã tin tưởng Lumi Book. Nếu cần trợ giúp, vui lòng liên hệ hotline 1900 xxxx.
          </p>
        </div>
      </div>
    );
  };

  export default OrderDetail;